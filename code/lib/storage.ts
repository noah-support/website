import { Readable } from "node:stream";
import type { ReadableStream as WebReadableStream } from "node:stream/web";
import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export function storageSettings() {
  const endpoint = process.env.S3_ENDPOINT?.trim();
  const accessKeyId = process.env.S3_ACCESS_KEY?.trim();
  const secretAccessKey = process.env.S3_SECRET_KEY?.trim();
  const bucket = process.env.S3_BUCKET?.trim() || "noah-assets";
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;
  return {
    endpoint: endpoint.startsWith("http") ? endpoint : `http://${endpoint}`,
    accessKeyId,
    secretAccessKey,
    bucket,
  };
}

const globalForS3 = globalThis as unknown as { s3?: S3Client };

function client() {
  const settings = storageSettings();
  if (!settings) return null;
  if (!globalForS3.s3) {
    globalForS3.s3 = new S3Client({
      region: process.env.S3_REGION?.trim() || "us-east-1",
      endpoint: settings.endpoint,
      credentials: {
        accessKeyId: settings.accessKeyId,
        secretAccessKey: settings.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  return { s3: globalForS3.s3, bucket: settings.bucket };
}

export async function ensureBucket() {
  const storage = client();
  if (!storage) return;
  try {
    await storage.s3.send(new HeadBucketCommand({ Bucket: storage.bucket }));
  } catch {
    try {
      await storage.s3.send(new CreateBucketCommand({ Bucket: storage.bucket }));
    } catch (error) {
      console.error("[storage] could not create bucket:", error);
    }
  }
}

// Streams the upload to storage instead of copying it into one more buffer.
export async function putAsset(key: string, file: File) {
  const storage = client();
  if (!storage) throw new Error("File storage is not configured.");
  await storage.s3.send(
    new PutObjectCommand({
      Bucket: storage.bucket,
      Key: key,
      Body: Readable.fromWeb(file.stream() as unknown as WebReadableStream),
      ContentLength: file.size,
      ContentType: file.type,
    })
  );
}

export async function assetSize(key: string) {
  const storage = client();
  if (!storage) return null;
  const head = await storage.s3.send(new HeadObjectCommand({ Bucket: storage.bucket, Key: key }));
  return head.ContentLength ?? null;
}

// Streams the object, or only the bytes asked for. A video is never held in memory whole.
export async function streamAsset(key: string, range?: { start: number; end: number }) {
  const storage = client();
  if (!storage) return null;
  const result = await storage.s3.send(
    new GetObjectCommand({
      Bucket: storage.bucket,
      Key: key,
      ...(range ? { Range: `bytes=${range.start}-${range.end}` } : {}),
    })
  );
  if (!result.Body) return null;
  return result.Body.transformToWebStream();
}
