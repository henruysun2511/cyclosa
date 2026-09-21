import { formatCurrency, formatDate } from "@/lib/utils";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_STATUS_LABELS,
} from "../constants/product.constants";
import type { Product, ProductTableRow } from "../types/product.types";

export function toProductTableRow(product: Product): ProductTableRow {
  return {
    ...product,
    formattedPrice: formatCurrency(product.price),
    formattedCreatedAt: formatDate(product.createdAt),
  };
}

export function getProductStatusLabel(status: Product["status"]): string {
  return PRODUCT_STATUS_LABELS[status];
}

export function getProductCategoryLabel(
  category: Product["category"]
): string {
  return PRODUCT_CATEGORY_LABELS[category];
}

export function isLowStock(stock: number, threshold = 10): boolean {
  return stock <= threshold;
}
