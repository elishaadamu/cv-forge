const fs = require('fs');

async function fetchCountries() {
  try {
    const response = await fetch('https://www.apicountries.com/countries');
    const data = await response.json();
    
    const formatted = data.map(country => {
      const dialCode = country.callingCodes?.[0] ? `+${country.callingCodes[0]}` : '';
      return { 
        iso: country.alpha2Code, 
        name: country.name,
        label: `${country.name} (${country.alpha2Code})`
      };
    });

    // Sort by name
    formatted.sort((a, b) => a.name.localeCompare(b.name));

    const content = `export const countryCodes = ${JSON.stringify(formatted, null, 2)};`;
    fs.writeFileSync('./lib/countries.ts', content);
    console.log('Successfully generated lib/countries.ts');
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

fetchCountries();
