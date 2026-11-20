"use client";

import React from "react";
import { MapPin, Navigation, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { GpsLocation } from "../../hooks/use-geofencing-camera";

interface GpsLocationCardProps {
  gpsLocation: GpsLocation | null;
  gpsError: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onUseOfficeLocation?: () => void;
  distanceToBranch: number | null;
  isWithinGeofence: boolean;
  allowedRadius: number;
  branchName?: string;
}

export function GpsLocationCard({
  gpsLocation,
  gpsError,
  isLoading,
  onRefresh,
  onUseOfficeLocation,
  distanceToBranch,
  isWithinGeofence,
  allowedRadius,
  branchName = "Văn phòng Trụ sở chính",
}: GpsLocationCardProps) {
  return (
    <Card className="shadow-xs border">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Navigation className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-semibold">Tọa độ & Phạm vi Geofencing</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onRefresh}
          disabled={isLoading}
          title="Cập nhật lại GPS"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-1 space-y-3">
        {isLoading ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : gpsError ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
            {onUseOfficeLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={onUseOfficeLocation}
                className="w-full text-xs h-8 border-dashed border-primary/50 text-primary hover:bg-primary/5"
              >
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                Dùng tọa độ văn phòng mặc định
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-muted/40 p-2">
                <span className="text-muted-foreground block text-[11px]">Vĩ độ (Lat):</span>
                <span className="font-mono font-medium">
                  {gpsLocation?.latitude.toFixed(6)}
                </span>
              </div>
              <div className="rounded-lg bg-muted/40 p-2">
                <span className="text-muted-foreground block text-[11px]">Kinh độ (Lng):</span>
                <span className="font-mono font-medium">
                  {gpsLocation?.longitude.toFixed(6)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-2.5 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{branchName}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Khoảng cách: <span className="font-semibold">{distanceToBranch ?? "--"} m</span> / Bán kính cho phép: {allowedRadius} m
                  </div>
                </div>
              </div>

              {isWithinGeofence ? (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 py-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Hợp lệ
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 py-1">
                  <AlertTriangle className="h-3 w-3" />
                  Ngoài vùng
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

