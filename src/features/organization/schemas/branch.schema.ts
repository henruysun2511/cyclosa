import { z } from "zod";

export const branchFormSchema = z.object({
  regionId: z.string().min(1, "Vui lòng chọn khu vực"),
  code: z
    .string()
    .min(1, "Mã chi nhánh không được để trống")
    .max(50, "Mã chi nhánh tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã chi nhánh chỉ gồm chữ hoa, số và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên chi nhánh không được để trống")
    .max(255, "Tên chi nhánh tối đa 255 ký tự"),
  address: z
    .string()
    .max(500, "Địa chỉ tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
  latitude: z
    .number()
    .min(-90, "Vĩ độ không được nhỏ hơn -90")
    .max(90, "Vĩ độ không được lớn hơn 90")
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, "Kinh độ không được nhỏ hơn -180")
    .max(180, "Kinh độ không được lớn hơn 180")
    .optional()
    .nullable(),
  attendanceRadiusMeters: z
    .number()
    .min(10, "Bán kính chấm công tối thiểu là 10 mét")
    .max(5000, "Bán kính chấm công tối đa là 5,000 mét")
    .default(200),
  isActive: z.boolean().default(true),
});

export type BranchFormValues = z.infer<typeof branchFormSchema>;

