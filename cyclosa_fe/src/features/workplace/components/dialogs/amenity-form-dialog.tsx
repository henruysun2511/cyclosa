"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { amenityFormSchema, type AmenityFormValues } from "../../schemas/workplace.schema";

interface AmenityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AmenityFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function AmenityFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: AmenityFormDialogProps) {
  const form = useForm<AmenityFormValues>({
    resolver: zodResolver(amenityFormSchema),
    defaultValues: {
      name: "",
      iconName: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        iconName: "",
        description: "",
      });
    }
  }, [open, form]);

  const handleSubmit = async (values: AmenityFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Thêm tiện ích bàn làm việc mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Tên tiện ích *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Màn hình 27 inch 4K, Ghế công thái học..."
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Mã icon (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: monitor, armchair, power, cable..."
                      className="h-9 font-mono text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả công năng của trang thiết bị hoặc hướng dẫn sử dụng..."
                      className="resize-none text-xs min-h-[70px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Lưu tiện ích
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
