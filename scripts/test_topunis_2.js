const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('topunis.html'));

console.log($('.item').length, " items");
$('.item').each((i, el) => {
    let t = $(el).text();
    if(t.trim().length > 0) console.log(`Item ${i}: `, t.trim().substring(0, 100).replace(/\n/g, ' '));
});
