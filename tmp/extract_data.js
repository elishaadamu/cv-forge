const { Country, State } = require('country-state-city');
const fs = require('fs');
const path = require('path');

const countries = Country.getAllCountries();
const data = countries.map(country => {
    const states = State.getStatesOfCountry(country.isoCode).map(state => ({
        name: state.name,
        code: state.isoCode
    }));
    
    return {
        name: country.name,
        isoCode: country.isoCode,
        flag: country.flag,
        phonecode: country.phonecode,
        states: states
    };
});

const outputPath = path.join(__dirname, '..', 'lib', 'countries-data.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Data extracted to ${outputPath}`);
