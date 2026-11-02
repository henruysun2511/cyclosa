import { z } from "zod";

export const costCenterFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã trung tâm chi phí không được để trống")
    .max(50, "Mã trung tâm chi phí tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã trung tâm chi phí chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên trung tâm chi phí không được để trống")
    .max(255, "Tên trung tâm chi phí tối đa 255 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type CostCenterFormValues = z.infer<typeof costCenterFormSchema>;

