const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const url = 'https://www.internationalscholarships.com/scholarships';
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const count = $('.list-group-item').length;
    console.log("Found .list-group-item:", count);
    
    if (count === 0) {
        console.log("All tags count:", $('*').length);
        // See what's inside the list-group if it exists
        console.log("List group count:", $('.list-group').length);
    }
  } catch (err) {
    console.error(err.message);
  }
}
test();
