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
import { toast } from "sonner";
import { Building2, MapPin, Briefcase, Award } from "lucide-react";
import { useCreateWorkAssignmentMutation } from "../../api/employee-api";
import {
  useGetDepartmentsQuery,
  useGetBranchesByCompanyQuery,
  useGetJobTitlesQuery,
  useGetJobLevelsQuery,
} from "@/features/organization/api";
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
  const { data: deptData } = useGetDepartmentsQuery({ companyId, size: 100 }, { skip: !companyId || !open });
  const { data: branches = [] } = useGetBranchesByCompanyQuery(companyId, { skip: !companyId || !open });
  const { data: titleData } = useGetJobTitlesQuery({ companyId, size: 100 }, { skip: !companyId || !open });
  const { data: levelData } = useGetJobLevelsQuery({ companyId, size: 100 }, { skip: !companyId || !open });

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
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể thực hiện luân chuyển công tác!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[92vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Bổ nhiệm & Luân chuyển công tác 3 chiều
          </DialogTitle>
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
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Lý do biến động <span className="text-destructive">*</span>
              </Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
              >
                <option value="PROMOTION">Bổ nhiệm thăng chức (Promotion)</option>
                <option value="TRANSFER">Luân chuyển điều động (Transfer)</option>
                <option value="RESTRUCTURE">Tái cơ cấu phòng ban (Restructure)</option>
                <option value="HIRE">Tiếp nhận ban đầu (Hire)</option>
              </select>
            </div>
          </div>

          {/* Chiều 1: Phòng ban */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-blue-700">
              <Building2 className="h-3.5 w-3.5" />
              Chiều 1: Phòng ban trực thuộc mới <span className="text-destructive">*</span>
            </Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">-- Chọn phòng ban công tác --</option>
              {deptData?.items?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Chiều 2: Chi nhánh */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-emerald-700">
              <MapPin className="h-3.5 w-3.5" />
              Chiều 2: Chi nhánh / Văn phòng làm việc (GPS) <span className="text-destructive">*</span>
            </Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              required
            >
              <option value="">-- Chọn chi nhánh làm việc --</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code}) - {b.address}
                </option>
              ))}
            </select>
          </div>

          {/* Chiều 3: Chức danh & Cấp bậc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-amber-700">
                <Briefcase className="h-3.5 w-3.5" />
                Chiều 3: Chức danh công việc <span className="text-destructive">*</span>
              </Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                value={jobTitleId}
                onChange={(e) => setJobTitleId(e.target.value)}
                required
              >
                <option value="">-- Chọn chức danh --</option>
                {titleData?.items?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-amber-700">
                <Award className="h-3.5 w-3.5" />
                Cấp bậc thẩm quyền <span className="text-destructive">*</span>
              </Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                value={jobLevelId}
                onChange={(e) => setJobLevelId(e.target.value)}
                required
              >
                <option value="">-- Chọn cấp bậc --</option>
                {levelData?.items?.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} (Bậc {l.rankOrder})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loại hình hợp đồng */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Loại hình lao động</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            >
              <option value="FULL_TIME">Toàn thời gian chính thức (Full-time)</option>
              <option value="PART_TIME">Bán thời gian (Part-time)</option>
              <option value="INTERN">Thực tập sinh (Intern)</option>
              <option value="CONTRACTOR">Cộng tác viên / Thuê ngoài (Contractor)</option>
            </select>
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
              {isLoading ? "Đang xử lý..." : "Xác nhận Điều chuyển"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

