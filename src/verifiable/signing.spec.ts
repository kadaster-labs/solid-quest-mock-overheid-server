import { Signing } from './signing';

describe('Signing', () => {
  let signing: Signing;

  const inputDocument = {
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
      webID: 'http://localhost:3001/koper-koos/profile/card#me',
      type: 'NatuurlijkPersoon',
      aanduidingNaamgebruik: 'De heer',
      geboorte: {
        type: 'Geboorte',
        geboortedatum: '1994-01-06',
        geboorteland: 'Nederland',
        geboorteplaats: 'Apeldoorn',
      },
      indicatieGeheim: 'false',
      indicatieOverleden: 'false',
      isVerbondenIn: {
        type: 'Partnerschap',
        datumSluiting: '2012-01-01',
        soortVerbintenis: 'Huwelijk',
        verbindt: 1337,
        verbintenisVoorwaarden: 'Gemeenschap van goederen',
      },
      naam: 'Koos Kadastersen',
    },
  };

  beforeEach(() => {
    signing = new Signing('brp', new Uint8Array([21, 31])); // Replace 'service' and empty Uint8Array with appropriate values
  });

  describe('loadSigningKeyPair', () => {
    it('should load the signing key pair', async () => {
      await signing.loadSigningKeyPair('brp', new Uint8Array([21, 31])); // Replace 'service' and empty Uint8Array with appropriate values

      expect(signing['keyPair']).toBeDefined(); // Ensure the keyPair property is defined
    });
  });

  describe('signDocument', () => {
    it('should sign the input document', async () => {
      const signedDocument = await signing.signDocument(inputDocument);

      expect(signedDocument).toBeDefined(); // Ensure the signed document is defined
      expect(signedDocument.proof).toBeDefined(); // Ensure the proof property is defined
    });
  });

  describe('verifyDocument', () => {
    let signedDocument: any;
    beforeAll(async () => {
      signedDocument = await signing.signDocument(inputDocument);
    });

    it('should verify the signed document', async () => {
      const verificationResult = await signing.verifyDocument(signedDocument);

      expect(verificationResult.verified).toBe(true);
    });

    it('should throw an error for unsupported signature type', async () => {
      const signedDocumentWithUnsupportedSignatureType = {
        ...signedDocument,
        proof: { type: 'UnsupportedSignatureType' },
      };

      await expect(
        signing.verifyDocument(signedDocumentWithUnsupportedSignatureType),
      ).rejects.toThrowError('Unsupported signature type');
    });
  });

  describe('deriveProofFromDocument', () => {
    let signedDocument: any;
    beforeAll(async () => {
      signedDocument = await signing.signDocument(inputDocument);
    });

    it('should derive a proof from the signed document', async () => {
      const derivedProof = await signing.deriveProofFromDocument(
        signedDocument,
      );

      expect(derivedProof.vc).toBeDefined(); // Ensure the derived proof is defined
    });

    it('should verify the signed derivative', async () => {
      const derivedProof = await signing.deriveProofFromDocument(
        signedDocument,
      );

      const verificationResult = await signing.verifyDocument(derivedProof.vc);

      expect(verificationResult.verified).toBe(true);
    });
  });
});
