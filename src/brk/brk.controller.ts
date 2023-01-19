import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request } from 'express';

import {
  getSessionFromStorage,
  getSessionIdFromStorageAll,
  Session,
} from '@inrupt/solid-client-authn-node';
import { ConfigService } from '@nestjs/config';

@Controller('brk')
export class BrkController {
  port: number;

  constructor(private configService: ConfigService) {
    this.port = this.configService.get<number>('port');
  }

  @Get('login')
  async login(@Req() req: Request, @Res() res): Promise<any> {
    // 1. Create a new Session
    const session = new Session();
    (req.session as any).sessionId = session.info.sessionId;
    const redirectToSolidIdentityProvider = (url) => {
      // Since we use Express in this example, we can call `res.redirect` to send the user to the
      // given URL, but the specific method of redirection depend on your app's particular setup.
      // For example, if you are writing a command line app, this might simply display a prompt for
      // the user to visit the given URL in their browser.
      res.redirect(url);
    };

    // 2. Start the login process; redirect handler will handle sending the user to their
    //    Solid Identity Provider.
    await session.login({
      // After login, the Solid Identity Provider will send the user back to the following
      // URL, with the data necessary to complete the authentication process
      // appended as query parameters:
      redirectUrl: `http://localhost:${this.port}/brk/redirect-from-solid-idp`,
      // Set to the user's Solid Identity Provider; e.g., "https://login.inrupt.com"
      oidcIssuer: 'http://localhost:3001',
      // Pick an application name that will be shown when asked
      // to approve the application's access to the requested data.
      clientName: 'Het Kadaster',
      handleRedirect: redirectToSolidIdentityProvider,
    });
  }

  @Get('redirect-from-solid-idp')
  async redirectFromSolidIdp(@Req() req: Request): Promise<string> {
    // 3. If the user is sent back to the `redirectUrl` provided in step 2,
    //    it means that the login has been initiated and can be completed. In
    //    particular, initiating the login stores the session in storage,
    //    which means it can be retrieved as follows.
    const session = await getSessionFromStorage((req.session as any).sessionId);

    // 4. With your session back from storage, you are now able to
    //    complete the login process using the data appended to it as query
    //    parameters in req.url by the Solid Identity Provider:
    await session.handleIncomingRedirect(
      `http://localhost:${this.port}${req.url}`,
    );

    // 5. `session` now contains an authenticated Session instance.
    if (session.info.isLoggedIn) {
      return `
        <h1>BRP Secure</h1>
        <p>Logged in with the WebID ${session.info.webId}.</p>
      `;
    }
  }

  // 6. Once you are logged in, you can retrieve the session from storage,
  //    and perform authenticated fetches.
  @Get('fetch')
  async fetch(@Req() req: Request): Promise<string> {
    if (typeof req.query['resource'] === 'undefined') {
      return '<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>';
    }
    const session = await getSessionFromStorage((req.session as any).sessionId);

    if (!session || session.info.isLoggedIn) {
      return '<p>You are not logged in.</p>';
    }

    const url = req.query['resource'] as string;
    const response = await session.fetch(url);
    const text = await response.text();
    console.log(text);
    return '<p>Performed authenticated fetch.</p>';
  }

  // 7. To log out a session, just retrieve the session from storage, and
  //    call the .logout method.
  @Get('logout')
  async logout(@Req() req: Request): Promise<string> {
    const session = await getSessionFromStorage((req.session as any).sessionId);
    session.logout();
    return `<p>Logged out.</p>`;
  }

  // 8. On the server side, you can also list all registered sessions using the
  //    getSessionIdFromStorageAll function.
  @Get('/')
  async home(): Promise<string> {
    const sessionIds = await getSessionIdFromStorageAll();
    for (const sessionId in sessionIds) {
      // Do something with the session ID...
    }
    return `<p>There are currently [${sessionIds.length}] visitors.</p>`;
  }
}
