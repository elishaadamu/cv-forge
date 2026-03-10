const axios = require('axios');
const cheerio = require('cheerio');

async function testCafe() {
  try {
    const response = await axios.get('https://scholarshipscafe.com/positions', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    const $ = cheerio.load(response.data);
    
    console.log("Title: " + $('title').text());
    
    // Look for the container of the list
    // Based on common patterns and previous attempts
    const articles = $('article');
    console.log("Article count:", articles.length);
    
    if (articles.length === 0) {
        // Try finding links that look like details
        const links = $('a[href*="/positions/"]');
        console.log("Position links count:", links.length);
        
        links.each((i, el) => {
            if (i < 3) {
                console.log(`Link ${i}:`, $(el).text().trim(), $(el).attr('href'));
                console.log("Parent text:", $(el).parent().text().trim().substring(0, 200));
            }
        });
    } else {
        articles.each((i, el) => {
            if (i < 3) {
                console.log(`Article ${i} title:`, $(el).find('h2, h3').first().text().trim());
            }
        });
    }

  } catch (err) {
    console.error(err.message);
  }
}

testCafe();
