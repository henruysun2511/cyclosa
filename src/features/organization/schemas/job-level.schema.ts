import { z } from "zod";

export const jobLevelFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã cấp bậc không được để trống")
    .max(50, "Mã cấp bậc tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã cấp bậc chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên cấp bậc không được để trống")
    .max(255, "Tên cấp bậc tối đa 255 ký tự"),
  rankOrder: z
    .number({ invalid_type_error: "Thứ tự cấp bậc phải là số nguyên" })
    .int("Thứ tự cấp bậc phải là số nguyên")
    .min(1, "Thứ tự cấp bậc tối thiểu là 1")
    .max(999, "Thứ tự cấp bậc tối đa là 999"),
});

export type JobLevelFormValues = z.infer<typeof jobLevelFormSchema>;

