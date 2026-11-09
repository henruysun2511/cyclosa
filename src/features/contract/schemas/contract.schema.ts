import { z } from "zod";

export const contractFormSchema = z.object({
  employeeId: z
    .string({ required_error: "Vui lòng chọn nhân viên ký kết" })
    .min(1, "Vui lòng chọn nhân viên"),
  contractType: z.enum(
    [
      "PROBATION",
      "FIXED_TERM",
      "INDEFINITE",
      "SEASONAL",
      "APPRENTICESHIP",
      "COLLABORATOR",
    ],
    { required_error: "Vui lòng chọn loại hợp đồng" }
  ),
  templateId: z.string().optional().or(z.literal("")),
  title: z
    .string({ required_error: "Vui lòng nhập tiêu đề hợp đồng" })
    .trim()
    .min(1, "Tiêu đề hợp đồng không được để trống")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  startDate: z
    .string({ required_error: "Vui lòng chọn ngày bắt đầu hiệu lực" })
    .min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().optional().or(z.literal("")),
  baseSalary: z
    .number({ invalid_type_error: "Lương cơ bản phải là số hợp lệ" })
    .min(0, "Mức lương cơ bản không được âm")
    .default(0),
  allowance: z.number().min(0, "Phụ cấp không được âm").default(0),
  signingForm: z
    .enum(["ELECTRONIC", "WET_INK", "HYBRID"])
    .default("ELECTRONIC"),
  fileUrl: z.string().trim().optional().or(z.literal("")),
  workLocation: z.string().trim().optional().or(z.literal("")),
  workingHours: z.string().trim().optional().or(z.literal("")),
  jobDescription: z.string().trim().optional().or(z.literal("")),
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;

export const contractTemplateSchema = z.object({
  name: z
    .string({ required_error: "Vui lòng nhập tên biểu mẫu" })
    .trim()
    .min(1, "Tên biểu mẫu không được để trống")
    .max(100, "Tên biểu mẫu tối đa 100 ký tự"),
  kind: z.enum(
    [
      "LABOR_CONTRACT",
      "PROBATION_CONTRACT",
      "SEASONAL_CONTRACT",
      "COLLABORATOR_AGREEMENT",
      "APPENDIX_ADJUSTMENT",
      "TERMINATION_AGREEMENT",
    ],
    { required_error: "Vui lòng chọn loại biểu mẫu" }
  ),
  description: z.string().trim().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
});

export type ContractTemplateFormValues = z.infer<typeof contractTemplateSchema>;

export const contractAppendixSchema = z.object({
  title: z
    .string({ required_error: "Vui lòng nhập tiêu đề phụ lục" })
    .trim()
    .min(1, "Tiêu đề phụ lục không được để trống"),
  effectiveDate: z
    .string({ required_error: "Vui lòng chọn ngày có hiệu lực" })
    .min(1, "Vui lòng chọn ngày có hiệu lực"),
  newSalary: z.number().min(0).optional(),
  newJobTitle: z.string().trim().optional().or(z.literal("")),
  changeDetails: z
    .string({ required_error: "Vui lòng nhập chi tiết điều khoản điều chỉnh" })
    .trim()
    .min(1, "Chi tiết điều chỉnh không được để trống"),
  fileUrl: z.string().trim().optional().or(z.literal("")),
});

export type ContractAppendixFormValues = z.infer<typeof contractAppendixSchema>;

export const contractTerminateSchema = z.object({
  terminatedAt: z
    .string({ required_error: "Vui lòng chọn ngày chấm dứt hợp đồng" })
    .min(1, "Vui lòng chọn ngày chấm dứt"),
  terminationReason: z
    .string({ required_error: "Vui lòng nhập lý do chấm dứt hợp đồng" })
    .trim()
    .min(1, "Lý do chấm dứt không được để trống"),
  severancePay: z.number().min(0, "Tiền trợ cấp không được âm").default(0),
  clearanceNote: z.string().trim().optional().or(z.literal("")),
});

export type ContractTerminateFormValues = z.infer<typeof contractTerminateSchema>;

