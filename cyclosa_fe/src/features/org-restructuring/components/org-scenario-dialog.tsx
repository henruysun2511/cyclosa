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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createOrgScenarioSchema,
  type CreateOrgScenarioFormValues,
} from "../schemas/org-restructuring.schemas";
import { SCENARIO_SCOPE_CONFIG } from "../constants/org-restructuring.constants";
import { FolderGit2, Loader2 } from "lucide-react";

interface OrgScenarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateOrgScenarioFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function OrgScenarioDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: OrgScenarioDialogProps) {
  const form = useForm<CreateOrgScenarioFormValues>({
    resolver: zodResolver(createOrgScenarioSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      scope: "COMPANY_WIDE",
      targetEffectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        code: `SCENARIO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
        description: "",
        scope: "COMPANY_WIDE",
        targetEffectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    }
  }, [open, form]);

  const handleSubmit = async (values: CreateOrgScenarioFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <FolderGit2 className="h-5 w-5 text-primary" />
            <span>Khởi tạo Kịch bản Tái cơ cấu Tổ chức</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
          {/* Tên kịch bản */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium">
              Tên kịch bản tái cơ cấu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="VD: Phương án sáp nhập Khối Sản phẩm & Công nghệ 2027"
              className="text-xs h-9"
            />
            {form.formState.errors.name && (
              <p className="text-[11px] text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Hàng 2: Mã kịch bản & Phạm vi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs font-medium">
                Mã kịch bản <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                {...form.register("code")}
                placeholder="VD: SCENARIO-2027-01"
                className="text-xs h-9 uppercase font-mono"
              />
              {form.formState.errors.code && (
                <p className="text-[11px] text-destructive">{form.formState.errors.code.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scope" className="text-xs font-medium">
                Phạm vi áp dụng <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch("scope")}
                onValueChange={(val) => form.setValue("scope", val as any)}
              >
                <SelectTrigger id="scope" className="text-xs h-9">
                  <SelectValue placeholder="Chọn phạm vi" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SCENARIO_SCOPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ngày hiệu lực dự kiến */}
          <div className="space-y-1.5">
            <Label htmlFor="targetEffectiveDate" className="text-xs font-medium">
              Ngày hiệu lực dự kiến <span className="text-destructive">*</span>
            </Label>
            <Input
              id="targetEffectiveDate"
              type="date"
              {...form.register("targetEffectiveDate")}
              className="text-xs h-9"
            />
            {form.formState.errors.targetEffectiveDate && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.targetEffectiveDate.message}
              </p>
            )}
          </div>

          {/* Mô tả mục tiêu */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium">
              Mục tiêu & Bối cảnh tái cấu trúc
            </Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Nêu rõ lý do tái cơ cấu, mục tiêu định biên, tối ưu ngân sách..."
              rows={3}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={isLoading} className="text-xs">
              {isLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              <span>Khởi tạo & Clone Snapshot</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
