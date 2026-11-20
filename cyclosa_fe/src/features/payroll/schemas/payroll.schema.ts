import { z } from "zod";

export const createSalaryComponentSchema = z.object({
  code: z.string().min(2, "Mã tối thiểu 2 ký tự").max(50, "Mã tối đa 50 ký tự"),
  name: z.string().min(2, "Tên tối thiểu 2 ký tự").max(150, "Tên tối đa 150 ký tự"),
  category: z.enum(["BASIC", "ALLOWANCE", "BONUS", "OVERTIME", "DEDUCTION", "OTHER"], {
    required_error: "Vui lòng chọn nhóm thành phần",
  }),
  frequency: z.enum(["MONTHLY", "ONE_TIME", "QUARTERLY", "YEARLY"], {
    required_error: "Vui lòng chọn chu kỳ áp dụng",
  }),
  defaultAmount: z.coerce.number().min(0, "Số tiền không được âm").optional(),
  isTaxable: z.boolean(),
  isInsuranceSalary: z.boolean(),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
});

export type CreateSalaryComponentFormValues = z.infer<typeof createSalaryComponentSchema>;

export const createPayrollPeriodSchema = z.object({
  code: z.string().min(2, "Mã kỳ lương tối thiểu 2 ký tự").max(50, "Mã tối đa 50 ký tự"),
  name: z.string().min(2, "Tên kỳ lương tối thiểu 2 ký tự").max(150, "Tên tối đa 150 ký tự"),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  plannedPaymentDate: z.string().min(1, "Vui lòng chọn ngày dự kiến chi trả"),
  standardWorkDays: z.coerce.number().min(1, "Số công chuẩn tối thiểu là 1").max(31, "Số công chuẩn tối đa 31"),
  note: z.string().max(500, "Ghi chú tối đa 500 ký tự").optional(),
});

export type CreatePayrollPeriodFormValues = z.infer<typeof createPayrollPeriodSchema>;

export const createSalaryAdvanceSchema = z.object({
  employeeId: z.string().optional(),
  amount: z.coerce.number().min(100000, "Số tiền tạm ứng tối thiểu 100.000 VNĐ"),
  requestDate: z.string().min(1, "Vui lòng chọn ngày đề nghị"),
  reason: z.string().min(5, "Lý do tạm ứng tối thiểu 5 ký tự").max(500, "Lý do tối đa 500 ký tự"),
});

export type CreateSalaryAdvanceFormValues = z.infer<typeof createSalaryAdvanceSchema>;

export const manualAdjustmentSchema = z.object({
  title: z.string().min(2, "Tiêu đề điều chỉnh tối thiểu 2 ký tự"),
  amount: z.coerce.number().min(0, "Số tiền không được âm"),
  reason: z.string().min(5, "Lý do điều chỉnh tối thiểu 5 ký tự để phục vụ kiểm toán").max(500, "Lý do tối đa 500 ký tự"),
});

export type ManualAdjustmentFormValues = z.infer<typeof manualAdjustmentSchema>;
