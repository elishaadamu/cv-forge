const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
  try {
    const response = await axios.get('https://www.internationalscholarships.com/');
    const $ = cheerio.load(response.data);
    
    $('.list-group-item').each((i, el) => {
       const title = $(el).find('h3 a').text().trim();
       const applyUrl = 'https://www.internationalscholarships.com' + $(el).find('h3 a').attr('href');
       const provider = $(el).find('h4').text().trim();
       const description = $(el).find('p').first().text().trim();
       
       let amount = "Varies";
       let deadline = null;
       
       // sometimes listed in spans or p tags? Let's check text
       const fullText = $(el).text();
       
       console.log(`[${i}] Title: ${title}`);
       console.log(`[${i}] Provider: ${provider}`);
       console.log(`[${i}] ApplyURL: ${applyUrl}`);
       console.log(`[${i}] Desc: ${description?.substring(0, 50)}...`);
       console.log("---------------");
    });

  } catch (err) {
    console.error(err.message);
  }
}

testScrape();
