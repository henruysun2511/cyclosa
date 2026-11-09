"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "../../schemas/employee.schema";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../../api/employee-api";
import {
  useGetDepartmentsQuery,
  useGetBranchesByCompanyQuery,
  useGetJobTitlesQuery,
  useGetJobLevelsQuery,
} from "@/features/organization/api";
import {
  GENDER_OPTIONS,
  GENDER_LABELS,
  EMPLOYMENT_TYPE_OPTIONS,
  EMPLOYMENT_TYPE_LABELS,
} from "../../constants/employee.constants";
import type { EmployeeDetail, EmploymentType } from "../../types/employee.types";

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeDetail | null;
  companyId: string;
  onSuccess?: () => void;
}

export function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  companyId,
  onSuccess,
}: EmployeeFormDialogProps) {
  const isEdit = Boolean(employee);

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const isSubmitting = isCreating || isUpdating;

  // Danh mục 3 chiều khi tạo mới
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

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      dateOfBirth: "",
      gender: "MALE",
      phone: "",
      personalEmail: "",
      address: "",
      startDate: new Date().toISOString().split("T")[0],
      probationEndDate: "",
      personalTaxCode: "",
      socialInsuranceNumber: "",
      portraitUrl: "",
      departmentId: "",
      branchId: "",
      jobTitleId: "",
      jobLevelId: "",
      employmentType: "FULL_TIME",
    },
  });

  useEffect(() => {
    if (open) {
      if (employee) {
        form.reset({
          lastName: employee.lastName || "",
          firstName: employee.firstName || "",
          dateOfBirth: employee.dateOfBirth || "",
          gender: employee.gender || "MALE",
          phone: employee.phone || "",
          personalEmail: employee.personalEmail || "",
          address: employee.address || "",
          startDate: employee.startDate || "",
          probationEndDate: employee.probationEndDate || "",
          personalTaxCode: employee.personalTaxCode || "",
          socialInsuranceNumber: employee.socialInsuranceNumber || "",
          portraitUrl: employee.portraitUrl || "",
          departmentId: employee.currentDepartmentId || "",
          branchId: employee.currentBranchId || "",
          jobTitleId: employee.currentJobTitleId || "",
          jobLevelId: employee.currentJobLevelId || "",
          employmentType: (employee.currentEmploymentType as EmploymentType) || "FULL_TIME",
        });
      } else {
        form.reset({
          lastName: "",
          firstName: "",
          dateOfBirth: "",
          gender: "MALE",
          phone: "",
          personalEmail: "",
          address: "",
          startDate: new Date().toISOString().split("T")[0],
          probationEndDate: "",
          personalTaxCode: "",
          socialInsuranceNumber: "",
          portraitUrl: "",
          departmentId: "",
          branchId: "",
          jobTitleId: "",
          jobLevelId: "",
          employmentType: "FULL_TIME",
        });
      }
    }
  }, [open, employee, form]);

  const onSubmit = async (values: EmployeeFormValues) => {
    if (!companyId) {
      toast.error("Vui lòng chọn công ty làm việc!");
      return;
    }

    try {
      if (isEdit && employee) {
        await updateEmployee({
          id: employee.id,
          body: {
            lastName: values.lastName,
            firstName: values.firstName,
            dateOfBirth: values.dateOfBirth,
            gender: values.gender,
            phone: values.phone,
            personalEmail: values.personalEmail || undefined,
            address: values.address || undefined,
            startDate: values.startDate || undefined,
            probationEndDate: values.probationEndDate || undefined,
            personalTaxCode: values.personalTaxCode || undefined,
            socialInsuranceNumber: values.socialInsuranceNumber || undefined,
            portraitUrl: values.portraitUrl || undefined,
          },
        }).unwrap();

        toast.success("Cập nhật thông tin nhân sự thành công!");
      } else {
        if (!values.departmentId || !values.branchId || !values.jobTitleId || !values.jobLevelId) {
          toast.error("Vui lòng chọn đầy đủ thông tin tổ chức 3 chiều (Phòng ban, Chi nhánh, Chức danh, Cấp bậc)!");
          return;
        }

        await createEmployee({
          companyId,
          departmentId: values.departmentId,
          branchId: values.branchId,
          jobTitleId: values.jobTitleId,
          jobLevelId: values.jobLevelId,
          employmentType: values.employmentType,
          lastName: values.lastName,
          firstName: values.firstName,
          dateOfBirth: values.dateOfBirth,
          gender: values.gender,
          phone: values.phone,
          personalEmail: values.personalEmail || undefined,
          address: values.address || undefined,
          startDate: values.startDate || new Date().toISOString().split("T")[0],
          probationEndDate: values.probationEndDate || undefined,
          personalTaxCode: values.personalTaxCode || undefined,
          socialInsuranceNumber: values.socialInsuranceNumber || undefined,
          portraitUrl: values.portraitUrl || undefined,
        }).unwrap();

        toast.success("Tiếp nhận và tạo mới hồ sơ nhân sự thành công!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Thao tác không thành công. Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[92vw] max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Chỉnh sửa hồ sơ nhân sự" : "Tiếp nhận nhân sự mới (Onboarding)"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? "Cập nhật các thông tin lý lịch cá nhân và pháp lý của nhân sự."
              : "Khai báo lý lịch và phân bổ tổ chức 3 chiều (Phòng ban, Chi nhánh, Chức danh)."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* PHẦN 1: THÔNG TIN LÝ LỊCH CÁ NHÂN */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
              1. Thông tin lý lịch cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Họ và tên đệm <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Nguyễn Văn"
                  {...form.register("lastName")}
                  className="h-9 text-xs"
                />
                {form.formState.errors.lastName && (
                  <p className="text-destructive text-[11px]">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Tên chính <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="An"
                  {...form.register("firstName")}
                  className="h-9 text-xs"
                />
                {form.formState.errors.firstName && (
                  <p className="text-destructive text-[11px]">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Ngày sinh <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  {...form.register("dateOfBirth")}
                  className="h-9 text-xs"
                />
                {form.formState.errors.dateOfBirth && (
                  <p className="text-destructive text-[11px]">
                    {form.formState.errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Giới tính <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Chọn giới tính">
                          {(val: string) => GENDER_LABELS[val] || val}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((g) => (
                          <SelectItem key={g.value} value={g.value} label={g.label}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Số điện thoại liên hệ <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="0912345678"
                  {...form.register("phone")}
                  className="h-9 text-xs"
                />
                {form.formState.errors.phone && (
                  <p className="text-destructive text-[11px]">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email cá nhân</Label>
                <Input
                  type="email"
                  placeholder="nguyenvanan@gmail.com"
                  {...form.register("personalEmail")}
                  className="h-9 text-xs"
                />
                {form.formState.errors.personalEmail && (
                  <p className="text-destructive text-[11px]">
                    {form.formState.errors.personalEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Địa chỉ thường trú / cư trú</Label>
              <Input
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                {...form.register("address")}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* PHẦN 2: TỔ CHỨC 3 CHIỀU (CHỈ KHI TẠO MỚI) */}
          {!isEdit && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
                2. Phân bổ tổ chức 3 chiều (Tổ chức - Không gian - Chức danh)
              </h3>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Chiều 1: Phòng ban trực thuộc <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
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
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Chiều 2: Chi nhánh / Văn phòng làm việc (GPS) <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={form.control}
                  name="branchId"
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
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
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Chiều 3: Chức danh công việc <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={form.control}
                    name="jobTitleId"
                    render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
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
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Cấp bậc thẩm quyền <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={form.control}
                    name="jobLevelId"
                    render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
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
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Loại hình lao động</Label>
                <Controller
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
              </div>
            </div>
          )}

          {/* PHẦN 3: THÔNG TIN PHÁP LÝ & HỢP ĐỒNG */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
              {isEdit ? "2. Pháp lý, BHXH & Ngày làm việc" : "3. Pháp lý, BHXH & Ngày làm việc"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mã số thuế TNCN</Label>
                <Input
                  placeholder="10 hoặc 13 chữ số"
                  {...form.register("personalTaxCode")}
                  className="h-9 text-xs"
                />
                {form.formState.errors.personalTaxCode && (
                  <p className="text-destructive text-[11px]">
                    {form.formState.errors.personalTaxCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mã số sổ BHXH</Label>
                <Input
                  placeholder="10 chữ số BHXH"
                  {...form.register("socialInsuranceNumber")}
                  className="h-9 text-xs"
                />
                {form.formState.errors.socialInsuranceNumber && (
                  <p className="text-destructive text-[11px]">
                    {form.formState.errors.socialInsuranceNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Ngày bắt đầu làm việc</Label>
                <Input
                  type="date"
                  {...form.register("startDate")}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hạn kết thúc thử việc</Label>
                <Input
                  type="date"
                  {...form.register("probationEndDate")}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Đường dẫn ảnh thẻ chân dung (URL)</Label>
              <Input
                placeholder="https://res.cloudinary.com/.../avatar.jpg"
                {...form.register("portraitUrl")}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : isEdit ? (
                "Lưu thay đổi"
              ) : (
                "Tiếp nhận nhân sự"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

