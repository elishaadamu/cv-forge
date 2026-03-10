const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const url = 'https://www.internationalscholarships.com/scholarships';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  };
  
  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const count = $('.list-group-item, .scholarship, .result').length;
    console.log("Found items:", count);
    
    // If 0, let's see what *is* there
    if (count === 0) {
        console.log("HTML Sample:", response.data.substring(0, 1000));
        console.log("Div count:", $('div').length);
    }
  } catch (err) {
    console.error(err.message);
  }
}
test();
