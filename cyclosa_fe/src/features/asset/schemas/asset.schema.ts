import { z } from "zod";

export const assetFormSchema = z.object({
  assetCode: z
    .string()
    .min(1, "Mã tài sản không được để trống")
    .max(50, "Mã tài sản tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã tài sản chỉ gồm chữ in hoa, số, gạch nối và gạch dưới"),
  categoryId: z.string().min(1, "Vui lòng chọn loại tài sản"),
  name: z
    .string()
    .min(1, "Tên tài sản không được để trống")
    .max(200, "Tên tài sản tối đa 200 ký tự"),
  serialNumber: z.string().max(100, "Số serial tối đa 100 ký tự").optional().or(z.literal("")),
  model: z.string().max(100, "Model tối đa 100 ký tự").optional().or(z.literal("")),
  manufacturer: z.string().max(100, "Hãng sản xuất tối đa 100 ký tự").optional().or(z.literal("")),
  specifications: z.string().optional().or(z.literal("")),
  purchaseDate: z.string().optional().or(z.literal("")),
  purchasePrice: z.coerce.number().min(0, "Giá trị không thể âm").optional(),
  conditionStatus: z.enum(["NEW", "GOOD", "FAIR", "MAINTENANCE_REQUIRED", "DAMAGED"]).default("NEW"),
  location: z.string().max(200, "Vị trí tối đa 200 ký tự").optional().or(z.literal("")),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().or(z.literal("")),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export const assignAssetFormSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên tiếp nhận"),
  assignedAt: z.string().min(1, "Vui lòng chọn ngày bàn giao"),
  conditionOnAssign: z.enum(["NEW", "GOOD", "FAIR", "MAINTENANCE_REQUIRED", "DAMAGED"]).default("GOOD"),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().or(z.literal("")),
});

export type AssignAssetFormValues = z.infer<typeof assignAssetFormSchema>;

export const returnAssetFormSchema = z.object({
  returnedAt: z.string().min(1, "Vui lòng chọn ngày hoàn trả"),
  conditionOnReturn: z.enum(["NEW", "GOOD", "FAIR", "MAINTENANCE_REQUIRED", "DAMAGED"]).default("GOOD"),
  notes: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional().or(z.literal("")),
});

export type ReturnAssetFormValues = z.infer<typeof returnAssetFormSchema>;

export const assetCategoryFormSchema = z.object({
  code: z
    .string()
    .min(1, "Mã loại tài sản không được để trống")
    .max(50, "Mã tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã chỉ gồm chữ in hoa, số, gạch nối"),
  name: z
    .string()
    .min(1, "Tên loại tài sản không được để trống")
    .max(100, "Tên tối đa 100 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional().or(z.literal("")),
});

export type AssetCategoryFormValues = z.infer<typeof assetCategoryFormSchema>;
