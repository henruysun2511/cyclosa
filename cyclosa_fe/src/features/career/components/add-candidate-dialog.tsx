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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import {
  addCandidateFormSchema,
  type AddCandidateFormValues,
} from "../schemas/career.schema";
import { READINESS_CONFIG } from "../constants/career.constants";
import type { SuccessionCandidateItem } from "../types/career.types";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  initialData?: SuccessionCandidateItem | null;
  employees: { id: string; fullName: string; employeeCode: string }[];
  onSubmit: (values: AddCandidateFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function AddCandidateDialog({
  open,
  onOpenChange,
  mode = "add",
  initialData,
  employees,
  onSubmit,
  isSubmitting = false,
}: AddCandidateDialogProps) {
  const form = useForm<AddCandidateFormValues>({
    resolver: zodResolver(addCandidateFormSchema),
    defaultValues: {
      employeeId: "",
      readiness: "READY_1_2_YEARS",
      developmentNotes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        form.reset({
          employeeId: initialData.employeeId,
          readiness: initialData.readiness as any,
          developmentNotes: initialData.developmentNotes || "",
        });
      } else {
        form.reset({
          employeeId: "",
          readiness: "READY_1_2_YEARS",
          developmentNotes: "",
        });
      }
    }
  }, [open, mode, initialData, form]);

  const handleSubmit = async (values: AddCandidateFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" />
            <span>
              {mode === "add" ? "Chỉ định ứng viên kế cận" : "Cập nhật ứng viên kế cận"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => {
                const selectedEmp = employees.find((e) => e.id === field.value);
                return (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Nhân viên kế nhiệm <span className="text-destructive">*</span></FormLabel>
                    <Select
                      disabled={mode === "edit"}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn nhân viên">
                            {selectedEmp ? `${selectedEmp.fullName} (${selectedEmp.employeeCode})` : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={e.id} className="text-xs">
                            {e.fullName} ({e.employeeCode})
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
              name="readiness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Mức độ sẵn sàng tiếp quản <span className="text-destructive">*</span></FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn mức độ sẵn sàng">
                          {field.value ? READINESS_CONFIG[field.value as keyof typeof READINESS_CONFIG]?.label || field.value : undefined}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(READINESS_CONFIG).map(([k, cfg]) => (
                        <SelectItem key={k} value={k} className="text-xs">
                          {cfg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="developmentNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kế hoạch đào tạo & Ghi chú phát triển</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Mô tả các khóa học, chương trình Mentoring hoặc dự án thử thách cần giao cho ứng viên..."
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
                  : mode === "add"
                  ? "Thêm ứng viên"
                  : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
