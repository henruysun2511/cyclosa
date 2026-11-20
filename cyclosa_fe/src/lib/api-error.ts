import { toast } from "sonner";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Cấu trúc lỗi trả về từ Spring Boot ApiResponse
 */
export interface BackendFieldError {
  field?: string;
  message?: string;
}

export interface BackendErrorPayload {
  success?: boolean;
  code?: number | string;
  message?: string;
  data?: {
    errors?: BackendFieldError[];
    [key: string]: unknown;
  } | unknown;
  error?: string;
  status?: number;
  timestamp?: string;
  path?: string;
}

/** Bộ nhớ đệm chống trùng lặp Toast trong khoảng thời gian ngắn (1.5 giây) */
const recentToasts = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1500;

function shouldThrottleToast(key: string): boolean {
  const now = Date.now();
  const lastTime = recentToasts.get(key);

  // Dọn dẹp các key cũ hơn 5 giây
  if (recentToasts.size > 50) {
    for (const [k, time] of recentToasts.entries()) {
      if (now - time > 5000) {
        recentToasts.delete(k);
      }
    }
  }

  if (lastTime && now - lastTime < DEDUPE_WINDOW_MS) {
    return true;
  }

  recentToasts.set(key, now);
  return false;
}

/**
 * Trích xuất thông báo lỗi chi tiết, thân thiện từ bất kỳ phản hồi lỗi API hoặc Error instance
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng thử lại!"
): string {
  if (!error) return fallbackMessage;

  // 1. Kiểm tra nếu là chuỗi thuần
  if (typeof error === "string") {
    return error.trim() || fallbackMessage;
  }

  // 2. Kiểm tra nếu là FetchBaseQueryError từ RTK Query
  const maybeQueryError = error as FetchBaseQueryError;

  // Lỗi mạng hoặc timeout
  if (maybeQueryError.status === "FETCH_ERROR") {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng hoặc liên hệ quản trị viên.";
  }
  if (maybeQueryError.status === "TIMEOUT_ERROR") {
    return "Quá thời gian phản hồi từ máy chủ. Vui lòng thử lại sau.";
  }
  if (maybeQueryError.status === "PARSING_ERROR") {
    return "Lỗi phân tích dữ liệu trả về từ máy chủ.";
  }

  // Kiểm tra payload từ Spring Boot ApiResponse
  const data = (maybeQueryError.data || (error as { response?: { data?: unknown } })?.response?.data || (error as { data?: unknown })?.data) as BackendErrorPayload | undefined;

  if (data && typeof data === "object") {
    // Trường hợp MethodArgumentNotValidException: chứa danh sách field errors
    const validationErrors = (data.data as { errors?: BackendFieldError[] })?.errors;
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      const fieldMsgs = validationErrors
        .map((e) => (e.message ? `${e.field ? `[${e.field}]: ` : ""}${e.message}` : ""))
        .filter(Boolean);

      if (fieldMsgs.length > 0) {
        // Nếu có tiêu đề chung
        const baseMsg = data.message && data.message !== "Validation failed" ? `${data.message}: ` : "Dữ liệu không hợp lệ: ";
        return `${baseMsg}${fieldMsgs.join(" • ")}`;
      }
    }

    // Trường hợp có message từ backend ApiResponse
    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message.trim();
    }

    // Trường hợp có trường error từ Spring Boot mặc định
    if (typeof data.error === "string" && data.error.trim().length > 0) {
      return data.error.trim();
    }
  }

  // Nếu data trả về dạng text thô
  if (typeof maybeQueryError.data === "string" && maybeQueryError.data.trim()) {
    // Tránh in cả HTML nếu backend trả về trang lỗi 502/500 dạng HTML
    if (!maybeQueryError.data.includes("<html") && !maybeQueryError.data.includes("<!DOCTYPE")) {
      return maybeQueryError.data.trim();
    }
  }

  // Xử lý theo mã HTTP Status tiêu chuẩn
  const statusCode = typeof maybeQueryError.status === "number" ? maybeQueryError.status : data?.status;

  if (statusCode) {
    switch (statusCode) {
      case 400:
        return fallbackMessage !== "Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng thử lại!"
          ? fallbackMessage
          : "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin (400).";
      case 401:
        return "Phiên làm việc đã hết hạn hoặc chưa đăng nhập. Vui lòng đăng nhập lại (401).";
      case 403:
        return "Bạn không có quyền thực hiện thao tác này (403 Forbidden).";
      case 404:
        return fallbackMessage !== "Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng thử lại!"
          ? fallbackMessage
          : "Không tìm thấy dữ liệu yêu cầu trên hệ thống (404).";
      case 409:
        return fallbackMessage !== "Đã xảy ra lỗi khi thực hiện thao tác. Vui lòng thử lại!"
          ? fallbackMessage
          : "Dữ liệu bị trùng lặp hoặc xung đột phiên bản (409 Conflict).";
      case 422:
        return "Dữ liệu gửi lên không thể xử lý (422 Unprocessable Entity).";
      case 500:
        return "Lỗi hệ thống máy chủ nội bộ (500). Vui lòng liên hệ quản trị viên.";
      case 502:
      case 503:
      case 504:
        return "Dịch vụ máy chủ tạm thời không khả dụng (503 Gateway Timeout).";
      default:
        break;
    }
  }

  // 3. Kiểm tra Error instance thông thường của JS
  if (error instanceof Error && typeof error.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
}

/**
 * Hiển thị Toast lỗi chuẩn mực cho toàn hệ thống với cơ chế chống trùng lặp
 */
export function showApiErrorToast(
  error: unknown,
  fallbackMessage?: string,
  options?: {
    id?: string;
    duration?: number;
    description?: string;
  }
): string {
  const message = getApiErrorMessage(error, fallbackMessage);

  // Ghi log chi tiết ra console phục vụ gỡ lỗi dev
  console.error("[API Error]", { error, parsedMessage: message });

  // Kiểm tra chống trùng lặp thông báo giống hệt nhau liên tiếp
  const dedupeKey = options?.id || message;
  if (shouldThrottleToast(dedupeKey)) {
    return message;
  }

  toast.error(message, {
    id: options?.id,
    duration: options?.duration || 4500,
    description: options?.description,
  });

  return message;
}

/** Alias dùng linh hoạt */
export const handleApiError = showApiErrorToast;

/**
 * Tiện ích bọc thao tác async với Toast phản hồi tự động
 */
export async function withApiFeedback<T>(
  action: () => Promise<T>,
  options: {
    loading?: string;
    success?: string | ((data: T) => string);
    errorFallback?: string;
  }
): Promise<T | null> {
  let toastId: string | number | undefined;

  if (options.loading) {
    toastId = toast.loading(options.loading);
  }

  try {
    const result = await action();

    if (toastId) toast.dismiss(toastId);

    if (options.success) {
      const msg = typeof options.success === "function" ? options.success(result) : options.success;
      toast.success(msg);
    }

    return result;
  } catch (err) {
    if (toastId) toast.dismiss(toastId);
    showApiErrorToast(err, options.errorFallback);
    return null;
  }
}
