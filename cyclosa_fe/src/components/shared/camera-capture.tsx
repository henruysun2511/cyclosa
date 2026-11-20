"use client";

import React, { useState, useEffect } from "react";
import { Camera, RefreshCw, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CameraCaptureProps {
  onCapture?: (imageDataUrl: string, location?: { lat: number; lng: number }) => void;
  title?: string;
  subtitle?: string;
  enableGps?: boolean;
  className?: string;
}

export function CameraCapture({
  onCapture,
  title = "Nhận diện khuôn mặt",
  subtitle = "Căn chỉnh khuôn mặt vào giữa khung tròn và giữ yên",
  enableGps = true,
  className,
}: CameraCaptureProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [captured, setCaptured] = useState(false);
  const [livenessPassed, setLivenessPassed] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);

  useEffect(() => {
    // Simulate camera & GPS initialization
    const timer = setTimeout(() => {
      setGpsReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    setIsScanning(true);
    // Simulate 1.5s AI Face Liveness verification
    setTimeout(() => {
      setLivenessPassed(true);
      setCaptured(true);
      setIsScanning(false);
      onCapture?.("data:image/png;base64,simulated_face_photo", {
        lat: 21.028511,
        lng: 105.854444,
      });
    }, 1500);
  };

  const handleRetake = () => {
    setCaptured(false);
    setLivenessPassed(false);
    setIsScanning(true);
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-6 text-center space-y-5", className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-xs">{subtitle}</p>
      </div>

      {/* Circle Camera Viewfinder */}
      <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl bg-slate-900 flex items-center justify-center">
        {/* Simulated Camera feed background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950 opacity-90" />

        {/* Circular Scanning Radar Line */}
        {isScanning && !captured && (
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
        )}

        {/* Face Oval Guide */}
        <div
          className={cn(
            "relative z-10 w-44 h-56 rounded-[50%] border-2 border-dashed transition-all flex flex-col items-center justify-center",
            captured
              ? "border-emerald-500 bg-emerald-500/10"
              : isScanning
              ? "border-primary/80 animate-pulse"
              : "border-white/50"
          )}
        >
          {captured ? (
            <div className="flex flex-col items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-12 w-12" />
              <span className="text-xs font-bold uppercase tracking-wider">Hợp lệ</span>
            </div>
          ) : (
            <div className="text-white/40 flex flex-col items-center gap-2">
              <Camera className="h-10 w-10 stroke-1" />
              <span className="text-2xs uppercase tracking-widest font-mono">Camera AI</span>
            </div>
          )}
        </div>

        {/* Liveness badge overlay */}
        <div className="absolute bottom-3 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-2xs text-white flex items-center gap-1.5 border border-white/10">
          <ShieldCheck className={cn("h-3.5 w-3.5", livenessPassed ? "text-emerald-400" : "text-amber-400")} />
          <span>{livenessPassed ? "Liveness Verified" : "Liveness Active"}</span>
        </div>
      </div>

      {/* GPS status pill */}
      {enableGps && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-700 border border-slate-200 font-mono">
          <MapPin className="h-3.5 w-3.5 text-rose-500" />
          <span>{gpsReady ? "Tọa độ: 21.0285° N, 105.8544° E (Đúng chi nhánh)" : "Đang lấy tọa độ GPS..."}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {captured ? (
          <Button type="button" variant="outline" size="sm" onClick={handleRetake}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Chụp lại
          </Button>
        ) : (
          <Button
            type="button"
            className="px-6 bg-primary hover:bg-primary/90 text-white font-medium"
            onClick={handleCapture}
          >
            <Camera className="h-4 w-4 mr-2" />
            Xác nhận khuôn mặt
          </Button>
        )}
      </div>
    </div>
  );
}
