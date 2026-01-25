import { S3Client } from "@aws-sdk/client-s3";

const globalForS3 = globalThis as unknown as { s3Client: S3Client };

// Cloudflare R2 configuration
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucket = process.env.R2_BUCKET_NAME || "";
const publicUrl = process.env.R2_PUBLIC_URL || "";

// R2 uses S3-compatible API with custom endpoint
const endpoint = accountId
  ? `https://${accountId}.r2.cloudflarestorage.com`
  : undefined;

export const s3Client =
  globalForS3.s3Client ||
  new S3Client({
    region: "auto", // R2 uses "auto" for region
    endpoint,
    forcePathStyle: true, // Required for R2 compatibility
    credentials: accessKeyId && secretAccessKey ? {
      accessKeyId,
      secretAccessKey,
    } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForS3.s3Client = s3Client;
}

export const R2_CONFIG = {
  bucket,
  publicUrl, // Custom domain or R2.dev URL for public access
  accountId,
};
