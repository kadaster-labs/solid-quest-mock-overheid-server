// /*!
//  * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
//  */
// import { securityLoader } from '@digitalcredentials/security-document-loader';
// import {
//   odrlController,
//   odrlDocument,
//   v1Controller,
//   v1Examples,
// } from './documents';
// import { jsonldRequest } from 'jsonld-request';
// import { extendContextLoader, sign, verify, purposes } from 'jsonld-signatures';

// import * as brpCredentials from '../../public/contexts/brp-credentials.json';
// import * as brkKeys from '../../public/keys/kadaster.json';
// import * as brpKeys from '../../public/keys/brp.json';

// export const loadDocumentLoader: any = async () => {
//   const { brkCredentials } = await jsonldRequest(
//     '../../public/contexts/brk-credentials.jsonld',
//   );

//   const loader = securityLoader();

//   loader.addStatic(
//     'http://localhost:8081/contexts/brk-credentials.jsonld',
//     brkCredentials,
//   );
//   loader.addStatic(
//     'http://localhost:8081/contexts/brp-credentials.json',
//     brpCredentials,
//   );
//   loader.addStatic('http://localhost:8081/keys/kadaster.json', brkKeys);
//   loader.addStatic('http://localhost:8081/keys/brp.json', brpKeys);
//   loader.addStatic(v1Controller, v1Examples);
//   loader.addStatic(odrlController, odrlDocument);

//   return loader.build();
// };
