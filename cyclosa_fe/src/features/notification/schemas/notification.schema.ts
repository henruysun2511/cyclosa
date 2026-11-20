import { z } from "zod";

export const broadcastNotificationSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề thông báo không được để trống")
    .max(200, "Tiêu đề thông báo tối đa 200 ký tự"),
  content: z
    .string()
    .min(1, "Nội dung thông báo không được để trống"),
  actionUrl: z
    .string()
    .max(500, "Đường dẫn liên kết tối đa 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type BroadcastNotificationFormValues = z.infer<
  typeof broadcastNotificationSchema
>;

