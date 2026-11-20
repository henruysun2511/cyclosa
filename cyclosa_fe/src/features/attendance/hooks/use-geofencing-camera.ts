"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface GpsLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Công thức Haversine tính khoảng cách giữa 2 tọa độ GPS (mét)
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Bán kính Trái Đất (mét)
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function useGeofencingCamera(
  defaultBranchLat = 21.0285,
  defaultBranchLng = 105.8542,
  allowedRadius = 200
) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<GpsLocation | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. Tắt hoàn toàn camera và giải phóng tài nguyên phần cứng
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.error("Lỗi khi dừng track camera:", e);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const vidStream = videoRef.current.srcObject as MediaStream;
        vidStream.getTracks?.().forEach((track) => {
          try {
            track.stop();
          } catch (e) {}
        });
        videoRef.current.srcObject = null;
      }
    }

    setStream(null);
  }, []);

  // 2. Khởi tạo Camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      // Dừng luồng cũ nếu có
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError("Trình duyệt không hỗ trợ hoặc chặn quyền truy cập máy ảnh.");
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      setCameraError(
        err.name === "NotAllowedError"
          ? "Trình duyệt chưa được cấp quyền truy cập máy ảnh."
          : "Không thể kết nối máy ảnh: " + (err.message || "Lỗi không xác định")
      );
    }
  }, []);

  // 3. Chụp ảnh từ Camera -> Base64 JPEG
  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Lật ngược nếu camera trước (mirror)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.85);
  }, []);

  // 4. Lấy tọa độ GPS thiết bị hoặc tọa độ văn phòng mặc định
  const useOfficeFallbackLocation = useCallback(() => {
    setGpsLocation({
      latitude: defaultBranchLat,
      longitude: defaultBranchLng,
      accuracy: 5,
    });
    setGpsError(null);
    setIsGpsLoading(false);
  }, [defaultBranchLat, defaultBranchLng]);

  const refreshGps = useCallback(() => {
    setIsGpsLoading(true);
    setGpsError(null);

    if (!("geolocation" in navigator)) {
      setGpsError("Thiết bị hoặc trình duyệt không hỗ trợ định vị GPS.");
      setIsGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setIsGpsLoading(false);
      },
      (error) => {
        let msg = "Không thể xác định vị trí hiện tại.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Vui lòng cho phép quyền truy cập vị trí (GPS) trên trình duyệt.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Tín hiệu GPS không khả dụng hoặc bị chặn.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Quá thời gian lấy vị trí GPS.";
        }
        setGpsError(msg);
        setIsGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // 5. Tự động khởi động khi mount và TẮT CAMERA TRIỆT ĐỂ khi unmount / thoát trang
  useEffect(() => {
    startCamera();
    refreshGps();

    return () => {
      // Dừng toàn bộ tracks khi unmount / rời trang
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (e) {}
        });
        streamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const vidStream = videoRef.current.srcObject as MediaStream;
        vidStream.getTracks?.().forEach((track) => {
          try {
            track.stop();
          } catch (e) {}
        });
        videoRef.current.srcObject = null;
      }
    };
  }, [startCamera, refreshGps]);

  // Tính khoảng cách đến chi nhánh
  const distanceToBranch = gpsLocation
    ? calculateHaversineDistance(
        gpsLocation.latitude,
        gpsLocation.longitude,
        defaultBranchLat,
        defaultBranchLng
      )
    : null;

  const isWithinGeofence = distanceToBranch !== null ? distanceToBranch <= allowedRadius : false;

  return {
    videoRef,
    stream,
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
  };
}
