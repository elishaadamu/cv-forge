import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

interface ScholarshipRegionData {
  title: string;
  provider: string;
  country: string;
  type: string;
  description: string;
  applyUrl?: string;
  deadline?: Date | null;
  image?: string;
  postedAt?: Date;
}

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

function cleanHTML(html: string): string {
  const $ = cheerio.load(html, null, false);
  // Remove all attributes except href on <a>
  $('*').each((_, el) => {
    if (el.type === 'tag') {
      const element = el as any;
      const attributes = element.attribs || {};
      const newAttribs: Record<string, string> = {};
      if (element.name === 'a' && attributes.href) {
        newAttribs.href = attributes.href;
      }
      element.attribs = newAttribs;
    }
  });
  return $.html() || '';
}

async function scrapeListingPage(pageUrl: string): Promise<{ title: string; detailUrl: string; thumbImg?: string }[]> {
  console.log(`Fetching listing page: ${pageUrl}`);
  const resp = await axios.get(pageUrl, { headers: HEADERS });
  const $ = cheerio.load(resp.data);
  
  const listings: { title: string; detailUrl: string; thumbImg?: string }[] = [];

  // Match only the main grid items, explicitly excluding those featured/flex blocks
  $('.tdb_module_loop, .td-animation-stack').each((_, el) => {
    // If it's in the footer/sidebar, or if it's a featured flex block (which are often stories), skip it
    if ($(el).closest('footer, .td-footer-wrapper, .td-sub-footer-container, .td-is-sidebar, aside, .widget, .td-pb-span4, .td-mc1-wrap, .td_module_flex').length > 0) {
      return;
    }

    const title = $(el).find('.entry-title a, .td-module-title a, h3 a').text().trim();
    const link = $(el).find('.entry-title a, .td-module-title a, h3 a').attr('href');
    const img = $(el).find('.td-module-thumb img').attr('data-img-url') || $(el).find('img').first().attr('src');
    
    if (title && link && !listings.find(l => l.detailUrl === link)) {
      listings.push({ title, detailUrl: link, thumbImg: img });
    }
  });

  console.log(`  Found ${listings.length} listings on ${pageUrl}`);
  return listings;
}

async function scrapeDetailPage(listing: { title: string; detailUrl: string; thumbImg?: string }): Promise<ScholarshipRegionData | null> {
  try {
    console.log(`  Scraping details: ${listing.title.substring(0, 60)}...`);
    const resp = await axios.get(listing.detailUrl, { 
      headers: { ...HEADERS, 'Referer': 'https://www.scholarshipregion.com/' } 
    });
    const $ = cheerio.load(resp.data);

    // Extract content from detail page
    const contentContainer = $('.td-post-content');
    let content = "";

    if (contentContainer.length > 0) {
      contentContainer.find('script, style, .sharedaddy, .jp-relatedposts, .sd-block, noscript, iframe').remove();
      
      const semanticHtml: string[] = [];
      contentContainer.find('h1, h2, h3, h4, h5, h6, p, ul, ol').each((_, el) => {
        // Stop duplicates: if this element is already inside another element we selected, skip it
        if ($(el).parents('p, h1, h2, h3, h4, h5, h6, li').length > 0) return;

        if (el.type === 'tag') {
          const tag = el.name;
          const htmlContent = $(el).html()?.trim();
          if (htmlContent && htmlContent.length > 1) {
            semanticHtml.push(`<${tag}>${htmlContent}</${tag}>`);
          }
        }
      });

      content = semanticHtml.length > 0 ? cleanHTML(semanticHtml.join('\n')) : contentContainer.text().trim();
    }

    // Image - prefer OG image, then thumbnail
    const image = $('meta[property="og:image"]').attr('content') || listing.thumbImg;

    // Date
    const dateAttr = $('time.entry-date').attr('datetime');
    const postedAt = dateAttr ? new Date(dateAttr) : new Date();

    // External application link
    let applyUrl = listing.detailUrl;
    contentContainer.find('a').each((_, linkElem) => {
      const href = $(linkElem).attr('href');
      if (href && !href.includes('scholarshipregion.com') && href.startsWith('http')) {
        const linkText = $(linkElem).text().toLowerCase();
        if (linkText.includes('apply') || linkText.includes('click here') || 
            href.includes('forms') || href.includes('application') || href.includes('careers')) {
          applyUrl = href;
          return false; // break
        }
      }
    });

    // Determine provider from title
    let provider = "Scholarship Region";
    if (listing.title.toLowerCase().includes(' at ')) {
      provider = listing.title.split(/ at /i)[1].split(/ for /i)[0].split(' - ')[0].trim();
    } else if (listing.title.toLowerCase().includes(' by ')) {
      provider = listing.title.split(/ by /i)[1].split(/ for /i)[0].split(' - ')[0].trim();
    }

    // Determine country from content or title
    let country = "International";
    const fullText = (listing.title + ' ' + contentContainer.text()).toLowerCase();
    const countryKeywords: Record<string, string> = {
      'nigeria': 'Nigeria', 'usa': 'USA', 'united states': 'USA', 'canada': 'Canada',
      'uk': 'UK', 'united kingdom': 'UK', 'germany': 'Germany', 'australia': 'Australia',
      'south africa': 'South Africa', 'ghana': 'Ghana', 'kenya': 'Kenya',
      'india': 'India', 'china': 'China', 'japan': 'Japan', 'france': 'France',
      'netherlands': 'Netherlands', 'switzerland': 'Switzerland', 'sweden': 'Sweden'
    };
    for (const [keyword, name] of Object.entries(countryKeywords)) {
      if (fullText.includes(keyword)) {
        country = name;
        break;
      }
    }

    return {
      title: listing.title,
      provider,
      country,
      type: "Scholarship",
      description: content || `<p>${listing.title}</p>`,
      applyUrl,
      deadline: null,
      image,
      postedAt: isNaN(postedAt.getTime()) ? new Date() : postedAt,
    };
  } catch (err: any) {
    console.error(`  Failed: ${listing.title} - ${err.message}`);
    return null;
  }
}

