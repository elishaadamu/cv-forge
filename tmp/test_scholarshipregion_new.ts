import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"',
};

async function testFilter() {
  const url = 'https://www.scholarshipregion.com/category/scholarships/';
  const resp = await axios.get(url, { headers: HEADERS });
  const $ = cheerio.load(resp.data);
  
  // Inspect the layout wrapper
  const mainContainers = $('.tdb_module_loop');
  console.log(`Found ${mainContainers.length} .tdb_module_loop blocks.`);
  
  let loopListings: any[] = [];
  mainContainers.each((_, el) => {
    const title = $(el).find('.entry-title a, .td-module-title a, h3 a').text().trim();
    if (title) loopListings.push(title);
  });
  console.log(`Listings in .tdb_module_loop: ${loopListings.length}`);
  if (loopListings.length > 0) {
    console.log(loopListings.slice(0, 3));
  }

  const columns = $('.td_block_inner.td-mc1-wrap');
  console.log('Columns inner wrapper:', columns.length);
  const colListings: any[] = [];
  columns.find('.td-animation-stack').each((_, el) => {
    const title = $(el).find('.entry-title a, .td-module-title a, h3 a').text().trim();
    if (title) colListings.push(title);
  });
  console.log(`Col listings: ${colListings.length}`);
}
testFilter();
