import { z } from "zod";

export const jobTitleFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã chức danh không được để trống")
    .max(50, "Mã chức danh tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã chức danh chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên chức danh không được để trống")
    .max(255, "Tên chức danh tối đa 255 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type JobTitleFormValues = z.infer<typeof jobTitleFormSchema>;

