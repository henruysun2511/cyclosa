"use client";

import React, { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
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
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import {
  assignAssetFormSchema,
  type AssignAssetFormValues,
} from "../schemas/asset.schema";
import { ASSET_CONDITION_LABELS } from "../constants/asset.constants";
import type { AssetSummary } from "../types/asset.types";

interface AssignAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetSummary | null;
  onSubmit: (values: AssignAssetFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AssignAssetDialog({
  open,
  onOpenChange,
  asset,
  onSubmit,
  isLoading = false,
}: AssignAssetDialogProps) {
  const { data: employeesData } = useGetEmployeesQuery({ size: 100 });
  const employees = employeesData?.items ?? [];

  const form = useForm<AssignAssetFormValues>({
    resolver: zodResolver(assignAssetFormSchema) as any,
    defaultValues: {
      employeeId: "",
      assignedAt: new Date().toISOString().slice(0, 16),
      conditionOnAssign: "GOOD",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        employeeId: "",
        assignedAt: new Date().toISOString().slice(0, 16),
        conditionOnAssign: asset?.conditionStatus || "GOOD",
        notes: "",
      });
    }
  }, [open, asset, form]);

  const handleSubmit = async (values: AssignAssetFormValues) => {
    await onSubmit(values);
  };

  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Cấp phát thiết bị cho nhân sự
          </DialogTitle>
          <DialogDescription className="text-xs">
            Bàn giao tài sản <strong className="text-foreground">{asset.name}</strong> ({asset.assetCode}) cho nhân viên sử dụng.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Chọn nhân viên */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Nhân sự tiếp nhận <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn nhân viên bàn giao" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-56">
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName} ({emp.employeeCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thời điểm bàn giao */}
            <FormField
              control={form.control}
              name="assignedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Thời điểm bàn giao <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      className="h-9 text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tình trạng lúc bàn giao */}
            <FormField
              control={form.control}
              name="conditionOnAssign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Tình trạng lúc giao máy</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ASSET_CONDITION_LABELS).map(([k, label]) => (
                        <SelectItem key={k} value={k}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ghi chú */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Ghi chú bàn giao</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="VD: Kèm củ sạc 140W, dây sạc Type-C, túi chống sốc..."
                      rows={2}
                      {...field}
                      className="text-xs resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="text-xs bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Đang xử lý..." : "Xác nhận cấp phát"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
