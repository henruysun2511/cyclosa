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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRejectResignationMutation } from "../../api/offboarding-api";
import {
  rejectResignationSchema,
  type RejectResignationFormValues,
} from "../../schemas/offboarding.schema";
import type { OffboardingRequest } from "../../types/offboarding.types";

interface RejectResignationDialogProps {
  request: OffboardingRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RejectResignationDialog({
  request,
  open,
  onOpenChange,
}: RejectResignationDialogProps) {
  const [rejectResignation, { isLoading }] = useRejectResignationMutation();

  const form = useForm<RejectResignationFormValues>({
    resolver: zodResolver(rejectResignationSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const onSubmit = async (values: RejectResignationFormValues) => {
    if (!request) return;

    try {
      await rejectResignation({
        id: request.id,
        payload: {
          rejectionReason: values.rejectionReason,
        },
      }).unwrap();

      toast.success("Từ chối đơn xin thôi việc thành công");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể từ chối đơn thôi việc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Từ chối Đơn xin thôi việc</DialogTitle>
        </DialogHeader>

        <div className="text-xs text-muted-foreground p-3 bg-muted/40 rounded-lg">
          <div>Nhân viên: <strong className="text-foreground">{request?.employeeName}</strong> ({request?.employeeCode})</div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do từ chối đơn <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do không phê duyệt đơn xin thôi việc (chưa đủ thời hạn báo trước, đang trong thời gian cam kết đào tạo...)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} variant="destructive">
                {isLoading ? "Đang xử lý..." : "Xác nhận Từ chối"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
