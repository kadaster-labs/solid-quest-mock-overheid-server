import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `
      <h1>Mock APIs - Solid Quest</h1>
      <p>Welkom bij de overheids mock APIs</p>
      <p><a href='/brp/login'>Login BRP</a></p>
      <p><a href='/brk/login'>Login Kadaster</a></p>
      `;
  }
}
