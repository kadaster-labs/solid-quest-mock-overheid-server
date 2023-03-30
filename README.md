# Mock Overheid Server

<p align="center">
  <img src="koek_server.jpg" width="200" alt="MOS Logo" />
</p>
<p align="center">
    Backend serving mock data for <a href="https://github.com/kadaster-labs/solid-quest">Solid Quest</a> in NestJS.
</p>



## Description
Within the [Solid Quest]() we want to examine and get a feeling for the scenario where citizens own their own data. In this scenario, government could issue data about citizens, which they can place in their own wallet/datapod/etc. This repo combines two fake services: the BRP and Kadaster. _BRP_ contains information about citizens and _Kadaster_, the land administration office, keeps records of land ownership.

Both services can issue credentials, information about the subject. Since the citizen is owner of their own data, we need some way to verify the data wasn't tampered with. For this, we'll use [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/). The services issue these VCs, which the citizen can reshare whenever necessary.

We've identified a couple of possible architectures for how a viable setup could look. We're trying to strike a balance between creating a demonstration which show the base principles and creating a realistic prototype of how it could work in the real world by mimicking real-world processes.

Going through the scenarios, the demo app gets more complex. At the moment it is unknown what setup meets our criteria for the Solid Quest best.

### Scenario 1:
In this architecture there is no authentication / authorization in the mock service. You can just send some webID to the backend, which will create a dummy VC for said webID. The VC is signed with a publicly accessible public key, so some _verifier_, like the Koopovereenkomst App, can verify the issued credentials.

There is some list of known (hardcoded) citizens: Koper Koos and Verkoper Vera.

### Scenario 2:
Like scenario 1, except: There is some authentication so that (signed in) citizens can only get credentials for themselves. This could possibly be done by utilizing `@inrupt/solid-client-authn-node`, which lets users authenticate using their Solid Pod. In this scenario citizens have some government provided Pods.

Koos and Vera can collect their credentials by logging in with their Pod in the backend.

### Scenario 3:
Like scenario 2, except: There is a database which contains the BRP and BRK records. Testers of the Solid Quest Koopovereenkomst App can create their own Solid Pod, whereas in Scenario 1 and 2 there only were the hardcoded Koos and Vera. After pod creation, dummy entries are created in the BRP and BRK databases.

Testers can collect their credentials from the backend by logging in to their Solid Pod.

### Scenario 4:
Like scenario 3, except: There is a separate Identity Provider for both the Pod Provider and government services. This scenario has a "bring your own pod" idea behind it. Logging in to the government services goes via some _DigiD_ and is decoupled from your Pod identity.

This scenario requires us to have some way to verify that a Pod belongs to the person. Otherwise, there doesn't seem a way to link the Pod owner to the verified citizen. It isn't quite clear yet how this would work. Perhaps citizens could log into mijn.overheid.nl, which shows some unique code. The citizen then places this code at a public location in their pod, after which they provide a link to it to mijn.overheid.nl. It effectively functions a verification code. Then, whenever someone logs in with DigiD to the _BRP_ / _BRK_, the VC will be issued with a reference to their webID(?).


## Example Credentials
The properties in the credentials originate from the Zorgeloos Vastgoed ontology [[1](https://taxonomie.zorgeloosvastgoed.nl/zv/nl/), [2](https://github.com/bp4mc2/bp4mc2-zvg/blob/master/informatiemodel/rdf/ontologie.ttl)], with an added _webID_ property. The context for the properties used in the credentials can be found in `/public/contexts/` in VC API ([link](https://github.com/kadaster-labs/solid-quest-koek-vc-api/tree/main/public/contexts)).

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

The `eigendom.perceel.identificatie` can be used to query the [Kadaster Knowledge Graph](https://data.labs.kadaster.nl/dst/kkg/) for information about the parcel.

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
  <dd>Contains the database entries for the government services. This obviously is mock data.</dd>
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
