/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const programs = [
    {
      name: 'Industrial Controller Board',
      description: 'Control board for factory automation systems.',
      status: 'active',
    },
    {
      name: 'IoT Thermal Module',
      description: 'Connected temperature and telemetry hardware module.',
      status: 'active',
    },
    {
      name: 'Smart Beverage Dispenser PCB',
      description: 'PCB program for smart beverage dispensing systems.',
      status: 'active',
    },
  ];

  for (const p of programs) {
    await prisma.program.upsert({
      where: { id: `seed-${p.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: { description: p.description, status: p.status },
      create: {
        id: `seed-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...p,
      },
    });
  }

  console.log('Seed complete: default programs inserted/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
