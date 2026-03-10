const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.topuniversities.com/scholarships/scholarships-for-students');
  const html = await page.content();
  console.log("HTML length:", html.length);
  const items = await page.$$eval('.item', els => els.length);
  console.log(".item count:", items);
  const scholarships = await page.$$eval('h3', els => els.map(e => e.innerText));
  console.log("H3 tags:", scholarships.slice(0, 5));
  await browser.close();
}
run();
