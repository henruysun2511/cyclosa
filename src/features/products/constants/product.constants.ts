import type { ProductStatus } from "../types/product.types";
import { PRODUCT_STATUSES, PRODUCT_CATEGORIES } from "../schemas/product.schema";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Đang kinh doanh",
  INACTIVE: "Tạm ngưng",
  OUT_OF_STOCK: "Hết hàng",
  DISCONTINUED: "Ngừng kinh doanh",
};

export const PRODUCT_STATUS_VARIANTS: Record<
  ProductStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  OUT_OF_STOCK: "outline",
  DISCONTINUED: "destructive",
};

export const PRODUCT_STATUS_OPTIONS = PRODUCT_STATUSES.map((status) => ({
  value: status,
  label: PRODUCT_STATUS_LABELS[status],
}));

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
