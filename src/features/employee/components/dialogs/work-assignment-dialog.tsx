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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreateWorkAssignmentMutation } from "../../api/employee-api";
import {
  useGetDepartmentsQuery,
  useGetBranchesByCompanyQuery,
  useGetJobTitlesQuery,
  useGetJobLevelsQuery,
} from "@/features/organization/api";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_LABELS,
  WORK_CHANGE_REASONS,
} from "../../constants/employee.constants";
import type { EmploymentType } from "../../types/employee.types";

interface WorkAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  companyId: string;
  onSuccess?: () => void;
}

export function WorkAssignmentDialog({
  open,
  onOpenChange,
  employeeId,
  companyId,
  onSuccess,
}: WorkAssignmentDialogProps) {
  const [createAssignment, { isLoading }] = useCreateWorkAssignmentMutation();

  // Danh mục 3 chiều
  const { data: deptData } = useGetDepartmentsQuery(
    { companyId, size: 100 },
    { skip: !companyId || !open }
  );
  const { data: branches = [] } = useGetBranchesByCompanyQuery(companyId, {
    skip: !companyId || !open,
  });
  const { data: titleData } = useGetJobTitlesQuery(
    { companyId, size: 100 },
    { skip: !companyId || !open }
  );
  const { data: levelData } = useGetJobLevelsQuery(
    { companyId, size: 100 },
    { skip: !companyId || !open }
  );

  // Form states
  const [departmentId, setDepartmentId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [jobTitleId, setJobTitleId] = useState("");
  const [jobLevelId, setJobLevelId] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("FULL_TIME");
  const [changeReason, setChangeReason] = useState("TRANSFER");
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentId || !branchId || !jobTitleId || !jobLevelId) {
      toast.error("Vui lòng chọn đầy đủ bộ 3 chiều: Phòng ban, Chi nhánh, Chức danh & Cấp bậc!");
      return;
    }
    if (!effectiveFrom) {
      toast.error("Vui lòng chọn ngày quyết định có hiệu lực!");
      return;
    }

    try {
      await createAssignment({
        employeeId,
        body: {
          departmentId,
          branchId,
          jobTitleId,
          jobLevelId,
          employmentType,
          changeReason,
          effectiveFrom,
        },
      }).unwrap();

      toast.success("Bổ nhiệm / Luân chuyển công tác thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Không thể thực hiện luân chuyển công tác!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[92vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Bổ nhiệm & Luân chuyển công tác 3 chiều
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Điều chuyển nhân sự giữa các phòng ban, chi nhánh văn phòng hoặc thăng tiến chức danh cấp bậc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Ngày hiệu lực & Lý do */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Ngày bắt đầu có hiệu lực <span className="text-destructive">*</span>
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
              <Label className="text-xs font-semibold">
                Lý do biến động <span className="text-destructive">*</span>
              </Label>
              <Select value={changeReason} onValueChange={(v) => v && setChangeReason(v)}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue placeholder="Chọn lý do">
                    {(val: string) => {
                      const r = WORK_CHANGE_REASONS.find((i) => i.value === val);
                      return r ? r.label : val;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {WORK_CHANGE_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value} label={r.label}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chiều 1: Phòng ban */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Chiều 1: Phòng ban trực thuộc mới <span className="text-destructive">*</span>
            </Label>
            <Select value={departmentId} onValueChange={(v) => v && setDepartmentId(v)}>
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Chọn phòng ban công tác...">
                  {(val: string) => {
                    const d = deptData?.items?.find((i) => i.id === val);
                    return d ? `${d.name} (${d.code})` : val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {deptData?.items?.map((d) => (
                  <SelectItem key={d.id} value={d.id} label={d.name}>
                    {d.name} ({d.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chiều 2: Chi nhánh */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Chiều 2: Chi nhánh / Văn phòng làm việc (GPS) <span className="text-destructive">*</span>
            </Label>
            <Select value={branchId} onValueChange={(v) => v && setBranchId(v)}>
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Chọn chi nhánh làm việc...">
                  {(val: string) => {
                    const b = branches.find((i) => i.id === val);
                    return b ? `${b.name} (${b.code})` : val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id} label={b.name}>
                    {b.name} ({b.code}) - {b.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chiều 3: Chức danh & Cấp bậc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Chiều 3: Chức danh công việc <span className="text-destructive">*</span>
              </Label>
              <Select value={jobTitleId} onValueChange={(v) => v && setJobTitleId(v)}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue placeholder="Chọn chức danh...">
                    {(val: string) => {
                      const t = titleData?.items?.find((i) => i.id === val);
                      return t ? `${t.name} (${t.code})` : val;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {titleData?.items?.map((t) => (
                    <SelectItem key={t.id} value={t.id} label={t.name}>
                      {t.name} ({t.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Cấp bậc thẩm quyền <span className="text-destructive">*</span>
              </Label>
              <Select value={jobLevelId} onValueChange={(v) => v && setJobLevelId(v)}>
                <SelectTrigger className="w-full h-9 text-xs">
                  <SelectValue placeholder="Chọn cấp bậc...">
                    {(val: string) => {
                      const l = levelData?.items?.find((i) => i.id === val);
                      return l ? `${l.name} (Bậc ${l.rankOrder})` : val;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {levelData?.items?.map((l) => (
                    <SelectItem key={l.id} value={l.id} label={l.name}>
                      {l.name} (Bậc {l.rankOrder})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loại hình hợp đồng */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Loại hình lao động</Label>
            <Select
              value={employmentType}
              onValueChange={(val) => val && setEmploymentType(val as EmploymentType)}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Chọn loại hình">
                  {(val: string) => EMPLOYMENT_TYPE_LABELS[val] || val}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPE_OPTIONS.map((e) => (
                  <SelectItem key={e.value} value={e.value} label={e.label}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                "Xác nhận Điều chuyển"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
