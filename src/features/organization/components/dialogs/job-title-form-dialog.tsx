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
  useCreateJobTitleMutation,
  useUpdateJobTitleMutation,
} from "../../api/organization-api";
import type { JobTitle } from "../../types/organization.types";

interface JobTitleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: JobTitle | null;
  companyId: string;
  onSuccess?: () => void;
}

export function JobTitleFormDialog({
  open,
  onOpenChange,
  jobTitle,
  companyId,
  onSuccess,
}: JobTitleFormDialogProps) {
  const isEditing = Boolean(jobTitle);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createJobTitle, { isLoading: isCreating }] = useCreateJobTitleMutation();
  const [updateJobTitle, { isLoading: isUpdating }] = useUpdateJobTitleMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (jobTitle) {
      setCode(jobTitle.code);
      setName(jobTitle.name);
      setDescription(jobTitle.description || "");
    } else {
      setCode("");
      setName("");
      setDescription("");
    }
  }, [jobTitle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên chức danh");
      return;
    }
    if (!isEditing && !code.trim()) {
      toast.error("Vui lòng nhập mã chức danh");
      return;
    }

    try {
      if (isEditing && jobTitle) {
        await updateJobTitle({
          id: jobTitle.id,
          body: {
            name: name.trim(),
            description: description.trim() || undefined,
          },
        }).unwrap();
        toast.success("Cập nhật chức danh thành công!");
      } else {
        await createJobTitle({
          companyId,
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
        }).unwrap();
        toast.success("Tạo mới chức danh thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi khi lưu chức danh!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Chức danh Công việc" : "Thêm mới Chức danh Công việc"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="title-code">Mã chức danh *</Label>
            <Input
              id="title-code"
              placeholder="DEV_SR"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isEditing}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title-name">Tên chức danh công việc *</Label>
            <Input
              id="title-name"
              placeholder="Kỹ sư Phần mềm cao cấp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title-desc">Mô tả tiêu chuẩn và nhiệm vụ công việc</Label>
            <Textarea
              id="title-desc"
              rows={3}
              placeholder="Yêu cầu tối thiểu 4 năm kinh nghiệm phát triển phần mềm..."
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
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo chức danh"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

