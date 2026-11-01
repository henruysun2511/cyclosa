import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string({ required_error: "Vui lòng nhập tên đăng nhập" })
    .trim()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được vượt quá 50 ký tự")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Tên đăng nhập chỉ gồm chữ cái, chữ số, dấu chấm (.), gạch dưới (_) hoặc gạch ngang (-)"
    ),
  email: z
    .string({ required_error: "Vui lòng nhập địa chỉ email" })
    .trim()
    .min(1, "Email không được để trống")
    .email("Định dạng email không hợp lệ (VD: user@cyclosa.vn)"),
  roleCodes: z.array(z.string()),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const assignUserRoleSchema = z.object({
  roleId: z
    .string({ required_error: "Vui lòng chọn vai trò" })
    .min(1, "Vui lòng chọn vai trò để gán"),
  companyId: z
    .string({ required_error: "Vui lòng nhập hoặc chọn mã công ty" })
    .min(1, "ID công ty không được để trống"),
});

export type AssignUserRoleFormValues = z.infer<typeof assignUserRoleSchema>;

