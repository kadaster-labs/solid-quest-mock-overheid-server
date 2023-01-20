import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BrkService } from './brk.service';

@Controller('brk')
export class BrkController {
  port: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly brkService: BrkService,
  ) {
    this.port = this.configService.get<number>('port');
  }

  @Get('credentials/issue/:webID')
  async issueCredential(@Param('webID') webID): Promise<object> {
    const result = this.brkService.issueVC(webID);

    return result;
  }
}
