const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const url = 'https://www.internationalscholarships.com/';
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const count = $('.list-group-item').length;
    console.log("Found .list-group-item on homepage:", count);
  } catch (err) {
    console.error(err.message);
  }
}
test();
