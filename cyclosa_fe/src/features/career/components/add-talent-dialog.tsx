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
import { Sparkles } from "lucide-react";
import {
  addTalentPoolFormSchema,
  type AddTalentPoolFormValues,
} from "../schemas/career.schema";
import { TALENT_TAG_CONFIG } from "../constants/career.constants";

interface AddTalentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: { id: string; fullName: string; employeeCode: string }[];
  onSubmit: (values: AddTalentPoolFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function AddTalentDialog({
  open,
  onOpenChange,
  employees,
  onSubmit,
  isSubmitting = false,
}: AddTalentDialogProps) {
  const form = useForm<AddTalentPoolFormValues>({
    resolver: zodResolver(addTalentPoolFormSchema),
    defaultValues: {
      employeeId: "",
      tag: "HIPO",
      reason: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        employeeId: "",
        tag: "HIPO",
        reason: "",
      });
    }
  }, [open, form]);

  const handleSubmit = async (values: AddTalentPoolFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Gắn thẻ nhân tài nội bộ</span>
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
                    <FormLabel className="text-xs font-semibold">Nhân sự được bình chọn <span className="text-destructive">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn nhân sự">
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
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Loại thẻ nhân tài <span className="text-destructive">*</span></FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn thẻ danh hiệu">
                          {field.value ? TALENT_TAG_CONFIG[field.value as keyof typeof TALENT_TAG_CONFIG]?.label || field.value : undefined}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TALENT_TAG_CONFIG).map(([k, cfg]) => (
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do bình chọn & Thành tích nổi trội <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Mô tả lý do ghi nhận nhân tài, dự án xuất sắc hoặc năng lực cốt lõi..."
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
                {isSubmitting ? "Đang lưu..." : "Xác nhận gắn thẻ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
