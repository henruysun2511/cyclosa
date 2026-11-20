"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  BookPlus,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateKnowledgeDocumentMutation } from "../../api/ai-api";
import { useUploadMediaMutation } from "@/features/media";
import { KNOWLEDGE_CATEGORY_LABELS } from "../../constants/ai.constants";
import {
  knowledgeDocumentFormSchema,
  type KnowledgeDocumentFormValues,
} from "../../schemas/knowledge-schema";

interface CreateDocDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface SelectedFileInfo {
  file: File;
  name: string;
  size: number;
  url?: string;
  isUploading: boolean;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CreateDocDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateDocDialogProps) {
  const [createDocMutation, { isLoading: isCreating }] =
    useCreateKnowledgeDocumentMutation();
  const [uploadMediaMutation] = useUploadMediaMutation();

  const [selectedFile, setSelectedFile] = useState<SelectedFileInfo | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<KnowledgeDocumentFormValues>({
    resolver: zodResolver(knowledgeDocumentFormSchema),
    defaultValues: {
      title: "",
      category: "HR_POLICY",
      version: "v1.0",
      content: "",
      fileUrl: undefined,
      fileSize: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        category: "HR_POLICY",
        version: "v1.0",
        content: "",
        fileUrl: undefined,
        fileSize: undefined,
      });
      setSelectedFile(null);
    }
  }, [open, form]);

  const handleProcessFile = async (file: File) => {
    const maxBytes = 20 * 1024 * 1024; // 20MB
    if (file.size > maxBytes) {
      toast.error("Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 20MB.");
      return;
    }

    // Tự động điền tiêu đề từ tên tệp (bỏ phần mở rộng) nếu tiêu đề còn trống
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    if (!form.getValues("title").trim()) {
      form.setValue("title", fileNameWithoutExt, { shouldValidate: true });
    }

    const fileInfo: SelectedFileInfo = {
      file,
      name: file.name,
      size: file.size,
      isUploading: true,
    };
    setSelectedFile(fileInfo);

    // 1. Nếu là file Text / Markdown, đọc ngay nội dung vào ô Textarea
    const isTextDoc =
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.type.includes("text");

    if (isTextDoc) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          form.setValue("content", text.trim(), { shouldValidate: true });
        }
      };
      reader.readAsText(file, "UTF-8");
    }

    // 2. Tải tệp lên máy chủ media để lưu file gốc đính kèm
    try {
      const uploadRes = await uploadMediaMutation({
        file,
        folder: "cyclosa/knowledge_base",
      }).unwrap();

      if (uploadRes.data?.secureUrl) {
        form.setValue("fileUrl", uploadRes.data.secureUrl);
        form.setValue("fileSize", file.size);
        setSelectedFile({
          file,
          name: file.name,
          size: file.size,
          url: uploadRes.data.secureUrl,
          isUploading: false,
        });
        toast.success(`Đã tải lên tệp: ${file.name}`);
      } else {
        // Fallback local file URL
        const localUrl = URL.createObjectURL(file);
        form.setValue("fileUrl", localUrl);
        form.setValue("fileSize", file.size);
        setSelectedFile({
          file,
          name: file.name,
          size: file.size,
          url: localUrl,
          isUploading: false,
        });
      }
    } catch {
      // Fallback local file URL nếu API media chưa cấu hình Cloudinary key
      const localUrl = URL.createObjectURL(file);
      form.setValue("fileUrl", localUrl);
      form.setValue("fileSize", file.size);
      setSelectedFile({
        file,
        name: file.name,
        size: file.size,
        url: localUrl,
        isUploading: false,
      });
      toast.info(`Đã đính kèm tệp: ${file.name}`);
    }

    // Nếu là PDF/DOCX và nội dung đang trống, điền tóm tắt mặc định
    if (!isTextDoc && !form.getValues("content")?.trim()) {
      form.setValue(
        "content",
        `Văn bản quy chế đính kèm: ${file.name} (${formatBytes(file.size)}). Toàn bộ nội dung điều khoản áp dụng theo file gốc đã tải lên.`,
        { shouldValidate: true }
      );
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    form.setValue("fileUrl", undefined);
    form.setValue("fileSize", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values: KnowledgeDocumentFormValues) => {
    try {
      await createDocMutation({
        title: values.title.trim(),
        category: values.category,
        version: values.version.trim() || "v1.0",
        fileUrl: values.fileUrl,
        fileSize: values.fileSize,
        content: values.content?.trim(),
      }).unwrap();

      toast.success("Tải lên và lập chỉ mục tài liệu tri thức thành công");
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.error("Không thể thêm tài liệu tri thức. Vui lòng thử lại.");
    }
  };

  const isSubmitting = isCreating || !!selectedFile?.isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
            <BookPlus className="h-5 w-5 text-primary shrink-0" />
            <span>Thêm tài liệu vào Kho tri thức</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
          {/* KHU VỰC TẢI LÊN FILE ĐÍNH KÈM (DROPZONE) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Tệp tài liệu đính kèm (PDF, Word, Markdown, Text)</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Tối đa 20MB
              </span>
            </Label>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleProcessFile(file);
              }}
            />

            {!selectedFile ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40",
                  isDragOver ? "border-primary bg-primary/5" : "border-border"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProcessFile(file);
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Kéo thả tệp vào đây hoặc{" "}
                      <span className="text-primary underline">bấm để chọn tệp</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Hỗ trợ định dạng .pdf, .docx, .doc, .txt, .md
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span>{formatBytes(selectedFile.size)}</span>
                      <span>•</span>
                      {selectedFile.isUploading ? (
                        <span className="text-amber-600 flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Đang tải lên...
                        </span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Đã sẵn sàng
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleRemoveFile}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="Gỡ bỏ tệp"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Tiêu đề */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-foreground">
              Tiêu đề văn bản / quy chế <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="VD: Quy chế làm việc từ xa và quản lý năng suất 2026"
              {...form.register("title")}
              className="text-xs"
            />
            {form.formState.errors.title && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Danh mục */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Danh mục tri thức <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch("category")}
                onValueChange={(val: any) => form.setValue("category", val)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(KNOWLEDGE_CATEGORY_LABELS).map(([k, label]) => (
                    <SelectItem key={k} value={k} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phiên bản */}
            <div className="space-y-1.5">
              <Label htmlFor="version" className="text-xs font-semibold text-foreground">
                Phiên bản áp dụng
              </Label>
              <Input
                id="version"
                placeholder="VD: v2.1"
                {...form.register("version")}
                className="text-xs font-mono"
              />
            </div>
          </div>

          {/* Nội dung */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-xs font-semibold text-foreground">
                Nội dung văn bản quy chế
              </Label>
              <span className="text-[11px] text-muted-foreground">
                Dùng để chia đoạn (chunks) lập vector RAG
              </span>
            </div>
            <Textarea
              id="content"
              placeholder="Dán toàn bộ nội dung điều khoản, quyền lợi, nghĩa vụ và quy trình phê duyệt vào đây (hoặc tải tệp .txt / .md ở trên để tự động nạp)..."
              rows={7}
              {...form.register("content")}
              className="text-xs font-mono resize-y"
            />
            {form.formState.errors.content && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="text-xs gap-1.5 min-w-[120px]"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Lưu và Lập Vector</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
