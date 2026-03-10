import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"',
};

async function testPaginationAndNoise() {
  const url1 = 'https://www.scholarshipregion.com/category/scholarships/';
  const url2 = 'https://www.scholarshipregion.com/category/scholarships/page/2/';
  
  const [resp1, resp2] = await Promise.all([
    axios.get(url1, { headers: HEADERS }),
    axios.get(url2, { headers: HEADERS })
  ]);
  
  const $1 = cheerio.load(resp1.data);
  const $2 = cheerio.load(resp2.data);
  
  let out = '';
  out += "=== Page 1 First 10 Listings ===\n";
  let c1 = 0;
  $1('.tdb_module_loop, .td-animation-stack').each((i, el) => {
    if ($1(el).closest('footer, .td-footer-wrapper, .td-sub-footer-container, .td-is-sidebar, aside, .widget, .td-pb-span4').length > 0) return;
    if (c1 < 10) out += $1(el).find('h3 a, .entry-title a').text().trim() + '\n';
    c1++;
  });
  
  out += "\n=== Page 2 First 10 Listings ===\n";
  let c2 = 0;
  $2('.tdb_module_loop, .td-animation-stack').each((i, el) => {
    if ($2(el).closest('footer, .td-footer-wrapper, .td-sub-footer-container, .td-is-sidebar, aside, .widget, .td-pb-span4').length > 0) return;
    if (c2 < 10) out += $2(el).find('h3 a, .entry-title a').text().trim() + '\n';
    c2++;
  });
  
  out += "\n=== Looking for noisy articles ===\n";
  $1('a').each((_, el) => {
    const text = $1(el).text().trim().toLowerCase();
    if (text.includes('13 years after') || text.includes('after a career in journalism') || text.includes('loosing her dad')) {
      out += 'Found noisy article: ' + text.substring(0, 50) + '\n';
      let parent = $1(el).parent();
      for (let i = 0; i < 5; i++) {
         out += '  Parent ' + i + ' class: ' + parent.attr('class') + '\n';
         parent = parent.parent();
         if (!parent.length) break;
      }
    }
  });
  
  fs.writeFileSync('tmp/debug_scholarships3.txt', out, 'utf8');
}
testPaginationAndNoise();
