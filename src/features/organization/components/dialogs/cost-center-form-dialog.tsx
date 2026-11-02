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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useCreateCostCenterMutation,
  useUpdateCostCenterMutation,
} from "../../api/organization-api";
import type { CostCenter } from "../../types/organization.types";

interface CostCenterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costCenter?: CostCenter | null;
  companyId: string;
  onSuccess?: () => void;
}

export function CostCenterFormDialog({
  open,
  onOpenChange,
  costCenter,
  companyId,
  onSuccess,
}: CostCenterFormDialogProps) {
  const isEditing = Boolean(costCenter);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createCostCenter, { isLoading: isCreating }] = useCreateCostCenterMutation();
  const [updateCostCenter, { isLoading: isUpdating }] = useUpdateCostCenterMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (costCenter) {
      setCode(costCenter.code);
      setName(costCenter.name);
      setDescription(costCenter.description || "");
    } else {
      setCode("");
      setName("");
      setDescription("");
    }
  }, [costCenter, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên trung tâm chi phí");
      return;
    }
    if (!isEditing && !code.trim()) {
      toast.error("Vui lòng nhập mã trung tâm chi phí");
      return;
    }

    try {
      if (isEditing && costCenter) {
        await updateCostCenter({
          id: costCenter.id,
          body: {
            name: name.trim(),
            description: description.trim() || undefined,
          },
        }).unwrap();
        toast.success("Cập nhật trung tâm chi phí thành công!");
      } else {
        await createCostCenter({
          companyId,
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
        }).unwrap();
        toast.success("Tạo mới trung tâm chi phí thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi khi lưu trung tâm chi phí!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Trung tâm Chi phí" : "Thêm mới Trung tâm Chi phí"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="cc-code">Mã trung tâm chi phí *</Label>
            <Input
              id="cc-code"
              placeholder="CC_TECH"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isEditing}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cc-name">Tên trung tâm chi phí *</Label>
            <Input
              id="cc-name"
              placeholder="Khối Công nghệ & Sản phẩm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cc-desc">Mô tả mục đích phân bổ ngân sách</Label>
            <Textarea
              id="cc-desc"
              rows={3}
              placeholder="Ngân sách hạch toán cho các chi phí hạ tầng máy chủ, R&D..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo trung tâm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

