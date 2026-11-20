import { z } from "zod";
import { strongPasswordSchema } from "@/features/auth/schemas/auth.schema";

export const updateProfileSchema = z.object({
  username: z
    .string({ required_error: "Vui lòng nhập tên đăng nhập" })
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được vượt quá 50 ký tự")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Tên đăng nhập chỉ chứa chữ cái, chữ số, dấu chấm, dấu gạch ngang và dấu gạch dưới"
    ),
  avatarUrl: z
    .string()
    .max(500, "Đường dẫn ảnh không được vượt quá 500 ký tự")
    .url("Đường dẫn ảnh đại diện không đúng định dạng URL")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: strongPasswordSchema,
    confirmNewPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu mới và mật khẩu xác nhận không trùng khớp",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
