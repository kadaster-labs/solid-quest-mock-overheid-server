import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { GovernmentAgency, IssuerCredentialsApi } from '../api/vcApi';
import { DatapleinService } from '../dataplein/dataplein.service';

@Injectable()
export class BrpService {
  vcAPIUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly overheidDataService: DatapleinService,
  ) {
    this.vcAPIUrl = this.config.get<string>('VCApiUrl');
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
    const person = this.overheidDataService.getPerson(webID);
    const credential = this.createCredential(person);

    const api = new IssuerCredentialsApi({ basePath: this.vcAPIUrl });
    const verifiableCredential = await api.issueCredential(
      GovernmentAgency.BRP,
      { credential },
    );

    return verifiableCredential;
  }
}
