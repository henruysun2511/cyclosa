"use client";

import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteFormSchema, type SiteFormValues } from "../../schemas/workplace.schema";
import type { WorkplaceSite } from "../../types/workplace.types";

interface SiteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site?: WorkplaceSite | null;
  branches: { id: string; name: string }[];
  onSubmit: (values: SiteFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function SiteFormDialog({
  open,
  onOpenChange,
  site,
  branches,
  onSubmit,
  isLoading,
}: SiteFormDialogProps) {
  const isEdit = Boolean(site);

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      branchId: branches[0]?.id || "",
      code: "",
      name: "",
      address: "",
      description: "",
    },
  });

  useEffect(() => {
    if (site) {
      form.reset({
        branchId: site.branchId || branches[0]?.id || "",
        code: site.code || "",
        name: site.name || "",
        address: site.address || "",
        description: site.description || "",
      });
    } else {
      form.reset({
        branchId: branches[0]?.id || "",
        code: "",
        name: "",
        address: "",
        description: "",
      });
    }
  }, [site, branches, form]);

  const handleSubmit = async (values: SiteFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Cập nhật thông tin cơ sở" : "Thêm mới cơ sở / tòa nhà"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Chi nhánh trực thuộc *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isEdit}>
                    <FormControl>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Chọn chi nhánh">
                          {(val: string) => {
                            if (!val) return "Chọn chi nhánh";
                            const b = branches.find((item) => item.id === val);
                            return b ? b.name : "Chọn chi nhánh";
                          }}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={b.id} label={b.name} className="text-xs">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Mã cơ sở *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="VD: SITE-HN-01"
                        className="text-xs h-9 uppercase font-mono"
                        disabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Tên tòa nhà *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VD: Tòa nhà Keangnam" className="text-xs h-9" />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Địa chỉ thực tế *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="VD: Phạm Hùng, Nam Từ Liêm, Hà Nội" className="text-xs h-9" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Mô tả thêm</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Ghi chú chi tiết về cơ sở..." className="text-xs resize-none" rows={3} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="gap-1.5">
                {isLoading && <span className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                <span>{isEdit ? "Lưu thay đổi" : "Tạo cơ sở"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
