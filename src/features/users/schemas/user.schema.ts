import { z } from "zod";

export const createUserSchema = z.object({
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

