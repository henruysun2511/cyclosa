import { z } from "zod";

// ==========================================
// 1. Zod Schema Cho Ca Làm Việc (Shifts)
// ==========================================

export const shiftBaseSchema = z.object({
  code: z
    .string()
    .min(1, "Mã ca làm việc không được để trống")
    .max(20, "Mã ca tối đa 20 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã ca chỉ được chứa chữ hoa, số và dấu gạch nối (vd: HC_01)"),
  name: z
    .string()
    .min(1, "Tên ca làm việc không được để trống")
    .max(100, "Tên ca tối đa 100 ký tự"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ bắt đầu không đúng định dạng HH:mm (vd: 08:00)"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ kết thúc không đúng định dạng HH:mm (vd: 17:00)"),
  breakStartTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ nghỉ trưa không đúng định dạng HH:mm")
    .optional()
    .or(z.literal("")),
  breakEndTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ kết thúc nghỉ trưa không đúng định dạng HH:mm")
    .optional()
    .or(z.literal("")),
  lateGraceMinutes: z
    .number({ invalid_type_error: "Số phút ân hạn phải là số" })
    .min(0, "Số phút ân hạn không được âm")
    .max(120, "Số phút ân hạn tối đa 120 phút")
    .default(15),
  earlyGraceMinutes: z
    .number({ invalid_type_error: "Số phút ân hạn phải là số" })
    .min(0, "Số phút ân hạn không được âm")
    .max(120, "Số phút ân hạn tối đa 120 phút")
    .default(0),
  workCredit: z
    .number({ invalid_type_error: "Định mức công phải là số" })
    .min(0.1, "Định mức công tối thiểu 0.1")
    .max(2.0, "Định mức công tối đa 2.0")
    .default(1.0),
  isActive: z.boolean().default(true),
});

export const createShiftSchema = shiftBaseSchema.refine(
  (data) => {
    if (data.breakStartTime && data.breakEndTime) {
      return data.breakStartTime < data.breakEndTime;
    }
    return true;
  },
  {
    message: "Giờ kết thúc nghỉ trưa phải sau giờ bắt đầu nghỉ trưa",
    path: ["breakEndTime"],
  }
);

export type CreateShiftFormData = z.infer<typeof createShiftSchema>;

export const updateShiftSchema = shiftBaseSchema.omit({ code: true }).refine(
  (data) => {
    if (data.breakStartTime && data.breakEndTime) {
      return data.breakStartTime < data.breakEndTime;
    }
    return true;
  },
  {
    message: "Giờ kết thúc nghỉ trưa phải sau giờ bắt đầu nghỉ trưa",
    path: ["breakEndTime"],
  }
);
export type UpdateShiftFormData = z.infer<typeof updateShiftSchema>;

// ==========================================
// 2. Zod Schema Cho Phân Ca Hàng Loạt (Bulk Shift Assignment)
// ==========================================

export const bulkShiftAssignmentSchema = z
  .object({
    employeeIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 nhân viên để phân ca"),
    shiftId: z.string().min(1, "Vui lòng chọn ca làm việc"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    daysOfWeek: z.array(z.number()).optional(),
    skipWeekends: z.boolean().default(true),
    overwriteExisting: z.boolean().default(false),
    note: z.string().max(255, "Ghi chú tối đa 255 ký tự").optional().or(z.literal("")),
  });

export type BulkShiftAssignmentFormData = z.infer<typeof bulkShiftAssignmentSchema>;
export type BulkShiftAssignmentFormValues = BulkShiftAssignmentFormData;

// ==========================================
// 3. Zod Schema Cho Đơn Giải Trình Chấm Công
// ==========================================

export const createAttendanceRequestSchema = z.object({
  workDate: z.string().optional(),
  attendanceDate: z.string().optional(),
  targetShiftId: z.string().optional().or(z.literal("")),
  requestType: z.string().min(1, "Vui lòng chọn loại đơn giải trình"),
  proposedCheckIn: z.string().optional().or(z.literal("")),
  proposedCheckOut: z.string().optional().or(z.literal("")),
  proposedInTime: z.string().optional().or(z.literal("")),
  proposedOutTime: z.string().optional().or(z.literal("")),
  reason: z
    .string()
    .min(5, "Lý do giải trình phải có ít nhất 5 ký tự")
    .max(500, "Lý do giải trình tối đa 500 ký tự"),
  attachmentFileId: z.string().optional().or(z.literal("")),
});

export type CreateAttendanceRequestFormData = z.infer<typeof createAttendanceRequestSchema>;
export type CreateAttendanceRequestFormValues = CreateAttendanceRequestFormData;

export const approveAttendanceRequestSchema = z.object({
  approvedCheckIn: z.string().optional().or(z.literal("")),
  approvedCheckOut: z.string().optional().or(z.literal("")),
  reviewerNotes: z.string().max(500, "Ghi chú người duyệt tối đa 500 ký tự").optional().or(z.literal("")),
});

export type ApproveAttendanceRequestFormData = z.infer<typeof approveAttendanceRequestSchema>;

export const rejectAttendanceRequestSchema = z.object({
  reason: z.string().min(3, "Bắt buộc phải nhập lý do từ chối (tối thiểu 3 ký tự)").max(500, "Lý do tối đa 500 ký tự"),
});

export type RejectAttendanceRequestFormData = z.infer<typeof rejectAttendanceRequestSchema>;

// ==========================================
// 4. Zod Schema Cho Kỳ Công Tháng
// ==========================================

export const createTimesheetPeriodSchema = z.object({
  periodCode: z.string().optional(),
  periodName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cutoffDate: z.string().optional(),
  year: z
    .number({ invalid_type_error: "Năm phải là số" })
    .min(2020, "Năm không hợp lệ")
    .max(2050, "Năm không hợp lệ")
    .optional(),
  month: z
    .number({ invalid_type_error: "Tháng phải là số" })
    .min(1, "Tháng từ 1 đến 12")
    .max(12, "Tháng từ 1 đến 12")
    .optional(),
  standardWorkingDays: z
    .number({ invalid_type_error: "Số ngày công chuẩn phải là số" })
    .min(1, "Tối thiểu 1 ngày công")
    .max(31, "Tối đa 31 ngày công")
    .default(22)
    .optional(),
});

export type CreateTimesheetPeriodFormData = z.infer<typeof createTimesheetPeriodSchema>;
export type CreateTimesheetPeriodFormValues = CreateTimesheetPeriodFormData;

export const unlockPeriodSchema = z.object({
  reason: z
    .string()
    .min(5, "Bắt buộc phải nhập lý do giải trình khi mở khóa kỳ công (tối thiểu 5 ký tự)")
    .max(500, "Lý do giải trình tối đa 500 ký tự"),
});

export type UnlockPeriodFormData = z.infer<typeof unlockPeriodSchema>;

