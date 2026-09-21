import { z } from "zod";

export const PRODUCT_STATUSES = ["active", "inactive", "draft"] as const;
export const PRODUCT_CATEGORIES = [
  "electronics",
  "clothing",
  "food",
  "other",
] as const;

// ── Base schema (shape from API) ─────────────────────────────────────────
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int(),
  status: z.enum(PRODUCT_STATUSES),
  category: z.enum(PRODUCT_CATEGORIES),
  imageUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ── Form schema: create ──────────────────────────────────────────────────
export const createProductSchema = z.object({
  name: z
    .string({ required_error: "Tên sản phẩm là bắt buộc" })
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự"),

  description: z
    .string({ required_error: "Mô tả là bắt buộc" })
    .min(10, "Mô tả phải có ít nhất 10 ký tự"),

  price: z
    .number({ required_error: "Giá là bắt buộc" })
    .positive("Giá phải lớn hơn 0")
    .multipleOf(0.01, "Giá tối đa 2 chữ số thập phân"),

  stock: z
    .number({ required_error: "Số lượng tồn kho là bắt buộc" })
    .int("Số lượng phải là số nguyên")
    .min(0, "Số lượng không được âm"),

  status: z.enum(PRODUCT_STATUSES, {
    required_error: "Trạng thái là bắt buộc",
  }),

  category: z.enum(PRODUCT_CATEGORIES, {
    required_error: "Danh mục là bắt buộc",
  }),

  imageUrl: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
});

// ── Form schema: update (all fields optional except partial validation) ──
export const updateProductSchema = createProductSchema.partial();

// ── Filter schema ────────────────────────────────────────────────────────
export const productFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  sortBy: z.enum(["name", "price", "stock", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});
