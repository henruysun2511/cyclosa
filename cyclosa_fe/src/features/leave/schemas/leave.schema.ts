import { z } from "zod";

export const leaveTypeSchema = z.object({
  code: z
    .string()
    .min(1, "Mã loại nghỉ không được để trống")
    .max(30, "Mã loại nghỉ tối đa 30 ký tự")
    .regex(/^[A-Z0-9_]+$/, "Mã chỉ được chứa chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên loại nghỉ không được để trống")
    .max(150, "Tên loại nghỉ tối đa 150 ký tự"),
  leaveGroup: z.enum(
    [
      "ANNUAL",
      "PUBLIC_HOLIDAY",
      "PERSONAL_PAID",
      "PERSONAL_UNPAID",
      "SICK",
      "MATERNITY",
    ],
    { message: "Vui lòng chọn nhóm loại nghỉ hợp lệ" }
  ),
  payer: z.enum(["EMPLOYER", "SOCIAL_INSURANCE", "NONE"], {
    message: "Vui lòng chọn nguồn chi trả chế độ",
  }),
  fixedDays: z.coerce
    .number()
    .min(0, "Số ngày cố định không được âm")
    .nullable()
    .optional(),
  requiresApproval: z.boolean(),
  isActive: z.boolean(),
  description: z.string().optional().nullable(),
});

export type LeaveTypeFormValues = z.infer<typeof leaveTypeSchema>;

export const leavePolicySchema = z.object({
  leaveTypeId: z.string().min(1, "Vui lòng chọn loại nghỉ phép áp dụng"),
  contractType: z
    .enum(["FIXED_TERM", "INDEFINITE", "PROBATION", "SERVICE"])
    .nullable()
    .optional(),
  effectiveFrom: z.string().min(1, "Vui lòng chọn ngày bắt đầu hiệu lực"),
  annualEntitlementDays: z.coerce
    .number()
    .min(0, "Định mức ngày nghỉ không được âm"),
  seniorityStepYears: z.coerce
    .number()
    .min(1, "Bước thâm niên tối thiểu 1 năm")
    .nullable()
    .optional(),
  seniorityBonusDays: z.coerce
    .number()
    .min(0, "Ngày phép thâm niên không được âm")
    .nullable()
    .optional(),
  maxCarryoverDays: z.coerce
    .number()
    .min(0, "Số ngày chuyển tối đa không được âm"),
  carryoverDeadlineMonth: z.coerce
    .number()
    .min(1, "Tháng từ 1 đến 12")
    .max(12, "Tháng từ 1 đến 12")
    .nullable()
    .optional(),
  description: z.string().optional().nullable(),
});

export type LeavePolicyFormValues = z.infer<typeof leavePolicySchema>;

export const generateBalancesSchema = z.object({
  year: z.coerce
    .number()
    .min(2020, "Năm không hợp lệ")
    .max(2099, "Năm không hợp lệ"),
  employeeIds: z.array(z.string()).optional(),
  notes: z.string().optional().nullable(),
});

export type GenerateBalancesFormValues = z.infer<typeof generateBalancesSchema>;

export const carryOverLeaveSchema = z.object({
  fromYear: z.coerce
    .number()
    .min(2020, "Năm không hợp lệ")
    .max(2099, "Năm không hợp lệ"),
});

export type CarryOverLeaveFormValues = z.infer<typeof carryOverLeaveSchema>;

export const createLeaveRequestSchema = z
  .object({
    employeeId: z.string().optional(),
    leaveTypeId: z.string().min(1, "Vui lòng chọn loại nghỉ phép"),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu nghỉ"),
    endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc nghỉ"),
    dayPortion: z.enum(["FULL_DAY", "MORNING", "AFTERNOON"], {
      message: "Vui lòng chọn buổi nghỉ",
    }),
    reason: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "Ngày bắt đầu nghỉ phải nhỏ hơn hoặc bằng ngày kết thúc",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.dayPortion !== "FULL_DAY") {
        return data.startDate === data.endDate;
      }
      return true;
    },
    {
      message: "Nghỉ nửa ngày (sáng/chiều) chỉ áp dụng trong cùng một ngày",
      path: ["dayPortion"],
    }
  );

export type CreateLeaveRequestFormValues = z.infer<
  typeof createLeaveRequestSchema
>;

