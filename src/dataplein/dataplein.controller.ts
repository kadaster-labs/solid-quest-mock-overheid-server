import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { DatapleinService } from '../dataplein/dataplein.service';
import { SolidAddress, SolidPerson } from './utils';

@Controller('dataplein')
export class DatapleinController {
  constructor(private readonly overheidDataService: DatapleinService) {}

  @Get('checkWebID/:webID')
  async checkWebID(@Param('webID') webID): Promise<object> {
    try {
      this.overheidDataService.validateWebIDExists(webID);
    } catch (error) {
      throw new HttpException('Unknown WebID', HttpStatus.FORBIDDEN);
    }
    return {
      status: 'found',
      webID: webID,
    };
  }

  @Post('registerWebID/:webID')
  async register(@Param('webID') webID, @Body() body): Promise<object> {
    let person: SolidPerson;
    if (!body.person) {
      person = {
        name: null,
        bday: null,
      };
    } else {
      person = body.person;
    }

    let address: SolidAddress;
    if (!body.address) {
      address = {
        streetAddress: null,
        postalCode: null,
        locality: null,
        region: null,
        countryName: null,
      };
    } else {
      address = body.address;
    }

    if (this.overheidDataService.registerWebID(webID, person, address)) {
      return {
        status: 'success',
        webID: webID,
      };
    }
  }
}
