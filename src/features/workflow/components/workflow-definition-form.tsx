"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building2,
  GitFork,
  Shield,
  User,
  DollarSign,
  AlertCircle,
  Save,
  ArrowLeft,
  Loader2,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetCompaniesQuery } from "@/features/organization/api";
import { useGetRolesQuery } from "@/features/authorization/api/role-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import {
  workflowDefinitionFormSchema,
  type WorkflowDefinitionFormValues,
} from "../schemas/workflow.schema";
import {
  REQUEST_TYPE_OPTIONS,
  APPROVER_TYPE_OPTIONS,
  CONDITION_TYPE_OPTIONS,
} from "../constants/workflow.constants";
import type { WorkflowDefinitionDetailResponse } from "../types/workflow.types";
import { cn } from "@/lib/utils";
import { WorkflowFlowCanvas } from "./workflow-flow-canvas";

interface WorkflowDefinitionFormProps {
  initialData?: WorkflowDefinitionDetailResponse;
  onSubmit: (values: WorkflowDefinitionFormValues) => Promise<void>;
  isLoading: boolean;
  mode: "create" | "edit";
}

export function WorkflowDefinitionForm({
  initialData,
  onSubmit,
  isLoading,
  mode,
}: WorkflowDefinitionFormProps) {
  const router = useRouter();

  // Load companies
  const { data: companiesData } = useGetCompaniesQuery({ size: 100 });
  const companies = companiesData?.items || [];

  // Load roles
  const { data: rolesData } = useGetRolesQuery({ size: 100 });
  const roles = rolesData?.data?.items || [];

  // Load employees
  const { data: employeesData } = useGetEmployeesQuery({ size: 100 });
  const employees = employeesData?.items || [];

  const defaultValues: WorkflowDefinitionFormValues = initialData
    ? {
        companyId: initialData.companyId,
        requestType: initialData.requestType,
        name: initialData.name,
        description: initialData.description || "",
        steps: initialData.steps.map((s) => ({
          id: s.id,
          stepOrder: s.stepOrder,
          stepName: s.stepName,
          approverType: s.approverType,
          approverRoleId: s.approverRoleId || undefined,
          approverEmployeeId: s.approverEmployeeId || undefined,
          conditionType: s.conditionType,
          conditionThreshold: s.conditionThreshold ? Number(s.conditionThreshold) : undefined,
        })),
      }
    : {
        companyId: "",
        requestType: "CONTRACT",
        name: "",
        description: "",
        steps: [
          {
            stepOrder: 1,
            stepName: "Quản lý trực tiếp phê duyệt",
            approverType: "DIRECT_MANAGER",
            conditionType: "ALWAYS",
          },
        ],
      };

  const form = useForm<WorkflowDefinitionFormValues>({
    resolver: zodResolver(workflowDefinitionFormSchema),
    defaultValues,
  });

  const [viewMode, setViewMode] = React.useState<"canvas" | "list">("canvas");

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const handleAddStep = () => {
    const nextOrder = fields.length + 1;
    append({
      stepOrder: nextOrder,
      stepName: `Bước ${nextOrder}`,
      approverType: "ROLE",
      conditionType: "ALWAYS",
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
      form.setValue(`steps.${index - 1}.stepOrder`, index);
      form.setValue(`steps.${index}.stepOrder`, index + 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
      form.setValue(`steps.${index + 1}.stepOrder`, index + 2);
      form.setValue(`steps.${index}.stepOrder`, index + 1);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Thông tin cơ bản quy trình */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-base font-semibold">
            Thông tin chung quy trình
          </CardTitle>
          <CardDescription className="text-xs">
            Xác lập phạm vi công ty, loại chứng từ áp dụng và tên gọi của quy trình.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Công ty áp dụng */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Công ty áp dụng <span className="text-destructive">*</span>
            </Label>
            <Select
              disabled={mode === "edit"}
              value={form.watch("companyId")}
              onValueChange={(val) => form.setValue("companyId", val || "", { shouldValidate: true })}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn công ty">
                  {(() => {
                    const cId = form.watch("companyId");
                    const c = companies.find((x) => x.id === cId);
                    return c ? `${c.name} (${c.code})` : undefined;
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.companyId && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.companyId.message}
              </p>
            )}
          </div>

          {/* Loại chứng từ */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Loại chứng từ <span className="text-destructive">*</span>
            </Label>
            <Select
              disabled={mode === "edit"}
              value={form.watch("requestType")}
              onValueChange={(val: any) =>
                form.setValue("requestType", val, { shouldValidate: true })
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn loại chứng từ">
                  {REQUEST_TYPE_OPTIONS.find((opt) => opt.value === form.watch("requestType"))?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REQUEST_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.requestType && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.requestType.message}
              </p>
            )}
          </div>

          {/* Tên quy trình */}
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium">
              Tên quy trình phê duyệt <span className="text-destructive">*</span>
            </Label>
            <Input
              {...form.register("name")}
              placeholder="VD: Quy trình phê duyệt Hợp đồng lao động & Phụ cấp"
              className="h-9 text-xs"
            />
            {form.formState.errors.name && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-medium">Mô tả / Ghi chú áp dụng</Label>
            <Textarea
              {...form.register("description")}
              rows={2}
              placeholder="Nhập mô tả chi tiết đối tượng hoặc điều kiện áp dụng quy trình..."
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cấu hình các bước duyệt (Step Builder) */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Cấu hình các cấp phê duyệt
            </CardTitle>
            <CardDescription className="text-xs">
              Thiết lập thứ tự duyệt tuần tự, người phê duyệt và điều kiện kích hoạt từng bước.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border">
              <Button
                type="button"
                variant={viewMode === "canvas" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("canvas")}
                className="h-7 px-2.5 text-xs gap-1.5 shadow-none"
              >
                <GitFork className="w-3.5 h-3.5 text-primary" />
                Bảng vẽ luồng
              </Button>
              <Button
                type="button"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-7 px-2.5 text-xs gap-1.5 shadow-none"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                Danh sách
              </Button>
            </div>

            {viewMode === "list" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStep}
                className="h-8 text-xs bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm cấp duyệt
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {form.formState.errors.steps && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{form.formState.errors.steps.message}</span>
            </div>
          )}

          {viewMode === "canvas" ? (
            <WorkflowFlowCanvas
              steps={form.watch("steps") as any}
              onChangeSteps={(newSteps) => {
                form.setValue("steps", newSteps, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              roles={roles}
              employees={employees}
            />
          ) : (
            fields.map((field, index) => {
              const approverType = form.watch(`steps.${index}.approverType`);
              const conditionType = form.watch(`steps.${index}.conditionType`);
              const stepErrors = form.formState.errors.steps?.[index];

              return (
                <div
                  key={field.id}
                  className="relative p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors space-y-3"
                >
                  {/* Header step */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        Cấp duyệt thứ {index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={index === fields.length - 1}
                        onClick={() => handleMoveDown(index)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={fields.length <= 1}
                        onClick={() => remove(index)}
                        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Tên bước */}
                    <div className="space-y-1 md:col-span-1">
                      <Label className="text-[11px] font-medium">
                        Tên bước duyệt <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        {...form.register(`steps.${index}.stepName`)}
                        placeholder="VD: Quản lý trực tiếp xác nhận"
                        className="h-8 text-xs"
                      />
                      {stepErrors?.stepName && (
                        <p className="text-[10px] text-destructive">
                          {stepErrors.stepName.message}
                        </p>
                      )}
                    </div>

                    {/* Loại người duyệt */}
                    <div className="space-y-1 md:col-span-1">
                      <Label className="text-[11px] font-medium">
                        Đối tượng duyệt <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={approverType}
                        onValueChange={(val: any) => {
                          form.setValue(`steps.${index}.approverType`, val, {
                            shouldValidate: true,
                          });
                          if (val !== "ROLE") form.setValue(`steps.${index}.approverRoleId`, null);
                          if (val !== "SPECIFIC_EMPLOYEE")
                            form.setValue(`steps.${index}.approverEmployeeId`, null);
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Chọn đối tượng duyệt">
                            {APPROVER_TYPE_OPTIONS.find((opt) => opt.value === approverType)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {APPROVER_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Chọn Vai trò hoặc Chọn Nhân viên (conditional) */}
                    <div className="space-y-1 md:col-span-1">
                      {approverType === "ROLE" ? (
                        <>
                          <Label className="text-[11px] font-medium">
                            Chọn vai trò duyệt <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={form.watch(`steps.${index}.approverRoleId`) || ""}
                            onValueChange={(val) =>
                              form.setValue(`steps.${index}.approverRoleId`, val, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Chọn vai trò...">
                                {roles.find((r) => r.id === form.watch(`steps.${index}.approverRoleId`))?.name}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {stepErrors?.approverRoleId && (
                            <p className="text-[10px] text-destructive">
                              {stepErrors.approverRoleId.message}
                            </p>
                          )}
                        </>
                      ) : approverType === "SPECIFIC_EMPLOYEE" ? (
                        <>
                          <Label className="text-[11px] font-medium">
                            Chọn nhân viên chỉ định <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={form.watch(`steps.${index}.approverEmployeeId`) || ""}
                            onValueChange={(val) =>
                              form.setValue(`steps.${index}.approverEmployeeId`, val, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Chọn nhân viên...">
                                {(() => {
                                  const empId = form.watch(`steps.${index}.approverEmployeeId`);
                                  const e = employees.find((emp) => emp.id === empId);
                                  return e ? `${e.fullName} (${e.employeeCode})` : undefined;
                                })()}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((e) => (
                                <SelectItem key={e.id} value={e.id}>
                                  {e.fullName} ({e.employeeCode})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {stepErrors?.approverEmployeeId && (
                            <p className="text-[10px] text-destructive">
                              {stepErrors.approverEmployeeId.message}
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="h-full flex items-end pb-1.5 text-[11px] text-muted-foreground italic">
                          {approverType === "DIRECT_MANAGER"
                            ? "Hệ thống tự động tìm quản lý trực tiếp"
                            : "Hệ thống tự động tìm trưởng phòng ban"}
                        </div>
                      )}
                    </div>

                    {/* Điều kiện duyệt */}
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-[11px] font-medium">Điều kiện kích hoạt bước</Label>
                      <Select
                        value={conditionType}
                        onValueChange={(val: any) => {
                          form.setValue(`steps.${index}.conditionType`, val, {
                            shouldValidate: true,
                          });
                          if (val !== "AMOUNT_ABOVE_THRESHOLD") {
                            form.setValue(`steps.${index}.conditionThreshold`, null);
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Chọn điều kiện kích hoạt">
                            {CONDITION_TYPE_OPTIONS.find((opt) => opt.value === conditionType)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITION_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ngưỡng giá trị nếu AMOUNT_ABOVE_THRESHOLD */}
                    {conditionType === "AMOUNT_ABOVE_THRESHOLD" && (
                      <div className="space-y-1 md:col-span-1">
                        <Label className="text-[11px] font-medium">
                          Định mức số tiền (VND) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="VD: 50000000"
                          value={form.watch(`steps.${index}.conditionThreshold`) || ""}
                          onChange={(e) =>
                            form.setValue(
                              `steps.${index}.conditionThreshold`,
                              e.target.value ? Number(e.target.value) : null,
                              { shouldValidate: true }
                            )
                          }
                          className="h-8 text-xs font-mono"
                        />
                        {stepErrors?.conditionThreshold && (
                          <p className="text-[10px] text-destructive">
                            {stepErrors.conditionThreshold.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Quay lại
        </Button>
        <Button type="submit" disabled={isLoading} className="text-xs">
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 mr-1.5" />
          )}
          {mode === "create" ? "Tạo quy trình phê duyệt" : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}

