"use client";

import React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateItemBuilder } from "./template-item-builder";
import {
  onboardingTemplateSchema,
  type OnboardingTemplateFormValues,
} from "../../schemas/onboarding.schema";
import type {
  OnboardingTemplateDto,
  CreateTemplateItemPayload,
} from "../../types/onboarding.types";
import { useGetDepartmentsQuery } from "@/features/organization/api/department-api";

interface TemplateFormProps {
  initialData?: OnboardingTemplateDto;
  isSubmitting: boolean;
  onSubmit: (values: OnboardingTemplateFormValues) => void;
  onCancel: () => void;
}

export function TemplateForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: TemplateFormProps) {
  const { data: departmentData } = useGetDepartmentsQuery({ page: 0, size: 100 });
  const departments = departmentData?.items || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OnboardingTemplateFormValues>({
    resolver: zodResolver(onboardingTemplateSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      departmentId: initialData?.departmentId || undefined,
      isActive: initialData ? initialData.isActive : true,
      items: initialData?.items?.map((it) => ({
        title: it.title,
        description: it.description,
        taskGroup: it.taskGroup,
        targetDayOffset: it.targetDayOffset,
        sequenceOrder: it.sequenceOrder,
        isMandatory: it.isMandatory,
        defaultAssigneeRole: it.defaultAssigneeRole,
        itAccountTypeId: it.itAccountTypeId,
        documentRequired: it.documentRequired ?? false,
      })) || [],
    },
  });

  const currentItems = useWatch({ control, name: "items" }) || [];

  const handleItemsChange = (newItems: CreateTemplateItemPayload[]) => {
    setValue(
      "items",
      newItems.map((it, idx) => ({
        ...it,
        sequenceOrder: idx + 1,
        isMandatory: Boolean(it.isMandatory),
        documentRequired: Boolean(it.documentRequired),
      })),
      { shouldValidate: true }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── 1. Thông tin Chung của Mẫu Checklist ─────────────────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl">
        <CardHeader className="py-4 px-6 border-b border-border bg-muted/20">
          <CardTitle className="text-sm font-semibold text-foreground">
            Thông tin Chung Mẫu Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên mẫu checklist */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-foreground">
                Tên mẫu checklist <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("name")}
                placeholder="VD: Mẫu Hội nhập Kỹ sư Phát triển Phần mềm (Fullstack/Frontend)"
                className="h-9 text-xs"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Phòng ban áp dụng */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Phòng ban áp dụng (Tùy chọn)
              </Label>
              <Controller
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <Select
                    value={field.value || "ALL"}
                    onValueChange={(val) =>
                      field.onChange(val === "ALL" ? undefined : val)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Toàn công ty (Áp dụng chung)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Toàn công ty (Áp dụng chung)</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-[11px] text-muted-foreground">
                Để trống nếu muốn áp dụng mẫu này cho toàn bộ nhân sự mới của doanh nghiệp.
              </p>
            </div>

            {/* Kích hoạt */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <Label className="text-xs font-semibold text-foreground">
                Trạng thái hoạt động
              </Label>
              <div className="flex items-center gap-2 pt-1">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="template-active-switch"
                    />
                  )}
                />
                <Label
                  htmlFor="template-active-switch"
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Cho phép sử dụng mẫu này khi tiếp nhận nhân sự mới
                </Label>
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-foreground">
                Mục đích & Hướng dẫn sử dụng mẫu
              </Label>
              <Textarea
                {...register("description")}
                placeholder="Ghi chú về đối tượng nhân viên, lộ trình đào tạo hoặc lưu ý của Trưởng phòng nhân sự..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Bộ Dựng Công việc theo 5 Nhóm việc ─────────────────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl">
        <CardHeader className="py-4 px-6 border-b border-border bg-muted/20">
          <CardTitle className="text-sm font-semibold text-foreground">
            Danh mục Đầu việc Chuẩn hóa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <TemplateItemBuilder
            items={currentItems}
            onChange={handleItemsChange}
          />
        </CardContent>
      </Card>

      {/* ── 3. Action Buttons ────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-9 px-4 text-xs"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="h-9 px-5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isSubmitting ? "Đang lưu..." : initialData ? "Lưu thay đổi mẫu" : "Tạo mẫu checklist"}
        </Button>
      </div>
    </form>
  );
}

