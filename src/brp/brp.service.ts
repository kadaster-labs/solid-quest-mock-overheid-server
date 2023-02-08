import { Injectable } from '@nestjs/common';

import { GovernmentAgency, IssuerCredentialsApi } from '../api/vcApi';

import * as brpData from '../../data/brp_data.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrpService {
  vcAPIUrl: string;

  constructor(private readonly config: ConfigService) {
    this.vcAPIUrl = this.config.get<string>('VCApiUrl');
  }
  private validateInput(webID) {
    if (!webID) {
      throw new Error('Missing webID');
    }

    // Some db lookup to check if person is known to the agency
    const knownCitizens = [
      'http://localhost:3001/verkoper-vera/profile/card#me',
      'http://localhost:3001/koper-koos/profile/card#me',
    ];

    if (!knownCitizens.includes(webID)) {
      throw new Error('Unknown webID');
    }
  }

  private createCredential(person: object) {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
        'http://localhost:8081/contexts/brp-credentials.jsonld',
      ],
      id: 'https://kadaster.nl/credentials/3732',
      type: ['VerifiableCredential', 'IdentificatieCredential'],
      issuer: 'http://localhost:8081/keys/brp.jsonld',
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        ...person,
      },
    };
  }

  public async issueVC(webID: string) {
    this.validateInput(webID);
    const person = this.getDataFromDB(webID);
    const credential = this.createCredential(person);

    const api = new IssuerCredentialsApi({ basePath: this.vcAPIUrl });
    const verifiableCredential = await api.issueCredential(
      GovernmentAgency.BRP,
      { credential },
    );

    return verifiableCredential;
  }

  private getDataFromDB(webID: string) {
    // find element in array based on property
    const person = brpData.find((element) => element.webID === webID);
    if (!person) {
      throw new Error('Unknown webID');
    }
    return person;
  }
}
