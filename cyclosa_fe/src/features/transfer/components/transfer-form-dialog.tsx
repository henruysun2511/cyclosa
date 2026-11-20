"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Building2,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  User,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateTransferMutation,
  useUpdateTransferMutation,
  useLazyGetCurrentSnapshotQuery,
} from "../api/transfer-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import { useGetCompaniesQuery } from "@/features/organization/api/company-api";
import { useGetDepartmentsQuery } from "@/features/organization/api/department-api";
import { useGetBranchesByCompanyQuery } from "@/features/organization/api/branch-api";
import { useGetAllJobTitlesQuery } from "@/features/organization/api/job-title-api";
import {
  transferFormSchema,
  type TransferFormValues,
} from "../schemas/transfer.schema";
import {
  TRANSFER_REASON_OPTIONS,
  TRANSFER_TYPE_LABELS,
} from "../constants/transfer.constants";
import type { CurrentWorkSnapshot, TransferDetail } from "../types/transfer.types";

interface TransferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfer?: TransferDetail | null;
  onSuccess?: () => void;
}

export function TransferFormDialog({
  open,
  onOpenChange,
  transfer,
  onSuccess,
}: TransferFormDialogProps) {
  const isEditing = Boolean(transfer);

  const [createTransfer, { isLoading: isCreating }] = useCreateTransferMutation();
  const [updateTransfer, { isLoading: isUpdating }] = useUpdateTransferMutation();
  const isSubmitting = isCreating || isUpdating;

  const [triggerGetSnapshot, { data: snapshotData, isLoading: isLoadingSnapshot }] =
    useLazyGetCurrentSnapshotQuery();

  const { data: companiesData } = useGetCompaniesQuery({ size: 50 }, { skip: !open });
  const companies = companiesData?.items || [];
  const effectiveCompanyId = companies[0]?.id || "";

  const { data: employeesData } = useGetEmployeesQuery({ size: 200 });
  const employees = employeesData?.items || [];

  const { data: deptsData } = useGetDepartmentsQuery(
    { companyId: effectiveCompanyId, size: 200 },
    { skip: !effectiveCompanyId || !open }
  );
  const departments = deptsData?.items || [];

  const { data: branches = [] } = useGetBranchesByCompanyQuery(effectiveCompanyId, {
    skip: !effectiveCompanyId || !open,
  });

  const { data: jobTitles = [] } = useGetAllJobTitlesQuery(effectiveCompanyId, {
    skip: !effectiveCompanyId || !open,
  });

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema) as any,
    defaultValues: {
      employeeId: "",
      transferType: "INTERNAL_DEPARTMENT",
      toDepartmentId: "",
      toBranchId: undefined,
      toJobTitleId: "",
      toJobLevelId: undefined,
      toManagerId: undefined,
      toBaseSalary: undefined,
      effectiveDate: new Date().toISOString().split("T")[0],
      endDate: undefined,
      reason: "BUSINESS_NEED",
      reasonDetail: "",
      notes: "",
      hasSalaryAdjustment: false,
      salaryNotes: "",
      allowances: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "allowances",
  });

  const selectedEmployeeId = form.watch("employeeId");
  const selectedTransferType = form.watch("transferType");
  const hasSalaryAdjustment = form.watch("hasSalaryAdjustment");

  const currentSnapshot: CurrentWorkSnapshot | undefined = snapshotData?.data;

  // Điền dữ liệu khi chỉnh sửa hoặc tạo mới
  useEffect(() => {
    if (transfer && open) {
      form.reset({
        employeeId: transfer.employeeId,
        transferType: transfer.transferType,
        toDepartmentId: transfer.toDepartmentId,
        toBranchId: transfer.toBranchId || undefined,
        toJobTitleId: transfer.toJobTitleId,
        toJobLevelId: transfer.toJobLevelId || undefined,
        toManagerId: transfer.toManagerId || undefined,
        toBaseSalary: transfer.toBaseSalary ? Number(transfer.toBaseSalary) : undefined,
        effectiveDate: transfer.effectiveDate,
        endDate: transfer.endDate || undefined,
        reason: transfer.reason,
        reasonDetail: transfer.reasonDetail || "",
        notes: transfer.notes || "",
        hasSalaryAdjustment: Boolean(transfer.hasSalaryAdjustment),
        salaryNotes: transfer.salaryNotes || "",
        allowances: transfer.allowances?.map((a) => ({
          allowanceName: a.allowanceName,
          amount: Number(a.amount),
          notes: a.notes || "",
        })) || [],
      });
      triggerGetSnapshot(transfer.employeeId);
    } else if (!transfer && open) {
      form.reset({
        employeeId: "",
        transferType: "INTERNAL_DEPARTMENT",
        toDepartmentId: "",
        toBranchId: undefined,
        toJobTitleId: "",
        toJobLevelId: undefined,
        toManagerId: undefined,
        toBaseSalary: undefined,
        effectiveDate: new Date().toISOString().split("T")[0],
        endDate: undefined,
        reason: "BUSINESS_NEED",
        reasonDetail: "",
        notes: "",
        hasSalaryAdjustment: false,
        salaryNotes: "",
        allowances: [],
      });
    }
  }, [transfer, open, form, triggerGetSnapshot]);

  // Khi chọn nhân viên mới, tự động lấy snapshot
  useEffect(() => {
    if (selectedEmployeeId && !isEditing) {
      triggerGetSnapshot(selectedEmployeeId);
    }
  }, [selectedEmployeeId, isEditing, triggerGetSnapshot]);

  const onSubmit = async (values: TransferFormValues) => {
    if (values.transferType === "TEMPORARY_DISPATCH") {
      if (!values.endDate || values.endDate <= values.effectiveDate) {
        toast.error("Điều chuyển tạm thời bắt buộc phải có ngày kết thúc lớn hơn ngày hiệu lực");
        return;
      }
    }

    try {
      const payload = {
        employeeId: values.employeeId,
        transferType: values.transferType,
        toDepartmentId: values.toDepartmentId,
        toBranchId: values.toBranchId || undefined,
        toJobTitleId: values.toJobTitleId,
        toJobLevelId: values.toJobLevelId || undefined,
        toManagerId: values.toManagerId || undefined,
        toBaseSalary: values.toBaseSalary,
        effectiveDate: values.effectiveDate,
        endDate: values.transferType === "TEMPORARY_DISPATCH" ? values.endDate : undefined,
        reason: values.reason,
        reasonDetail: values.reasonDetail,
        notes: values.notes,
        hasSalaryAdjustment: values.hasSalaryAdjustment,
        salaryNotes: values.salaryNotes,
        allowances: values.allowances?.map((a) => ({
          allowanceName: a.allowanceName,
          amount: Number(a.amount),
          notes: a.notes,
        })),
      };

      if (isEditing && transfer) {
        await updateTransfer({
          id: transfer.id,
          body: payload,
        }).unwrap();
        toast.success("Cập nhật phiếu điều chuyển nhân sự thành công");
      } else {
        await createTransfer(payload).unwrap();
        toast.success("Tạo phiếu điều chuyển nhân sự thành công");
      }

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu phiếu điều chuyển");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {isEditing ? "Chỉnh sửa phiếu điều chuyển" : "Lập phiếu điều chuyển nhân sự"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật lại các thông tin điều chuyển khi phiếu còn ở trạng thái Dự thảo."
              : "Khởi tạo quyết định luân chuyển, bổ nhiệm hoặc biệt phái nhân sự trong hệ thống."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. Chọn nhân sự & Hiển thị Snapshot Nguồn */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <User className="w-4 h-4 text-primary" />
                1. Thông tin nhân sự điều chuyển
              </h4>

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nhân viên <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Chọn nhân viên cần điều chuyển" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.employeeCode} - {emp.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Box Snapshot Công tác hiện tại */}
              {selectedEmployeeId && (
                <div className="p-3.5 rounded-xl border bg-muted/40 text-xs space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground font-medium">
                    <span className="flex items-center gap-1 text-primary">
                      <Info className="w-3.5 h-3.5" /> Công tác hiện tại (Snapshot nguồn)
                    </span>
                    {isLoadingSnapshot && <span className="italic">Đang nạp dữ liệu...</span>}
                  </div>
                  {currentSnapshot ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-foreground">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Phòng ban:</span>
                        <strong>{currentSnapshot.departmentName || "Chưa gán"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Chức danh:</span>
                        <strong>{currentSnapshot.jobTitleName || "Chưa gán"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Chi nhánh:</span>
                        <strong>{currentSnapshot.branchName || "Hội sở"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Quản lý trực tiếp:</span>
                        <strong>{currentSnapshot.managerName || "Không có"}</strong>
                      </div>
                    </div>
                  ) : (
                    !isLoadingSnapshot && (
                      <p className="text-muted-foreground italic">
                        Chưa tìm thấy phân công công tác hiện hành của nhân sự này.
                      </p>
                    )
                  )}
                </div>
              )}
            </div>

            {/* 2. Đích tiếp nhận & Loại hình điều chuyển */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <ArrowRight className="w-4 h-4 text-primary" />
                2. Đơn vị tiếp nhận mới
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="transferType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Loại hình điều chuyển <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn loại hình" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TRANSFER_TYPE_LABELS).map(([k, label]) => (
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

                <FormField
                  control={form.control}
                  name="toDepartmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phòng ban tiếp nhận <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn phòng ban mới">
                              {(val: string) => departments.find((d) => d.id === val)?.name || "Chọn phòng ban mới"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toJobTitleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Chức danh mới <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn chức danh mới">
                              {(val: string) => jobTitles.find((j) => j.id === val)?.name || "Chọn chức danh mới"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobTitles.map((job) => (
                            <SelectItem key={job.id} value={job.id}>
                              {job.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toBranchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chi nhánh tiếp nhận</FormLabel>
                      <Select
                        value={field.value || "NONE"}
                        onValueChange={(v) => field.onChange(v === "NONE" ? undefined : v)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn chi nhánh (nếu có)">
                              {(val: string) => (!val || val === "NONE" ? "Không áp dụng" : branches.find((b) => b.id === val)?.name || val)}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NONE">Không áp dụng</SelectItem>
                          {branches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toManagerId"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Quản lý trực tiếp mới</FormLabel>
                      <Select
                        value={field.value || "NONE"}
                        onValueChange={(v) => field.onChange(v === "NONE" ? undefined : v)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn quản lý trực tiếp (nếu có)">
                              {(val: string) => {
                                if (!val || val === "NONE") return "Không có";
                                const emp = employees.find((e) => e.id === val);
                                return emp ? `${emp.employeeCode} - ${emp.fullName}` : val;
                              }}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NONE">Không có</SelectItem>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.employeeCode} - {emp.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 3. Thời hạn & Căn cứ lý do */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                3. Thời hạn & Lý do điều chuyển
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="effectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ngày có hiệu lực <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTransferType === "TEMPORARY_DISPATCH" && (
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Ngày kết thúc dự kiến <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className={selectedTransferType === "TEMPORARY_DISPATCH" ? "sm:col-span-2" : ""}>
                      <FormLabel>
                        Lý do điều chuyển <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn lý do" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRANSFER_REASON_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reasonDetail"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nội dung chi tiết / Căn cứ quyết định</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết lý do, dự án hoặc thỏa thuận..."
                          {...field}
                          rows={2}
                          className="resize-none text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 4. Điều chỉnh Lương & Phụ cấp */}
            <div className="space-y-3 p-3.5 rounded-xl border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    4. Đãi ngộ & Phụ cấp mới
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Khai báo điều chỉnh mức lương và các khoản phụ cấp biệt phái/di chuyển đi kèm.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="hasSalaryAdjustment"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {hasSalaryAdjustment && (
                <div className="space-y-3 pt-2">
                  <FormField
                    control={form.control}
                    name="toBaseSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mức lương cơ bản mới (VNĐ)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ví dụ: 25000000"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            className="h-9"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Danh sách phụ cấp đi kèm */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Khoản phụ cấp đi kèm</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ allowanceName: "", amount: 0, notes: "" })}
                        className="h-7 text-xs gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm phụ cấp
                      </Button>
                    </div>

                    {fields.map((item, idx) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Input
                            placeholder="Tên phụ cấp (Biệt phái, di chuyển...)"
                            {...form.register(`allowances.${idx}.allowanceName` as const)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="col-span-4">
                          <Input
                            type="number"
                            placeholder="Số tiền (VNĐ)"
                            {...form.register(`allowances.${idx}.amount` as const, {
                              valueAsNumber: true,
                            })}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Ghi chú"
                            {...form.register(`allowances.${idx}.notes` as const)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="col-span-1 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(idx)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật phiếu" : "Lưu dự thảo phiếu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
