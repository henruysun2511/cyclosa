"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  leaveTypeSchema,
  type LeaveTypeFormValues,
} from "../../schemas/leave.schema";
import {
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
} from "../../api/leave-api";
import {
  LEAVE_GROUP_OPTIONS,
  LEAVE_PAYER_OPTIONS,
} from "../../constants/leave.constants";
import type { LeaveTypeDto } from "../../types/leave.types";
import { toast } from "sonner";

interface LeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveType?: LeaveTypeDto | null;
}

export function LeaveTypeDialog({
  open,
  onOpenChange,
  leaveType,
}: LeaveTypeDialogProps) {
  const isEdit = !!leaveType;
  const [createLeaveType, { isLoading: isCreating }] = useCreateLeaveTypeMutation();
  const [updateLeaveType, { isLoading: isUpdating }] = useUpdateLeaveTypeMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: {
      code: "",
      name: "",
      leaveGroup: "ANNUAL",
      payer: "EMPLOYER",
      fixedDays: null,
      requiresApproval: true,
      isActive: true,
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (leaveType) {
        reset({
          code: leaveType.code,
          name: leaveType.name,
          leaveGroup: leaveType.leaveGroup,
          payer: leaveType.payer,
          fixedDays: leaveType.fixedDays ?? null,
          requiresApproval: leaveType.requiresApproval,
          isActive: leaveType.isActive,
          description: leaveType.description || "",
        });
      } else {
        reset({
          code: "",
          name: "",
          leaveGroup: "ANNUAL",
          payer: "EMPLOYER",
          fixedDays: null,
          requiresApproval: true,
          isActive: true,
          description: "",
        });
      }
    }
  }, [open, leaveType, reset]);

  const onSubmit = async (values: LeaveTypeFormValues) => {
    try {
      if (isEdit && leaveType) {
        await updateLeaveType({
          id: leaveType.id,
          body: {
            name: values.name,
            leaveGroup: values.leaveGroup,
            payer: values.payer,
            fixedDays: values.fixedDays ?? null,
            requiresApproval: values.requiresApproval,
            isActive: values.isActive,
            description: values.description,
          },
        }).unwrap();
        toast.success("Cập nhật loại nghỉ phép thành công");
      } else {
        await createLeaveType({
          code: values.code,
          name: values.name,
          leaveGroup: values.leaveGroup,
          payer: values.payer,
          fixedDays: values.fixedDays ?? null,
          requiresApproval: values.requiresApproval,
          isActive: values.isActive,
          description: values.description,
        }).unwrap();
        toast.success("Tạo mới loại nghỉ phép thành công");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra, vui lòng thử lại";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật loại nghỉ phép" : "Thêm mới loại nghỉ phép"}
          </DialogTitle>
          <DialogDescription>
            Cấu hình loại nghỉ, nhóm phân loại, nguồn chi trả lương và quy tắc phê duyệt
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã loại nghỉ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: ANNUAL, SICK..."
                disabled={isEdit}
                {...register("code")}
              />
              {errors.code && (
                <p className="text-xs text-destructive">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Tên loại nghỉ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Nghỉ phép năm..."
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Nhóm loại nghỉ <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="leaveGroup"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm nghỉ" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_GROUP_OPTIONS.filter((o) => o.value !== "ALL").map(
                        (opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.leaveGroup && (
                <p className="text-xs text-destructive">
                  {errors.leaveGroup.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Nguồn chi trả <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="payer"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nguồn chi trả" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_PAYER_OPTIONS.filter((o) => o.value !== "ALL").map(
                        (opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.payer && (
                <p className="text-xs text-destructive">
                  {errors.payer.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fixedDays">
              Số ngày cố định theo sự kiện (nếu có)
            </Label>
            <Input
              id="fixedDays"
              type="number"
              step="0.5"
              placeholder="VD: 3 ngày cho kết hôn/tang lễ..."
              {...register("fixedDays")}
            />
            {errors.fixedDays && (
              <p className="text-xs text-destructive">
                {errors.fixedDays.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả / Căn cứ áp dụng</Label>
            <Textarea
              id="description"
              rows={2}
              placeholder="Nhập thông tin mô tả căn cứ quy định lao động..."
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Cần phê duyệt</Label>
                <p className="text-xs text-muted-foreground">
                  Đơn cần qua quy trình duyệt
                </p>
              </div>
              <Controller
                name="requiresApproval"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Kích hoạt</Label>
                <p className="text-xs text-muted-foreground">
                  Cho phép nhân viên sử dụng
                </p>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? "Đang lưu..."
                : isEdit
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

