import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

interface ScholarshipData {
  title: string;
  provider: string;
  amount: string;
  currency: string;
  type: string;
  country: string;
  description: string;
  applyUrl?: string;
  deadline?: Date | null;
  image?: string;
  postedAt?: Date;
}

const parsers: Record<string, (html: string) => Promise<ScholarshipData[]>> = {
  'jobs.smartyacad.com': async (html) => {
    const $ = cheerio.load(html);
    const results: ScholarshipData[] = [];
    const listings = $('.elementor-post').toArray();

    console.log(`Found ${listings.length} listings. Starting deep scrape...`);

    for (const element of listings) {
      const title = $(element).find('.elementor-post__title a').text().trim();
      const detailUrl = $(element).find('.elementor-post__title a').attr('href');
      
      if (title && detailUrl) {
        try {
          console.log(`  Scraping details for: ${title}`);
          const detailResponse = await axios.get(detailUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            }
          });
          const $detail = cheerio.load(detailResponse.data);

          // Extract full content - target the Elementor content container used by SmartyAcad
          let content = "";
          let contentContainer = $detail('.elementor-widget-theme-post-content');
          if (contentContainer.length === 0) contentContainer = $detail('.entry-content');
          
          if (contentContainer.length > 0) {
            // Remove scripts, styles, and social sharing noise
            contentContainer.find('script, style, .sharedaddy, .jp-relatedposts, .sd-block, noscript, iframe').remove();
            
            // Reconstruct semantic HTML
            const semanticHtml: string[] = [];
            contentContainer.find('h1, h2, h3, h4, h5, h6, p, ul, ol, li, strong, b, i, em, br').each((_, el) => {
              if (el.type === 'tag') {
                const tag = el.name;
                const text = $(el).text().trim();
                if (text || tag === 'br') {
                  if (['ul', 'ol'].includes(tag)) {
                    semanticHtml.push($(el).prop('outerHTML') || "");
                  } else if (tag === 'li') {
                    if (!$(el).parent().is('ul, ol')) {
                      semanticHtml.push(`<li>${$(el).html()}</li>`);
                    }
                  } else {
                    semanticHtml.push(`<${tag}>${$(el).html()}</${tag}>`);
                  }
                }
              }
            });

            // If recon fails to find tags, fallback to cleaned inner html
            if (semanticHtml.length > 0) {
              content = semanticHtml.join('\n');
            } else {
              content = contentContainer.html() || "";
            }
            
            // Final Polish of HTML: Remove classes, ids, and inline styles
            const $cleaner = cheerio.load(content, null, false); // Load as fragment (isDocument = false)
            $cleaner('*').each((_, el) => {
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
            content = $cleaner.html() || contentContainer.text().trim();
          }
          
          if (!content || content.length < 100) {
             const container = $detail('.ast-container');
             container.find('script, style, img, video').remove();
             content = `<p>${container.text().trim()}</p>`;
          }
          
          // Extract image
          const image = $detail('.astra-post-thumbnail img').attr('src') || 
                        $detail('.wp-post-image').attr('src') ||
                        $detail('meta[property="og:image"]').attr('content');

          // Extract posted date
          const dateStr = $detail('.entry-date').text().trim() || $detail('.published').text().trim();
          const postedAt = dateStr ? new Date(dateStr) : new Date();

          // Extract final application link - MUST be external
          let externalApplyUrl = "";
          // Search within the specific content container for the best link
          contentContainer.find('a').each((_, linkElem) => {
            const href = $(linkElem).attr('href');
            if (href && !href.includes('jobs.smartyacad.com') && href.startsWith('http')) {
              const linkText = $(linkElem).text().toLowerCase();
              const isHighPriority = linkText.includes('apply') || 
                                   linkText.includes('click here') || 
                                   href.includes('forms') || 
                                   href.includes('careers') ||
                                   href.includes('application');
                                   
              if (isHighPriority) {
                externalApplyUrl = href;
                return false; // found a high-priority link, break
              }
              // Set if we don't have one, but keep looking for a higher priority one
              if (!externalApplyUrl) externalApplyUrl = href;
            }
          });

          const finalApplyUrl = externalApplyUrl || detailUrl;
          console.log(`    -> Description Length: ${content.length}`);
          console.log(`    -> Final Apply URL: ${finalApplyUrl}`);

          // Provider extraction logic
          let provider = "SmartyAcad Listing";
          if (title.toLowerCase().includes(' at ')) {
            provider = title.split(/ at /i)[1].split(/ Across /i)[0].split(' - ')[0].trim();
          } else if (title.includes(': ')) {
            const afterColon = title.split(': ')[1];
            provider = afterColon.split(/ Hiring /i)[0].split(/ Across /i)[0].trim();
          }

          results.push({
            title,
            provider,
            amount: "Varies",
            currency: "",
            type: "Graduate Program",
            country: "Nigeria",
            description: content || "Details available at source.",
            applyUrl: finalApplyUrl,
            deadline: null,
            image,
            postedAt: isNaN(postedAt.getTime()) ? new Date() : postedAt
          });
        } catch (err: any) {
          console.error(`  Failed to scrape details for ${title}:`, err.message);
        }
      }
    }
    return results;
  }
};

async function scrapeScholarships() {
  console.log('Starting multi-site scholarship scraper pipeline...');
  
  // Clear the existing scholarships as requested
  console.log('Clearing existing scholarship database...');
  await prisma.scholarship.deleteMany({});
  
  const TARGET_URLS = [
    'https://jobs.smartyacad.com/category/graduate-programs/',
  ];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  };

  let totalScraped = 0;
  const allScholarships: ScholarshipData[] = [];

  for (const url of TARGET_URLS) {
    console.log(`\nFetching data from ${url}...`);
    try {
      const response = await axios.get(url, { headers });
      const domain = new URL(url).hostname;
      
      const parser = parsers[domain] || parsers[domain.replace('www.', '')];
      if (parser) {
        const items = await parser(response.data);
        console.log(`Found ${items.length} scholarships from ${domain}.`);
        allScholarships.push(...items);
        totalScraped += items.length;
      } else {
        console.warn(`No parser found for ${domain}`);
      }
    } catch (error: any) {
      console.error(`Failed to scrape ${url}:`, error.message);
    }
  }

  console.log(`\nSuccessfully aggregated ${totalScraped} total scholarships. Processing database...`);

  let count = 0;
  for (const data of allScholarships) {
    try {
      await prisma.scholarship.create({
        data: {
          title: data.title,
          provider: data.provider,
          amount: data.amount,
          currency: data.currency,
          type: data.type,
          country: data.country,
          description: data.description,
          applyUrl: data.applyUrl,
          deadline: data.deadline,
          image: data.image,
          postedAt: data.postedAt
        }
      });
      count++;
    } catch (e: any) {
        console.error(`Failed to insert ${data.title}:`, e.message);
    }
  }

  console.log(`Scraper finished! Added ${count} new scholarships.`);
  await prisma.$disconnect();
}

scrapeScholarships();
