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
  goalFormSchema,
  type GoalFormValues,
} from "../../schemas/performance.schema";
import type { PerformanceGoalDto, KpiDto } from "../../types/performance.types";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: PerformanceGoalDto | null;
  kpis: KpiDto[];
  remainingWeight: number;
  onSubmit: (values: GoalFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function GoalFormDialog({
  open,
  onOpenChange,
  entity,
  kpis,
  remainingWeight,
  onSubmit,
  isLoading,
}: GoalFormDialogProps) {
  const isEditing = Boolean(entity);
  const maxAllowedWeight = isEditing
    ? remainingWeight + (entity?.weight || 0)
    : remainingWeight;

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      targetValue: undefined,
      kpiId: "",
      weight: 10,
    },
  });

  useEffect(() => {
    if (open) {
      if (entity) {
        form.reset({
          name: entity.name,
          targetValue: entity.targetValue,
          kpiId: entity.kpiId || "",
          weight: entity.weight,
        });
      } else {
        form.reset({
          name: "",
          targetValue: undefined,
          kpiId: "",
          weight: Math.min(20, Math.max(1, maxAllowedWeight)),
        });
      }
    }
  }, [open, entity, form, maxAllowedWeight]);

  const handleKpiSelect = (kpiId: string) => {
    form.setValue("kpiId", kpiId === "NONE" ? "" : kpiId);
    if (kpiId !== "NONE") {
      const selected = kpis.find((k) => k.id === kpiId);
      if (selected) {
        if (!form.getValues("name")) {
          form.setValue("name", selected.name);
        }
        if (selected.defaultTarget !== undefined && selected.defaultTarget !== null) {
          form.setValue("targetValue", selected.defaultTarget);
        }
      }
    }
  };

  const handleSubmit = async (values: GoalFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Cập nhật mục tiêu đánh giá" : "Thêm mục tiêu đánh giá"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Thiết lập mục tiêu công việc hoặc liên kết chỉ số KPI có sẵn trong danh mục.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="kpiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Liên kết chỉ số KPI (Tùy chọn)
                  </FormLabel>
                  <Select
                    value={field.value || "NONE"}
                    onValueChange={(val) => handleKpiSelect(val || "NONE")}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn chỉ số KPI có sẵn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">Không liên kết (Mục tiêu tự do)</SelectItem>
                      {kpis.map((k) => (
                        <SelectItem key={k.id} value={k.id}>
                          [{k.code}] {k.name} ({k.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Tên mục tiêu <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Đạt 100% doanh thu dự án ERP"
                      className="h-9 text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Chỉ tiêu cần đạt (Target)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 100"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Trọng số (%) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="VD: 25"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Còn lại: {maxAllowedWeight.toFixed(1)}%
                    </p>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

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
                <span>{isEditing ? "Lưu mục tiêu" : "Thêm mục tiêu"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
