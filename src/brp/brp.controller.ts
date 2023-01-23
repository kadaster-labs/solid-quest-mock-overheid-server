import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BrpService } from './brp.service';

@Controller('brp')
export class BrpController {
  port: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly brpService: BrpService,
  ) {
    this.port = this.configService.get<number>('port');
  }

  // Inspired by:
  // - https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-nodejs-web-server/

  @Get('credentials/issue/:webID')
  async issueCredential(@Param('webID') webID): Promise<object> {
    const result = this.brpService.issueVC(webID);

    return result;
  }
}
