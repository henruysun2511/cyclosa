import { z } from "zod";

export const createResignationSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên làm đơn"),
  resignationReason: z.enum(
    [
      "BETTER_OPPORTUNITY",
      "PERSONAL_FAMILY",
      "HEALTH",
      "RELOCATION",
      "CAREER_CHANGE",
      "WORK_ENVIRONMENT",
      "COMPENSATION",
      "OTHER",
    ],
    { required_error: "Vui lòng chọn lý do thôi việc" }
  ),
  noticeDate: z.string().min(1, "Vui lòng chọn ngày nộp đơn/thông báo"),
  desiredLastWorkingDate: z.string().min(1, "Vui lòng chọn ngày mong muốn nghỉ"),
  actualLastWorkingDate: z.string().min(1, "Vui lòng chọn ngày làm việc cuối cùng"),
  successorId: z.string().optional(),
  reasonDetail: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateResignationFormValues = z.infer<typeof createResignationSchema>;

export const createTerminationSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên chấm dứt HĐLĐ"),
  terminationReason: z.enum(
    [
      "PERFORMANCE",
      "DISCIPLINARY_DISMISSAL",
      "RESTRUCTURING_DOWNSIZING",
      "CONTRACT_EXPIRED_NOT_RENEWED",
      "MUTUAL_AGREEMENT",
      "PROBATION_FAILED",
      "OTHER",
    ],
    { required_error: "Vui lòng chọn lý do chấm dứt HĐLĐ" }
  ),
  disciplineId: z.string().optional(),
  decisionNumber: z.string().min(1, "Vui lòng nhập số quyết định"),
  decisionDate: z.string().min(1, "Vui lòng chọn ngày ban hành quyết định"),
  actualLastWorkingDate: z.string().min(1, "Vui lòng chọn ngày làm việc cuối cùng"),
  successorId: z.string().optional(),
  reasonDetail: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateTerminationFormValues = z.infer<typeof createTerminationSchema>;

export const approveResignationSchema = z.object({
  actualLastWorkingDate: z.string().optional(),
  notes: z.string().optional(),
});

export type ApproveResignationFormValues = z.infer<typeof approveResignationSchema>;

export const rejectResignationSchema = z.object({
  rejectionReason: z.string().min(1, "Vui lòng nhập lý do từ chối"),
});

export type RejectResignationFormValues = z.infer<typeof rejectResignationSchema>;

export const updateClearanceItemSchema = z.object({
  status: z.enum(["PENDING", "CLEARED", "REJECTED"], {
    required_error: "Vui lòng chọn trạng thái bàn giao",
  }),
  notes: z.string().optional(),
});

export type UpdateClearanceItemFormValues = z.infer<typeof updateClearanceItemSchema>;

export const saveExitInterviewSchema = z.object({
  interviewerId: z.string().min(1, "Vui lòng chọn người thực hiện phỏng vấn"),
  interviewDate: z.string().min(1, "Vui lòng chọn ngày phỏng vấn"),
  primaryReason: z.string().optional(),
  workingEnvironmentFeedback: z.string().optional(),
  managementFeedback: z.string().optional(),
  compensationFeedback: z.string().optional(),
  improvementSuggestions: z.string().optional(),
  willingToRecommend: z.boolean(),
  notes: z.string().optional(),
});

export type SaveExitInterviewFormValues = z.infer<typeof saveExitInterviewSchema>;
