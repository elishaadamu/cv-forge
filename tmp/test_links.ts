import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  const url = 'https://jobs.smartyacad.com/sundry-markets-warehouse-management-trainee-programme-2026/';
  const resp = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36' } });
  const $ = cheerio.load(resp.data);
  
  const container = $('.elementor-widget-theme-post-content');
  console.log('Container found:', container.length);
  console.log('Links in container:', container.find('a').length);
  container.find('a').each((i, e) => {
    console.log('Link:', $(e).attr('href'), '| Text:', $(e).text().trim());
  });
}
test();
