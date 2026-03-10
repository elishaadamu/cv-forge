import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

async function debug() {
  const url = 'https://www.scholarshipregion.com/category/scholarships/';
  const resp = await axios.get(url, { headers: HEADERS });
  const $ = cheerio.load(resp.data);

  // Check what various selectors match
  console.log('=== SELECTOR ANALYSIS ===');
  console.log('article:', $('article').length);
  console.log('.td_module_10:', $('.td_module_10').length);
  console.log('.td_module_16:', $('.td_module_16').length);
  console.log('.td-animation-stack:', $('.td-animation-stack').length);
  console.log('.td-block-span6:', $('.td-block-span6').length);
  console.log('.td_module_mx2:', $('.td_module_mx2').length);
  console.log('.tdb_module_loop:', $('.tdb_module_loop').length);

  // What's in the footer?
  console.log('\n=== FOOTER LINKS ===');
  $('footer a, .td-footer-wrapper a, .td-sub-footer-container a').each((i, el) => {
    if (i < 10) {
      console.log('Footer link:', $(el).text().trim().substring(0, 60), '->', $(el).attr('href'));
    }
  });

  // Now let's see what .td-animation-stack picks up
  console.log('\n=== .td-animation-stack ITEMS ===');
  $('.td-animation-stack').each((i, el) => {
    const title = $(el).find('.entry-title a, .td-module-title a, h3 a').text().trim();
    const link = $(el).find('.entry-title a, .td-module-title a, h3 a').attr('href');
    const parentClasses = $(el).parent().attr('class') || 'none';
    const isInFooter = $(el).closest('footer, .td-footer-wrapper, .td-sub-footer-container').length > 0;
    const isInSidebar = $(el).closest('.td-pb-span4, .td-is-sidebar, aside, .widget').length > 0;
    console.log(`[${i}] title: "${title.substring(0, 50)}" | inFooter: ${isInFooter} | inSidebar: ${isInSidebar} | parent: ${parentClasses.substring(0, 80)}`);
  });

  // Try to find the main content area  
  console.log('\n=== MAIN CONTENT AREA ===');
  const mainBlock = $('.td-ss-main-content, .td-pb-span8');
  console.log('Main content blocks:', mainBlock.length);
  
  const mainArticles: any[] = [];
  mainBlock.find('.td-animation-stack, .td_module_10, article').each((_, el) => {
    const title = $(el).find('.entry-title a, .td-module-title a, h3 a').text().trim();
    const link = $(el).find('.entry-title a, .td-module-title a, h3 a').attr('href');
    if (title && link && !mainArticles.find(a => a.link === link)) {
      mainArticles.push({ title: title.substring(0, 60), link });
    }
  });
  console.log(`Main area articles: ${mainArticles.length}`);
  mainArticles.forEach((a, i) => console.log(`  [${i}] ${a.title}`));

  // Footer articles (things we DON'T want)
  const footerArticles: any[] = [];
  $('footer .td-animation-stack, .td-footer-wrapper .td-animation-stack, .td-sub-footer-container .td-animation-stack').each((_, el) => {
    const title = $(el).find('.entry-title a, .td-module-title a, h3 a').text().trim();
    if (title) footerArticles.push(title.substring(0, 60));
  });
  console.log(`\nFooter articles (unwanted): ${footerArticles.length}`);
  footerArticles.forEach((t, i) => console.log(`  [${i}] ${t}`));

  // Sidebar articles (things we also probably DON'T want)
  const sidebarArticles: any[] = [];
  $('.td-pb-span4 .td-animation-stack, .td-is-sidebar .td-animation-stack, aside .td-animation-stack').each((_, el) => {
    const title = $(el).find('.entry-title a, .td-module-title a, h3 a').text().trim();
    if (title) sidebarArticles.push(title.substring(0, 60));
  });
  console.log(`\nSidebar articles (unwanted): ${sidebarArticles.length}`);
  sidebarArticles.forEach((t, i) => console.log(`  [${i}] ${t}`));
}
debug();