async function scrapeScholarshipRegion() {
  console.log('=== Starting ScholarshipRegion Scraper ===\n');

  // No longer clearing the database to allow incremental updates
  // console.log('Clearing ScholarshipRegion table...');
  // await prisma.scholarshipRegion.deleteMany({});

  // Pages to scrape
  const pages = [
    'https://www.scholarshipregion.com/category/scholarships/',
    'https://www.scholarshipregion.com/category/scholarships/page/2/',
    'https://www.scholarshipregion.com/category/scholarships/page/3/',
    'https://www.scholarshipregion.com/category/scholarships/page/4/',
    'https://www.scholarshipregion.com/category/scholarships/page/5/',
    'https://www.scholarshipregion.com/category/scholarships/page/6/',
    'https://www.scholarshipregion.com/category/scholarships/page/7/',
    'https://www.scholarshipregion.com/category/scholarships/page/8/',
    'https://www.scholarshipregion.com/category/scholarships/page/9/',
    'https://www.scholarshipregion.com/category/scholarships/page/10/',
  ];

  const allListings: { title: string; detailUrl: string; thumbImg?: string }[] = [];
  const seenUrls = new Set<string>();

  for (const pageUrl of pages) {
    try {
      const listings = await scrapeListingPage(pageUrl);
      for (const listing of listings) {
        if (!seenUrls.has(listing.detailUrl)) {
          seenUrls.add(listing.detailUrl);
          allListings.push(listing);
        }
      }
    } catch (err: any) {
      console.error(`Failed to scrape ${pageUrl}: ${err.message}`);
    }
  }

  console.log(`\nTotal listings found: ${allListings.length}. Deep scraping...\n`);

  let count = 0;
  for (const listing of allListings) {
    const data = await scrapeDetailPage(listing);
    if (data) {
      try {
        await prisma.scholarshipRegion.upsert({
          where: { applyUrl: data.applyUrl || "" } as any,
          update: {
            title: data.title,
            provider: data.provider,
            country: data.country,
            type: data.type,
            description: data.description,
            deadline: data.deadline,
            image: data.image,
            postedAt: data.postedAt,
          },
          create: {
            title: data.title,
            provider: data.provider,
            country: data.country,
            type: data.type,
            description: data.description,
            applyUrl: data.applyUrl,
            deadline: data.deadline,
            image: data.image,
            postedAt: data.postedAt,
          }
        });
        count++;
      } catch (e: any) {
        console.error(`  DB insert failed for ${data.title}: ${e.message}`);
      }
    }
  }

  console.log(`\n=== Scraper Complete! Added ${count} scholarships to ScholarshipRegion table. ===`);
  await prisma.$disconnect();
}

scrapeScholarshipRegion();
