/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */
import { securityLoader } from '@digitalcredentials/security-document-loader';
import {
  odrlController,
  odrlDocument,
  v1Controller,
  v1Examples,
} from './documents';

import * as brkCredentials from '../../public/contexts/brk-credentials.json';
import * as brpCredentials from '../../public/contexts/brp-credentials.json';
import * as brkKeys from '../../public/keys/kadaster.json';
import * as brpKeys from '../../public/keys/brp.json';

const loader = securityLoader();

loader.addStatic(
  'http://localhost:8080/public/contexts/brk-credentials.json',
  brkCredentials,
);
loader.addStatic(
  'http://localhost:8080/public/contexts/brp-credentials.json',
  brpCredentials,
);
loader.addStatic('http://localhost:8080/public/keys/kadaster.json', brkKeys);
loader.addStatic('http://localhost:8080/public/keys/brp.json', brpKeys);
loader.addStatic(v1Controller, v1Examples);
loader.addStatic(odrlController, odrlDocument);

export const documentLoader: any = loader.build();
