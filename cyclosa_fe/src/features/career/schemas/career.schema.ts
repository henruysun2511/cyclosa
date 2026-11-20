import { z } from "zod";

export const careerPathFormSchema = z.object({
  fromJobTitleId: z.string().min(1, "Vui lòng chọn vị trí xuất phát"),
  toJobTitleId: z.string().min(1, "Vui lòng chọn vị trí mục tiêu"),
  minExperienceYears: z.coerce
    .number()
    .min(0, "Số năm kinh nghiệm không thể âm")
    .max(50, "Số năm kinh nghiệm không hợp lệ"),
  requirements: z
    .string()
    .max(2000, "Yêu cầu năng lực tối đa 2000 ký tự")
    .optional()
    .or(z.literal("")),
}).refine((data) => data.fromJobTitleId !== data.toJobTitleId, {
  message: "Vị trí xuất phát và vị trí mục tiêu không được trùng nhau",
  path: ["toJobTitleId"],
});

export type CareerPathFormValues = z.infer<typeof careerPathFormSchema>;

export const successionPlanFormSchema = z.object({
  departmentId: z.string().min(1, "Vui lòng chọn phòng ban trọng yếu"),
  jobTitleId: z.string().min(1, "Vui lòng chọn chức danh trọng yếu"),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  reviewDate: z.string().min(1, "Vui lòng chọn ngày rà soát định kỳ"),
});

export type SuccessionPlanFormValues = z.infer<typeof successionPlanFormSchema>;

export const addCandidateFormSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn ứng viên kế nhiệm"),
  readiness: z.enum(["READY_NOW", "READY_1_2_YEARS", "READY_3_5_YEARS"]),
  developmentNotes: z
    .string()
    .max(1000, "Kế hoạch đào tạo tối đa 1000 ký tự")
    .optional()
    .or(z.literal("")),
});

export type AddCandidateFormValues = z.infer<typeof addCandidateFormSchema>;

export const addTalentPoolFormSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân sự để gắn thẻ"),
  tag: z.enum(["HIPO", "KEY_TALENT", "LEADERSHIP_POTENTIAL", "TECH_EXPERT"]),
  reason: z.string().min(5, "Lý do bình chọn ít nhất 5 ký tự").max(1000, "Lý do tối đa 1000 ký tự"),
});

export type AddTalentPoolFormValues = z.infer<typeof addTalentPoolFormSchema>;
