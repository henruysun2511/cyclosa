"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  broadcastNotificationSchema,
  type BroadcastNotificationFormValues,
} from "../schemas/notification.schema";
import { useBroadcastNotificationMutation } from "../api/notification-api";

interface BroadcastNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BroadcastNotificationDialog({
  open,
  onOpenChange,
}: BroadcastNotificationDialogProps) {
  const [broadcastNotification, { isLoading }] = useBroadcastNotificationMutation();

  const form = useForm<BroadcastNotificationFormValues>({
    resolver: zodResolver(broadcastNotificationSchema),
    defaultValues: {
      title: "",
      content: "",
      actionUrl: "",
    },
  });

  const onSubmit = async (values: BroadcastNotificationFormValues) => {
    try {
      const res = await broadcastNotification({
        title: values.title.trim(),
        content: values.content.trim(),
        actionUrl: values.actionUrl?.trim() || undefined,
      }).unwrap();

      toast.success(
        `Phát thông báo thành công tới ${res.recipientsCount} nhân sự toàn công ty!`
      );
      form.reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi phát thông báo diện rộng";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Send className="h-5 w-5 text-primary" />
            <span>Phát thông báo toàn công ty</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Thông điệp này sẽ được gửi tới hòm thư cá nhân của tất cả nhân sự đang kích hoạt.
          </DialogDescription>
        </DialogHeader>

        {/* Cảnh báo an toàn */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Lưu ý:</strong> Thao tác phát thông báo toàn công ty không thể thu hồi.
            Vui lòng kiểm tra kỹ tiêu đề và nội dung trước khi gửi.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-foreground">
                    Tiêu đề thông báo <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Thông báo lịch nghỉ lễ Tết Dương lịch 2027..."
                      {...field}
                      className="text-xs h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-foreground">
                    Nội dung chi tiết <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Nhập nội dung đầy đủ thông cáo của công ty..."
                      {...field}
                      className="text-xs resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actionUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-foreground">
                    Đường dẫn liên kết (tùy chọn)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: /announcements/tet-2027 hoặc để trống"
                      {...field}
                      className="text-xs h-9"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="text-xs gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang phát tán...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Phát thông báo ngay</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

