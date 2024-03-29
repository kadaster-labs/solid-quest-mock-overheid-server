import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DatapleinService } from '../dataplein/dataplein.service';
import { BrkService } from './brk.service';

@Controller('brk')
export class BrkController {
  port: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly brkService: BrkService,
    private readonly overheidDataService: DatapleinService,
  ) {
    this.port = this.configService.get<number>('port');
  }

  @Get('credentials/issue/:webID')
  async issueCredential(@Param('webID') webID): Promise<object> {
    try {
      this.overheidDataService.validateWebIDExists(webID);
      this.overheidDataService.validateWebIDHasEigendom(webID);
    } catch (error) {
      throw new HttpException('Unknown WebID', HttpStatus.FORBIDDEN);
    }

    const result = this.brkService.issueVC(webID);

    return result;
  }
}
