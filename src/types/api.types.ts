export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PaginationData {
  page: number; // 0-based từ Spring Boot backend
  size: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PageData<T> {
  items: T[];
  pagination: PaginationData;
}

// Backward compatibility alias for existing code
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
