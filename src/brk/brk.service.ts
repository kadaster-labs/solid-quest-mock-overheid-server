import { Injectable } from '@nestjs/common';

import { GovernmentAgency, IssuerCredentialsApi } from '../api/vcApi';
import { DatapleinService } from '../dataplein/dataplein.service';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrkService {
  vcAPIUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly overheidDataService: DatapleinService,
  ) {
    this.vcAPIUrl = this.config.get<string>('VCApiUrl');
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
    const eigenaarschap = this.overheidDataService.getEigendom(webID);
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
}
