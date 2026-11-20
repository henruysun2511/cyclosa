"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { bulkShiftAssignmentSchema, type BulkShiftAssignmentFormValues } from "../../schemas/attendance.schema";
import { useBulkAssignShiftsMutation } from "../../api/attendance-api";
import type { ShiftResponse } from "../../types/attendance.types";
import { DAYS_OF_WEEK } from "../../constants/attendance.constants";

interface BulkAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shifts: ShiftResponse[];
  onSuccess?: () => void;
}

export function BulkAssignmentDialog({
  open,
  onOpenChange,
  shifts,
  onSuccess,
}: BulkAssignmentDialogProps) {
  const [bulkAssign, { isLoading }] = useBulkAssignShiftsMutation();
  const [rawEmployeeIds, setRawEmployeeIds] = useState("");

  const form = useForm<BulkShiftAssignmentFormValues>({
    resolver: zodResolver(bulkShiftAssignmentSchema as any),
    defaultValues: {
      shiftId: "",
      employeeIds: [],
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      daysOfWeek: [1, 2, 3, 4, 5], // T2 - T6
      overwriteExisting: false,
    },
  });

  const onSubmit = async (values: BulkShiftAssignmentFormValues) => {
    // Parse raw employee IDs if entered as comma-separated or space-separated
    let empIds = values.employeeIds;
    if (rawEmployeeIds.trim()) {
      empIds = rawEmployeeIds
        .split(/[\n, ]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (empIds.length === 0) {
      toast.error("Vui lòng nhập ít nhất 1 mã nhân viên hoặc UUID");
      return;
    }

    try {
      await bulkAssign({
        ...values,
        employeeIds: empIds,
      }).unwrap();

      toast.success("Phân ca làm việc hàng loạt thành công");
      form.reset();
      setRawEmployeeIds("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể phân ca làm việc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Phân ca làm việc hàng loạt</DialogTitle>
          <DialogDescription>
            Gán ca làm việc cho danh sách nhân viên theo dải ngày và các ngày trong tuần.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Chọn Ca làm việc */}
            <FormField
              control={form.control}
              name="shiftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ca làm việc áp dụng <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ca làm việc" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.shiftName} ({shift.shiftCode}) - {shift.startTime} đến {shift.endTime}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Danh sách nhân viên */}
            <div className="space-y-2">
              <FormLabel>Mã định danh nhân viên (Employee IDs/UUIDs) <span className="text-destructive">*</span></FormLabel>
              <Input
                placeholder="Nhập ID/UUID nhân viên (ngăn cách bởi dấu phẩy hoặc khoảng trắng)"
                value={rawEmployeeIds}
                onChange={(e) => {
                  setRawEmployeeIds(e.target.value);
                  const parsed = e.target.value
                    .split(/[\n, ]+/)
                    .map((s) => s.trim())
                    .filter(Boolean);
                  form.setValue("employeeIds", parsed);
                }}
              />
              <p className="text-[11px] text-muted-foreground">
                Ví dụ: 00000000-0000-0000-0000-000000000001, 00000000-0000-0000-0000-000000000002
              </p>
            </div>

            {/* Dải ngày áp dụng */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Từ ngày <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đến ngày <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thứ trong tuần */}
            <FormField
              control={form.control}
              name="daysOfWeek"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Các ngày trong tuần áp dụng <span className="text-destructive">*</span></FormLabel>
                    <FormDescription className="text-xs">
                      Chọn các ngày nhân viên sẽ được xếp ca làm việc
                    </FormDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((item: { value: number; label: string }) => (
                      <FormField
                        key={item.value}
                        control={form.control}
                        name="daysOfWeek"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(item.value);
                          return (
                            <FormItem
                              key={item.value}
                              className="flex items-center space-x-1.5 space-y-0 rounded-md border p-2 text-xs"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.value])
                                      : field.onChange(
                                          field.value?.filter((val: number) => val !== item.value)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ghi đè ca hiện tại */}
            <FormField
              control={form.control}
              name="overwriteExisting"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-xs font-normal cursor-pointer">
                      Ghi đè nếu ngày đó nhân viên đã được phân ca trước đó
                    </FormLabel>
                  </div>
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
                {isLoading ? "Đang xử lý..." : "Xác nhận phân ca"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

