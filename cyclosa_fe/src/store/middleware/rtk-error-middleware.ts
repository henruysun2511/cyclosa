import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { showApiErrorToast } from "@/lib/api-error";

/**
 * Middleware RTK Query toàn cục: Tự động bắt mọi action mutation bị rejected
 * và kích hoạt toast thông báo lỗi chi tiết từ backend nếu chưa được xử lý.
 */
export const rtkErrorMiddleware: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    // Chỉ tự động hiện toast cho mutation (POST, PUT, DELETE, PATCH), không hiện cho GET queries để tránh spam
    const isMutation = action.meta?.arg?.type === "mutation";
    const preventGlobalToast = Boolean(action.meta?.arg?.originalArgs?.preventGlobalToast);

    if (isMutation && !preventGlobalToast) {
      showApiErrorToast(action.payload);
    }
  }

  return next(action);
};
