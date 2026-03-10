import axios from 'axios';
import * as cheerio from 'cheerio';

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
  
  console.log("=== Page 1 First 3 Listings ===");
  $1('.tdb_module_loop, .td-animation-stack').each((i, el) => {
    if (i < 3) console.log($1(el).find('h3 a, .entry-title a').text().trim());
  });
  
  console.log("\n=== Page 2 First 3 Listings ===");
  $2('.tdb_module_loop, .td-animation-stack').each((i, el) => {
    if (i < 3) console.log($2(el).find('h3 a, .entry-title a').text().trim());
  });
  
  // Find where "years after" is located
  console.log("\n=== Looking for noisy articles ===");
  $1('a').each((_, el) => {
    const text = $1(el).text().trim().toLowerCase();
    if (text.includes('13 years after') || text.includes('after a career in journalism') || text.includes('loosing her dad')) {
      console.log('Found noisy article:', text.substring(0, 50));
      // Traverse up to find interesting parent classes
      let parent = $1(el).parent();
      for (let i = 0; i < 5; i++) {
         console.log('  Parent', i, 'class:', parent.attr('class'));
         parent = parent.parent();
         if (!parent.length) break;
      }
    }
  });

  // What is the main container for the actual grid?
  console.log("\n=== Investigating Grid Containers ===");
  $1('.td-ss-main-content, .tdc-column, .tdb_module_loop, .tdi_73, .tdi_74, .td-pb-span8').each((_, el) => {
    const classes = $1(el).attr('class');
    if (classes && classes.includes('column')) {
      const articles = $1(el).find('article, .td-animation-stack').length;
      if (articles > 0) {
        console.log(`Column ${classes.substring(0, 30)} has ${articles} articles`);
      }
    }
  });
  
  // Try to find a wrapper that only contains the list of scholarships we want
  const strictArticles: string[] = [];
  $1('div.tdb-category-loop-posts article, .td-category-grid article, .tdb_module_loop, .td_module_wrap').each((_, el) => {
     // A better way might be finding the specific wrapper or ignoring specific sidebar widgets
  });
}
testPaginationAndNoise();
