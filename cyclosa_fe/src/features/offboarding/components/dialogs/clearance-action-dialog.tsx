"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUpdateClearanceItemMutation } from "../../api/offboarding-api";
import {
  updateClearanceItemSchema,
  type UpdateClearanceItemFormValues,
} from "../../schemas/offboarding.schema";
import type { OffboardingClearanceItem } from "../../types/offboarding.types";
import { CLEARANCE_TYPE_CONFIG } from "../../constants/offboarding.constants";

interface ClearanceActionDialogProps {
  requestId: string;
  item: OffboardingClearanceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClearanceActionDialog({
  requestId,
  item,
  open,
  onOpenChange,
}: ClearanceActionDialogProps) {
  const [updateClearanceItem, { isLoading }] = useUpdateClearanceItemMutation();

  const form = useForm<UpdateClearanceItemFormValues>({
    resolver: zodResolver(updateClearanceItemSchema),
    defaultValues: {
      status: "CLEARED",
      notes: "",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        status: item.status === "PENDING" ? "CLEARED" : item.status,
        notes: item.notes || "",
      });
    }
  }, [item, form]);

  const onSubmit = async (values: UpdateClearanceItemFormValues) => {
    if (!item) return;

    try {
      await updateClearanceItem({
        requestId,
        itemId: item.id,
        payload: {
          status: values.status,
          notes: values.notes || undefined,
        },
      }).unwrap();

      toast.success("Cập nhật trạng thái bàn giao thành công");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể cập nhật hạng mục bàn giao");
    }
  };

  const typeConfig = item ? CLEARANCE_TYPE_CONFIG[item.clearanceType] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận Hạng mục Bàn giao</DialogTitle>
        </DialogHeader>

        {typeConfig && (
          <div className="p-3 bg-muted/40 rounded-lg space-y-1">
            <div className="text-sm font-semibold text-foreground">
              {typeConfig.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {typeConfig.description}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái bàn giao <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CLEARED">Đã hoàn tất bàn giao</SelectItem>
                      <SelectItem value="REJECTED">Chưa đạt yêu cầu / Từ chối</SelectItem>
                      <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú xác nhận / Lý do từ chối</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi nhận tình trạng tài sản, công việc dở dang, biên bản bàn giao..."
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : "Lưu xác nhận"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
