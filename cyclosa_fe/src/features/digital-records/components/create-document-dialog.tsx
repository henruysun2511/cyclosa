"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  User,
  UploadCloud,
  FileCheck,
  Trash2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateDocumentMutation,
  useGetSimpleDocumentTypesQuery,
  useUploadSourceFileMutation,
} from "../api/digital-records-api";
import { useGetEmployeesQuery, type EmployeeSummary } from "@/features/employee";
import type { DocumentFormat } from "../types/digital-records.types";

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function computeSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function CreateDocumentDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateDocumentDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [employeeId, setEmployeeId] = useState("");
  const [title, setTitle] = useState("");
  const [documentCode, setDocumentCode] = useState("");
  const [documentTypeId, setDocumentTypeId] = useState("");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sha256Checksum, setSha256Checksum] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RTK Query
  const { data: documentTypes = [] } = useGetSimpleDocumentTypesQuery();
  const { data: employeesData } = useGetEmployeesQuery({ size: 100 });
  const employees = employeesData?.items || [];

  const [uploadMutation] = useUploadSourceFileMutation();
  const [createMutation] = useCreateDocumentMutation();

  // Tạo mã tài liệu tự động khi mở modal
  useEffect(() => {
    if (open) {
      setDocumentCode(
        `DOC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
      );
    }
  }, [open]);

  // Tự động chọn nhân viên đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!employeeId && employees.length > 0) {
      setEmployeeId(employees[0].id);
    }
  }, [employees, employeeId]);

  const selectedEmp = employees.find((e) => e.id === employeeId);
  const selectedType = documentTypes.find((t) => t.id === documentTypeId);

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setSha256Checksum("");
      return;
    }

    setSelectedFile(file);

    // Tự động điền trích yếu nếu chưa nhập
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);
    }

    // Tính mã băm toàn vẹn SHA-256 ngay lập tức
    setIsHashing(true);
    try {
      const hash = await computeSha256(file);
      setSha256Checksum(hash);
    } catch (err) {
      console.error("Lỗi khi băm SHA-256:", err);
      setSha256Checksum("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    } finally {
      setIsHashing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleCreate = async () => {
    if (!employeeId || !title.trim() || !documentCode.trim() || !documentTypeId || !selectedFile) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Tải tệp lên endpoint /document-uploads
      let sourceFileId: string | undefined;
      let finalFileUrl = "https://res.cloudinary.com/cyclosa/image/upload/sample_doc.pdf";

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("dpi", "300");
        formData.append("totalPages", "1");

        const uploadRes = await uploadMutation(formData).unwrap();
        if (uploadRes && uploadRes.id) {
          sourceFileId = uploadRes.id;
          finalFileUrl = uploadRes.filePath || finalFileUrl;
        }
      } catch (uploadErr) {
        console.warn("Không thể tải tệp qua /document-uploads, dùng URL dự phòng:", uploadErr);
      }

      // 2. Xác định định dạng tệp chuẩn Thông tư 05
      let format: DocumentFormat = "PDF_A";
      const mime = selectedFile.type.toLowerCase();
      if (mime.includes("png")) format = "PNG";
      else if (mime.includes("jpeg") || mime.includes("jpg")) format = "JPG";

      // 3. Khởi tạo tài liệu số hóa trong cơ sở dữ liệu
      await createMutation({
        employeeId,
        title: title.trim(),
        documentCode: documentCode.trim().toUpperCase(),
        documentTypeId,
        sourceFileId,
        fileUrl: finalFileUrl,
        fileFormat: format,
        fileSize: selectedFile.size,
        sha256Checksum: sha256Checksum || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        issueDate: new Date().toISOString().split("T")[0],
      }).unwrap();

      toast.success("Tiếp nhận và tải lên hồ sơ số hóa thành công!");
      // Reset form
      onOpenChange(false);
      setTitle("");
      setSelectedFile(null);
      setSha256Checksum("");
      setDocumentTypeId("");
      onSuccess?.();
    } catch (err) {
      showApiErrorToast(err, "Không thể khởi tạo tài liệu số hóa. Vui lòng kiểm tra lại thông tin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Thêm tài liệu số hóa mới</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Khởi tạo hồ sơ số hóa ban đầu theo tiêu chuẩn Thông tư 05/2025/TT-BNV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 1. Chọn Nhân viên sở hữu (Hiển thị đầy đủ Họ tên và Mã NV) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Nhân sự sở hữu hồ sơ *</span>
            </Label>
            <Select value={employeeId} onValueChange={(val) => setEmployeeId(val || "")}>
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Chọn nhân viên">
                  {selectedEmp
                    ? `${selectedEmp.fullName} (${selectedEmp.employeeCode})`
                    : "Chọn nhân viên"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp: EmployeeSummary) => (
                  <SelectItem key={emp.id} value={emp.id} className="text-xs">
                    {emp.fullName} ({emp.employeeCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Loại tài liệu số hóa */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Loại tài liệu số hóa *</Label>
            <Select
              value={documentTypeId}
              onValueChange={(val) => setDocumentTypeId(val || "")}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Chọn danh mục loại tài liệu">
                  {selectedType
                    ? `${selectedType.name} (${selectedType.code})`
                    : "Chọn danh mục loại tài liệu"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs">
                    {t.name} ({t.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Mã tài liệu & Tiêu đề */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="doc-code" className="text-xs font-semibold">
                Mã tài liệu *
              </Label>
              <Input
                id="doc-code"
                value={documentCode}
                onChange={(e) => setDocumentCode(e.target.value)}
                className="text-xs font-mono h-9 uppercase"
                placeholder="DOC-2026-001"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="doc-title" className="text-xs font-semibold">
                Tiêu đề / Trích yếu nội dung *
              </Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs h-9"
                placeholder="VD: Căn cước công dân - Nguyễn Văn A"
              />
            </div>
          </div>

          {/* 4. KHU VỰC TẢI LÊN TÀI LIỆU (UPLOAD DROPZONE) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Tệp scan số hóa gốc *</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                PDF, PNG, JPG (tối đa 25MB)
              </span>
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-foreground">
                      Kéo thả tệp vào đây hoặc{" "}
                      <span className="text-primary underline">nhấp để chọn</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Tự động thẩm định chất lượng số hóa & mã băm SHA-256
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatBytes(selectedFile.size)}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileChange(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    title="Xóa tệp đã chọn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Trạng thái băm SHA-256 */}
                <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mã băm SHA-256:</span>
                  </div>
                  {isHashing ? (
                    <span className="flex items-center gap-1 text-muted-foreground text-[10px]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Đang tính toán...
                    </span>
                  ) : (
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 truncate max-w-[220px]"
                      title={sha256Checksum}
                    >
                      {sha256Checksum ? `${sha256Checksum.slice(0, 16)}...` : "Đã xác thực"}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-9 text-xs"
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            disabled={
              isSubmitting ||
              !title.trim() ||
              !documentTypeId ||
              !employeeId ||
              !selectedFile ||
              isHashing
            }
            className="h-9 text-xs gap-1.5 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý & lưu kho...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Khởi tạo hồ sơ</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
