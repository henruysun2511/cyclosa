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
import { toast } from "sonner";
import {
  useCreateRegionMutation,
  useUpdateRegionMutation,
} from "../../api/organization-api";
import type { Region } from "../../types/organization.types";

interface RegionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region?: Region | null;
  companyId: string;
  onSuccess?: () => void;
}

export function RegionFormDialog({
  open,
  onOpenChange,
  region,
  companyId,
  onSuccess,
}: RegionFormDialogProps) {
  const isEditing = Boolean(region);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const [createRegion, { isLoading: isCreating }] = useCreateRegionMutation();
  const [updateRegion, { isLoading: isUpdating }] = useUpdateRegionMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (region) {
      setCode(region.code);
      setName(region.name);
    } else {
      setCode("");
      setName("");
    }
  }, [region, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên khu vực");
      return;
    }
    if (!isEditing && !code.trim()) {
      toast.error("Vui lòng nhập mã khu vực");
      return;
    }

    try {
      if (isEditing && region) {
        await updateRegion({
          id: region.id,
          body: { name: name.trim() },
        }).unwrap();
        toast.success("Cập nhật khu vực thành công!");
      } else {
        await createRegion({
          companyId,
          code: code.trim().toUpperCase(),
          name: name.trim(),
        }).unwrap();
        toast.success("Tạo mới khu vực thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi khi lưu khu vực!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Khu vực / Vùng miền" : "Thêm mới Khu vực / Vùng miền"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="region-code">Mã khu vực *</Label>
            <Input
              id="region-code"
              placeholder="REG_NORTH"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isEditing}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="region-name">Tên khu vực *</Label>
            <Input
              id="region-name"
              placeholder="Khu vực Miền Bắc"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo khu vực"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

