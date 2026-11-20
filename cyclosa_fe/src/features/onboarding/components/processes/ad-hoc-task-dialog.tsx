"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adHocTaskSchema,
  type AdHocTaskFormValues,
} from "../../schemas/onboarding.schema";
import {
  ONBOARDING_TASK_GROUP_OPTIONS,
  ASSIGNEE_ROLE_OPTIONS,
} from "../../constants/onboarding.constants";

interface AdHocTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: AdHocTaskFormValues) => Promise<void>;
}

function getTomorrowDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function AdHocTaskDialog({
  open,
  onOpenChange,
  onConfirm,
}: AdHocTaskDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdHocTaskFormValues>({
    resolver: zodResolver(adHocTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      taskGroup: "TRAINING",
      dueDate: getTomorrowDateString(),
      isMandatory: false,
      assigneeRole: "HR",
      documentRequired: false,
    },
  });

  const onSubmit = async (values: AdHocTaskFormValues) => {
    await onConfirm(values);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Plus className="h-5 w-5" />
            <DialogTitle className="text-sm font-bold text-foreground">
              Thêm Công việc Phát sinh
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Giao thêm một đầu việc ngoài mẫu checklist cho nhân viên mới trong kỳ thử việc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">
              Tiêu đề công việc <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("title")}
              placeholder="VD: Cài đặt và cấu hình chứng chỉ bảo mật VPN nội bộ"
              className="h-8 text-xs"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Nhóm công việc</Label>
              <Controller
                control={control}
                name="taskGroup"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Chọn nhóm việc" />
                    </SelectTrigger>
                    <SelectContent>
                      {ONBOARDING_TASK_GROUP_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Đơn vị phụ trách</Label>
              <Controller
                control={control}
                name="assigneeRole"
                render={({ field }) => (
                  <Select value={field.value || "HR"} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Người phụ trách" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSIGNEE_ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Hạn hoàn thành <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                {...register("dueDate")}
                className="h-8 text-xs font-mono"
              />
              {errors.dueDate && (
                <p className="text-xs text-destructive">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="flex flex-col justify-end pb-1.5 space-y-2">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="isMandatory"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="adhoc-mandatory"
                    />
                  )}
                />
                <Label htmlFor="adhoc-mandatory" className="text-xs cursor-pointer">
                  Bắt buộc nghiệm thu
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="documentRequired"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="adhoc-doc"
                    />
                  )}
                />
                <Label htmlFor="adhoc-doc" className="text-xs cursor-pointer">
                  Yêu cầu đính kèm file
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Hướng dẫn chi tiết</Label>
            <Textarea
              {...register("description")}
              placeholder="Mô tả các yêu cầu hoặc tài liệu hướng dẫn..."
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
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {isSubmitting ? "Đang thêm..." : "Thêm công việc vào tiến trình"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

