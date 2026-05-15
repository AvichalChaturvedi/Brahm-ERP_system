import 'server-only';

import path from 'path';
import { promises as fs } from 'fs';
import type { StorageProvider } from '@/lib/storage/types';

const uploadRoot = path.join(process.cwd(), 'uploads');

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export const localStorageProvider: StorageProvider = {
  async upload({ buffer, fileName, programId }) {
    const safeName = `${Date.now()}-${sanitizeName(fileName)}`;
    const relPath = path.posix.join(programId, safeName);
    const fullPath = path.join(uploadRoot, relPath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);

    return {
      url: `/api/files/${encodeURIComponent(relPath)}`,
      storagePath: `local://${relPath}`,
      size: buffer.byteLength,
    };
  },

  async readBuffer(storagePath: string) {
    const relPath = storagePath.replace(/^local:\/\//, '');
    const fullPath = path.join(uploadRoot, relPath);
    return fs.readFile(fullPath);
  },

  async readText(storagePath: string) {
    const buf = await localStorageProvider.readBuffer!(storagePath);
    return buf.toString('utf8');
  },
};
