"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTimesheetPeriodSchema, type CreateTimesheetPeriodFormValues } from "../../schemas/attendance.schema";
import { useCreateTimesheetPeriodMutation } from "../../api/attendance-api";

interface CreatePeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreatePeriodDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePeriodDialogProps) {
  const [createPeriod, { isLoading }] = useCreateTimesheetPeriodMutation();

  const now = new Date();
  const currentMonthStr = String(now.getMonth() + 1).padStart(2, "0");
  const currentYearStr = String(now.getFullYear());

  const form = useForm<CreateTimesheetPeriodFormValues>({
    resolver: zodResolver(createTimesheetPeriodSchema),
    defaultValues: {
      periodCode: `KC_${currentYearStr}_${currentMonthStr}`,
      periodName: `Kỳ công Tháng ${currentMonthStr}/${currentYearStr}`,
      startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0],
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0],
      cutoffDate: new Date(now.getFullYear(), now.getMonth() + 1, 3).toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: CreateTimesheetPeriodFormValues) => {
    try {
      await createPeriod(values).unwrap();
      toast.success("Tạo kỳ công mới thành công");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tạo kỳ công");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo kỳ công mới</DialogTitle>
          <DialogDescription>
            Thiết lập chu kỳ tính công hàng tháng cho toàn bộ nhân sự trước khi tính lương.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="periodCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã kỳ công <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="KC_2026_11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên kỳ công <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Kỳ công Tháng 11/2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cutoffDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hạn chót gửi đơn giải trình (Cut-off date) <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    Sau ngày này nhân viên sẽ không thể gửi thêm đơn giải trình cho kỳ này.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tạo..." : "Xác nhận tạo kỳ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

