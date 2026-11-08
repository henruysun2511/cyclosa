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
import { UserPlus, Building2, MapPin, Briefcase, Award, ShieldAlert, CreditCard } from "lucide-react";
import { useCreateEmployeeMutation } from "../../api/employee-api";
import {
  useGetDepartmentsQuery,
  useGetBranchesByCompanyQuery,
  useGetJobTitlesQuery,
  useGetJobLevelsQuery,
} from "@/features/organization/api";
import type { CreateEmployeeInput, EmploymentType, Gender } from "../../types/employee.types";

interface EmployeeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onSuccess?: () => void;
}

export function EmployeeCreateDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: EmployeeCreateDialogProps) {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  // Nạp danh mục tổ chức 3 chiều của công ty
  const { data: deptData } = useGetDepartmentsQuery({ companyId, size: 100 }, { skip: !companyId });
  const { data: branches = [] } = useGetBranchesByCompanyQuery(companyId, { skip: !companyId });
  const { data: titleData } = useGetJobTitlesQuery({ companyId, size: 100 }, { skip: !companyId });
  const { data: levelData } = useGetJobLevelsQuery({ companyId, size: 100 }, { skip: !companyId });

  // Form states
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("1995-01-01");
  const [gender, setGender] = useState<Gender>("MALE");
  const [phone, setPhone] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [address, setAddress] = useState("");

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [hasProbation, setHasProbation] = useState(true);
  const [probationMonths, setProbationMonths] = useState("2");

  // 3 chiều công tác
  const [departmentId, setDepartmentId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [jobTitleId, setJobTitleId] = useState("");
  const [jobLevelId, setJobLevelId] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("FULL_TIME");

  // Pháp lý & User
  const [identityNumber, setIdentityNumber] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [createSystemUser, setCreateSystemUser] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const departments = deptData?.items || [];
  const jobTitles = titleData?.items || [];
  const jobLevels = levelData?.items || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lastName.trim() || !firstName.trim()) {
      toast.error("Vui lòng nhập đầy đủ họ và tên nhân viên!");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ!");
      return;
    }
    if (!departmentId || !branchId || !jobTitleId || !jobLevelId) {
      toast.error("Vui lòng chọn đầy đủ Phòng ban, Chi nhánh, Chức danh và Cấp bậc!");
      return;
    }

    let calculatedProbationEnd: string | undefined = undefined;
    if (hasProbation) {
      const start = new Date(startDate);
      start.setMonth(start.getMonth() + parseInt(probationMonths, 10));
      calculatedProbationEnd = start.toISOString().split("T")[0];
    }

    const payload: CreateEmployeeInput = {
      companyId,
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      dateOfBirth,
      gender,
      phone: phone.trim(),
      personalEmail: personalEmail.trim() || undefined,
      address: address.trim() || undefined,
      startDate,
      probationEndDate: calculatedProbationEnd,
      personalTaxCode: taxCode.trim() || undefined,

      identityDocumentType: "CITIZEN_ID",
      identityDocumentNumber: identityNumber.trim() || undefined,
      identityIssueDate: new Date().toISOString().split("T")[0],
      identityIssuePlace: "Cục CSQLHC về TTXH",

      departmentId,
      branchId,
      jobTitleId,
      jobLevelId,
      employmentType,

      createSystemUser,
      userEmail: createSystemUser ? (userEmail.trim() || personalEmail.trim()) : undefined,
    };

    try {
      await createEmployee(payload).unwrap();
      toast.success("Tiếp nhận nhân sự mới thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi khi tiếp nhận nhân sự!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-bold text-lg">
            <UserPlus className="h-5 w-5" />
            Tiếp nhận Nhân sự Mới (Thử việc / Chính thức)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Phần 1: Thông tin cá nhân & liên hệ */}
          <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              1. Thông tin cá nhân & Lý lịch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Họ và tên đệm *</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nguyễn Văn"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Tên nhân viên *</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="An"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Giới tính</Label>
                <Select value={gender} onValueChange={(v) => v && setGender(v as Gender)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Ngày sinh *</Label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Số điện thoại *</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Email cá nhân</Label>
                <Input
                  type="email"
                  value={personalEmail}
                  onChange={(e) => {
                    setPersonalEmail(e.target.value);
                    if (!userEmail) setUserEmail(e.target.value);
                  }}
                  placeholder="an.nguyen@gmail.com"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Địa chỉ thường trú / Nơi ở hiện tại</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số 12 Cầu Giấy, P. Dịch Vọng, Cầu Giấy, Hà Nội"
              />
            </div>
          </div>

          {/* Phần 2: Phân công công tác 3 chiều */}
          <div className="space-y-3 p-4 rounded-lg bg-blue-50/50 border border-blue-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              2. Phân công Công tác 3 Chiều Độc lập
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  Chiều 1: Phòng ban trực thuộc *
                </Label>
                <Select value={departmentId} onValueChange={(v) => setDepartmentId(v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Chiều 2: Chi nhánh làm việc (Chấm công GPS) *
                </Label>
                <Select value={branchId} onValueChange={(v) => setBranchId(v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chi nhánh..." />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  Chiều 3: Chức danh công việc *
                </Label>
                <Select value={jobTitleId} onValueChange={(v) => setJobTitleId(v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức danh..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  Cấp bậc chuyên môn *
                </Label>
                <Select value={jobLevelId} onValueChange={(v) => setJobLevelId(v || "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp bậc..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobLevels.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name} (Bậc {l.rankOrder})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Loại hình lao động</Label>
                <Select value={employmentType} onValueChange={(v) => v && setEmploymentType(v as EmploymentType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Toàn thời gian</SelectItem>
                    <SelectItem value="PART_TIME">Bán thời gian</SelectItem>
                    <SelectItem value="INTERN">Thực tập sinh</SelectItem>
                    <SelectItem value="CONTRACTOR">Cộng tác viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-blue-200/60">
              <div>
                <Label className="text-xs">Ngày bắt đầu làm việc *</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-xs">Thời gian thử việc</Label>
                <Select value={hasProbation ? probationMonths : "0"} onValueChange={(v) => {
                  if (!v || v === "0") {
                    setHasProbation(false);
                  } else {
                    setHasProbation(true);
                    setProbationMonths(v);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Không thử việc (Chính thức)</SelectItem>
                    <SelectItem value="1">1 Tháng (30 ngày)</SelectItem>
                    <SelectItem value="2">2 Tháng (60 ngày)</SelectItem>
                    <SelectItem value="3">3 Tháng (90 ngày)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Số CCCD / Hộ chiếu</Label>
                <Input
                  value={identityNumber}
                  onChange={(e) => setIdentityNumber(e.target.value)}
                  placeholder="001095012345"
                />
              </div>
            </div>
          </div>

          {/* Phần 3: Tài khoản & Hệ thống */}
          <div className="space-y-3 p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              3. Tài khoản đăng nhập hệ thống (User)
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="createSystemUser"
                checked={createSystemUser}
                onChange={(e) => setCreateSystemUser(e.target.checked)}
                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="createSystemUser" className="text-xs font-medium cursor-pointer text-slate-700">
                Tự động cấp tài khoản đăng nhập hệ thống và gửi email đặt mật khẩu kích hoạt (48h)
              </label>
            </div>

            {createSystemUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <Label className="text-xs">Email đăng nhập *</Label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="email.nhanvien@congty.com"
                    required={createSystemUser}
                  />
                </div>
                <div>
                  <Label className="text-xs">Mã số thuế TNCN (Tùy chọn)</Label>
                  <Input
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="8012345678"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              <UserPlus className="h-4 w-4" />
              {isLoading ? "Đang xử lý tiếp nhận..." : "Xác nhận Tiếp nhận Nhân sự"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

