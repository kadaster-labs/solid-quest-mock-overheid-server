import {
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  Bls12381G2KeyPair,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';
import * as bs58 from 'bs58';
import {
  extendContextLoader,
  purposes,
  sign,
  suites,
  verify,
} from 'jsonld-signatures';

import * as bbsContext from './data/bbs.json';
import * as credentialContext from './data/credentialsContext.json';
import * as odrlContext from './data/odrl.json';
import * as suiteContext from './data/suiteContext.json';
import * as revealDocument from './data/deriveProofFrame.json';

import * as brkCredentialContext from '../../public/contexts/brk-credentials.json';
import * as brpCredentialContext from '../../public/contexts/brp-credentials.json';
import * as brkController from '../../public/keys/brk-controller.json';
import * as brkPublic from '../../public/keys/brk.json';
import * as brpController from '../../public/keys/brp-controller.json';
import * as brpPublic from '../../public/keys/brp.json';

/* eslint-disable-next-line */
const documents = {
  'https://www.w3.org/2018/credentials/v1': credentialContext,
  'https://www.w3.org/ns/odrl.jsonld': odrlContext,
  'https://w3id.org/security/bbs/v1': bbsContext,
  'https://w3id.org/security/suites/jws-2020/v1': suiteContext,
  'http://localhost:8080/contexts/brk-credentials.json': brkCredentialContext,
  'http://localhost:8080/contexts/brp-credentials.json': brpCredentialContext,
  'http://localhost:8080/keys/brk-controller.json': brkController,
  'http://localhost:8080/keys/brk.json': brkPublic,
  'http://localhost:8080/keys/brp-controller.json': brpController,
  'http://localhost:8080/keys/brp.json': brpPublic,
};

/* eslint-disable-next-line */
const customDocLoader = async (url) => {
  const context = documents[url];

  if (context) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: context, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  console.log(
    `Attempted to remote load context : '${url}', please cache instead`,
  );
  throw new Error(
    `Attempted to remote load context : '${url}', please cache instead`,
  );
};

//Extended document load that uses local contexts
/* eslint-disable-next-line */
const documentLoader = extendContextLoader(customDocLoader);

export class Signing {
  private keyPair: Bls12381G2KeyPair;

  constructor(service: string, seed: Uint8Array) {
    this.loadSigningKeyPair(service, seed);
  }

  async loadSigningKeyPair(service: string, seed: Uint8Array): Promise<void> {
    //Load the key pair from storage
    this.keyPair = await Bls12381G2KeyPair.generate({
      id: `http://localhost:8080/keys/${service}.json`,
      controller: `http://localhost:8080/keys/${service}-controller.json`,
      seed,
    });

    const publicKeyBase58 = bs58.encode(Buffer.from(this.keyPair.publicKey));
    console.log(`Public key base58 for ${service} is: `, publicKeyBase58);
  }

  // Sign the input document
  async signDocument(inputDocument: object): Promise<any> {
    const purpose = new purposes.AssertionProofPurpose();
    return await sign(
      { ...inputDocument }, // pass copy of document, as original document will be mutated
      {
        suite: new BbsBlsSignature2020({ key: this.keyPair }),
        purpose,
        documentLoader,
      },
    );
  }

  async verifyDocument(signedDocument: any): Promise<any> {
    let suite: suites.LinkedDataProof;
    if (signedDocument.proof.type === 'BbsBlsSignature2020') {
      suite = new BbsBlsSignature2020();
    } else if (signedDocument.proof.type === 'BbsBlsSignatureProof2020') {
      suite = new BbsBlsSignatureProof2020();
    } else {
      throw new Error('Unsupported signature type');
    }

    return await verify(signedDocument, {
      suite,
      purpose: new purposes.AssertionProofPurpose(),
      documentLoader,
    });
  }

  async deriveProofFromDocument(signedDocument: any): Promise<any> {
    // Derive a proof
    const derivedProof = await deriveProof(signedDocument, revealDocument, {
      suite: new BbsBlsSignatureProof2020(),
      documentLoader,
    });

    return { vc: derivedProof };
  }
}
