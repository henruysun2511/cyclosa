"use client";

import React, { useState } from "react";
import { UploadCloud, File, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt?: string;
}

export interface FileUploaderProps {
  files?: UploadedFileItem[];
  onChange?: (files: UploadedFileItem[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMb?: number;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function FileUploader({
  files = [],
  onChange,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxFiles = 5,
  maxSizeMb = 15,
  label = "Kéo thả tài liệu vào đây hoặc bấm để chọn tệp",
  description = `Hỗ trợ PDF, Word, JPG, PNG tối đa ${maxSizeMb}MB mỗi tệp`,
  disabled = false,
  className,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSimulatedUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newItems: UploadedFileItem[] = Array.from(fileList).map((f) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }));

    const combined = [...files, ...newItems].slice(0, maxFiles);
    onChange?.(combined);
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    onChange?.(updated);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-slate-300 hover:border-slate-400 bg-slate-50/50",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleSimulatedUpload(e.dataTransfer.files);
        }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = accept;
          input.multiple = maxFiles > 1;
          input.onchange = (e) => handleSimulatedUpload((e.target as HTMLInputElement).files);
          input.click();
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      </div>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-white text-sm"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {file.name.endsWith(".pdf") ? (
                  <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                ) : file.name.match(/\.(jpg|jpeg|png)$/i) ? (
                  <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                ) : (
                  <File className="h-4 w-4 text-slate-500 shrink-0" />
                )}
                <div className="truncate">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-2xs text-muted-foreground">
                    {formatFileSize(file.size)} • Đã tải lên {file.uploadedAt}
                  </p>
                </div>
              </div>

              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
