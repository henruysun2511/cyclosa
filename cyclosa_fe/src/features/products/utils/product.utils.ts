import { formatCurrency, formatDate } from "@/lib/utils";
import type { Product, ProductTableRow } from "../types/product.types";
import { PRODUCT_STATUS_LABELS } from "../constants/product.constants";

export function toProductTableRow(product: Product): ProductTableRow {
  return {
    ...product,
    formattedPrice: formatCurrency(product.price),
    formattedCreatedAt: formatDate(product.createdAt),
  };
}

export function getProductStatusLabel(status: Product["status"]): string {
  return PRODUCT_STATUS_LABELS[status] ?? status;
}
