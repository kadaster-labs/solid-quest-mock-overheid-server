import { Injectable } from '@nestjs/common';

import { GovernmentAgency, IssuerCredentialsApi } from '../api/vcApi';

import * as brkData from '../../data/brk_data.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrkService {
  vcAPIUrl: string;

  constructor(private readonly config: ConfigService) {
    this.vcAPIUrl = this.config.get<string>('VCApiUrl');
  }

  private validateInput(webID) {
    if (!webID) {
      throw new Error('Missing webID');
    }

    // Some db lookup to check if person is known to the agency
    const knownOwners = ['http://localhost:3001/verkoper-vera/profile/card#me'];

    if (!knownOwners.includes(webID)) {
      throw new Error('Unknown webID');
    }
  }

  private createCredential(eigenaarschap: object) {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
        'http://localhost:8081/contexts/brk-credentials.jsonld',
      ],
      id: 'https://kadaster.nl/credentials/3732',
      type: ['VerifiableCredential', 'EigendomCredential'],
      issuer: 'http://localhost:8081/keys/brk.jsonld',
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        ...eigenaarschap,
      },
    };
  }

  public async issueVC(webID: string) {
    this.validateInput(webID);
    const eigenaarschap = this.getDataFromDB(webID);
    const credential = this.createCredential(eigenaarschap);

    const api = new IssuerCredentialsApi({
      basePath: this.vcAPIUrl,
    });
    try {
      const verifiableCredential = await api.issueCredential(
        GovernmentAgency.Kadaster,
        { credential },
      );
      return verifiableCredential;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  private getDataFromDB(webID: string) {
    // find element in array based on property
    const eigenaarschap = brkData.find((element) => element.webID === webID);
    if (!eigenaarschap) {
      throw new Error('Unknown webID');
    }
    return eigenaarschap;
  }
}
