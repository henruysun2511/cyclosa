export const MEDIA_ENDPOINTS = {
  UPLOAD: "/media/upload",
  DELETE: "/media",
} as const;

export const MEDIA_CONFIG = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  DEFAULT_AVATAR_FOLDER: "cyclosa/avatars",
} as const;
