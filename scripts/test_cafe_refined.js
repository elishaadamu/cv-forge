const axios = require('axios');
const cheerio = require('cheerio');

async function testCafe() {
  const response = await axios.get('https://scholarshipscafe.com/positions', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(response.data);
  
  $('h3').each((i, el) => {
    if (i > 2) return;
    console.log(`--- H3 ${i}:`, $(el).text().trim());
    
    // Look for the closest container that has an <a> tag and more info
    let container = $(el).parent();
    for (let d = 0; d < 5; d++) {
        if (container.find('a').length > 0) {
            console.log(`Level ${d} container has links:`, container.find('a').attr('href'));
            // console.log("Text:", container.text().replace(/\s+/g, ' ').trim().substring(0, 500));
            break;
        }
        container = container.parent();
    }
  });
}
testCafe();
