"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useChangeEmployeeStatusMutation } from "../../api/employee-api";
import {
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_STATUS_LABELS,
} from "../../constants/employee.constants";
import type { EmployeeStatus } from "../../types/employee.types";

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  currentStatus?: EmployeeStatus;
  onSuccess?: () => void;
}

export function StatusChangeDialog({
  open,
  onOpenChange,
  employeeId,
  currentStatus,
  onSuccess,
}: StatusChangeDialogProps) {
  const [changeStatus, { isLoading }] = useChangeEmployeeStatusMutation();

  const [status, setStatus] = useState<EmployeeStatus>(
    currentStatus === "ACTIVE" ? "ON_LEAVE" : "ACTIVE"
  );
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveFrom) {
      toast.error("Vui lòng chọn ngày quyết định có hiệu lực!");
      return;
    }

    try {
      await changeStatus({
        employeeId,
        body: {
          status,
          effectiveFrom,
          note: note.trim() || undefined,
        },
      }).unwrap();

      toast.success("Thay đổi trạng thái làm việc của nhân sự thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Không thể chuyển trạng thái làm việc!");
    }
  };

  const statusOptions = EMPLOYEE_STATUS_OPTIONS.filter((o) => o.value !== "ALL");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-[90vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Thay đổi trạng thái làm việc nhân sự
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cập nhật tình trạng công tác thực tế của nhân sự theo quyết định nhân sự hoặc quy định BHXH.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Trạng thái mới <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={(val) => val && setStatus(val as EmployeeStatus)}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Chọn trạng thái">
                  {(val: string) => EMPLOYEE_STATUS_LABELS[val] || val}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Ngày có hiệu lực <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Lý do / Căn cứ quyết định biến động</Label>
            <Textarea
              rows={3}
              placeholder="Ghi rõ lý do điều chỉnh trạng thái (ví dụ: Nghỉ sinh theo chế độ BHXH 6 tháng, Thôi việc theo nguyện vọng cá nhân...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận chuyển trạng thái"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
