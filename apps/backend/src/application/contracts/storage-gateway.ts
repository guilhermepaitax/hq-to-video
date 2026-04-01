export interface StorageGateway {
  savePdf(projectId: string, file: Buffer): Promise<string>;

  saveImage(projectId: string, filename: string, data: Buffer): Promise<string>;

  saveAudio(projectId: string, filename: string, data: Buffer): Promise<string>;

  saveVideo(projectId: string, filename: string, data: Buffer): Promise<string>;

  getFileUrl(key: string, expiresIn?: number): Promise<string>;

  getFileStream(key: string): Promise<NodeJS.ReadableStream>;

  deleteProjectFiles(projectId: string): Promise<void>;
}

export namespace StorageGateway {
  export type Config = {
    accountId: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
  };
}
