import 'server-only';

import { Client } from 'minio';
import type { StorageProvider } from '@/lib/storage/types';

const endpoint = process.env.S3_ENDPOINT || 'minio';
const port = Number(process.env.S3_PORT || '9000');
const useSSL = String(process.env.S3_USE_SSL || 'false').toLowerCase() === 'true';
const accessKey = process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER || '';
const secretKey = process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || '';
const bucket = process.env.S3_BUCKET || 'brahmforge-files';

const client = new Client({ endPoint: endpoint, port, useSSL, accessKey, secretKey });

async function ensureBucket() {
  const exists = await client.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(bucket, 'us-east-1');
  }
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export const s3StorageProvider: StorageProvider = {
  async upload({ buffer, fileName, contentType, programId }) {
    await ensureBucket();
    const objectName = `${programId}/${Date.now()}-${safeName(fileName)}`;
    await client.putObject(bucket, objectName, buffer, buffer.byteLength, {
      'Content-Type': contentType || 'application/octet-stream',
    });

    return {
      url: `/api/files/${encodeURIComponent(`${bucket}/${objectName}`)}`,
      storagePath: `s3://${bucket}/${objectName}`,
      size: buffer.byteLength,
    };
  },

  async readBuffer(storagePath: string) {
    await ensureBucket();
    const trimmed = storagePath.replace(/^s3:\/\//, '');
    const idx = trimmed.indexOf('/');
    const b = trimmed.slice(0, idx);
    const key = trimmed.slice(idx + 1);
    const stream = await client.getObject(b, key);
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      stream.on('data', (c) => chunks.push(Buffer.from(c)));
      stream.on('end', () => resolve());
      stream.on('error', reject);
    });
    return Buffer.concat(chunks);
  },

  async readText(storagePath: string) {
    const buf = await s3StorageProvider.readBuffer!(storagePath);
    return buf.toString('utf8');
  },
};
