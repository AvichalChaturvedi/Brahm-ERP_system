import 'server-only';

import type { StorageProvider } from '@/lib/storage/types';
import { localStorageProvider } from '@/lib/storage/local-storage-provider';
import { s3StorageProvider } from '@/lib/storage/s3-storage-provider';

export function getStorageProvider(): StorageProvider {
  const provider = (process.env.STORAGE_PROVIDER || 's3').toLowerCase();
  if (provider === 's3') return s3StorageProvider;
  return localStorageProvider;
}
