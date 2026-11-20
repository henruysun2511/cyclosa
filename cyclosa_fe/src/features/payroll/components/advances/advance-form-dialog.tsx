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
import { useCreateSalaryAdvanceMutation, useRequestMySalaryAdvanceMutation } from "../../api/payroll-api";
import {
  createSalaryAdvanceSchema,
  type CreateSalaryAdvanceFormValues,
} from "../../schemas/payroll.schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AdvanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEmployeeSelfService?: boolean;
}

export function AdvanceFormDialog({
  open,
  onOpenChange,
  isEmployeeSelfService = false,
}: AdvanceFormDialogProps) {
  const [createAdvanceAdmin, { isLoading: isCreatingAdmin }] = useCreateSalaryAdvanceMutation();
  const [createAdvanceMe, { isLoading: isCreatingMe }] = useRequestMySalaryAdvanceMutation();

  const isLoading = isCreatingAdmin || isCreatingMe;

  const form = useForm<CreateSalaryAdvanceFormValues>({
    resolver: zodResolver(createSalaryAdvanceSchema),
    defaultValues: {
      amount: 2000000,
      requestDate: new Date().toISOString().split("T")[0],
      reason: "",
    },
  });

  const onSubmit = async (values: CreateSalaryAdvanceFormValues) => {
    try {
      if (isEmployeeSelfService) {
        await createAdvanceMe(values).unwrap();
      } else {
        await createAdvanceAdmin(values).unwrap();
      }
      toast.success("Đã gửi đơn đề nghị tạm ứng lương thành công");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể nộp đơn tạm ứng");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Đề nghị tạm ứng lương</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền tạm ứng (VNĐ) *</FormLabel>
                  <FormControl>
                    <Input type="number" step="100000" placeholder="2.000.000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày đề nghị *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Lý do tạm ứng *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi rõ lý do xin tạm ứng (gia đình, việc cá nhân, viện phí...)"
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
                Gửi đề nghị
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

