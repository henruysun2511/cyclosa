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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Bổ nhiệm & Luân chuyển công tác 3 chiều
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Ngày hiệu lực & Lý do */}
          <div className="grid grid-cols-2 gap-3">
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
              <Select value={changeReason} onValueChange={(v) => v && setChangeReason(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lý do" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROMOTION">Bổ nhiệm thăng chức (Promotion)</SelectItem>
                  <SelectItem value="TRANSFER">Luân chuyển điều động (Transfer)</SelectItem>
                  <SelectItem value="RESTRUCTURE">Tái cơ cấu phòng ban (Restructure)</SelectItem>
                  <SelectItem value="HIRE">Tiếp nhận ban đầu (Hire)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chiều 1: Phòng ban */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-blue-700">
              <Building2 className="h-3.5 w-3.5" />
              Chiều 1: Phòng ban trực thuộc mới <span className="text-destructive">*</span>
            </Label>
            <Select value={departmentId} onValueChange={(v) => v && setDepartmentId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban công tác..." />
              </SelectTrigger>
              <SelectContent>
                {deptData?.items?.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chiều 2: Chi nhánh */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-emerald-700">
              <MapPin className="h-3.5 w-3.5" />
              Chiều 2: Chi nhánh / Văn phòng làm việc (GPS) <span className="text-destructive">*</span>
            </Label>
            <Select value={branchId} onValueChange={(v) => v && setBranchId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh làm việc..." />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} ({b.code}) - {b.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chiều 3: Chức danh & Cấp bậc */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-amber-700">
                <Briefcase className="h-3.5 w-3.5" />
                Chiều 3: Chức danh công việc <span className="text-destructive">*</span>
              </Label>
              <Select value={jobTitleId} onValueChange={(v) => v && setJobTitleId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chức danh..." />
                </SelectTrigger>
                <SelectContent>
                  {titleData?.items?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-amber-700">
                <Award className="h-3.5 w-3.5" />
                Cấp bậc thẩm quyền <span className="text-destructive">*</span>
              </Label>
              <Select value={jobLevelId} onValueChange={(v) => v && setJobLevelId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cấp bậc..." />
                </SelectTrigger>
                <SelectContent>
                  {levelData?.items?.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
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
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại hình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Toàn thời gian chính thức (Full-time)</SelectItem>
                <SelectItem value="PART_TIME">Bán thời gian (Part-time)</SelectItem>
                <SelectItem value="INTERN">Thực tập sinh (Intern)</SelectItem>
                <SelectItem value="CONTRACTOR">Cộng tác viên / Thuê ngoài (Contractor)</SelectItem>
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
              {isLoading ? "Đang xử lý..." : "Xác nhận Điều chuyển"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

