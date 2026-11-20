import { z } from "zod";

export const workflowStepSchema = z.object({
  id: z.string().optional(),
  stepOrder: z.number().int().min(1, "Thứ tự bước phải từ 1 trở lên"),
  stepName: z
    .string()
    .min(2, "Tên bước duyệt tối thiểu 2 ký tự")
    .max(150, "Tên bước duyệt tối đa 150 ký tự"),
  approverType: z.enum([
    "DIRECT_MANAGER",
    "DEPARTMENT_HEAD",
    "ROLE",
    "SPECIFIC_EMPLOYEE",
  ]),
  approverRoleId: z.string().nullable().optional(),
  approverEmployeeId: z.string().nullable().optional(),
  conditionType: z.enum([
    "ALWAYS",
    "AMOUNT_ABOVE_THRESHOLD",
    "SALARY_ABOVE_BAND",
  ]),
  conditionThreshold: z.number().nullable().optional(),
}).refine(
  (data) => {
    if (data.approverType === "ROLE" && !data.approverRoleId) {
      return false;
    }
    return true;
  },
  {
    message: "Vui lòng chọn vai trò phê duyệt",
    path: ["approverRoleId"],
  }
).refine(
  (data) => {
    if (data.approverType === "SPECIFIC_EMPLOYEE" && !data.approverEmployeeId) {
      return false;
    }
    return true;
  },
  {
    message: "Vui lòng chọn nhân viên phê duyệt chỉ định",
    path: ["approverEmployeeId"],
  }
).refine(
  (data) => {
    if (
      data.conditionType === "AMOUNT_ABOVE_THRESHOLD" &&
      (data.conditionThreshold === null || data.conditionThreshold === undefined || data.conditionThreshold <= 0)
    ) {
      return false;
    }
    return true;
  },
  {
    message: "Vui lòng nhập định mức giá trị lớn hơn 0",
    path: ["conditionThreshold"],
  }
);

export const workflowDefinitionFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty áp dụng"),
  requestType: z.enum([
    "CONTRACT",
    "RESIGNATION",
    "OVERTIME",
    "LEAVE",
    "SALARY_ADJUSTMENT",
  ]),
  name: z
    .string()
    .min(3, "Tên quy trình tối thiểu 3 ký tự")
    .max(200, "Tên quy trình tối đa 200 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
  steps: z
    .array(workflowStepSchema)
    .min(1, "Quy trình phải có ít nhất 1 bước phê duyệt"),
});

export type WorkflowDefinitionFormValues = z.infer<typeof workflowDefinitionFormSchema>;
export type WorkflowStepFormValues = z.infer<typeof workflowStepSchema>;

export const approveStepSchema = z.object({
  comment: z.string().max(1000, "Ý kiến phê duyệt tối đa 1000 ký tự").optional(),
});
export type ApproveStepFormValues = z.infer<typeof approveStepSchema>;

export const rejectStepSchema = z.object({
  comment: z
    .string()
    .min(5, "Lý do từ chối tối thiểu 5 ký tự")
    .max(1000, "Lý do từ chối tối đa 1000 ký tự"),
});
export type RejectStepFormValues = z.infer<typeof rejectStepSchema>;

export const cancelWorkflowSchema = z.object({
  reason: z
    .string()
    .min(3, "Lý do hủy yêu cầu tối thiểu 3 ký tự")
    .max(1000, "Lý do hủy tối đa 1000 ký tự"),
});
export type CancelWorkflowFormValues = z.infer<typeof cancelWorkflowSchema>;

