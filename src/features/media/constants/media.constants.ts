export const MEDIA_ENDPOINTS = {
  UPLOAD: "/media/upload",
  DELETE: "/media",
} as const;

export const MEDIA_FOLDERS = {
  GENERAL: "cyclosa/general",
  AVATARS: "cyclosa/avatars",
  PRODUCTS: "cyclosa/products",
  EMPLOYEES: "cyclosa/employees",
  DOCUMENTS: "cyclosa/documents",
  CONTRACTS: "cyclosa/contracts",
  ASSETS: "cyclosa/assets",
  RECEIPTS: "cyclosa/receipts",
} as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[keyof typeof MEDIA_FOLDERS];

export const MEDIA_CONFIG = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  DEFAULT_FOLDER: MEDIA_FOLDERS.GENERAL,
} as const;
