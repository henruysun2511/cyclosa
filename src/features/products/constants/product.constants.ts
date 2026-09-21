import type { SelectOption } from "@/types/common.types";
import type { ProductCategory, ProductStatus } from "../types/product.types";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: "Đang bán",
  inactive: "Ngừng bán",
  draft: "Nháp",
};

export const PRODUCT_STATUS_VARIANTS: Record<
  ProductStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  inactive: "destructive",
  draft: "secondary",
};

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  electronics: "Điện tử",
  clothing: "Thời trang",
  food: "Thực phẩm",
  other: "Khác",
};

export const PRODUCT_STATUS_OPTIONS: SelectOption<ProductStatus>[] = [
  { label: "Đang bán", value: "active" },
  { label: "Ngừng bán", value: "inactive" },
  { label: "Nháp", value: "draft" },
];

export const PRODUCT_CATEGORY_OPTIONS: SelectOption<ProductCategory>[] = [
  { label: "Điện tử", value: "electronics" },
  { label: "Thời trang", value: "clothing" },
  { label: "Thực phẩm", value: "food" },
  { label: "Khác", value: "other" },
];

export const PRODUCT_SORT_OPTIONS: SelectOption[] = [
  { label: "Mới nhất", value: "createdAt" },
  { label: "Tên A-Z", value: "name" },
  { label: "Giá tăng dần", value: "price" },
  { label: "Tồn kho", value: "stock" },
];

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
