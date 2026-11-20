"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useManualAdjustRecordLineMutation } from "../../api/payroll-api";
import {
  manualAdjustmentSchema,
  type ManualAdjustmentFormValues,
} from "../../schemas/payroll.schema";
import type { PayrollRecordDto } from "../../types/payroll.types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ManualAdjustmentDialogProps {
  record: PayrollRecordDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ManualAdjustmentDialog({
  record,
  open,
  onOpenChange,
  onSuccess,
}: ManualAdjustmentDialogProps) {
  const [manualAdjust, { isLoading }] = useManualAdjustRecordLineMutation();

  const form = useForm<ManualAdjustmentFormValues>({
    resolver: zodResolver(manualAdjustmentSchema),
    defaultValues: {
      title: "Điều chỉnh phụ cấp thủ công",
      amount: 0,
      reason: "",
    },
  });

  const onSubmit = async (values: ManualAdjustmentFormValues) => {
    if (!record) return;
    try {
      await manualAdjust({
        recordId: record.id,
        body: values,
      }).unwrap();
      toast.success("Đã ghi nhận điều chỉnh thủ công và cập nhật lại bảng lương");
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể điều chỉnh dòng lương");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Điều chỉnh dòng lương thủ công</DialogTitle>
          <DialogDescription>
            Nhân viên: <span className="font-semibold text-foreground">{record?.employeeName}</span> ({record?.employeeCode})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khoản điều chỉnh *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Phụ cấp dự án đặc biệt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền điều chỉnh (VNĐ) *</FormLabel>
                  <FormControl>
                    <Input type="number" step="10000" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do giải trình (Bắt buộc theo chuẩn Kiểm toán) *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nêu rõ căn cứ điều chỉnh, quyết định phê duyệt hoặc thỏa thuận..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu điều chỉnh
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

