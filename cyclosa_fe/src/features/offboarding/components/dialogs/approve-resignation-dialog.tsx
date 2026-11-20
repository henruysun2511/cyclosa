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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useApproveResignationMutation } from "../../api/offboarding-api";
import {
  approveResignationSchema,
  type ApproveResignationFormValues,
} from "../../schemas/offboarding.schema";
import type { OffboardingRequest } from "../../types/offboarding.types";

interface ApproveResignationDialogProps {
  request: OffboardingRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApproveResignationDialog({
  request,
  open,
  onOpenChange,
}: ApproveResignationDialogProps) {
  const [approveResignation, { isLoading }] = useApproveResignationMutation();

  const form = useForm<ApproveResignationFormValues>({
    resolver: zodResolver(approveResignationSchema),
    defaultValues: {
      actualLastWorkingDate: request?.actualLastWorkingDate || "",
      notes: "",
    },
  });

  const onSubmit = async (values: ApproveResignationFormValues) => {
    if (!request) return;

    try {
      await approveResignation({
        id: request.id,
        payload: {
          actualLastWorkingDate: values.actualLastWorkingDate || undefined,
          notes: values.notes || undefined,
        },
      }).unwrap();

      toast.success("Phê duyệt đơn xin thôi việc thành công");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể phê duyệt đơn thôi việc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Phê duyệt Đơn xin thôi việc</DialogTitle>
        </DialogHeader>

        <div className="text-xs text-muted-foreground p-3 bg-muted/40 rounded-lg">
          <div>Nhân viên: <strong className="text-foreground">{request?.employeeName}</strong> ({request?.employeeCode})</div>
          <div>Ngày mong muốn: <strong className="text-foreground">{request?.desiredLastWorkingDate}</strong></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="actualLastWorkingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày làm việc cuối cùng phê duyệt</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ý kiến phê duyệt & Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ý kiến của cấp quản lý / HR phê duyệt..."
                      rows={3}
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
              <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                {isLoading ? "Đang xử lý..." : "Xác nhận Phê duyệt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
