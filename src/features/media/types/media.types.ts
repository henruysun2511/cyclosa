export interface CloudinaryMediaResponse {
  publicId: string;
  secureUrl: string;
  format?: string;
  bytes?: number;
  resourceType?: string;
}

export interface UploadMediaPayload {
  file: File;
  folder?: string;
}

export interface DeleteMediaPayload {
  publicId: string;
}
