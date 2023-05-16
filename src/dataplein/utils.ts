import { faker } from '@faker-js/faker/locale/nl';

export interface SolidPerson {
  name: string | null;
  bday: Date | null;
}

export interface SolidAddress {
  streetAddress: string | null;
  locality: string | null;
  region: string | null;
  postalCode: string | null;
  countryName: string | null;
}

function formatDate(date: Date) {
  const day = date.getDate().toString().padStart(2, '0'); // padStart ensures the day has two digits
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // add 1 to month because it is zero-based, padStart ensures the month has two digits
  const year = date.getFullYear().toString();

  return `${day}-${month}-${year}`;
}

export function generateBRPPerson(webID: string, person: SolidPerson) {
  const brpPerson = {
    webID: webID,
    type: 'NatuurlijkPersoon',
    naam: person.name || faker.name.fullName(),
    geboorte: {
      type: 'Geboorte',
      geboortedatum: formatDate(
        person.bday
          ? new Date(person.bday)
          : faker.date.birthdate({ min: 18, mode: 'age' }),
      ),
      geboorteland: 'Nederland',
      geboorteplaats: faker.address.city(),
    },
  };

  return brpPerson;
}

export function generateBRKEigendom(webID: string, address: SolidAddress) {
  const eigendom = {
    webID: webID,
    eigendom: {
      perceel: {
        identificatie: '10020263270000', // TODO: generate pseudo-random BAG ID
      },
      pand: {
        adres: address.streetAddress || faker.address.streetAddress(),
        postcode: address.postalCode || faker.address.zipCode(),
        woonplaats: address.countryName || faker.address.city(),
      },
    },
  };

  return eigendom;
}
