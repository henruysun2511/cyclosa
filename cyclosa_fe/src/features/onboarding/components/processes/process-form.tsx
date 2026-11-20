"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  onboardingProcessSchema,
  type OnboardingProcessFormValues,
} from "../../schemas/onboarding.schema";
import { useGetOnboardingTemplatesQuery } from "../../api/onboarding-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";

interface ProcessFormProps {
  isSubmitting: boolean;
  onSubmit: (values: OnboardingProcessFormValues) => void;
  onCancel: () => void;
}

export function ProcessForm({
  isSubmitting,
  onSubmit,
  onCancel,
}: ProcessFormProps) {
  const { data: employeeData } = useGetEmployeesQuery({ page: 0, size: 200 });
  const employees = employeeData?.items || [];

  const { data: templateData } = useGetOnboardingTemplatesQuery({
    isActive: true,
    page: 1,
    size: 100,
  });
  const templates = templateData?.items || [];

  // Default start date = today, probation end date = +60 days
  const todayStr = new Date().toISOString().split("T")[0];
  const probationEnd = new Date();
  probationEnd.setDate(probationEnd.getDate() + 60);
  const probationEndStr = probationEnd.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OnboardingProcessFormValues>({
    resolver: zodResolver(onboardingProcessSchema),
    defaultValues: {
      employeeId: "",
      templateId: "",
      startDate: todayStr,
      probationEndDate: probationEndStr,
      mentorId: undefined,
      directManagerId: undefined,
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-border bg-card shadow-xs rounded-xl">
        <CardHeader className="py-4 px-6 border-b border-border bg-muted/20">
          <CardTitle className="text-sm font-semibold text-foreground">
            Thông tin Tiếp nhận & Kế hoạch Thử việc
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chọn Nhân viên mới */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-foreground">
                Nhân viên mới tiếp nhận <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="employeeId"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Chọn nhân sự mới tiếp nhận..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName} ({emp.employeeCode}) — {emp.currentJobTitleName || "Nhân viên"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employeeId && (
                <p className="text-xs text-destructive">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Chọn Mẫu Checklist Hội nhập */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-foreground">
                Mẫu Checklist Hội nhập áp dụng <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="templateId"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Chọn mẫu checklist phù hợp với vị trí..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((tpl) => (
                        <SelectItem key={tpl.id} value={tpl.id}>
                          {tpl.name} ({tpl.code} — {tpl.itemCount || 0} đầu việc)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.templateId && (
                <p className="text-xs text-destructive">{errors.templateId.message}</p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Hệ thống sẽ sao chép toàn bộ công việc từ mẫu đã chọn thành các nhiệm vụ thực thi riêng biệt cho nhân sự này.
              </p>
            </div>

            {/* Ngày bắt đầu làm việc */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Ngày bắt đầu làm việc (Ngày 1) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                {...register("startDate")}
                className="h-9 text-xs font-mono"
              />
              {errors.startDate && (
                <p className="text-xs text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            {/* Ngày kết thúc thử việc */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Ngày kết thúc thử việc (Dự kiến 60 ngày) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                {...register("probationEndDate")}
                className="h-9 text-xs font-mono"
              />
              {errors.probationEndDate && (
                <p className="text-xs text-destructive">{errors.probationEndDate.message}</p>
              )}
            </div>

            {/* Người hướng dẫn (Mentor/Buddy) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Người hướng dẫn (Mentor / Buddy)
              </Label>
              <Controller
                control={control}
                name="mentorId"
                render={({ field }) => (
                  <Select
                    value={field.value || "NONE"}
                    onValueChange={(val) =>
                      field.onChange(val === "NONE" ? undefined : val)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Chọn nhân sự đồng hành (Buddy)..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Chưa phân công</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName} ({emp.employeeCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-[11px] text-muted-foreground">
                Nhân sự kỳ cựu hỗ trợ hướng dẫn văn hóa và làm quen môi trường.
              </p>
            </div>

            {/* Quản lý trực tiếp */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Quản lý trực tiếp (Manager)
              </Label>
              <Controller
                control={control}
                name="directManagerId"
                render={({ field }) => (
                  <Select
                    value={field.value || "NONE"}
                    onValueChange={(val) =>
                      field.onChange(val === "NONE" ? undefined : val)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Chọn Trưởng bộ phận / Quản lý..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Chưa phân công</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName} ({emp.employeeCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-[11px] text-muted-foreground">
                Người chịu trách nhiệm đánh giá nghiệm thu cuối kỳ thử việc.
              </p>
            </div>

            {/* Ghi chú */}
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs font-semibold text-foreground">
                Ghi chú tiếp nhận & Kỳ vọng đặc biệt
              </Label>
              <Textarea
                {...register("notes")}
                placeholder="Yêu cầu chuẩn bị thiết bị cấu hình cao, lịch đón tiếp tại sảnh hoặc lưu ý sức khỏe..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3">
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
          {isSubmitting ? "Đang khởi tạo..." : "Bắt đầu Tiến trình Hội nhập"}
        </Button>
      </div>
    </form>
  );
}

