"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { RoleResponse } from "../types/role.types";

export interface RoleCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleResponse[];
  defaultCloneRoleId?: string;
  onSubmit: (data: {
    name: string;
    code: string;
    description?: string;
    cloneFromRoleId?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function RoleCreateDialog({
  open,
  onOpenChange,
  roles,
  defaultCloneRoleId = "none",
  onSubmit,
  isSubmitting = false,
}: RoleCreateDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [cloneFromRoleId, setCloneFromRoleId] = useState("none");

  useEffect(() => {
    if (open) {
      setName("");
      setCode("");
      setDescription("");
      setCloneFromRoleId(defaultCloneRoleId || "none");
    }
  }, [open, defaultCloneRoleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error("Vui lòng nhập tên và mã vai trò");
      return;
    }

    await onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      cloneFromRoleId: cloneFromRoleId !== "none" ? cloneFromRoleId : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Thêm Vai trò Mới vào Hệ thống
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-2 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-foreground block">
              Tên vai trò <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Trưởng Nhóm Dự Án (Tech Lead)"
              disabled={isSubmitting}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground block">
              Mã định danh vai trò (Role Code) <span className="text-destructive">*</span>
            </label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: TECH_LEAD"
              disabled={isSubmitting}
              className="h-8 text-xs font-mono uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground block">
              Kế thừa cấu hình quyền ban đầu từ
            </label>
            <select
              value={cloneFromRoleId}
              onChange={(e) => setCloneFromRoleId(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
            >
              <option value="none">-- Không sao chép (để trống) --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-foreground block">
              Mô tả trách nhiệm & phạm vi
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú tóm tắt trách nhiệm của vai trò này..."
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              <span>Khởi tạo vai trò</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
