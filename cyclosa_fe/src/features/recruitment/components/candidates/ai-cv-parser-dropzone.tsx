"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParseCvFileMutation } from "../../api/recruitment-api";
import type { CvParsedProfileResponse } from "../../types/recruitment.types";

interface AiCvParserDropzoneProps {
  onParsedSuccess: (data: CvParsedProfileResponse, file: File) => void;
}

export function AiCvParserDropzone({ onParsedSuccess }: AiCvParserDropzoneProps) {
  const [parseCv, { isLoading }] = useParseCvFileMutation();
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.name.match(/\.(pdf|docx|doc)$/i)) {
      toast.error("Vui lòng tải lên tệp định dạng PDF hoặc DOCX!");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước tệp không được vượt quá 10MB!");
      return;
    }

    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const parsedResult = await parseCv(formData).unwrap();
      toast.success("AI đã phân tích và trích xuất hồ sơ ứng viên thành công!", {
        description: `Đã bóc tách thông tin của ứng viên ${parsedResult.fullName || file.name}.`,
      });
      onParsedSuccess(parsedResult, file);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể phân tích CV bằng AI lúc này");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
        dragOver
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border bg-card hover:bg-muted/20"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleChange}
        className="hidden"
      />

      <div className="max-w-md mx-auto space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Sparkles className="h-6 w-6 text-primary" />
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground">
            {isLoading ? "AI đang bóc tách hồ sơ CV..." : "Tải lên CV & Bóc tách thông tin tự động bằng AI"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Kéo thả tệp CV định dạng <span className="font-semibold text-foreground">PDF hoặc DOCX</span> vào đây, hoặc bấm nút bên dưới.
          </p>
        </div>

        {fileName && !isLoading && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs dark:bg-emerald-950/40 dark:text-emerald-300 font-mono">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{fileName}</span>
          </div>
        )}

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="h-8 text-xs gap-1.5"
          >
            <UploadCloud className="h-4 w-4" />
            <span>{isLoading ? "Đang xử lý trích xuất..." : "Chọn tệp từ máy tính"}</span>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Được tối ưu bởi mô hình AI OCR bóc tách trích xuất kỹ năng, kinh nghiệm và học vấn.
        </p>
      </div>
    </div>
  );
}
