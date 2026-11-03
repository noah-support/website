// Shared by the upload routes and the builder.

export const MAX_VIDEO_BYTES = 300 * 1024 * 1024;
export const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
// 300 MB in 8 MiB parts is 38 parts. The cap leaves room and stays far below the S3 limit.
export const MAX_PARTS = 64;

const UPLOAD_PREFIX = "pending:upload:";

export function pendingUploadKey(uploadId: string) {
  return `${UPLOAD_PREFIX}${uploadId}`;
}

export function uploadIdFromKey(key: string) {
  return key.startsWith(UPLOAD_PREFIX) ? key.slice(UPLOAD_PREFIX.length) : "";
}
