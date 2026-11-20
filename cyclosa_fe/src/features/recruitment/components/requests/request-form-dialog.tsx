"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import {
  recruitmentRequestFormSchema,
  type RecruitmentRequestFormValues,
} from "../../schemas/recruitment.schema";
import { EMPLOYMENT_TYPE_LABELS } from "../../constants/recruitment.constants";
import type { RecruitmentRequestDto, EmploymentType } from "../../types/recruitment.types";
import { useGetDepartmentsQuery } from "@/features/organization/api";

interface RequestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RecruitmentRequestDto | null;
  onSubmit: (values: RecruitmentRequestFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function RequestFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading = false,
}: RequestFormDialogProps) {
  const isEdit = !!initialData;
  const { data: deptData } = useGetDepartmentsQuery({ size: 100 });
  const departments = deptData?.items || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RecruitmentRequestFormValues>({
    resolver: zodResolver(recruitmentRequestFormSchema),
    defaultValues: {
      title: "",
      departmentId: "",
      positionId: "",
      headcount: 1,
      employmentType: "FULL_TIME",
      reason: "",
      jobDescription: "",
      requirements: "",
      minSalary: undefined,
      maxSalary: undefined,
      currency: "VND",
      targetDate: "",
    },
  });

  const selectedDeptId = watch("departmentId");
  const selectedEmpType = watch("employmentType");

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        departmentId: initialData.departmentId || "",
        positionId: initialData.positionId || "",
        headcount: initialData.headcount || 1,
        employmentType: initialData.employmentType || "FULL_TIME",
        reason: initialData.reason || "",
        jobDescription: initialData.jobDescription || "",
        requirements: initialData.requirements || "",
        minSalary: initialData.minSalary,
        maxSalary: initialData.maxSalary,
        currency: initialData.currency || "VND",
        targetDate: initialData.targetDate ? initialData.targetDate.split("T")[0] : "",
      });
    } else {
      reset({
        title: "",
        departmentId: "",
        positionId: "",
        headcount: 1,
        employmentType: "FULL_TIME",
        reason: "",
        jobDescription: "",
        requirements: "",
        minSalary: undefined,
        maxSalary: undefined,
        currency: "VND",
        targetDate: "",
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (values: RecruitmentRequestFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Chỉnh sửa Đề xuất Tuyển dụng" : "Tạo Đề xuất Tuyển dụng Mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Tiêu đề vị trí */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-medium">
              Vị trí cần tuyển <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="VD: Senior Frontend Engineer (React/Next.js)"
              className="h-9 text-xs"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Phòng ban & Số lượng chỉ tiêu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Phòng ban tiếp nhận <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedDeptId}
                onValueChange={(val) => setValue("departmentId", val || "", { shouldValidate: true })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Chọn phòng ban">
                    {departments.find((d) => d.id === selectedDeptId)?.name || "Chọn phòng ban"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id} className="text-xs">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && (
                <p className="text-[11px] text-destructive">{errors.departmentId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="headcount" className="text-xs font-medium">
                Số lượng nhân sự cần tuyển <span className="text-destructive">*</span>
              </Label>
              <Input
                id="headcount"
                type="number"
                min={1}
                placeholder="1"
                className="h-9 text-xs font-mono"
                {...register("headcount")}
              />
              {errors.headcount && (
                <p className="text-[11px] text-destructive">{errors.headcount.message}</p>
              )}
            </div>
          </div>

          {/* Loại hình & Ngày mong muốn onboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Hình thức làm việc <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedEmpType}
                onValueChange={(val) => {
                  if (val)
                    setValue("employmentType", val as EmploymentType, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Chọn hình thức">
                    {EMPLOYMENT_TYPE_LABELS[selectedEmpType] || "Toàn thời gian (Full-time)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(EMPLOYMENT_TYPE_LABELS) as (keyof typeof EMPLOYMENT_TYPE_LABELS)[]).map(
                    (key) => (
                      <SelectItem key={key} value={key} className="text-xs">
                        {EMPLOYMENT_TYPE_LABELS[key]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetDate" className="text-xs font-medium">
                Hạn mong muốn tiếp nhận nhân sự
              </Label>
              <Input
                id="targetDate"
                type="date"
                className="h-9 text-xs"
                {...register("targetDate")}
              />
            </div>
          </div>

          {/* Khung lương dự kiến */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="minSalary" className="text-xs font-medium">
                Mức lương tối thiểu (VND)
              </Label>
              <Input
                id="minSalary"
                type="number"
                step={1000000}
                placeholder="VD: 20000000"
                className="h-9 text-xs font-mono"
                {...register("minSalary")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxSalary" className="text-xs font-medium">
                Mức lương tối đa (VND)
              </Label>
              <Input
                id="maxSalary"
                type="number"
                step={1000000}
                placeholder="VD: 35000000"
                className="h-9 text-xs font-mono"
                {...register("maxSalary")}
              />
            </div>
          </div>

          {/* Lý do tuyển dụng */}
          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-medium">
              Lý do tuyển dụng (Thay thế, mở rộng dự án...) <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              rows={2}
              placeholder="VD: Bổ sung nhân lực cho dự án Core HRM theo kế hoạch quý 4/2026..."
              className="text-xs resize-none"
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-[11px] text-destructive">{errors.reason.message}</p>
            )}
          </div>

          {/* Bản mô tả sơ bộ & Yêu cầu */}
          <div className="space-y-1.5">
            <Label htmlFor="jobDescription" className="text-xs font-medium">
              Mô tả trách nhiệm công việc sơ bộ
            </Label>
            <Textarea
              id="jobDescription"
              rows={3}
              placeholder="Nêu các trách nhiệm chính của vị trí..."
              className="text-xs resize-none"
              {...register("jobDescription")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-9 text-xs"
            >
              Hủy bỏ
            </Button>
            <Button type="submit" size="sm" disabled={isLoading} className="h-9 text-xs">
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{isEdit ? "Cập nhật đề xuất" : "Tạo đề xuất"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
