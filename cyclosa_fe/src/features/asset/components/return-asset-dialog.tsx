"use client";

import React, { useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  returnAssetFormSchema,
  type ReturnAssetFormValues,
} from "../schemas/asset.schema";
import { ASSET_CONDITION_LABELS } from "../constants/asset.constants";
import type { AssetSummary } from "../types/asset.types";

interface ReturnAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: AssetSummary | null;
  onSubmit: (values: ReturnAssetFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function ReturnAssetDialog({
  open,
  onOpenChange,
  asset,
  onSubmit,
  isLoading = false,
}: ReturnAssetDialogProps) {
  const form = useForm<ReturnAssetFormValues>({
    resolver: zodResolver(returnAssetFormSchema) as any,
    defaultValues: {
      returnedAt: new Date().toISOString().slice(0, 16),
      conditionOnReturn: "GOOD",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        returnedAt: new Date().toISOString().slice(0, 16),
        conditionOnReturn: asset?.conditionStatus || "GOOD",
        notes: "",
      });
    }
  }, [open, asset, form]);

  const handleSubmit = async (values: ReturnAssetFormValues) => {
    await onSubmit(values);
  };

  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Ghi nhận thu hồi / Hoàn trả tài sản
          </DialogTitle>
          <DialogDescription className="text-xs">
            Thu hồi tài sản <strong className="text-foreground">{asset.name}</strong> ({asset.assetCode}) từ nhân sự{" "}
            <strong className="text-foreground">
              {asset.currentEmployeeName || "Nhân viên"}
            </strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Thời điểm hoàn trả */}
            <FormField
              control={form.control}
              name="returnedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Thời điểm thu hồi <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      className="h-9 text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tình trạng lúc nhận lại */}
            <FormField
              control={form.control}
              name="conditionOnReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Tình trạng thiết bị khi thu hồi
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn tình trạng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ASSET_CONDITION_LABELS).map(([k, label]) => (
                        <SelectItem key={k} value={k}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ghi chú */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Ghi chú thu hồi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="VD: Thu hồi do chuyển phòng ban / nghỉ việc; máy hoạt động bình thường, đầy đủ phụ kiện..."
                      rows={2}
                      {...field}
                      className="text-xs resize-none"
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
                className="text-xs"
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="text-xs bg-amber-600 hover:bg-amber-700">
                {isLoading ? "Đang xử lý..." : "Xác nhận thu hồi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
