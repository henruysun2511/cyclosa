import { z } from "zod";

export const PRODUCT_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "OUT_OF_STOCK",
  "DISCONTINUED",
] as const;

export const PRODUCT_CATEGORIES = [
  "Thiết bị CNTT",
  "Phần mềm & Bản quyền",
  "Văn phòng phẩm",
  "Nội thất văn phòng",
  "Dịch vụ doanh nghiệp",
  "Khác",
] as const;

// ── Base schema (shape from API Backend Spring Boot) ─────────────────────
export const productSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  stockQuantity: z.number().int(),
  status: z.enum(PRODUCT_STATUSES),
  description: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
});

// ── Form schema: create ──────────────────────────────────────────────────
export const createProductSchema = z.object({
  sku: z
    .string({ required_error: "Mã SKU là bắt buộc" })
    .min(3, "Mã SKU phải có ít nhất 3 ký tự")
    .max(100, "Mã SKU không được quá 100 ký tự")
    .regex(/^[A-Za-z0-9_-]+$/, "Mã SKU chỉ được chứa chữ cái, số, gạch dưới và gạch ngang"),

  name: z
    .string({ required_error: "Tên sản phẩm là bắt buộc" })
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(255, "Tên không được quá 255 ký tự"),

  category: z
    .string({ required_error: "Danh mục là bắt buộc" })
    .min(1, "Vui lòng chọn danh mục sản phẩm"),

  price: z
    .number({ required_error: "Giá sản phẩm là bắt buộc" })
    .min(0, "Giá không được là số âm"),

  stockQuantity: z
    .number({ required_error: "Số lượng tồn kho là bắt buộc" })
    .int("Số lượng phải là số nguyên")
    .min(0, "Số lượng không được âm"),

  status: z.enum(PRODUCT_STATUSES, {
    required_error: "Trạng thái là bắt buộc",
  }),

  description: z.string().nullable().optional().or(z.literal("")),
});

// ── Form schema: update ──────────────────────────────────────────────────
export const updateProductSchema = createProductSchema;

// ── Filter schema (URL Query Params) ─────────────────────────────────────
export const productFilterSchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  size: z.coerce.number().int().positive().max(100).default(10),
  keyword: z.string().nullable().optional(),
  status: z.enum(PRODUCT_STATUSES).nullable().optional(),
  category: z.string().nullable().optional(),
  sortBy: z
    .enum(["name", "sku", "category", "price", "stockQuantity", "status", "createdAt"])
    .default("createdAt"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  minPrice: z.coerce.number().min(0).nullable().optional(),
  maxPrice: z.coerce.number().min(0).nullable().optional(),
});
