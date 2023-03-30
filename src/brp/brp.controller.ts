import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatapleinService } from '../dataplein/dataplein.service';

import { BrpService } from './brp.service';

@Controller('brp')
export class BrpController {
  port: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly brpService: BrpService,
    private readonly overheidDataService: DatapleinService,
  ) {
    this.port = this.configService.get<number>('port');
  }

  @Get('credentials/issue/:webID')
  async issueCredential(@Param('webID') webID): Promise<object> {
    try {
      this.overheidDataService.validateWebIDExists(webID);
    } catch (error) {
      throw new HttpException('Unknown WebID', HttpStatus.FORBIDDEN);
    }

    try {
      return await this.brpService.issueVC(webID);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error issuing VC',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
