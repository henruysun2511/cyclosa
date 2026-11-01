"use client";

import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Camera, X, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadMediaMutation, useDeleteMediaMutation } from "../api/media-api";
import { MEDIA_CONFIG } from "../constants/media.constants";
import { extractPublicIdFromCloudinaryUrl } from "../utils/media-utils";
import { Button } from "@/components/ui/button";

export interface AvatarUploaderProps {
  value?: string | null;
  fallbackText?: string;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function AvatarUploader({
  value,
  fallbackText = "U",
  onChange,
  disabled = false,
  className,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [activePublicId, setActivePublicId] = useState<string | null>(null);

  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();

  const isProcessing = isUploading || isDeleting;

  // Khi value thay đổi từ ngoài vào, cập nhật publicId nếu có thể
  useEffect(() => {
    setImageError(false);
    if (value) {
      const extracted = extractPublicIdFromCloudinaryUrl(value);
      if (extracted) {
        setActivePublicId(extracted);
      }
    } else {
      setActivePublicId(null);
    }
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input để có thể chọn lại cùng 1 file
    e.target.value = "";

    // 1. Kiểm tra dung lượng
    if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE_BYTES) {
      toast.error("Ảnh quá lớn", {
        description: `Dung lượng tệp tối đa cho phép là ${MEDIA_CONFIG.MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    // 2. Kiểm tra định dạng
    if (!MEDIA_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type as (typeof MEDIA_CONFIG.ALLOWED_IMAGE_TYPES)[number])) {
      toast.error("Định dạng không hỗ trợ", {
        description: "Vui lòng chọn tệp ảnh có định dạng .jpg, .jpeg, .png hoặc .webp.",
      });
      return;
    }

    // 3. Ghi nhớ publicId của ảnh cũ cần dọn dẹp
    const oldPublicId = activePublicId || extractPublicIdFromCloudinaryUrl(value);

    try {
      // 4. Upload ảnh mới lên Cloudinary
      const res = await uploadMedia({
        file,
        folder: MEDIA_CONFIG.DEFAULT_AVATAR_FOLDER,
      }).unwrap();

      const newSecureUrl = res.data.secureUrl;
      const newPublicId = res.data.publicId;

      // 5. Nếu trước đó đã có ảnh cũ trên Cloudinary, tự động xóa để giải phóng dung lượng
      if (oldPublicId && oldPublicId !== newPublicId) {
        deleteMedia({ publicId: oldPublicId }).catch(() => {
          // Bỏ qua lỗi ngầm nếu ảnh cũ không còn tồn tại
        });
      }

      // 6. Cập nhật URL & publicId mới
      setActivePublicId(newPublicId);
      setImageError(false);
      onChange(newSecureUrl);

      toast.success("Tải ảnh đại diện thành công", {
        description: "Ảnh mới đã được cập nhật. Hãy nhấn 'Lưu thay đổi' để hoàn tất.",
      });
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      const message =
        errorObj?.data?.message || "Tải ảnh lên thất bại. Vui lòng thử lại sau.";
      toast.error("Lỗi tải ảnh", {
        description: message,
      });
    }
  };

  const handleDeleteImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isProcessing) return;

    const publicIdToDelete = activePublicId || extractPublicIdFromCloudinaryUrl(value);

    try {
      if (publicIdToDelete) {
        await deleteMedia({ publicId: publicIdToDelete }).unwrap();
      }

      setActivePublicId(null);
      setImageError(false);
      onChange(null);

      toast.success("Đã xóa ảnh đại diện", {
        description: "Ảnh trên Cloudinary đã được dọn dẹp. Hãy nhấn 'Lưu thay đổi' để hoàn tất.",
      });
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      const message =
        errorObj?.data?.message || "Xóa ảnh thất bại. Vui lòng thử lại sau.";
      toast.error("Lỗi xóa ảnh", {
        description: message,
      });
    }
  };

  const hasValidImage = !!value && !imageError;
  const initialLetter = fallbackText ? fallbackText.charAt(0).toUpperCase() : "U";

  return (
    <div className={cn("flex flex-col sm:flex-row items-center gap-5", className)}>
      {/* Vùng Avatar tròn */}
      <div className="relative group">
        <div
          onClick={() => !disabled && !isProcessing && fileInputRef.current?.click()}
          className={cn(
            "relative h-20 w-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl uppercase border-2 border-primary/20 shrink-0 overflow-hidden shadow-xs cursor-pointer transition-all",
            !disabled && !isProcessing && "hover:border-primary/60 hover:ring-4 hover:ring-primary/10"
          )}
          title="Nhấp để thay đổi ảnh đại diện"
        >
          {hasValidImage ? (
            <img
              src={value || ""}
              alt="Avatar"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-200"
            />
          ) : (
            <span>{initialLetter}</span>
          )}

          {/* Hover Overlay khi chưa đang loading */}
          {!disabled && !isProcessing && (
            <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
              <Camera className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-medium">Đổi ảnh</span>
            </div>
          )}

          {/* Processing Loading Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-[10px] font-semibold text-primary mt-1">
                {isUploading ? "Đang tải..." : "Đang xóa..."}
              </span>
            </div>
          )}
        </div>

        {/* Nút dấu [X] xóa ảnh nổi ở góc trên phải */}
        {hasValidImage && !disabled && !isProcessing && (
          <button
            type="button"
            onClick={handleDeleteImage}
            title="Xóa ảnh đại diện"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white hover:bg-destructive/90 flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95 z-30 ring-2 ring-background"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Input file ẩn */}
        <input
          ref={fileInputRef}
          type="file"
          accept={MEDIA_CONFIG.ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleFileSelect}
          disabled={disabled || isProcessing}
          className="hidden"
        />
      </div>

      {/* Thông tin mô tả & nút chọn nhanh */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 text-xs gap-1.5 cursor-pointer font-medium"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Tải ảnh lên</span>
          </Button>

          {hasValidImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || isProcessing}
              onClick={handleDeleteImage}
              className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              <span>Gỡ ảnh</span>
            </Button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa {MEDIA_CONFIG.MAX_FILE_SIZE_MB}MB). Ảnh được tối ưu hóa tự động trên Cloudinary.
        </p>
      </div>
    </div>
  );
}
