"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Loader2, AlertTriangle } from "lucide-react";
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
import { auditExportSchema, type AuditExportValues } from "../schemas/audit.schema";
import { useExportAuditLogsMutation } from "../api/audit-api";
import type { AuditLogFilters } from "../types/audit.types";

interface AuditExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters?: AuditLogFilters;
}

/**
 * Dialog xuất dữ liệu nhật ký kiểm toán ra file Excel/CSV.
 * Tự động ghi nhận hành động EXPORT vào nhật ký kiểm toán (Backend tự xử lý).
 */
export function AuditExportDialog({
  open,
  onOpenChange,
  currentFilters,
}: AuditExportDialogProps) {
  const [exportAuditLogs, { isLoading }] = useExportAuditLogsMutation();

  const form = useForm<AuditExportValues>({
    resolver: zodResolver(auditExportSchema),
    defaultValues: {
      format: "XLSX",
      from: currentFilters?.from || "",
      to: currentFilters?.to || "",
      action: currentFilters?.action || "",
      entityType: currentFilters?.entityType || "",
    },
  });

  const onSubmit = async (values: AuditExportValues) => {
    try {
      const res = await exportAuditLogs({
        format: values.format,
        from: values.from || undefined,
        to: values.to || undefined,
        action: (values.action as AuditLogFilters["action"]) || undefined,
        entityType: values.entityType || undefined,
      }).unwrap();

      const exportData = res.data;

      if (exportData.status === "COMPLETED" && exportData.downloadUrl) {
        window.open(exportData.downloadUrl, "_blank");
        toast.success(
          `Xuất thành công ${exportData.estimatedRecords.toLocaleString("vi-VN")} bản ghi nhật ký kiểm toán!`
        );
      } else {
        toast.info(
          `Yêu cầu xuất dữ liệu đã được tiếp nhận (Mã tác vụ: ${exportData.jobId}). Tệp sẽ sẵn sàng sau ít phút.`
        );
      }

      form.reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi xuất dữ liệu nhật ký kiểm toán";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4 text-primary" />
            Xuất file Nhật ký Kiểm toán
          </DialogTitle>
          <DialogDescription className="text-xs">
            Dữ liệu được xuất theo bộ lọc hiện tại. Hành động xuất dữ liệu sẽ
            được ghi nhận tự động vào nhật ký kiểm toán.
          </DialogDescription>
        </DialogHeader>

        {/* Cảnh báo tuân thủ */}
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            Thao tác xuất dữ liệu kiểm toán tuân thủ chuẩn{" "}
            <strong>ISO/IEC 27001</strong> và được lưu vết đầy đủ.
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Chọn định dạng file */}
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Định dạng file xuất *
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn định dạng...">
                          {(val: string) => {
                            if (val === "XLSX") return "📊 Excel (.xlsx) — Khuyến nghị";
                            if (val === "CSV") return "📄 CSV (.csv) — Nhẹ, dễ xử lý";
                            return val;
                          }}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XLSX" label="Excel (.xlsx)">
                          📊 Excel (.xlsx) — Khuyến nghị
                        </SelectItem>
                        <SelectItem value="CSV" label="CSV (.csv)">
                          📄 CSV (.csv) — Nhẹ, dễ xử lý
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="-mx-4 -mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    Xuất file
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

