"use client";

import React from "react";
import { Camera, RefreshCw, AlertCircle, Sparkles, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveCameraScannerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraError: string | null;
  onRetry: () => void;
  previewImage?: string | null;
  onClearPreview?: () => void;
  isAutoMode?: boolean;
  countdown?: number | null;
  autoStatusText?: string | null;
}

export function LiveCameraScanner({
  videoRef,
  cameraError,
  onRetry,
  previewImage,
  onClearPreview,
  isAutoMode = false,
  countdown,
  autoStatusText,
}: LiveCameraScannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-black shadow-lg aspect-4/3 flex items-center justify-center">
      {cameraError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center text-white">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm font-medium mb-1">Không thể mở Camera</p>
          <p className="text-xs text-zinc-400 max-w-xs mb-4">{cameraError}</p>
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Thử lại
          </Button>
        </div>
      ) : previewImage ? (
        <div className="relative w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Preview khuôn mặt"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-72 border-2 border-dashed border-emerald-400/80 rounded-[50%] animate-pulse" />
          </div>
          {onClearPreview && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onClearPreview}
                className="bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs"
              >
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                Chụp lại
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {/* Hiệu ứng quét Scanline khi ở chế độ Tự động */}
          {isAutoMode && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-75 animate-pulse pointer-events-none top-1/4" />
          )}

          {/* Vùng hướng dẫn khuôn mặt (Oval Target Frame) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div
              className={`w-56 h-72 border-2 rounded-[50%] transition-all duration-300 ${
                isAutoMode
                  ? "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-102"
                  : "border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              }`}
            />

            {/* Thông báo đếm ngược / hướng dẫn */}
            {countdown !== null && countdown !== undefined && countdown > 0 ? (
              <div className="mt-3 flex items-center gap-1.5 bg-emerald-600/90 text-white px-4 py-1.5 rounded-full shadow-lg backdrop-blur-xs text-xs font-semibold animate-bounce">
                <Timer className="h-3.5 w-3.5 animate-spin" />
                Tự động chụp sau {countdown}s...
              </div>
            ) : autoStatusText ? (
              <span className="mt-3 text-xs font-medium text-white/90 bg-black/60 px-3.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                {autoStatusText}
              </span>
            ) : (
              <span className="mt-3 text-xs font-medium text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                Giữ khuôn mặt ngay ngắn trong khung hình
              </span>
            )}
          </div>

          {/* Badge Chế độ Tự động ở góc trái */}
          {isAutoMode && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/80 text-white px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              <span>Kiosk Auto-Punch</span>
            </div>
          )}

          {/* Nút reload camera */}
          <button
            onClick={onRetry}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
            title="Khởi động lại Camera"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
