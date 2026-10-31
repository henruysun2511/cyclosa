import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Vui lòng nhập tên đăng nhập" })
    .min(1, "Tên đăng nhập không được để trống")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(100, "Tên đăng nhập không được quá 100 ký tự"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu không được quá 100 ký tự"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const strongPasswordSchema = z
  .string({ required_error: "Vui lòng nhập mật khẩu" })
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .max(100, "Mật khẩu không được vượt quá 100 ký tự")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@$!%*?&)"
  );

export const activateAccountSchema = z
  .object({
    token: z.string().min(1, "Mã token kích hoạt không được để trống"),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp",
    path: ["confirmPassword"],
  });

export type ActivateAccountInput = z.infer<typeof activateAccountSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: "Vui lòng nhập email" })
      .min(1, "Email không được để trống")
      .email("Email không đúng định dạng"),
    otp: z
      .string({ required_error: "Vui lòng nhập mã OTP" })
      .length(6, "Mã OTP phải gồm chính xác 6 chữ số")
      .regex(/^\d{6}$/, "Mã OTP chỉ được chứa ký tự số"),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

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
