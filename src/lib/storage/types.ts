export type UploadResult = {
  url: string;
  storagePath: string;
  size: number;
};

export interface StorageProvider {
  upload(args: {
    buffer: Buffer;
    fileName: string;
    contentType?: string;
    programId: string;
  }): Promise<UploadResult>;
  readText?(storagePath: string): Promise<string>;
  readBuffer?(storagePath: string): Promise<Buffer>;
}
