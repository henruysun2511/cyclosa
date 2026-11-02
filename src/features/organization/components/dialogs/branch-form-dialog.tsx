"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "../../api/organization-api";
import type { Branch } from "../../types/organization.types";

interface BranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: Branch | null;
  regionId: string;
  onSuccess?: () => void;
}

export function BranchFormDialog({
  open,
  onOpenChange,
  branch,
  regionId,
  onSuccess,
}: BranchFormDialogProps) {
  const isEditing = Boolean(branch);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [attendanceRadiusMeters, setAttendanceRadiusMeters] = useState(100);
  const [isActive, setIsActive] = useState(true);

  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (branch) {
      setCode(branch.code);
      setName(branch.name);
      setAddress(branch.address || "");
      setLatitude(branch.latitude ? String(branch.latitude) : "");
      setLongitude(branch.longitude ? String(branch.longitude) : "");
      setAttendanceRadiusMeters(branch.attendanceRadiusMeters || 100);
      setIsActive(branch.isActive);
    } else {
      setCode("");
      setName("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setAttendanceRadiusMeters(100);
      setIsActive(true);
    }
  }, [branch, open]);

  // Lấy tọa độ GPS hiện tại từ trình duyệt
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ Geolocation!");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(7));
        setLongitude(pos.coords.longitude.toFixed(7));
        toast.success("Đã lấy tọa độ GPS vị trí hiện tại của bạn!");
      },
      () => {
        toast.error("Không thể lấy tọa độ GPS từ trình duyệt!");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên chi nhánh");
      return;
    }
    if (!isEditing && !code.trim()) {
      toast.error("Vui lòng nhập mã chi nhánh");
      return;
    }

    const lat = latitude ? parseFloat(latitude) : undefined;
    const lng = longitude ? parseFloat(longitude) : undefined;

    try {
      if (isEditing && branch) {
        await updateBranch({
          id: branch.id,
          body: {
            name: name.trim(),
            address: address.trim() || undefined,
            latitude: lat,
            longitude: lng,
            attendanceRadiusMeters,
            isActive,
          },
        }).unwrap();
        toast.success("Cập nhật chi nhánh thành công!");
      } else {
        await createBranch({
          regionId,
          code: code.trim().toUpperCase(),
          name: name.trim(),
          address: address.trim() || undefined,
          latitude: lat,
          longitude: lng,
          attendanceRadiusMeters,
        }).unwrap();
        toast.success("Tạo mới chi nhánh thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi khi lưu chi nhánh!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {isEditing ? "Chỉnh sửa Chi nhánh / Văn phòng" : "Thêm mới Chi nhánh / Văn phòng"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-1">
              <Label htmlFor="branch-code">Mã chi nhánh *</Label>
              <Input
                id="branch-code"
                placeholder="BR_HN_01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isEditing}
                required
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="branch-name">Tên chi nhánh / văn phòng *</Label>
              <Input
                id="branch-name"
                placeholder="Chi nhánh Hà Nội"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="branch-address">Địa chỉ chi nhánh</Label>
            <Input
              id="branch-address"
              placeholder="Số 1 Thái Hà, Đống Đa, Hà Nội"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Tọa độ GPS Geofence */}
          <div className="p-3 bg-slate-50/80 rounded-lg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-primary" />
                Cấu hình Geofence Chấm công GPS
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2 text-primary"
                onClick={handleGetCurrentLocation}
              >
                Lấy GPS hiện tại
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="branch-lat" className="text-xs">Vĩ độ (Latitude)</Label>
                <Input
                  id="branch-lat"
                  type="number"
                  step="0.0000001"
                  placeholder="21.016938"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="branch-lng" className="text-xs">Kinh độ (Longitude)</Label>
                <Input
                  id="branch-lng"
                  type="number"
                  step="0.0000001"
                  placeholder="105.783636"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="branch-radius" className="text-xs">
                Bán kính cho phép chấm công: <strong>{attendanceRadiusMeters}m</strong>
              </Label>
              <Input
                id="branch-radius"
                type="range"
                min={20}
                max={1000}
                step={10}
                value={attendanceRadiusMeters}
                onChange={(e) => setAttendanceRadiusMeters(Number(e.target.value))}
                className="h-8 cursor-pointer"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Trạng thái hoạt động</Label>
                <p className="text-xs text-muted-foreground">
                  Chi nhánh ngừng hoạt động sẽ không hiển thị khi phân công làm việc
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo chi nhánh"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

