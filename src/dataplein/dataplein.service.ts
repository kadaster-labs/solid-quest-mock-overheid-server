import { Injectable } from '@nestjs/common';

import * as brpData from '../../data/brp_data.json';
import * as brkData from '../../data/brk_data.json';
import {
  generateBRPPerson,
  generateBRKEigendom,
  SolidAddress,
  SolidPerson,
} from './utils';

@Injectable()
export class DatapleinService {
  public validateWebIDExists(webID) {
    if (!webID) {
      throw new Error('Missing webID');
    }

    // check if any object in brpData array contains webID
    const person = brpData.find((element) => element.webID === webID);
    if (!person) {
      throw new Error('Unknown webID');
    }
  }

  public validateWebIDHasEigendom(webID) {
    if (!webID) {
      throw new Error('Missing webID');
    }

    // check if any object in brkData array contains webID
    const eigenaarschap = brkData.find((element) => element.webID === webID);
    if (!eigenaarschap) {
      throw new Error('WebID has no eigendom');
    }
  }

  public async registerWebID(
    webID: string,
    person: SolidPerson,
    address: SolidAddress,
  ): Promise<void> {
    await this.createPerson(webID, person);
    await this.createEigenaarschap(webID, address);
  }

  public getPerson(webID: string) {
    const person = brpData.find((element) => element.webID === webID);
    if (!person) {
      console.log('getPerson', webID, 'not found');
      throw new Error('Unknown webID');
    }
    return person;
  }

  private createPerson(webID: string, person: SolidPerson) {
    return new Promise((resolve, reject) => {
      const newPerson = generateBRPPerson(webID, person);
      console.log(newPerson);
      brpData.push(newPerson as any);
      resolve(webID);
    });
  }

  public getEigendom(webID: string) {
    // find element in array based on property
    const eigenaarschap = brkData.find((element) => element.webID === webID);
    if (!eigenaarschap) {
      throw new Error('No eigendom found');
    }
    return eigenaarschap;
  }

  private createEigenaarschap(webID: string, address: SolidAddress) {
    return new Promise((resolve, reject) => {
      const newEigenaarschap = generateBRKEigendom(webID, address);
      console.log(newEigenaarschap);
      brkData.push(newEigenaarschap as any);
      resolve(webID);
    });
  }
}
