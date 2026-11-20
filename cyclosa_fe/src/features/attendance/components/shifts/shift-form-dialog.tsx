"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Moon } from "lucide-react";
import { createShiftSchema, type CreateShiftFormData } from "../../schemas/attendance.schema";
import type { ShiftResponse } from "../../types/attendance.types";

interface ShiftFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftToEdit?: ShiftResponse | null;
  onSubmit: (data: CreateShiftFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ShiftFormDialog({
  open,
  onOpenChange,
  shiftToEdit,
  onSubmit,
  isSubmitting,
}: ShiftFormDialogProps) {
  const isEdit = Boolean(shiftToEdit);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateShiftFormData>({
    resolver: zodResolver(createShiftSchema as any),
    defaultValues: {
      code: "",
      name: "",
      startTime: "08:00",
      endTime: "17:00",
      breakStartTime: "12:00",
      breakEndTime: "13:00",
      lateGraceMinutes: 15,
      earlyGraceMinutes: 0,
      workCredit: 1.0,
      isActive: true,
    },
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const isActive = watch("isActive");

  // Kiểm tra ca qua đêm
  const isNightShift = Boolean(startTime && endTime && endTime < startTime);

  useEffect(() => {
    if (open) {
      if (shiftToEdit) {
        reset({
          code: shiftToEdit.code,
          name: shiftToEdit.name,
          startTime: shiftToEdit.startTime,
          endTime: shiftToEdit.endTime,
          breakStartTime: shiftToEdit.breakStartTime || "",
          breakEndTime: shiftToEdit.breakEndTime || "",
          lateGraceMinutes: shiftToEdit.lateGraceMinutes,
          earlyGraceMinutes: shiftToEdit.earlyGraceMinutes,
          workCredit: shiftToEdit.workCredit,
          isActive: shiftToEdit.isActive,
        });
      } else {
        reset({
          code: "",
          name: "",
          startTime: "08:00",
          endTime: "17:00",
          breakStartTime: "12:00",
          breakEndTime: "13:00",
          lateGraceMinutes: 15,
          earlyGraceMinutes: 0,
          workCredit: 1.0,
          isActive: true,
        });
      }
    }
  }, [open, shiftToEdit, reset]);

  const handleFormSubmit = async (data: CreateShiftFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Cập nhật ca làm việc" : "Thêm mới ca làm việc"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Chỉnh sửa khung giờ làm việc và quy chuẩn ân hạn của ca."
                : "Thiết lập thông tin ca làm việc chuẩn để phân công cho nhân viên."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Mã ca */}
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs font-semibold">
                Mã ca làm việc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="vd: HC_01, CA_DEM"
                disabled={isEdit || isSubmitting}
                className="uppercase font-mono text-xs"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-[11px] text-destructive">{errors.code.message}</p>
              )}
            </div>

            {/* Tên ca */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">
                Tên ca làm việc <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="vd: Ca hành chính, Ca xoay 1"
                disabled={isSubmitting}
                className="text-xs"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-[11px] text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Giờ bắt đầu */}
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-xs font-semibold">
                Giờ vào ca <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                disabled={isSubmitting}
                className="text-xs"
                {...register("startTime")}
              />
              {errors.startTime && (
                <p className="text-[11px] text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            {/* Giờ kết thúc */}
            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-xs font-semibold">
                Giờ tan ca <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                disabled={isSubmitting}
                className="text-xs"
                {...register("endTime")}
              />
              {errors.endTime && (
                <p className="text-[11px] text-destructive">{errors.endTime.message}</p>
              )}
            </div>

            {/* Cảnh báo ca qua đêm */}
            {isNightShift && (
              <div className="sm:col-span-2 flex items-center gap-2 p-2 bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-md text-xs">
                <Moon className="w-4 h-4 shrink-0" />
                <span>
                  Hệ thống tự động nhận diện đây là <strong>Ca làm việc qua đêm</strong> (kết thúc
                  vào sáng ngày hôm sau).
                </span>
              </div>
            )}

            {/* Giờ nghỉ trưa bắt đầu */}
            <div className="space-y-1.5">
              <Label htmlFor="breakStartTime" className="text-xs font-medium text-muted-foreground">
                Nghỉ trưa từ
              </Label>
              <Input
                id="breakStartTime"
                type="time"
                disabled={isSubmitting}
                className="text-xs"
                {...register("breakStartTime")}
              />
            </div>

            {/* Giờ nghỉ trưa kết thúc */}
            <div className="space-y-1.5">
              <Label htmlFor="breakEndTime" className="text-xs font-medium text-muted-foreground">
                Đến
              </Label>
              <Input
                id="breakEndTime"
                type="time"
                disabled={isSubmitting}
                className="text-xs"
                {...register("breakEndTime")}
              />
              {errors.breakEndTime && (
                <p className="text-[11px] text-destructive">{errors.breakEndTime.message}</p>
              )}
            </div>

            {/* Ân hạn đi muộn */}
            <div className="space-y-1.5">
              <Label htmlFor="lateGraceMinutes" className="text-xs font-medium">
                Ân hạn đi muộn (phút)
              </Label>
              <Input
                id="lateGraceMinutes"
                type="number"
                min={0}
                max={120}
                disabled={isSubmitting}
                className="text-xs"
                {...register("lateGraceMinutes", { valueAsNumber: true })}
              />
              {errors.lateGraceMinutes && (
                <p className="text-[11px] text-destructive">
                  {errors.lateGraceMinutes.message}
                </p>
              )}
            </div>

            {/* Định mức công */}
            <div className="space-y-1.5">
              <Label htmlFor="workCredit" className="text-xs font-medium">
                Định mức công quy đổi
              </Label>
              <Input
                id="workCredit"
                type="number"
                step="0.1"
                min={0.1}
                max={2.0}
                disabled={isSubmitting}
                className="text-xs"
                {...register("workCredit", { valueAsNumber: true })}
              />
              {errors.workCredit && (
                <p className="text-[11px] text-destructive">{errors.workCredit.message}</p>
              )}
            </div>

            {/* Trạng thái hoạt động */}
            <div className="sm:col-span-2 flex items-center justify-between p-3 border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-xs font-medium cursor-pointer">
                  Kích hoạt ca làm việc
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Cho phép phân ca này cho nhân viên trong bảng phân ca
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Lưu thay đổi" : "Tạo ca làm việc"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

