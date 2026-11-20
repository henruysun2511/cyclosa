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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  leavePolicySchema,
  type LeavePolicyFormValues,
} from "../../schemas/leave.schema";
import {
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
  useGetActiveLeaveTypesQuery,
} from "../../api/leave-api";
import { CONTRACT_TYPE_OPTIONS } from "../../constants/leave.constants";
import type { LeavePolicyDto } from "../../types/leave.types";
import { toast } from "sonner";

interface LeavePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy?: LeavePolicyDto | null;
}

export function LeavePolicyDialog({
  open,
  onOpenChange,
  policy,
}: LeavePolicyDialogProps) {
  const isEdit = !!policy;
  const [createPolicy, { isLoading: isCreating }] = useCreateLeavePolicyMutation();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdateLeavePolicyMutation();
  const { data: leaveTypesRes } = useGetActiveLeaveTypesQuery();
  const leaveTypes = leaveTypesRes?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LeavePolicyFormValues>({
    resolver: zodResolver(leavePolicySchema),
    defaultValues: {
      leaveTypeId: "",
      contractType: null,
      effectiveFrom: new Date().toISOString().split("T")[0],
      annualEntitlementDays: 12,
      seniorityStepYears: 5,
      seniorityBonusDays: 1,
      maxCarryoverDays: 5,
      carryoverDeadlineMonth: 3,
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (policy) {
        reset({
          leaveTypeId: policy.leaveTypeId,
          contractType: policy.contractType || null,
          effectiveFrom: policy.effectiveFrom,
          annualEntitlementDays: policy.annualEntitlementDays,
          seniorityStepYears: policy.seniorityStepYears ?? null,
          seniorityBonusDays: policy.seniorityBonusDays ?? null,
          maxCarryoverDays: policy.maxCarryoverDays,
          carryoverDeadlineMonth: policy.carryoverDeadlineMonth ?? null,
          description: policy.description || "",
        });
      } else {
        reset({
          leaveTypeId: leaveTypes.length > 0 ? leaveTypes[0].id : "",
          contractType: null,
          effectiveFrom: new Date().toISOString().split("T")[0],
          annualEntitlementDays: 12,
          seniorityStepYears: 5,
          seniorityBonusDays: 1,
          maxCarryoverDays: 5,
          carryoverDeadlineMonth: 3,
          description: "",
        });
      }
    }
  }, [open, policy, leaveTypes, reset]);

  const onSubmit = async (values: LeavePolicyFormValues) => {
    try {
      if (isEdit && policy) {
        await updatePolicy({
          id: policy.id,
          body: {
            contractType: values.contractType || null,
            effectiveFrom: values.effectiveFrom,
            annualEntitlementDays: values.annualEntitlementDays,
            seniorityStepYears: values.seniorityStepYears ?? null,
            seniorityBonusDays: values.seniorityBonusDays ?? null,
            maxCarryoverDays: values.maxCarryoverDays,
            carryoverDeadlineMonth: values.carryoverDeadlineMonth ?? null,
            description: values.description,
          },
        }).unwrap();
        toast.success("Cập nhật chính sách thành công");
      } else {
        await createPolicy({
          leaveTypeId: values.leaveTypeId,
          contractType: values.contractType || null,
          effectiveFrom: values.effectiveFrom,
          annualEntitlementDays: values.annualEntitlementDays,
          seniorityStepYears: values.seniorityStepYears ?? null,
          seniorityBonusDays: values.seniorityBonusDays ?? null,
          maxCarryoverDays: values.maxCarryoverDays,
          carryoverDeadlineMonth: values.carryoverDeadlineMonth ?? null,
          description: values.description,
        }).unwrap();
        toast.success("Tạo mới chính sách thành công");
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật chính sách nghỉ phép" : "Thêm mới chính sách nghỉ phép"}
          </DialogTitle>
          <DialogDescription>
            Cấu hình định mức phép năm, thâm niên và quy tắc kết chuyển phép tồn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Loại nghỉ áp dụng <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="leaveTypeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                    disabled={isEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại nghỉ" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.leaveTypeId && (
                <p className="text-xs text-destructive">
                  {errors.leaveTypeId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Loại hợp đồng áp dụng</Label>
              <Controller
                name="contractType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || "ALL"}
                    onValueChange={(val) => field.onChange(val === "ALL" ? null : val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Áp dụng tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTRACT_TYPE_OPTIONS.map((opt) => (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effectiveFrom">
                Ngày bắt đầu hiệu lực <span className="text-destructive">*</span>
              </Label>
              <Input
                id="effectiveFrom"
                type="date"
                {...register("effectiveFrom")}
              />
              {errors.effectiveFrom && (
                <p className="text-xs text-destructive">
                  {errors.effectiveFrom.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualEntitlementDays">
                Định mức phép năm (ngày) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="annualEntitlementDays"
                type="number"
                step="0.5"
                placeholder="VD: 12"
                {...register("annualEntitlementDays")}
              />
              {errors.annualEntitlementDays && (
                <p className="text-xs text-destructive">
                  {errors.annualEntitlementDays.message}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-3 bg-muted/30">
            <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
              Cộng thêm theo thâm niên (Luật LĐ: cứ 5 năm + 1 ngày)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="seniorityStepYears" className="text-xs">
                  Mỗi bước thâm niên (năm)
                </Label>
                <Input
                  id="seniorityStepYears"
                  type="number"
                  placeholder="VD: 5"
                  {...register("seniorityStepYears")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="seniorityBonusDays" className="text-xs">
                  Số ngày cộng thêm (ngày)
                </Label>
                <Input
                  id="seniorityBonusDays"
                  type="number"
                  step="0.5"
                  placeholder="VD: 1"
                  {...register("seniorityBonusDays")}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-3 bg-muted/30">
            <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
              Chính sách kết chuyển phép tồn
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="maxCarryoverDays" className="text-xs">
                  Số ngày tối đa được chuyển (0 = không chuyển)
                </Label>
                <Input
                  id="maxCarryoverDays"
                  type="number"
                  step="0.5"
                  placeholder="VD: 5"
                  {...register("maxCarryoverDays")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="carryoverDeadlineMonth" className="text-xs">
                  Hạn sử dụng phép chuyển (tháng)
                </Label>
                <Input
                  id="carryoverDeadlineMonth"
                  type="number"
                  placeholder="VD: 3 (hết 31/03)"
                  {...register("carryoverDeadlineMonth")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả hoặc căn cứ ban hành</Label>
            <Textarea
              id="description"
              rows={2}
              placeholder="Quy định nghỉ phép ban hành theo Quyết định số..."
              {...register("description")}
            />
          </div>

          <DialogFooter className="pt-3">
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

