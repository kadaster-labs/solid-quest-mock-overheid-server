import { Injectable } from '@nestjs/common';
import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020';
import { Ed25519VerificationKey2020 } from '@digitalcredentials/ed25519-verification-key-2020';
import * as vc from '@digitalcredentials/vc';

import { documentLoader } from '../utils/document-loader';
import * as brkData from '../../data/brk_data.json';

@Injectable()
export class BrkService {
  private readonly signingSeed = 'kadaster';

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
        'http://localhost:8080/public/contexts/brk-credentials.json',
      ],
      id: 'https://kadaster.nl/credentials/3732',
      type: ['VerifiableCredential', 'EigendomCredential'],
      issuer: 'http://localhost:8080/public/keys/kadaster.json',
      issuanceDate: '2020-03-16T22:37:26.544Z',
      credentialSubject: {
        ...eigenaarschap,
      },
    };
  }

  private async signCredential(credential) {
    const keyPair = await Ed25519VerificationKey2020.generate({
      controller: 'http://localhost:8080/public/keys/kadaster.json',
      // Make sure the keyPair.publicKeyMultibase is updated in issuer.json
      seed: Buffer.alloc(32).fill(this.signingSeed),
    });

    console.log(
      `generated keypair with\npublic key:\n${keyPair.publicKeyMultibase}\nand private key:\n${keyPair.privateKeyMultibase}`,
    );

    const suite = new Ed25519Signature2020({ key: keyPair });
    suite.date = new Date();

    const signedCredential = await vc.issue({
      credential,
      suite,
      documentLoader,
    });

    return signedCredential;
  }

  public async issueVC(webID: string) {
    this.validateInput(webID);
    const eigenaarschap = this.getDataFromDB(webID);
    const credential = this.createCredential(eigenaarschap);
    const verifiableCredential = await this.signCredential(credential);
    return verifiableCredential;
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
