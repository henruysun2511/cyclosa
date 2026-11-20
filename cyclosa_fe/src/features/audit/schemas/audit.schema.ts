import { z } from "zod";

/**
 * Schema bộ lọc nhật ký kiểm toán.
 * Nguồn sự thật duy nhất cho validate Filter request (Quy chuẩn §5.1).
 */
export const auditFilterSchema = z.object({
  search: z.string().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  ipAddress: z
    .string()
    .regex(
      /^$|^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]+$/,
      "Địa chỉ IP không đúng định dạng IPv4 hoặc IPv6"
    )
    .optional(),
  page: z.number().int().min(1).optional(),
  size: z.number().int().min(1).max(100).optional(),
});

export type AuditFilterValues = z.infer<typeof auditFilterSchema>;

/**
 * Schema form xuất dữ liệu kiểm toán.
 */
export const auditExportSchema = z.object({
  format: z.enum(["XLSX", "CSV"], {
    required_error: "Vui lòng chọn định dạng file xuất",
    message: "Định dạng file không hợp lệ",
  }),
  from: z.string().optional(),
  to: z.string().optional(),
  action: z.string().optional(),
  entityType: z.string().optional(),
});

export type AuditExportValues = z.infer<typeof auditExportSchema>;

