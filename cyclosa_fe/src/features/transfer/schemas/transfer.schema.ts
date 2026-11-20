import { z } from "zod";

export const transferAllowanceSchema = z.object({
  allowanceName: z
    .string({ required_error: "Vui lòng nhập tên khoản phụ cấp" })
    .min(1, "Tên phụ cấp không được để trống")
    .max(150, "Tên phụ cấp tối đa 150 ký tự"),
  amount: z
    .coerce
    .number({ required_error: "Vui lòng nhập số tiền" })
    .positive("Số tiền phụ cấp phải lớn hơn 0"),
  notes: z.string().max(255, "Ghi chú tối đa 255 ký tự").optional(),
});

export const transferFormSchema = z.object({
  employeeId: z
    .string({ required_error: "Vui lòng chọn nhân viên điều chuyển" })
    .min(1, "Vui lòng chọn nhân viên"),
  transferType: z.enum([
    "INTERNAL_DEPARTMENT",
    "BRANCH_TRANSFER",
    "INTER_COMPANY",
    "ROLE_PROMOTION_DEMOTION",
    "TEMPORARY_DISPATCH",
  ], { required_error: "Vui lòng chọn loại hình điều chuyển" }),

  toDepartmentId: z
    .string({ required_error: "Vui lòng chọn phòng ban tiếp nhận" })
    .min(1, "Vui lòng chọn phòng ban tiếp nhận"),
  toBranchId: z.string().optional(),
  toJobTitleId: z
    .string({ required_error: "Vui lòng chọn chức danh tiếp nhận" })
    .min(1, "Vui lòng chọn chức danh tiếp nhận"),
  toJobLevelId: z.string().optional(),
  toManagerId: z.string().optional(),
  toBaseSalary: z.coerce.number().positive("Lương cơ bản mới phải lớn hơn 0").optional(),

  effectiveDate: z
    .string({ required_error: "Vui lòng chọn ngày có hiệu lực" })
    .min(1, "Vui lòng chọn ngày có hiệu lực"),
  endDate: z.string().optional(),

  reason: z.enum([
    "BUSINESS_NEED",
    "PROMOTION",
    "CAREER_DEVELOPMENT",
    "PERFORMANCE",
    "RESTRUCTURING",
    "EMPLOYEE_REQUEST",
    "TEMPORARY_PROJECT",
    "OTHER",
  ], { required_error: "Vui lòng chọn lý do điều chuyển" }),
  reasonDetail: z.string().optional(),
  notes: z.string().max(1000, "Ghi chú tối đa 1000 ký tự").optional(),

  hasSalaryAdjustment: z.boolean().default(false),
  salaryNotes: z.string().optional(),
  allowances: z.array(transferAllowanceSchema).optional(),
});

export type TransferFormValues = z.infer<typeof transferFormSchema>;
