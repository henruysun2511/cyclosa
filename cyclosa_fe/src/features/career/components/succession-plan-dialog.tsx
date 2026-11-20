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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Compass } from "lucide-react";
import {
  successionPlanFormSchema,
  type SuccessionPlanFormValues,
} from "../schemas/career.schema";
import { RISK_LEVEL_CONFIG } from "../constants/career.constants";
import type { SuccessionPlanItem } from "../types/career.types";

interface SuccessionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: SuccessionPlanItem | null;
  departments: { id: string; name: string }[];
  jobTitles: { id: string; name: string; code: string }[];
  onSubmit: (values: SuccessionPlanFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function SuccessionPlanDialog({
  open,
  onOpenChange,
  mode,
  initialData,
  departments,
  jobTitles,
  onSubmit,
  isSubmitting = false,
}: SuccessionPlanDialogProps) {
  const form = useForm<SuccessionPlanFormValues>({
    resolver: zodResolver(successionPlanFormSchema),
    defaultValues: {
      departmentId: "",
      jobTitleId: "",
      riskLevel: "MEDIUM",
      reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        form.reset({
          departmentId: initialData.departmentId,
          jobTitleId: initialData.jobTitleId,
          riskLevel: initialData.riskLevel,
          reviewDate: initialData.reviewDate || "",
        });
      } else {
        form.reset({
          departmentId: "",
          jobTitleId: "",
          riskLevel: "MEDIUM",
          reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        });
      }
    }
  }, [open, mode, initialData, form]);

  const handleSubmit = async (values: SuccessionPlanFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Compass className="h-5 w-5 text-primary" />
            <span>
              {mode === "create"
                ? "Lập kế hoạch kế nhiệm mới"
                : "Cập nhật kế hoạch kế nhiệm"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => {
                const selectedDept = departments.find((d) => d.id === field.value);
                return (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Phòng ban trực thuộc <span className="text-destructive">*</span></FormLabel>
                    <Select
                      disabled={mode === "edit"}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn phòng ban">
                            {selectedDept ? selectedDept.name : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id} className="text-xs">
                            {d.name}
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
              name="jobTitleId"
              render={({ field }) => {
                const selectedJob = jobTitles.find((jt) => jt.id === field.value);
                return (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Chức danh trọng yếu <span className="text-destructive">*</span></FormLabel>
                    <Select
                      disabled={mode === "edit"}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn chức danh trọng yếu">
                            {selectedJob ? `${selectedJob.name} (${selectedJob.code})` : undefined}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Mức độ rủi ro <span className="text-destructive">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn mức rủi ro">
                            {field.value ? RISK_LEVEL_CONFIG[field.value as keyof typeof RISK_LEVEL_CONFIG]?.label || field.value : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(RISK_LEVEL_CONFIG).map(([k, cfg]) => (
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
                name="reviewDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Ngày rà soát định kỳ <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-9 text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="h-8 text-xs border-border"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : mode === "create"
                  ? "Tạo kế hoạch"
                  : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
