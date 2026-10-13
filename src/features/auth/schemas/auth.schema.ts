import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập email hoặc tên đăng nhập" })
    .min(1, "Vui lòng nhập email hoặc tên đăng nhập"),
  password: z
    .string({ required_error: "Mật khẩu là bắt buộc" })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
