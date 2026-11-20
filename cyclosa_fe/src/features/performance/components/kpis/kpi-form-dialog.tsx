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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  kpiFormSchema,
  type KpiFormValues,
} from "../../schemas/performance.schema";
import type { KpiDto } from "../../types/performance.types";

interface DepartmentOption {
  id: string;
  name: string;
}

interface KpiFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: KpiDto | null;
  departments: DepartmentOption[];
  onSubmit: (values: KpiFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function KpiFormDialog({
  open,
  onOpenChange,
  entity,
  departments,
  onSubmit,
  isLoading,
}: KpiFormDialogProps) {
  const isEditing = Boolean(entity);

  const form = useForm<KpiFormValues>({
    resolver: zodResolver(kpiFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      unit: "%",
      defaultTarget: 100,
      departmentId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (entity) {
        form.reset({
          code: entity.code,
          name: entity.name,
          description: entity.description || "",
          unit: entity.unit,
          defaultTarget: entity.defaultTarget,
          departmentId: entity.departmentId || "",
          isActive: entity.isActive,
        });
      } else {
        form.reset({
          code: "",
          name: "",
          description: "",
          unit: "%",
          defaultTarget: 100,
          departmentId: "",
          isActive: true,
        });
      }
    }
  }, [open, entity, form]);

  const handleSubmit = async (values: KpiFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Cập nhật chỉ số KPI" : "Thêm chỉ số KPI mới"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Chỉnh sửa thông số, đơn vị tính và định mức của chỉ số đo lường."
              : "Khai báo chỉ số đo lường hiệu suất dùng chung cho doanh nghiệp hoặc phòng ban."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Mã chỉ số <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: SALES_REV_01"
                        className="h-9 text-xs font-mono"
                        disabled={isEditing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Đơn vị tính <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: %, Triệu VNĐ, Điểm, Giờ"
                        className="h-9 text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Tên chỉ số KPI <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Tỷ lệ hoàn thành doanh thu bán hàng"
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
                name="defaultTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Chỉ tiêu mặc định
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
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Phòng ban áp dụng
                    </FormLabel>
                    <Select
                      value={field.value || "GLOBAL"}
                      onValueChange={(val) => field.onChange(val === "GLOBAL" ? "" : (val || ""))}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Toàn công ty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GLOBAL">Toàn công ty (Dùng chung)</SelectItem>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel className="text-xs font-medium">Phương pháp đo lường & Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Công thức tính toán, nguồn trích xuất dữ liệu nghiệm thu..."
                      className="text-xs resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-xs">
                  <div className="space-y-0.5">
                    <FormLabel className="text-xs font-medium">
                      Kích hoạt chỉ số KPI
                    </FormLabel>
                    <p className="text-[11px] text-muted-foreground">
                      Cho phép gán vào phiếu đánh giá của nhân sự
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                <span>{isEditing ? "Lưu thay đổi" : "Thêm chỉ số"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
