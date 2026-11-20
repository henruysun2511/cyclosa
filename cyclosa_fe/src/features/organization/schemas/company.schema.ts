import { z } from "zod";

export const companyFormSchema = z.object({
  code: z
    .string()
    .min(1, "Mã công ty không được để trống")
    .max(50, "Mã công ty tối đa 50 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã công ty chỉ gồm chữ hoa, số, dấu gạch nối và gạch dưới"),
  name: z
    .string()
    .min(1, "Tên công ty không được để trống")
    .max(255, "Tên công ty tối đa 255 ký tự"),
  taxCode: z
    .string()
    .max(50, "Mã số thuế tối đa 50 ký tự")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Địa chỉ tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(50, "Số điện thoại tối đa 50 ký tự")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Email không đúng định dạng")
    .max(100, "Email tối đa 100 ký tự")
    .optional()
    .or(z.literal("")),
  logoUrl: z
    .string()
    .url("URL logo không hợp lệ")
    .optional()
    .or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

