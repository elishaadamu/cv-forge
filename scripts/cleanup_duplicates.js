const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDuplicates() {
  console.log('Cleaning duplicates for Scholarship...');
  const scholarships = await prisma.scholarship.findMany({
    select: { id: true, applyUrl: true }
  });
  
  const seenUrls = new Set();
  for (const s of scholarships) {
    if (s.applyUrl && seenUrls.has(s.applyUrl)) {
      console.log(`Deleting duplicate scholarship ID: ${s.id} with URL: ${s.applyUrl}`);
      await prisma.scholarship.delete({ where: { id: s.id } });
    } else if (s.applyUrl) {
      seenUrls.add(s.applyUrl);
    }
  }

  console.log('Cleaning duplicates for ScholarshipRegion...');
  const regions = await prisma.scholarshipRegion.findMany({
    select: { id: true, applyUrl: true }
  });
  
  const seenUrlsRegion = new Set();
  for (const r of regions) {
    if (r.applyUrl && seenUrlsRegion.has(r.applyUrl)) {
      console.log(`Deleting duplicate region ID: ${r.id} with URL: ${r.applyUrl}`);
      await prisma.scholarshipRegion.delete({ where: { id: r.id } });
    } else if (r.applyUrl) {
      seenUrlsRegion.add(r.applyUrl);
    }
  }

  console.log('Cleanup finished.');
  await prisma.$disconnect();
}

cleanDuplicates();
