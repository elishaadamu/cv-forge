const axios = require('axios');
const cheerio = require('cheerio');

async function testCafe() {
  const response = await axios.get('https://scholarshipscafe.com/positions', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(response.data);
  
  $('h2').each((i, el) => {
    if (i < 5) {
        console.log(`H2 ${i}:`, $(el).text().trim());
        const link = $(el).find('a').attr('href') || $(el).closest('div').find('a').attr('href');
        console.log(`Link:`, link);
    }
  });
}
testCafe();
