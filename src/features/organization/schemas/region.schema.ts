import { z } from "zod";

export const regionFormSchema = z.object({
  companyId: z.string().min(1, "Vui lòng chọn công ty"),
  code: z
    .string()
    .min(1, "Mã khu vực không được để trống")
    .max(50, "Mã khu vực tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã khu vực chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên khu vực không được để trống")
    .max(255, "Tên khu vực tối đa 255 ký tự"),
});

export type RegionFormValues = z.infer<typeof regionFormSchema>;

