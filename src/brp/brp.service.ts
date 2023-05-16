import { Injectable } from '@nestjs/common';

import { DatapleinService } from '../dataplein/dataplein.service';
import { Signing } from '../verifiable/signing';

@Injectable()
export class BrpService {
  signingSuite: Signing;

  constructor(private readonly overheidDataService: DatapleinService) {
    this.signingSuite = new Signing('brp', new Uint8Array([21, 31]));
  }

  private createCredential(person: object) {
    return {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/bbs/v1',
        'http://localhost:8080/contexts/brp-credentials.json',
      ],
      id: 'https://kadaster.nl/credentials/3732',
      type: ['VerifiableCredential', 'IdentificatieCredential'],
      issuer: 'http://localhost:8080/keys/brp.json',
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        ...person,
      },
    };
  }

  public async issueVC(webID: string, skipVerify = false) {
    const person = this.overheidDataService.getPerson(webID);
    const credential = this.createCredential(person);

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
