
import { PrismaClient } from '@prisma/client';
import { shareToAllPlatforms } from '../lib/social';

const prisma = new PrismaClient();

async function main() {
  const mode = process.argv[2] || 'latest'; // 'latest' or 'all' or specific id
  
  console.log(`🚀 Starting social media broadcast (Mode: ${mode})...`);

  let programs: any[] = [];

  if (mode === 'latest') {
    // Get last 3 scholarship entries
    const scholarships = await prisma.scholarship.findMany({
      orderBy: { postedAt: 'desc' },
      take: 2
    });
    
    // Get last 2 scholarship region entries
    const regions = await prisma.scholarshipRegion.findMany({
      orderBy: { postedAt: 'desc' },
      take: 2
    });

    programs = [
      ...scholarships.map(s => ({ ...s, type: 'scholarship' })),
      ...regions.map(r => ({ ...r, type: 'scholarship' })) // Both treated as scholarships for now
    ];
  }

  if (programs.length === 0) {
    console.log('❌ No programs found to share.');
    return;
  }

  for (const program of programs) {
    console.log(`📢 Sharing: ${program.title}`);
    const result = await shareToAllPlatforms({
      title: program.title,
      company: program.company || program.provider || 'CVMYJOB',
      url: program.type === 'scholarship' && !program.country 
        ? `/graduate-programs/${program.id}` 
        : `/scholarship-region/${program.id}`,
      description: program.description,
      type: 'scholarship'
    });

    console.log('✅ Status:', JSON.stringify(result, null, 2));
    
    // Safety delay to avoid spam filters
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log('🏁 Broadcast complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
