# Mock Overheid Server

## Description
Within the [Solid Quest](https://github.com/kadaster-labs/solid-quest) we want to examine and get a feeling for the scenario where citizens own their own data. In this scenario, government could issue data about citizens, which they can place in their own wallet/datapod/etc. This repo combines two mock services: a local government and Kadaster. The local government contains the registry of citizen data, the Basisregistratie Personen _BRP_, and Kadaster, the land administration office, keeps records of land ownership in the _BRK_.

Both services can issue claims, information about the subject. An example is that a certain citizen is the owner of some parcel. Since the citizen is owner of their own data, we need some way to verify the data wasn't tampered with. For this, we'll use [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/). The services issue these VCs, which the citizen can reshare whenever necessary.

## Mock service architecture
The mock backend service architecture is designed to support the koopovereenkomst app of the Solid Quest with some example Verifiable Credentials. The following description outlines the approach of the mock service:

The architecture of the service revolves around generating Verifiable Credentials (VCs) for webIDs without the need for authentication or authorization. This eliminates the complexity of user authentication and allows for a streamlined demonstration. Users can simply submit a webID to the backend, triggering the creation of a dummy VC associated with the provided webID. If the webID is new, a new entry can be creating, creating dummy data.


## Example Credentials
The properties in the credentials originate from the Zorgeloos Vastgoed ontology [[1](https://taxonomie.zorgeloosvastgoed.nl/zv/nl/), [2](https://github.com/bp4mc2/bp4mc2-zvg/blob/master/informatiemodel/rdf/ontologie.ttl)], with an added _webID_ property. The context for the properties used in the credentials can be found in `/public/contexts/`.

### BRP - IdentificatieCredential
An identification credential contains the following:
```json
{
    "webID": "http://localhost:3001/koper-koos/profile/card#me",
    "type": "NatuurlijkPersoon",
    "aanduidingNaamgebruik": "De heer",
    "geboorte": {
        "type": "Geboorte",
        "geboortedatum": "1994-01-06",
        "geboorteland": "Nederland",
        "geboorteplaats": "Apeldoorn"
    },
    "naam": "Koos"
}
```

### BRK - EigendomCredential
An ownership credential contains the following:
```json
{
    "webID": "http://localhost:3001/verkoper-vera/profile/card#me",
    "eigendom": {
        "perceel": {
            "begrenzingPerceel": "",
            "kadastraleGrootte": "42",
            "identificatie": 10020263270000
        },
        "pand": {
            "adres": "Laan van Westenenk 701",
            "postcode": "7334 DP",
            "woonplaats": "Apeldoorn"
        }
    }
}
```

Note: The `eigendom.perceel.identificatie` can be used to query the [Kadaster Knowledge Graph](https://data.labs.kadaster.nl/dst/kkg/) for information about the parcel.

## Project structure
```
.
├── data
├── public
│   ├── contexts
│   └── keys
└── src
```

<dl>
  <dt>data</dt>
  <dd>Contains the database entries for the government services. This obviously is mock data. Extra entries can be generated via the `/registerWebID` endpoint.</dd>
  <dt>public</dt>
  <dd>Files that should be publicly available, namely: the public keys used for verifying the VCs. Also, additional context information for the contents of the credentials.</dd>
  <dt>src</dt>
  <dd>Contains the project source code.</dd>
</dl>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
