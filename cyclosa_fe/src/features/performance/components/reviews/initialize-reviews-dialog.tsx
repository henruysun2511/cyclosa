"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Users } from "lucide-react";
import type { PerformanceCycleDto } from "../../types/performance.types";

interface EmployeeOption {
  id: string;
  employeeCode: string;
  fullName: string;
  departmentName?: string;
}

interface InitializeReviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycles: PerformanceCycleDto[];
  defaultCycleId?: string;
  employees: EmployeeOption[];
  onSubmit: (cycleId: string, employeeIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function InitializeReviewsDialog({
  open,
  onOpenChange,
  cycles,
  defaultCycleId,
  employees,
  onSubmit,
  isLoading,
}: InitializeReviewsDialogProps) {
  const [selectedCycleId, setSelectedCycleId] = useState<string>(
    defaultCycleId || cycles[0]?.id || ""
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterText, setFilterText] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const kw = filterText.toLowerCase();
    return (
      emp.fullName.toLowerCase().includes(kw) ||
      emp.employeeCode.toLowerCase().includes(kw) ||
      (emp.departmentName && emp.departmentName.toLowerCase().includes(kw))
    );
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    if (!selectedCycleId || selectedIds.length === 0) return;
    await onSubmit(selectedCycleId, selectedIds);
    onOpenChange(false);
    setSelectedIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Khởi tạo phiếu đánh giá nhân sự</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tạo phiếu đánh giá mới cho các nhân sự trong kỳ. Hệ thống sẽ tự động gán Quản lý trực tiếp phụ trách chấm điểm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 flex-1 overflow-hidden flex flex-col">
          {/* Chọn kỳ đánh giá */}
          <div>
            <Label className="text-xs font-medium">Kỳ đánh giá áp dụng</Label>
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status === "ACTIVE" ? "Đang mở" : c.status})
                </option>
              ))}
            </select>
          </div>

          {/* Tìm kiếm nhân viên */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Tìm theo tên hoặc mã nhân viên..."
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* Danh sách nhân viên chọn */}
          <div className="border rounded-lg p-2 flex-1 overflow-y-auto space-y-2 min-h-[220px] max-h-[300px]">
            <div className="flex items-center justify-between pb-2 border-b text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    filteredEmployees.length > 0 &&
                    selectedIds.length === filteredEmployees.length
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="font-medium">Chọn tất cả ({filteredEmployees.length})</span>
              </div>
              <span>Đã chọn: {selectedIds.length}</span>
            </div>

            {filteredEmployees.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Không tìm thấy nhân viên phù hợp
              </div>
            ) : (
              filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => handleToggle(emp.id)}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={selectedIds.includes(emp.id)}
                      onCheckedChange={() => handleToggle(emp.id)}
                    />
                    <div>
                      <span className="font-medium text-foreground block">
                        {emp.fullName}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {emp.employeeCode} {emp.departmentName && `• ${emp.departmentName}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-8 text-xs"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={isLoading || selectedIds.length === 0 || !selectedCycleId}
            className="h-8 text-xs gap-1.5"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Khởi tạo {selectedIds.length} phiếu</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
