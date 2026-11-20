"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitBranch } from "lucide-react";
import {
  careerPathFormSchema,
  type CareerPathFormValues,
} from "../schemas/career.schema";
import type { CareerPathItem } from "../types/career.types";

interface CareerPathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: CareerPathItem | null;
  jobTitles: { id: string; name: string; code: string }[];
  onSubmit: (values: CareerPathFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function CareerPathDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  jobTitles,
  onSubmit,
  isSubmitting = false,
}: CareerPathDialogProps) {
  const form = useForm<CareerPathFormValues>({
    resolver: zodResolver(careerPathFormSchema),
    defaultValues: {
      fromJobTitleId: "",
      toJobTitleId: "",
      minExperienceYears: 2,
      requirements: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        form.reset({
          fromJobTitleId: initialData.fromJobTitleId,
          toJobTitleId: initialData.toJobTitleId,
          minExperienceYears: initialData.minExperienceYears,
          requirements: initialData.requirements || "",
        });
      } else {
        form.reset({
          fromJobTitleId: "",
          toJobTitleId: "",
          minExperienceYears: 2,
          requirements: "",
        });
      }
    }
  }, [open, mode, initialData, form]);

  const handleSubmit = async (values: CareerPathFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <GitBranch className="h-5 w-5 text-primary" />
            <span>
              {mode === "create"
                ? "Thiết lập tuyến thăng tiến mới"
                : "Cập nhật tuyến thăng tiến"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromJobTitleId"
                render={({ field }) => {
                  const selectedFrom = jobTitles.find((jt) => jt.id === field.value);
                  return (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Vị trí khởi điểm <span className="text-destructive">*</span></FormLabel>
                      <Select
                        disabled={mode === "edit"}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="Chọn vị trí bắt đầu">
                              {selectedFrom ? `${selectedFrom.name} (${selectedFrom.code})` : undefined}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobTitles.map((jt) => (
                            <SelectItem key={jt.id} value={jt.id} className="text-xs">
                              {jt.name} ({jt.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="toJobTitleId"
                render={({ field }) => {
                  const selectedTo = jobTitles.find((jt) => jt.id === field.value);
                  return (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Vị trí mục tiêu <span className="text-destructive">*</span></FormLabel>
                      <Select
                        disabled={mode === "edit"}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs">
                            <SelectValue placeholder="Chọn vị trí hướng tới">
                              {selectedTo ? `${selectedTo.name} (${selectedTo.code})` : undefined}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobTitles.map((jt) => (
                            <SelectItem key={jt.id} value={jt.id} className="text-xs">
                              {jt.name} ({jt.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="minExperienceYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số năm kinh nghiệm tối thiểu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="Ví dụ: 2.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu chuẩn năng lực & Điều kiện thăng tiến</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Mô tả các yêu cầu về hiệu suất, kỹ năng quản trị, chứng chỉ hoặc dự án đã dẫn dắt..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang lưu..."
                  : mode === "create"
                  ? "Tạo tuyến thăng tiến"
                  : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
