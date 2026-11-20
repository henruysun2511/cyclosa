import { z } from "zod";

export const employeeFormSchema = z.object({
  lastName: z
    .string({ required_error: "Vui lòng nhập họ và tên đệm" })
    .trim()
    .min(1, "Họ và tên đệm không được để trống")
    .max(50, "Họ và tên đệm tối đa 50 ký tự"),
  firstName: z
    .string({ required_error: "Vui lòng nhập tên chính" })
    .trim()
    .min(1, "Tên chính không được để trống")
    .max(30, "Tên chính tối đa 30 ký tự"),
  dateOfBirth: z
    .string({ required_error: "Vui lòng chọn ngày sinh" })
    .min(1, "Vui lòng chọn ngày sinh"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  phone: z
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .trim()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
  personalEmail: z
    .string()
    .trim()
    .email("Định dạng email cá nhân không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu làm việc"),
  probationEndDate: z.string().optional().or(z.literal("")),
  personalTaxCode: z
    .string()
    .trim()
    .regex(/^([0-9]{10}|[0-9]{13})?$/, "Mã số thuế TNCN phải gồm 10 hoặc 13 chữ số")
    .optional()
    .or(z.literal("")),
  socialInsuranceNumber: z
    .string()
    .trim()
    .regex(/^([0-9]{10})?$/, "Mã số sổ BHXH phải gồm 10 chữ số")
    .optional()
    .or(z.literal("")),
  portraitUrl: z.string().trim().optional().or(z.literal("")),
  // Chiều 1, 2, 3 dùng khi tạo mới
  departmentId: z.string().optional(),
  branchId: z.string().optional(),
  jobTitleId: z.string().optional(),
  jobLevelId: z.string().optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERN", "CONTRACTOR"]),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const workAssignmentSchema = z.object({
  departmentId: z
    .string({ required_error: "Vui lòng chọn phòng ban" })
    .min(1, "Vui lòng chọn phòng ban"),
  branchId: z
    .string({ required_error: "Vui lòng chọn chi nhánh" })
    .min(1, "Vui lòng chọn chi nhánh"),
  jobTitleId: z
    .string({ required_error: "Vui lòng chọn chức danh" })
    .min(1, "Vui lòng chọn chức danh"),
  jobLevelId: z
    .string({ required_error: "Vui lòng chọn cấp bậc" })
    .min(1, "Vui lòng chọn cấp bậc"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERN", "CONTRACTOR"]),
  changeReason: z.string().min(1, "Vui lòng chọn lý do biến động"),
  effectiveFrom: z.string().min(1, "Vui lòng chọn ngày có hiệu lực"),
});

export type WorkAssignmentFormValues = z.infer<typeof workAssignmentSchema>;

export const statusChangeSchema = z.object({
  status: z.enum(["ACTIVE", "PROBATION", "ON_LEAVE", "SUSPENDED", "TERMINATED"], {
    required_error: "Vui lòng chọn trạng thái mới",
  }),
  effectiveFrom: z.string().min(1, "Vui lòng chọn ngày có hiệu lực"),
  note: z.string().trim().optional().or(z.literal("")),
});

export type StatusChangeFormValues = z.infer<typeof statusChangeSchema>;

