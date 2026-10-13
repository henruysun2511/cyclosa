"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SignaturePadProps {
  onSave?: (signatureDataUrl: string) => void;
  onClear?: () => void;
  className?: string;
  height?: number;
}

export function SignaturePad({
  onSave,
  onClear,
  className,
  height = 180,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const ratio = Math.ceil(window.devicePixelRatio || 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
  }, [height]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current && onSave) {
      onSave(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onClear?.();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <PenTool className="h-3.5 w-3.5 text-primary" />
          Ký trực tiếp bằng ngón tay hoặc chuột
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-rose-600 hover:bg-rose-50"
          onClick={clearCanvas}
          disabled={!hasDrawn}
        >
          <Eraser className="h-3 w-3 mr-1" />
          Ký lại
        </Button>
      </div>

      <div className="relative border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-white touch-none">
        <canvas
          ref={canvasRef}
          style={{ height: `${height}px`, width: "100%" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full"
        />

        {!hasDrawn && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400 select-none">
            Vẽ chữ ký của bạn vào khung này
          </div>
        )}
      </div>
    </div>
  );
}
