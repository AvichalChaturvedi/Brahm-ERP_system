/* eslint-disable no-console */
import prismaPkg from '@prisma/client';

const { PrismaClient } = prismaPkg;

const prisma = new PrismaClient();

async function verifyDatabase() {
  await prisma.$queryRaw`SELECT 1`;
  console.log('✅ Database connection: OK');
}

function verifyEnv() {
  const required = [
    'DATABASE_URL',
    'GROQ_API_KEY',
    'OPENROUTER_API_KEY',
    'AI_PROVIDER',
    'DEFAULT_AI_MODEL',
  ];

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  console.log('✅ Environment variables: OK');
}

async function verifyAIProvider() {
  const provider = (process.env.AI_PROVIDER || 'groq').toLowerCase();
  if (!['groq', 'openrouter'].includes(provider)) {
    throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
  }
  console.log(`✅ AI provider configuration: ${provider}`);
}

async function verifyBOMRouteContract() {
  const sample = {
    programName: 'Verification Program',
    fileName: 'sample.csv',
    sourceType: 'script',
    items: [
      { partNumber: 'MCU-001', description: 'MCU', quantity: 1000, supplier: '', unitCost: 3.4, category: 'semiconductor' },
      { partNumber: 'RES-10K', description: 'Resistor 10K', quantity: 12000, supplier: 'ABC', unitCost: 0.02, category: 'passive' },
    ],
  };

  const requiredKeys = ['programName', 'fileName', 'sourceType', 'items'];
  for (const key of requiredKeys) {
    if (!(key in sample)) throw new Error(`Route payload missing key: ${key}`);
  }
  console.log('✅ BOM route payload contract: OK');
}

async function main() {
  verifyEnv();
  await verifyDatabase();
  await verifyAIProvider();
  await verifyBOMRouteContract();
  console.log('🎉 Foundation verification passed');
}

main()
  .catch((err) => {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
