"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, AlertTriangle, CheckCircle2, Loader2, DollarSign } from "lucide-react";
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
  offerFormSchema,
  type OfferFormValues,
} from "../../schemas/recruitment.schema";
import { useGetApplicationsQuery } from "../../api/recruitment-api";
import type { CreateOfferPayload } from "../../types/recruitment.types";

interface OfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateOfferPayload) => Promise<void>;
  isLoading?: boolean;
}

export function OfferFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: OfferFormDialogProps) {
  const { data: appsData } = useGetApplicationsQuery({ size: 100 });
  const applications = appsData?.items || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      applicationId: "",
      baseSalary: 30000000,
      probationSalary: 25500000,
      probationPeriodMonths: 2,
      currency: "VND",
      startDate: "",
      expiryDate: "",
      notes: "",
    },
  });

  const selectedAppId = watch("applicationId");
  const baseSalary = watch("baseSalary") || 0;

  // Giả định trần khung lương là 40,000,000 VND để kiểm tra Matrix duyệt lương
  const maxSalaryBand = 40000000;
  const isOverSalaryBand = baseSalary > maxSalaryBand;

  const onFormSubmit = async (values: OfferFormValues) => {
    await onSubmit({
      ...values,
      allowances: [
        { allowanceType: "Ăn trưa & Xăng xe", amount: 1500000 },
        { allowanceType: "Trách nhiệm dự án", amount: 2000000 },
      ],
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Lập Thư Mời Nhận Việc (Job Offer Letter)
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Xác lập mức lương chính thức, thời gian thử việc và tự động kiểm tra ma trận khung lương chuẩn.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Chọn ứng viên trúng tuyển */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Ứng viên trúng tuyển <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedAppId}
              onValueChange={(val) => setValue("applicationId", val || "", { shouldValidate: true })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn ứng viên nhận Offer">
                  {applications.find((a) => a.id === selectedAppId)
                    ? `${applications.find((a) => a.id === selectedAppId)?.candidateName} (${applications.find((a) => a.id === selectedAppId)?.jobOpeningTitle})`
                    : "Chọn ứng viên nhận Offer"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id} className="text-xs">
                    {app.candidateName} — {app.jobOpeningTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.applicationId && (
              <p className="text-[11px] text-destructive">{errors.applicationId.message}</p>
            )}
          </div>

          {/* Lương chính thức & Thử việc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="baseSalary" className="text-xs font-medium">
                Mức lương cơ bản chính thức (VND) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="baseSalary"
                type="number"
                step={1000000}
                className="h-9 text-xs font-mono font-bold"
                {...register("baseSalary")}
              />
              {errors.baseSalary && (
                <p className="text-[11px] text-destructive">{errors.baseSalary.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="probationSalary" className="text-xs font-medium">
                Mức lương thời gian thử việc (85%)
              </Label>
              <Input
                id="probationSalary"
                type="number"
                step={1000000}
                className="h-9 text-xs font-mono"
                {...register("probationSalary")}
              />
            </div>
          </div>

          {/* Cảnh báo kiểm tra Khung lương (Salary Band Check) */}
          {isOverSalaryBand ? (
            <div className="p-3 rounded-lg border border-amber-300 bg-amber-50/70 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cảnh báo vượt khung lương:</strong> Mức lương thỏa thuận (
                {new Intl.NumberFormat("vi-VN").format(baseSalary)} VND) vượt trần khung ngân sách vị trí (
                {new Intl.NumberFormat("vi-VN").format(maxSalaryBand)} VND). Thư mời sẽ tự động chuyển cấp Ban Giám Đốc phê duyệt ngoại lệ.
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Mức lương nằm trong khung ngân sách phê duyệt chuẩn.</span>
            </div>
          )}

          {/* Ngày bắt đầu & Thời gian thử việc */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-xs font-medium">
                Ngày đi làm dự kiến (Onboarding Date) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                className="h-9 text-xs"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-[11px] text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expiryDate" className="text-xs font-medium">
                Hạn chót ứng viên phản hồi thư mời
              </Label>
              <Input
                id="expiryDate"
                type="date"
                className="h-9 text-xs"
                {...register("expiryDate")}
              />
            </div>
          </div>

          {/* Ghi chú thêm */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-medium">
              Ghi chú thêm & Điều kiện tiên quyết
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="VD: Cần nộp giấy khám sức khỏe và bản sao công chứng bằng cấp khi tiếp nhận..."
              className="text-xs resize-none"
              {...register("notes")}
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
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang khởi tạo Offer...</span>
                </>
              ) : (
                <span>Lập Thư mời nhận việc</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
