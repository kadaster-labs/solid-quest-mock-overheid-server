import { Injectable } from '@nestjs/common';

import { DatapleinService } from '../dataplein/dataplein.service';
import { Signing } from '../verifiable/signing';

@Injectable()
export class BrkService {
  signingSuite: Signing;

  constructor(private readonly overheidDataService: DatapleinService) {
    this.signingSuite = new Signing('brk', new Uint8Array([86, 97]));
  }

  private createCredential(eigenaarschap: object) {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/bbs/v1',
        'http://localhost:8080/contexts/brk-credentials.json',
      ],
      id: 'https://kadaster.nl/credentials/3732',
      type: ['VerifiableCredential', 'EigendomCredential'],
      issuer: 'http://localhost:8080/keys/brk.json',
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        ...eigenaarschap,
      },
    };
  }

  public async issueVC(webID: string, skipVerify = false) {
    const eigenaarschap = this.overheidDataService.getEigendom(webID);
    const credential = this.createCredential(eigenaarschap);

    const verifiableCredential = await this.signingSuite.signDocument(
      credential,
    );

    if (!skipVerify) {
      const verified = await this.signingSuite.verifyDocument(
        verifiableCredential,
      );

      console.log('Verified:', verified);
      if (!verified.verified) {
        throw new Error('Verification failed');
      }
    }

    return verifiableCredential;
  }
}
