const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const url = 'https://scholarshipsads.com/';
  try {
    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(response.data);
    console.log("Title:", $('title').text());
    
    // Look for scholarship listing
    const items = $('.post-item, .listing-item, article');
    console.log("Found items:", items.length);
    
    if (items.length > 0) {
        items.each((i, el) => {
            if (i < 2) console.log(`Item ${i}:`, $(el).find('h2, h3').text().trim());
        });
    }
  } catch (err) {
    console.error(err.message);
  }
}
test();
