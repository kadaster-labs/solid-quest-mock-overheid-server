import { Injectable } from '@nestjs/common';

@Injectable()
export class BrpService {
  issueCredential(webID: string) {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
      ],
      id: 'https://kadaster.nl/credentials/3732',
      type: ['VerifiableCredential', 'AlumniCredential'],
      issuer: 'this.controller',
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        id: webID,
      },
    };
  }
}
