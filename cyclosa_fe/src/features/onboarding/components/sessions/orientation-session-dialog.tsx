"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  orientationSessionSchema,
  type OrientationSessionFormValues,
} from "../../schemas/onboarding.schema";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";

interface OrientationSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: OrientationSessionFormValues) => Promise<void>;
}

export function OrientationSessionDialog({
  open,
  onOpenChange,
  onConfirm,
}: OrientationSessionDialogProps) {
  const { data: employeeData } = useGetEmployeesQuery({ page: 0, size: 200 });
  const employees = employeeData?.items || [];

  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrientationSessionFormValues>({
    resolver: zodResolver(orientationSessionSchema),
    defaultValues: {
      title: "",
      description: "",
      trainerName: "",
      trainerEmail: "",
      location: "",
      meetingLink: "",
      startTime: "",
      endTime: "",
      maxAttendees: 20,
      attendeeEmployeeIds: [],
    },
  });

  const toggleAttendee = (empId: string) => {
    const next = selectedAttendees.includes(empId)
      ? selectedAttendees.filter((id) => id !== empId)
      : [...selectedAttendees, empId];
    setSelectedAttendees(next);
    setValue("attendeeEmployeeIds", next, { shouldValidate: true });
  };

  const onSubmit = async (values: OrientationSessionFormValues) => {
    await onConfirm(values);
    reset();
    setSelectedAttendees([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            <DialogTitle className="text-sm font-bold text-foreground">
              Tạo Lớp Đào tạo Nhập môn & Định hướng
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Lên lịch lớp học văn hóa doanh nghiệp, giới thiệu sơ đồ tổ chức và sản phẩm cốt lõi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">
              Tên buổi đào tạo <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("title")}
              placeholder="VD: Đào tạo Hội nhập Văn hóa Doanh nghiệp FSI & Khát vọng 2030"
              className="h-8 text-xs"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Giảng viên / Người trình bày <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("trainerName")}
                placeholder="VD: Vũ Thị Minh Ngọc (HRD)"
                className="h-8 text-xs"
              />
              {errors.trainerName && (
                <p className="text-xs text-destructive">{errors.trainerName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Email giảng viên</Label>
              <Input
                {...register("trainerEmail")}
                placeholder="ngoc.vu@cyclosa.vn"
                className="h-8 text-xs"
              />
              {errors.trainerEmail && (
                <p className="text-xs text-destructive">{errors.trainerEmail.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Thời gian bắt đầu <span className="text-destructive">*</span>
              </Label>
              <Input
                type="datetime-local"
                {...register("startTime")}
                className="h-8 text-xs font-mono"
              />
              {errors.startTime && (
                <p className="text-xs text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Thời gian kết thúc <span className="text-destructive">*</span>
              </Label>
              <Input
                type="datetime-local"
                {...register("endTime")}
                className="h-8 text-xs font-mono"
              />
              {errors.endTime && (
                <p className="text-xs text-destructive">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Địa điểm phòng họp</Label>
              <Input
                {...register("location")}
                placeholder="Phòng Hội trường Tầng 5 FSI"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Link Google Meet / Zoom</Label>
              <Input
                {...register("meetingLink")}
                placeholder="https://meet.google.com/xyz-abcd"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Chọn học viên */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Ghi danh học viên tham gia ({selectedAttendees.length} nhân sự đã chọn)
            </Label>
            <div className="max-h-36 overflow-y-auto border border-border rounded-lg p-2 space-y-1 bg-muted/20">
              {employees.slice(0, 30).map((emp) => {
                const isSelected = selectedAttendees.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleAttendee(emp.id)}
                    className={`flex items-center justify-between p-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 text-primary font-bold" : "hover:bg-card"
                    }`}
                  >
                    <span>
                      {emp.fullName} ({emp.employeeCode}) — {emp.currentJobTitleName || "Nhân viên"}
                    </span>
                    <span className="text-[10px] font-mono">
                      {isSelected ? "✓ Đã chọn" : "+ Thêm"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Nội dung tóm tắt</Label>
            <Textarea
              {...register("description")}
              placeholder="Chương trình đào tạo, tài liệu cần chuẩn bị trước buổi học..."
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
              {isSubmitting ? "Đang lên lịch..." : "Lên lịch Buổi Đào tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

