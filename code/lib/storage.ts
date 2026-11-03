import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateBucketCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";

// Each video part is sent as its own request. The storage server refuses chunks over 16 MiB.
export const UPLOAD_PART_BYTES = 8 * 1024 * 1024;

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
      // Checksums only when the storage requires them. Otherwise the SDK sends
      // aws-chunked bodies, which S3-compatible servers often reject.
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
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

export async function putAsset(key: string, body: Buffer, mime: string) {
  const storage = client();
  if (!storage) throw new Error("File storage is not configured.");
  await storage.s3.send(
    new PutObjectCommand({ Bucket: storage.bucket, Key: key, Body: body, ContentLength: body.length, ContentType: mime })
  );
}

export async function startMultipart(key: string, mime: string) {
  const storage = client();
  if (!storage) throw new Error("File storage is not configured.");
  const result = await storage.s3.send(
    new CreateMultipartUploadCommand({ Bucket: storage.bucket, Key: key, ContentType: mime })
  );
  if (!result.UploadId) throw new Error("Storage did not start the upload.");
  return result.UploadId;
}

export async function uploadPart(key: string, uploadId: string, partNumber: number, body: Buffer) {
  const storage = client();
  if (!storage) throw new Error("File storage is not configured.");
  const result = await storage.s3.send(
    new UploadPartCommand({
      Bucket: storage.bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: body,
      ContentLength: body.length,
    })
  );
  if (!result.ETag) throw new Error("Storage did not accept the part.");
  return result.ETag;
}

export async function completeMultipart(key: string, uploadId: string, parts: { partNumber: number; etag: string }[]) {
  const storage = client();
  if (!storage) throw new Error("File storage is not configured.");
  await storage.s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: storage.bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts.map((part) => ({ PartNumber: part.partNumber, ETag: part.etag })) },
    })
  );
}

export async function abortMultipart(key: string, uploadId: string) {
  const storage = client();
  if (!storage) return;
  await storage.s3.send(new AbortMultipartUploadCommand({ Bucket: storage.bucket, Key: key, UploadId: uploadId }));
}

export async function deleteObject(key: string) {
  const storage = client();
  if (!storage) return;
  await storage.s3.send(new DeleteObjectCommand({ Bucket: storage.bucket, Key: key }));
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
