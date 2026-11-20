/**
 * CYCLOSA - Phân hệ 06: Hội nhập Nhân sự (Onboarding)
 * Zod Validation Schemas (Source of Truth cho mọi biểu mẫu dữ liệu)
 */

import { z } from "zod";

export const templateItemSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề công việc phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: z.string().optional(),
  taskGroup: z.enum(["DOCS", "EQUIPMENT", "ACCOUNTS", "TRAINING", "ORIENTATION"], {
    message: "Vui lòng chọn nhóm công việc hợp lệ",
  }),
  targetDayOffset: z
    .number()
    .int("Ngày tương đối phải là số nguyên")
    .min(0, "Ngày tương đối không được âm"),
  sequenceOrder: z.number().int(),
  isMandatory: z.boolean(),
  defaultAssigneeRole: z.string().optional(),
  itAccountTypeId: z.string().optional(),
  documentRequired: z.boolean().optional(),
});

export const onboardingTemplateSchema = z.object({
  name: z
    .string()
    .min(3, "Tên mẫu checklist phải có ít nhất 3 ký tự")
    .max(150, "Tên mẫu checklist không được vượt quá 150 ký tự"),
  description: z.string().optional(),
  departmentId: z.string().optional(),
  isActive: z.boolean(),
  items: z.array(templateItemSchema).optional(),
});

export const onboardingProcessSchema = z.object({
  employeeId: z.string().min(1, "Vui lòng chọn nhân viên tiếp nhận"),
  templateId: z.string().min(1, "Vui lòng chọn mẫu checklist hội nhập"),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu làm việc"),
  probationEndDate: z.string().min(1, "Vui lòng chọn ngày kết thúc thử việc"),
  mentorId: z.string().optional(),
  directManagerId: z.string().optional(),
  notes: z.string().optional(),
});

export const orientationSessionSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề buổi đào tạo phải có ít nhất 3 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  description: z.string().optional(),
  trainerName: z.string().min(2, "Vui lòng nhập họ tên người đào tạo/giảng viên"),
  trainerEmail: z.string().email("Email giảng viên không hợp lệ").optional().or(z.literal("")),
  location: z.string().optional(),
  meetingLink: z.string().url("Đường dẫn Google Meet/Zoom không hợp lệ").optional().or(z.literal("")),
  startTime: z.string().min(1, "Vui lòng chọn thời gian bắt đầu"),
  endTime: z.string().min(1, "Vui lòng chọn thời gian kết thúc"),
  maxAttendees: z.number().int().min(1, "Số học viên tối đa ít nhất là 1"),
  attendeeEmployeeIds: z.array(z.string()).optional(),
});

export const itAccountTypeSchema = z.object({
  name: z
    .string()
    .min(2, "Tên loại tài khoản phải có ít nhất 2 ký tự")
    .max(100, "Tên loại tài khoản không được vượt quá 100 ký tự"),
  description: z.string().optional(),
  usernamePattern: z.string().optional(),
  requiresVpn: z.boolean(),
  isActive: z.boolean(),
});

export const provisionItAccountSchema = z.object({
  provisionedUsername: z
    .string()
    .min(2, "Vui lòng nhập tên tài khoản (Username) đã tạo"),
  provisionedEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  initialPasswordNote: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu khởi tạo hoặc quy tắc mật khẩu ban đầu"),
  notes: z.string().optional(),
});

export const adHocTaskSchema = z.object({
  title: z.string().min(3, "Tiêu đề công việc phát sinh phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  taskGroup: z.enum(["DOCS", "EQUIPMENT", "ACCOUNTS", "TRAINING", "ORIENTATION"]),
  dueDate: z.string().min(1, "Vui lòng chọn ngày hạn hoàn thành"),
  isMandatory: z.boolean(),
  assigneeRole: z.string().optional(),
  assignedToEmployeeId: z.string().optional(),
  documentRequired: z.boolean().optional(),
});

export const completeTaskSchema = z.object({
  notes: z.string().optional(),
  documentFileUrl: z.string().optional(),
});

export const acceptProcessSchema = z.object({
  notes: z.string().optional(),
});

export const cancelProcessSchema = z.object({
  reason: z.string().min(5, "Vui lòng nhập lý do hủy bỏ tiến trình (tối thiểu 5 ký tự)"),
});

export type OnboardingTemplateFormValues = z.infer<typeof onboardingTemplateSchema>;
export type OnboardingProcessFormValues = z.infer<typeof onboardingProcessSchema>;
export type OrientationSessionFormValues = z.infer<typeof orientationSessionSchema>;
export type ItAccountTypeFormValues = z.infer<typeof itAccountTypeSchema>;
export type ProvisionItAccountFormValues = z.infer<typeof provisionItAccountSchema>;
export type AdHocTaskFormValues = z.infer<typeof adHocTaskSchema>;
