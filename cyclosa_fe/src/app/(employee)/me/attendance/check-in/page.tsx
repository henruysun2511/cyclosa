"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Camera, LogIn, LogOut, Clock, Calendar, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import {
  AttendancePageHeader,
  useGeofencingCamera,
  LiveCameraScanner,
  GpsLocationCard,
  PunchResultDialog,
  LatestPunchCard,
  usePunchCheckInMutation,
  usePunchCheckOutMutation,
  useGetMyTodayStatusQuery,
  type AttendanceLogResponse,
} from "@/features/attendance";

function CheckInContent() {
  const authUser = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const autoParam = searchParams.get("auto");

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [punchResult, setPunchResult] = useState<AttendanceLogResponse | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Chế độ Tự động (Auto-punch / Kiosk Mode): mặc định bật nếu URL có ?auto=true hoặc người dùng gạt công tắc
  const [isAutoMode, setIsAutoMode] = useState(autoParam === "true");
  const [autoTargetType, setAutoTargetType] = useState<"AUTO" | "CHECK_IN" | "CHECK_OUT">("AUTO");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [autoStatusText, setAutoStatusText] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Hook Camera & GPS Geofencing
  const {
    videoRef,
    cameraError,
    startCamera,
    stopCamera,
    capturePhoto,
    gpsLocation,
    gpsError,
    isGpsLoading,
    refreshGps,
    useOfficeFallbackLocation,
    distanceToBranch,
    isWithinGeofence,
    allowedRadius,
  } = useGeofencingCamera();

  // Đảm bảo dừng hoàn toàn Camera phần cứng khi thoát/rời khỏi trang Check-in
  useEffect(() => {
    const handleUnload = () => {
      stopCamera();
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      stopCamera();
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [stopCamera]);

  // RTK Query API
  const { data: todayStatusData, refetch: refetchTodayStatus } = useGetMyTodayStatusQuery();
  const [punchCheckIn, { isLoading: isCheckInLoading }] = usePunchCheckInMutation();
  const [punchCheckOut, { isLoading: isCheckOutLoading }] = usePunchCheckOutMutation();

  const todayStatus = todayStatusData?.data;
  const isSubmitting = isCheckInLoading || isCheckOutLoading;

  // Xử lý Check-in / Check-out
  const handlePunch = async (eventType: "CHECK_IN" | "CHECK_OUT") => {
    // 1. Kiểm tra GPS
    if (!gpsLocation) {
      toast.error("Vui lòng đợi hệ thống xác định vị trí GPS hoặc bấm thử lại");
      return;
    }

    // 2. Chụp ảnh từ camera
    const photo = capturePhoto();
    if (!photo) {
      toast.error("Không thể chụp ảnh từ Camera. Vui lòng kiểm tra quyền thiết bị");
      return;
    }
    setPreviewImage(photo);

    const punchData = {
      transactionCode: `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      latitude: gpsLocation.latitude,
      longitude: gpsLocation.longitude,
      accuracyMeters: gpsLocation.accuracy,
      liveImageBase64: photo,
      deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    try {
      let res;
      if (eventType === "CHECK_IN") {
        res = await punchCheckIn(punchData).unwrap();
      } else {
        res = await punchCheckOut(punchData).unwrap();
      }

      if (res?.data) {
        setPunchResult(res.data);
        setIsResultOpen(true);
        refetchTodayStatus();
        toast.success(
          `Chấm công ${eventType === "CHECK_IN" ? "vào ca" : "tan ca"} thành công!`
        );

        // Bắt đầu thời gian nghỉ (cooldown 6 giây) nếu đang ở chế độ tự động
        if (isAutoMode) {
          setCooldown(6);
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || `Lỗi khi thực hiện ${eventType === "CHECK_IN" ? "vào ca" : "tan ca"}`);
    }
  };

  // Xác định sự kiện tiếp theo (Vào ca hay Tan ca)
  const resolveTargetEventType = (): "CHECK_IN" | "CHECK_OUT" => {
    if (autoTargetType === "CHECK_IN") return "CHECK_IN";
    if (autoTargetType === "CHECK_OUT") return "CHECK_OUT";
    // Tự động: Nếu hôm nay chưa check-in -> CHECK_IN; nếu đã check-in -> CHECK_OUT
    return todayStatus?.firstInTime ? "CHECK_OUT" : "CHECK_IN";
  };

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Bộ điều khiển Logic Chấm công Tự động (Auto Mode)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoMode) {
      setCountdown(null);
      setAutoStatusText(null);
      return;
    }

    if (cooldown > 0) {
      setAutoStatusText(`Đã ghi nhận! Chờ lượt quét kế tiếp (${cooldown}s)...`);
      setCountdown(null);
      return;
    }

    if (cameraError) {
      setAutoStatusText("Không thể mở máy ảnh");
      setCountdown(null);
      return;
    }

    if (!gpsLocation) {
      setAutoStatusText("Đang định vị GPS...");
      setCountdown(null);
      return;
    }

    if (isSubmitting) {
      setAutoStatusText("Đang xác thực Face AI...");
      setCountdown(null);
      return;
    }

    // Camera + GPS đã sẵn sàng -> Bắt đầu đếm ngược 2s
    setAutoStatusText("Đã nhận diện khuôn mặt, đang chuẩn bị...");
    let current = 2;
    setCountdown(current);

    timerRef.current = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
      } else {
        clearInterval(timerRef.current!);
        setCountdown(null);
        setAutoStatusText("Đang chụp và gửi xác thực...");
        const event = resolveTargetEventType();
        handlePunch(event);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAutoMode, cooldown, cameraError, gpsLocation, isSubmitting]);

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Điểm danh Face AI"
        breadcrumbs={[
          { label: "Cổng nhân viên", href: "/me" },
          { label: "Bảng công", href: "/me/attendance" },
          { label: "Điểm danh Face AI" },
        ]}
        icon={Camera}
        actions={
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" asChild>
            <Link href="/me/attendance">
              <span>Xem bảng công</span>
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cột trái: Live Camera Scanner & Điều khiển */}
        <div className="md:col-span-7 space-y-4">
          <LiveCameraScanner
            videoRef={videoRef}
            cameraError={cameraError}
            onRetry={startCamera}
            previewImage={previewImage}
            onClearPreview={() => {
              setPreviewImage(null);
              setPunchResult(null);
            }}
            isAutoMode={isAutoMode}
            countdown={countdown}
            autoStatusText={autoStatusText}
          />

          {/* Thanh chuyển đổi Chế độ Tự động (Auto / Kiosk Mode) */}
          <div className="flex items-center justify-between rounded-xl border bg-card p-3.5 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  Chế độ Tự động quét (Kiosk Auto-Punch)
                  {isAutoMode && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-600">
                      Đang bật
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Hệ thống tự động chụp & điểm danh khi khuôn mặt vào khung
                </p>
              </div>
            </div>

            <Switch
              checked={isAutoMode}
              onCheckedChange={(checked) => {
                setIsAutoMode(checked);
                setPreviewImage(null);
                setPunchResult(null);
              }}
            />
          </div>

          {/* Nút hành động Chấm công Thủ công (Khi không ở chế độ Tự động) */}
          {!isAutoMode ? (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                size="lg"
                className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md cursor-pointer"
                disabled={isSubmitting || !gpsLocation}
                onClick={() => handlePunch("CHECK_IN")}
              >
                <LogIn className="mr-2 h-5 w-5" />
                {isCheckInLoading ? "Đang xác thực..." : "Vào ca (Check-in)"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 border-primary/40 hover:bg-primary/5 font-semibold text-base shadow-sm cursor-pointer"
                disabled={isSubmitting || !gpsLocation}
                onClick={() => handlePunch("CHECK_OUT")}
              >
                <LogOut className="mr-2 h-5 w-5" />
                {isCheckOutLoading ? "Đang xác thực..." : "Tan ca (Check-out)"}
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-xs text-center text-emerald-700 dark:text-emerald-300">
              <span className="font-semibold flex items-center justify-center gap-1.5 mb-0.5">
                <Sparkles className="h-3.5 w-3.5" />
                Đang vận hành chế độ tự động
              </span>
              <span>
                Mục tiêu tự động tiếp theo:{" "}
                <strong>
                  {resolveTargetEventType() === "CHECK_IN"
                    ? "Vào ca (Check-in)"
                    : "Tan ca (Check-out)"}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Cột phải: Thẻ kết quả quét gần nhất, Ca hôm nay & GPS */}
        <div className="md:col-span-5 space-y-4">
          {/* 1. Thẻ Kết quả Chấm công Vừa Quét Xong (Hiển thị ngay cạnh Camera) */}
          {punchResult && (
            <LatestPunchCard
              result={punchResult}
              photoUrl={previewImage}
              employeeName={authUser?.name}
            />
          )}

          {/* 2. Card Ca làm việc hôm nay */}
          <Card className="shadow-xs border">
            <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Ca làm việc hôm nay</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-3">
              {todayStatus?.currentShift ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Ca áp dụng:</span>
                    <span className="font-semibold text-foreground">
                      {todayStatus.currentShift.shiftName} ({todayStatus.currentShift.shiftCode})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Khung giờ ca:</span>
                    <span className="font-medium">
                      {todayStatus.currentShift.startTime} - {todayStatus.currentShift.endTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nghỉ trưa:</span>
                    <span>
                      {todayStatus.currentShift.breakStartTime} - {todayStatus.currentShift.breakEndTime}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  Bạn chưa có ca làm việc được phân trong ngày hôm nay.
                </p>
              )}

              {/* Lịch sử quẹt hôm nay */}
              <div className="rounded-lg bg-muted/40 p-3 space-y-2 border">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Lượt điểm danh trong ngày:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Giờ vào (In):</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {todayStatus?.firstInTime
                        ? new Date(todayStatus.firstInTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Giờ ra (Out):</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {todayStatus?.lastOutTime
                        ? new Date(todayStatus.lastOutTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Card GPS Geofencing */}
          <GpsLocationCard
            gpsLocation={gpsLocation}
            gpsError={gpsError}
            isLoading={isGpsLoading}
            onRefresh={refreshGps}
            onUseOfficeLocation={useOfficeFallbackLocation}
            distanceToBranch={distanceToBranch}
            isWithinGeofence={isWithinGeofence}
            allowedRadius={allowedRadius}
          />

          {/* 4. Banner bảo mật & AI */}
          <div className="rounded-xl border border-dashed p-3 text-[11px] text-muted-foreground flex items-start gap-2 bg-muted/20">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              Hệ thống tự động kiểm tra Anti-Spoofing (chống chụp lại ảnh) và xác thực vector đặc trưng khuôn mặt 512 chiều. Mọi giao dịch đều được ký mã kiểm toán bất biến.
            </span>
          </div>
        </div>
      </div>

      {/* Dialog kết quả chấm công chi tiết */}
      <PunchResultDialog
        open={isResultOpen}
        onOpenChange={setIsResultOpen}
        result={punchResult}
        previewImage={previewImage}
        employeeName={authUser?.name}
      />
    </div>
  );
}

export default function MyCheckInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Đang tải máy ảnh chấm công...</div>}>
      <CheckInContent />
    </Suspense>
  );
}
