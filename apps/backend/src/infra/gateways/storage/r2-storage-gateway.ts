import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { basename } from 'node:path';
import { Readable } from 'node:stream';

import type { StorageGateway } from '@application/contracts/storage-gateway';
import { BadRequestError } from '@application/errors/http/BadRequestError';
import { NotFoundError } from '@application/errors/http/NotFoundError';
import { createR2S3Client } from '@infra/clients/r2-s3-client';
import { Injectable } from '@kernel/decorators/injectable';
import { env } from '@shared/config/env';

const PDF_MAGIC = Buffer.from('%PDF-', 'ascii');
const MAX_PDF_BYTES = 150 * 1024 * 1024;

function isS3ObjectNotFound(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('name' in error)) {
    return false;
  }

  const name = (error as { name: string }).name;
  return name === 'NoSuchKey' || name === 'NotFound';
}

@Injectable()
export class R2StorageGateway implements StorageGateway {
  private readonly client: S3Client;

  private readonly bucket: string;

  constructor() {
    const config: StorageGateway.Config = {
      accountId: env.r2AccountId,
      bucket: env.r2Bucket,
      accessKeyId: env.r2AccessKeyId,
      secretAccessKey: env.r2SecretAccessKey,
      endpoint: env.r2Endpoint,
    };

    this.client = createR2S3Client(config);
    this.bucket = config.bucket;
  }

  async savePdf(projectId: string, file: Buffer): Promise<string> {
    if (file.length > MAX_PDF_BYTES) {
      throw new BadRequestError(
        `PDF exceeds maximum size of ${MAX_PDF_BYTES} bytes (150 MB)`,
      );
    }

    if (file.length < PDF_MAGIC.length || file.subarray(0, 5).compare(PDF_MAGIC) !== 0) {
      throw new BadRequestError('Invalid PDF file: file must start with %PDF- header');
    }

    const key = `${projectId}/pdfs/original.pdf`;
    await this.uploadMultipart(key, file, 'application/pdf');
    return key;
  }

  async saveImage(
    projectId: string,
    filename: string,
    data: Buffer,
  ): Promise<string> {
    const safeName = basename(filename);
    if (!safeName || safeName === '.' || safeName === '..') {
      throw new BadRequestError('Invalid image filename');
    }

    const key = `${projectId}/images/${safeName}`;
    const contentType = this.inferContentType(safeName);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );

    return key;
  }

  async saveAudio(
    projectId: string,
    filename: string,
    data: Buffer,
  ): Promise<string> {
    const safeName = basename(filename);
    if (!safeName || safeName === '.' || safeName === '..') {
      throw new BadRequestError('Invalid audio filename');
    }

    const key = `${projectId}/audio/${safeName}`;
    const contentType = this.inferContentType(safeName);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );

    return key;
  }

  async saveVideo(
    projectId: string,
    filename: string,
    data: Buffer,
  ): Promise<string> {
    const safeName = basename(filename);
    if (!safeName || safeName === '.' || safeName === '..') {
      throw new BadRequestError('Invalid video filename');
    }

    const key = `${projectId}/video/${safeName}`;
    const contentType = this.inferContentType(safeName);
    await this.uploadMultipart(key, data, contentType);
    return key;
  }

  async getFileUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      if (isS3ObjectNotFound(error)) {
        throw new NotFoundError(`Object not found: ${key}`);
      }
      throw error;
    }

    return getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
      { expiresIn },
    );
  }

  async getFileStream(key: string): Promise<NodeJS.ReadableStream> {
    try {
      const result = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      const body = result.Body;
      if (!body) {
        throw new NotFoundError(`Object not found: ${key}`);
      }

      if (body instanceof Readable) {
        return body;
      }

      return Readable.from(body as AsyncIterable<Uint8Array>);
    } catch (error) {
      if (isS3ObjectNotFound(error)) {
        throw new NotFoundError(`Object not found: ${key}`);
      }
      throw error;
    }
  }

  async deleteProjectFiles(projectId: string): Promise<void> {
    const prefix = `${projectId}/`;
    let continuationToken: string | undefined;

    do {
      const list = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      const keys =
        list.Contents?.map((c) => c.Key).filter((k): k is string => Boolean(k)) ??
        [];

      for (let i = 0; i < keys.length; i += 1000) {
        const batch = keys.slice(i, i + 1000);
        await this.client.send(
          new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: {
              Objects: batch.map((Key) => ({ Key })),
            },
          }),
        );
      }

      continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
    } while (continuationToken);
  }

  private async uploadMultipart(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<void> {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
    });

    await upload.done();
  }

  private inferContentType(filename: string): string {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.pdf')) return 'application/pdf';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.mp3')) return 'audio/mpeg';
    if (lower.endsWith('.wav')) return 'audio/wav';
    if (lower.endsWith('.mp4')) return 'video/mp4';
    return 'application/octet-stream';
  }
}
