import { S3Client } from '@aws-sdk/client-s3';

import type { StorageGateway } from '@application/contracts/storage-gateway';

export function createR2S3Client(config: StorageGateway.Config): S3Client {
  const endpoint =
    config.endpoint ?? `https://${config.accountId}.r2.cloudflarestorage.com`;

  const useCustomEndpoint = Boolean(config.endpoint);

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    ...(useCustomEndpoint ? { forcePathStyle: true as const } : {}),
  });
}
