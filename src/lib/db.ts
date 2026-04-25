import 'server-only';

// NOTE:
// Prisma client generation can fail in non-LTS Node runtimes.
// Use runtime require here to keep Next.js typecheck/build resilient,
// while still using the generated client at runtime after `prisma generate`.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client') as { PrismaClient: new (...args: any[]) => any };

declare global {
  // eslint-disable-next-line no-var
  var prisma: any;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
