import faker from 'faker';

function createFakeRow(index) {
    return {
        id: index,
        avartar: faker.image.avatar(),
        county: faker.address.county(),
        email: faker.internet.email(),
        title: faker.name.prefix(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        street: faker.address.streetName(),
        zipCode: faker.address.zipCode(),
        date: faker.date.past().toLocaleDateString(),
        bs: faker.company.bs(),
        catchPhrase: faker.company.catchPhrase(),
        companyName: faker.company.companyName(),
        words: faker.lorem.words(),
        sentence: faker.lorem.sentence(),
    };
}

export default function createRowData(count) {
    return [...Array(count).keys()].map((i) => createFakeRow(i));
}
