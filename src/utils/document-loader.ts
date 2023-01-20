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

import * as data1 from '../../public/contexts/kadasterCredentials.json';
import * as data2 from '../../public/keys/brp.json';
import * as data3 from '../../public/keys/kadaster.json';

const loader = securityLoader();

loader.addStatic(
  'http://localhost:8080/public/contexts/kadasterCredentials.json',
  // data.default,
  data1,
);
loader.addStatic(
  'http://localhost:8080/public/keys/brp.json',
  // data.default,
  data2,
);
loader.addStatic(
  'http://localhost:8080/public/keys/kadaster.json',
  // data.default,
  data3,
);
loader.addStatic(v1Controller, v1Examples);
loader.addStatic(odrlController, odrlDocument);

export const documentLoader: any = loader.build();
