import { z } from "zod";

export const knowledgeDocumentFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Tiêu đề văn bản quy chế không được để trống")
      .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
    category: z.enum(
      [
        "HR_POLICY",
        "EMPLOYEE_HANDBOOK",
        "SYSTEM_GUIDE",
        "LEGAL_COMPLIANCE",
      ],
      {
        required_error: "Vui lòng chọn danh mục tài liệu",
      }
    ),
    version: z
      .string()
      .min(1, "Phiên bản văn bản không được để trống"),
    content: z
      .string()
      .max(100000, "Nội dung vượt quá giới hạn tối đa cho phép")
      .optional(),
    fileUrl: z.string().optional(),
    fileSize: z.number().optional(),
  })
  .refine(
    (data) => {
      // Bắt buộc có tệp đính kèm hoặc có nội dung văn bản >= 10 ký tự
      const hasContent = !!data.content && data.content.trim().length >= 10;
      const hasFile = !!data.fileUrl && data.fileUrl.trim().length > 0;
      return hasContent || hasFile;
    },
    {
      message: "Vui lòng tải lên tệp đính kèm (PDF/Word/TXT) hoặc nhập nội dung văn bản ít nhất 10 ký tự",
      path: ["content"],
    }
  );

export type KnowledgeDocumentFormValues = z.infer<
  typeof knowledgeDocumentFormSchema
>;
