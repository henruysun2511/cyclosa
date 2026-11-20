import { z } from "zod";

export const createRewardDecisionSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên được khen thưởng"),
  rewardType: z.enum([
    "MONETARY_BONUS",
    "CERTIFICATE",
    "TROPHY",
    "PROMOTION_RECOMMENDATION",
    "OTHER",
  ], {
    errorMap: () => ({ message: "Vui lòng chọn hình thức khen thưởng" }),
  }),
  title: z
    .string()
    .min(1, "Vui lòng nhập danh hiệu / nội dung khen thưởng")
    .max(255, "Nội dung khen thưởng không vượt quá 255 ký tự"),
  reason: z.string().max(1000, "Lý do khen thưởng tối đa 1000 ký tự").optional(),
  amount: z.coerce.number().optional(),
  decidedByEmployeeId: z.string().min(1, "Vui lòng chọn người ký quyết định"),
  decisionDate: z.string().min(1, "Vui lòng chọn ngày ra quyết định"),
}).refine(
  (data) => {
    if (data.rewardType === "MONETARY_BONUS") {
      return data.amount !== undefined && data.amount > 0;
    }
    return true;
  },
  {
    message: "Hình thức thưởng tiền bắt buộc nhập số tiền lớn hơn 0",
    path: ["amount"],
  }
);

export type CreateRewardDecisionFormValues = z.infer<typeof createRewardDecisionSchema>;

export const createDisciplineCaseSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên vi phạm"),
  violationDate: z.string().min(1, "Vui lòng chọn ngày phát hiện vi phạm"),
  violationCategory: z.enum([
    "ATTENDANCE_BREACH",
    "PROCESS_POLICY_VIOLATION",
    "INTERNAL_SECURITY_DISCLOSURE",
    "FINANCIAL_ASSET_SECRET",
    "HARASSMENT_DISORDER",
    "INSUBORDINATION_DEFIANCE",
    "OTHER",
  ], {
    errorMap: () => ({ message: "Vui lòng chọn nhóm hành vi vi phạm" }),
  }),
  violationDescription: z
    .string()
    .min(1, "Vui lòng mô tả tóm tắt hành vi vi phạm")
    .max(1000, "Mô tả vi phạm tối đa 1000 ký tự"),
});

export type CreateDisciplineCaseFormValues = z.infer<typeof createDisciplineCaseSchema>;

export const decideDisciplineSchema = z.object({
  disciplineForm: z.enum([
    "KHIEN_TRACH",
    "KEO_DAI_NANG_LUONG",
    "CACH_CHUC",
  ], {
    errorMap: () => ({ message: "Vui lòng chọn hình thức kỷ luật hợp lệ (không bao gồm sa thải trực tiếp)" }),
  }),
  salaryExtensionMonths: z.coerce.number().optional(),
  ruleBasis: z.string().min(1, "Vui lòng nhập căn cứ nội quy / điều khoản vi phạm"),
  meetingDate: z.string().min(1, "Vui lòng chọn ngày tổ chức phiên họp"),
  meetingNote: z.string().max(2000, "Nội dung biên bản tối đa 2000 ký tự").optional(),
  reason: z.string().max(1000, "Lý do kỷ luật tối đa 1000 ký tự").optional(),
  decidedByEmployeeId: z.string().min(1, "Vui lòng chọn người ký quyết định kỷ luật"),
  decidedAt: z.string().min(1, "Vui lòng chọn ngày ký quyết định"),
}).refine(
  (data) => {
    if (data.disciplineForm === "KEO_DAI_NANG_LUONG") {
      return (
        data.salaryExtensionMonths !== undefined &&
        data.salaryExtensionMonths > 0 &&
        data.salaryExtensionMonths <= 6
      );
    }
    return true;
  },
  {
    message: "Thời hạn kéo dài nâng lương không vượt quá 06 tháng theo Bộ luật Lao động",
    path: ["salaryExtensionMonths"],
  }
);

export type DecideDisciplineFormValues = z.infer<typeof decideDisciplineSchema>;

export const resolveComplaintSchema = z.object({
  resolution: z
    .string()
    .min(10, "Nội dung kết luận và phương án giải quyết tối thiểu 10 ký tự")
    .max(2000, "Nội dung phương án tối đa 2000 ký tự"),
});

export type ResolveComplaintFormValues = z.infer<typeof resolveComplaintSchema>;

