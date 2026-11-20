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
  useCreateJobLevelMutation,
  useUpdateJobLevelMutation,
} from "../../api/organization-api";
import type { JobLevel } from "../../types/organization.types";

interface JobLevelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobLevel?: JobLevel | null;
  companyId: string;
  onSuccess?: () => void;
}

export function JobLevelFormDialog({
  open,
  onOpenChange,
  jobLevel,
  companyId,
  onSuccess,
}: JobLevelFormDialogProps) {
  const isEditing = Boolean(jobLevel);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [rankOrder, setRankOrder] = useState<number>(1);

  const [createJobLevel, { isLoading: isCreating }] = useCreateJobLevelMutation();
  const [updateJobLevel, { isLoading: isUpdating }] = useUpdateJobLevelMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (jobLevel) {
      setCode(jobLevel.code);
      setName(jobLevel.name);
      setRankOrder(jobLevel.rankOrder);
    } else {
      setCode("");
      setName("");
      setRankOrder(1);
    }
  }, [jobLevel, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên cấp bậc");
      return;
    }
    if (!isEditing && !code.trim()) {
      toast.error("Vui lòng nhập mã cấp bậc");
      return;
    }
    if (rankOrder < 1) {
      toast.error("Thứ tự cấp bậc phải từ 1 trở lên");
      return;
    }

    try {
      if (isEditing && jobLevel) {
        await updateJobLevel({
          id: jobLevel.id,
          body: {
            name: name.trim(),
            rankOrder,
          },
        }).unwrap();
        toast.success("Cập nhật cấp bậc thành công!");
      } else {
        await createJobLevel({
          companyId,
          code: code.trim().toUpperCase(),
          name: name.trim(),
          rankOrder,
        }).unwrap();
        toast.success("Tạo mới cấp bậc thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi khi lưu cấp bậc!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Cấp bậc Thẩm quyền" : "Thêm mới Cấp bậc Thẩm quyền"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="level-code">Mã cấp bậc *</Label>
            <Input
              id="level-code"
              placeholder="LVL_04"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isEditing}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="level-name">Tên cấp bậc *</Label>
            <Input
              id="level-name"
              placeholder="Level 4 - Chuyên viên cao cấp (Senior)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="level-rank">Thứ tự thẩm quyền (Rank Order) *</Label>
            <Input
              id="level-rank"
              type="number"
              min={1}
              max={99}
              value={rankOrder}
              onChange={(e) => setRankOrder(Number(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Số 1 là cấp bậc thấp nhất (Intern), số càng lớn cấp bậc và thẩm quyền càng cao.
            </p>
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
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo cấp bậc"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

