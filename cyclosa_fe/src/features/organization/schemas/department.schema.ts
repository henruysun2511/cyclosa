import { z } from "zod";

export const departmentFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã phòng ban không được để trống")
    .max(50, "Mã phòng ban tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã phòng ban chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên phòng ban không được để trống")
    .max(255, "Tên phòng ban tối đa 255 ký tự"),
  parentDepartmentId: z.string().nullable().optional(),
  costCenterId: z.string().nullable().optional(),
  managerEmployeeId: z.string().nullable().optional(),
  effectiveFrom: z
    .string()
    .min(1, "Ngày hiệu lực không được để trống")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),
  isPermissionInherited: z.boolean().default(true),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

export const moveDepartmentSchema = z.object({
  newParentDepartmentId: z.string().nullable().optional(),
  effectiveFrom: z
    .string()
    .min(1, "Ngày hiệu lực điều chuyển không được để trống")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),
});

export type MoveDepartmentFormValues = z.infer<typeof moveDepartmentSchema>;

