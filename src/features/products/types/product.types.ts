import type { z } from "zod";
import type {
  productSchema,
  createProductSchema,
  updateProductSchema,
  productFilterSchema,
} from "../schemas/product.schema";
import type { BaseFilterParams } from "@/types/common.types";

// Infer types from Zod schemas – single source of truth
export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilterParams = z.infer<typeof productFilterSchema>;

export type ProductStatus = Product["status"];
export type ProductCategory = Product["category"];

// UI-specific types (not in schema)
export interface ProductTableRow extends Product {
  formattedPrice: string;
  formattedCreatedAt: string;
}
