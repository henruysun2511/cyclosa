import { z } from "zod";

// ── 1. Company Schema ────────────────────────────────────────────────────────
export const companyFormSchema = z.object({
  code: z
    .string()
    .min(1, "Mã công ty không được để trống")
    .max(50, "Mã công ty tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã công ty chỉ gồm chữ hoa, số, dấu gạch nối và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên công ty không được để trống")
    .max(255, "Tên công ty tối đa 255 ký tự"),
  taxCode: z
    .string()
    .max(50, "Mã số thuế tối đa 50 ký tự")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Địa chỉ tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(50, "Số điện thoại tối đa 50 ký tự")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Email không đúng định dạng")
    .max(100, "Email tối đa 100 ký tự")
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .url("URL logo không hợp lệ")
    .optional()
    .or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

// ── 2. Region Schema ─────────────────────────────────────────────────────────
export const regionFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã khu vực không được để trống")
    .max(50, "Mã khu vực tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã khu vực chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên khu vực không được để trống")
    .max(255, "Tên khu vực tối đa 255 ký tự"),
});

export type RegionFormValues = z.infer<typeof regionFormSchema>;

// ── 3. Branch Schema ─────────────────────────────────────────────────────────
export const branchFormSchema = z.object({
  regionId: z.string().min(1, "Vui lòng chọn khu vực"),
  code: z
    .string()
    .min(1, "Mã chi nhánh không được để trống")
    .max(50, "Mã chi nhánh tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã chi nhánh chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên chi nhánh không được để trống")
    .max(255, "Tên chi nhánh tối đa 255 ký tự"),
  address: z
    .string()
    .max(500, "Địa chỉ tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
  latitude: z
    .number()
    .min(-90, "Vĩ độ không được nhỏ hơn -90")
    .max(90, "Vĩ độ không được lớn hơn 90")
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, "Kinh độ không được nhỏ hơn -180")
    .max(180, "Kinh độ không được lớn hơn 180")
    .optional()
    .nullable(),
  attendanceRadiusMeters: z
    .number()
    .min(10, "Bán kính chấm công tối thiểu là 10 mét")
    .max(5000, "Bán kính chấm công tối đa là 5,000 mét")
    .default(200),
  isActive: z.boolean().default(true),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;

// ── 4. Cost Center Schema ────────────────────────────────────────────────────
export const costCenterFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã trung tâm chi phí không được để trống")
    .max(50, "Mã trung tâm chi phí tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã trung tâm chi phí chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên trung tâm chi phí không được để trống")
    .max(255, "Tên trung tâm chi phí tối đa 255 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type CostCenterFormValues = z.infer<typeof costCenterFormSchema>;

// ── 5. Job Title Schema ──────────────────────────────────────────────────────
export const jobTitleFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã chức danh không được để trống")
    .max(50, "Mã chức danh tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã chức danh chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên chức danh không được để trống")
    .max(255, "Tên chức danh tối đa 255 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type JobTitleFormValues = z.infer<typeof jobTitleFormSchema>;

// ── 6. Job Level Schema ──────────────────────────────────────────────────────
export const jobLevelFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã cấp bậc không được để trống")
    .max(50, "Mã cấp bậc tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã cấp bậc chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên cấp bậc không được để trống")
    .max(255, "Tên cấp bậc tối đa 255 ký tự"),
  rankOrder: z
    .number({ invalid_type_error: "Thứ tự cấp bậc phải là số nguyên" })
    .int("Thứ tự cấp bậc phải là số nguyên")
    .min(1, "Thứ tự cấp bậc tối thiểu là 1")
    .max(999, "Thứ tự cấp bậc tối đa là 999"),
});

export type JobLevelFormValues = z.infer<typeof jobLevelFormSchema>;

// ── 7. Department Schema ─────────────────────────────────────────────────────
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

// ── 8. Move Department Schema ────────────────────────────────────────────────
export const moveDepartmentSchema = z.object({
  newParentDepartmentId: z.string().nullable().optional(),
  effectiveFrom: z
    .string()
    .min(1, "Ngày hiệu lực điều chuyển không được để trống")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),
});

export type MoveDepartmentFormValues = z.infer<typeof moveDepartmentSchema>;
