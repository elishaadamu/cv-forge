const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function testTopUnis() {
  const response = await axios.get('https://www.topuniversities.com/scholarships/scholarships-for-students', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  
  fs.writeFileSync('topunis.html', response.data);
  console.log('Saved to topunis.html, length: ' + response.data.length);
}
testTopUnis();
