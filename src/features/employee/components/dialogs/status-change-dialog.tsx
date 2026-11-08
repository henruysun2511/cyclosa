"use client";

import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useChangeEmployeeStatusMutation } from "../../api/employee-api";
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
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể chuyển trạng thái làm việc!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Thay đổi trạng thái làm việc nhân sự
          </DialogTitle>
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
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Chính thức (Active) - Đang công tác</SelectItem>
                <SelectItem value="PROBATION">Thử việc (Probation)</SelectItem>
                <SelectItem value="ON_LEAVE">Nghỉ chế độ / Nghỉ thai sản (On Leave)</SelectItem>
                <SelectItem value="SUSPENDED">Tạm đình chỉ / Hoãn HĐLĐ (Suspended)</SelectItem>
                <SelectItem value="TERMINATED">Thôi việc / Chấm dứt HĐLĐ (Terminated)</SelectItem>
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
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Lý do / Căn cứ quyết định biến động</Label>
            <Textarea
              rows={3}
              placeholder="Ghi rõ lý do điều chỉnh trạng thái (ví dụ: Nghỉ sinh theo chế độ BHXH 6 tháng, Thôi việc theo nguyện vọng cá nhân...)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              {isLoading ? "Đang xử lý..." : "Xác nhận chuyển trạng thái"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

