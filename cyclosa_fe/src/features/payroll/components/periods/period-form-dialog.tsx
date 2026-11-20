"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useCreatePayrollPeriodMutation } from "../../api/payroll-api";
import {
  createPayrollPeriodSchema,
  type CreatePayrollPeriodFormValues,
} from "../../schemas/payroll.schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PeriodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PeriodFormDialog({ open, onOpenChange }: PeriodFormDialogProps) {
  const [createPeriod, { isLoading }] = useCreatePayrollPeriodMutation();

  const form = useForm<CreatePayrollPeriodFormValues>({
    resolver: zodResolver(createPayrollPeriodSchema),
    defaultValues: {
      code: `PR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}`,
      name: `Kỳ lương tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0],
      plannedPaymentDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString().split("T")[0],
      standardWorkDays: 22,
      note: "",
    },
  });

  const onSubmit = async (values: CreatePayrollPeriodFormValues) => {
    try {
      await createPeriod(values).unwrap();
      toast.success("Tạo kỳ lương thành công");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể tạo kỳ lương");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo kỳ lương mới</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã kỳ lương *</FormLabel>
                    <FormControl>
                      <Input placeholder="PR-202611" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên kỳ lương *</FormLabel>
                    <FormControl>
                      <Input placeholder="Kỳ lương T11/2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Từ ngày *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đến ngày *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plannedPaymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày dự kiến chi trả *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="standardWorkDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Công chuẩn (ngày) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ghi chú thêm về kỳ lương..." {...field} />
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
                Tạo kỳ lương
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

