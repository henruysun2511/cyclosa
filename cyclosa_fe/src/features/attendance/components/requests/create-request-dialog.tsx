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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAttendanceRequestSchema, type CreateAttendanceRequestFormValues } from "../../schemas/attendance.schema";
import { useCreateAttendanceRequestMutation, useGetShiftsQuery } from "../../api/attendance-api";
import { ATTENDANCE_REQUEST_TYPES } from "../../constants/attendance.constants";

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRequestDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateRequestDialogProps) {
  const [createRequest, { isLoading }] = useCreateAttendanceRequestMutation();
  const { data: shiftsData } = useGetShiftsQuery({ activeOnly: true, size: 50 });
  const shifts = shiftsData?.data?.items || [];

  const form = useForm<CreateAttendanceRequestFormValues>({
    resolver: zodResolver(createAttendanceRequestSchema),
    defaultValues: {
      requestType: "ATTENDANCE_EXPLANATION",
      attendanceDate: new Date().toISOString().split("T")[0],
      targetShiftId: "",
      proposedInTime: "",
      proposedOutTime: "",
      reason: "",
    },
  });

  const onSubmit = async (values: CreateAttendanceRequestFormValues) => {
    try {
      await createRequest({
        requestType: values.requestType as any,
        attendanceDate: values.attendanceDate,
        targetShiftId: values.targetShiftId || undefined,
        proposedInTime: values.proposedInTime
          ? `${values.attendanceDate}T${values.proposedInTime}:00`
          : undefined,
        proposedOutTime: values.proposedOutTime
          ? `${values.attendanceDate}T${values.proposedOutTime}:00`
          : undefined,
        reason: values.reason,
      }).unwrap();

      toast.success("Gửi đơn giải trình chấm công thành công");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể gửi đơn giải trình");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo đơn giải trình chấm công</DialogTitle>
          <DialogDescription>
            Gửi yêu cầu giải trình quên quẹt thẻ, sai lệch thời gian hoặc đăng ký tăng ca tới quản lý.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Loại đơn */}
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại đơn giải trình <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại đơn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ATTENDANCE_REQUEST_TYPES.map((type: { value: string; label: string }) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày giải trình & Ca làm việc */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="attendanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày làm việc <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetShiftId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ca làm việc</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ca (nếu có)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shifts.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.shiftName} ({s.shiftCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Giờ vào & Giờ ra đề xuất */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="proposedInTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ vào đề xuất</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proposedOutTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ ra đề xuất</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Lý do giải trình */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do chi tiết <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả nguyên nhân (ví dụ: máy chấm công mất mạng, quên quẹt lúc về, làm thêm giờ theo điều động...)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    Lý do rõ ràng sẽ giúp cấp quản lý phê duyệt nhanh chóng hơn.
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
                {isLoading ? "Đang gửi..." : "Gửi đơn giải trình"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

