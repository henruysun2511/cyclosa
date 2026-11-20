"use client";

import React, { useState } from "react";
import { Users, CheckSquare, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { OrientationSessionDto } from "../../types/onboarding.types";

interface BatchAttendanceDialogProps {
  session: OrientationSessionDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (attendedEmployeeIds: string[], notes?: string) => Promise<void>;
}

export function BatchAttendanceDialog({
  session,
  open,
  onOpenChange,
  onConfirm,
}: BatchAttendanceDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    session?.attendeeEmployeeIds || []
  );
  const [prevSession, setPrevSession] = useState(session);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session !== prevSession) {
    setPrevSession(session);
    setSelectedIds(session?.attendeeEmployeeIds || []);
  }

  if (!session) return null;

  const attendeeIds = session.attendeeEmployeeIds || [];

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === attendeeIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...attendeeIds]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(selectedIds, notes.trim() || undefined);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <DialogTitle className="text-sm font-bold text-foreground">
              Điểm danh Lớp Đào tạo Định hướng
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Buổi: <strong className="text-foreground">{session.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="flex items-center justify-between pb-1 border-b border-border">
            <span className="text-xs font-semibold text-foreground">
              Danh sách Học viên ({selectedIds.length}/{attendeeIds.length} có mặt)
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-7 text-xs text-primary hover:text-primary/90"
            >
              {selectedIds.length === attendeeIds.length
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả có mặt"}
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {attendeeIds.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">
                Chưa có học viên nào được ghi danh vào buổi học này.
              </p>
            ) : (
              attendeeIds.map((empId, idx) => {
                const isChecked = selectedIds.includes(empId);
                const empName = session.attendeeNames?.[idx] || `Học viên ID ${empId}`;
                return (
                  <div
                    key={empId}
                    onClick={() => handleToggle(empId)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-pointer transition-colors text-xs select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium text-foreground">{empName}</span>
                    </div>
                    {isChecked ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                      >
                        Có mặt
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground"
                      >
                        Vắng mặt
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <p className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border">
            ℹ️ Khi lưu điểm danh, hệ thống sẽ tự động hoàn thành công việc
            <strong> Văn hóa & Định hướng (ORIENTATION)</strong> trong tiến trình hội nhập của các học viên có mặt.
          </p>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Ghi chú buổi đào tạo</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhận xét tinh thần học tập, câu hỏi thảo luận nổi bật..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Đang lưu..." : "Xác nhận Điểm danh"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

