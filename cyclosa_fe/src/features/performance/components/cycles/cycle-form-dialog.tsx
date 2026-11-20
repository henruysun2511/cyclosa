"use client";

import { useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import {
  cycleFormSchema,
  type CycleFormValues,
} from "../../schemas/performance.schema";
import { PERFORMANCE_CYCLE_TYPE_LABELS } from "../../constants/performance.constants";
import type { PerformanceCycleDto } from "../../types/performance.types";

interface CycleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: PerformanceCycleDto | null;
  onSubmit: (values: CycleFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function CycleFormDialog({
  open,
  onOpenChange,
  entity,
  onSubmit,
  isLoading,
}: CycleFormDialogProps) {
  const isEditing = Boolean(entity);
  const currentYear = new Date().getFullYear();

  const form = useForm<CycleFormValues>({
    resolver: zodResolver(cycleFormSchema),
    defaultValues: {
      name: "",
      cycleType: "QUARTERLY",
      year: currentYear,
      startDate: "",
      endDate: "",
      selfReviewDeadline: "",
      managerReviewDeadline: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (entity) {
        form.reset({
          name: entity.name,
          cycleType: entity.cycleType,
          year: entity.year,
          startDate: entity.startDate?.slice(0, 10) || "",
          endDate: entity.endDate?.slice(0, 10) || "",
          selfReviewDeadline: entity.selfReviewDeadline?.slice(0, 10) || "",
          managerReviewDeadline: entity.managerReviewDeadline?.slice(0, 10) || "",
          description: entity.description || "",
        });
      } else {
        form.reset({
          name: "",
          cycleType: "QUARTERLY",
          year: currentYear,
          startDate: "",
          endDate: "",
          selfReviewDeadline: "",
          managerReviewDeadline: "",
          description: "",
        });
      }
    }
  }, [open, entity, form, currentYear]);

  const handleSubmit = async (values: CycleFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Cập nhật kỳ đánh giá" : "Tạo kỳ đánh giá mới"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Chỉnh sửa thông tin thiết lập kỳ đánh giá hiệu suất nhân sự."
              : "Thiết lập chu kỳ, thời hạn tự đánh giá và thời hạn quản lý phê duyệt."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Tên kỳ đánh giá <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Đánh giá hiệu suất Quý 1/2026"
                      className="h-9 text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="cycleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Phân loại kỳ <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => field.onChange(val || "QUARTERLY")}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn loại chu kỳ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">
                          {PERFORMANCE_CYCLE_TYPE_LABELS.MONTHLY}
                        </SelectItem>
                        <SelectItem value="QUARTERLY">
                          {PERFORMANCE_CYCLE_TYPE_LABELS.QUARTERLY}
                        </SelectItem>
                        <SelectItem value="HALF_YEAR">
                          {PERFORMANCE_CYCLE_TYPE_LABELS.HALF_YEAR}
                        </SelectItem>
                        <SelectItem value="ANNUAL">
                          {PERFORMANCE_CYCLE_TYPE_LABELS.ANNUAL}
                        </SelectItem>
                        <SelectItem value="PROBATION">
                          {PERFORMANCE_CYCLE_TYPE_LABELS.PROBATION}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Năm áp dụng <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-9 text-xs"
                        disabled={isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Ngày bắt đầu kỳ <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9 text-xs" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Ngày kết thúc kỳ <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9 text-xs" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="selfReviewDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Hạn chót nhân viên tự đánh giá
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9 text-xs" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerReviewDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Hạn chót quản lý chấm điểm
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="h-9 text-xs" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Ghi chú & Hướng dẫn</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả mục tiêu trọng tâm, tiêu chí chấm điểm của kỳ..."
                      className="text-xs resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="h-8 text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="h-8 text-xs gap-1.5"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isEditing ? "Lưu thay đổi" : "Tạo kỳ đánh giá"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
