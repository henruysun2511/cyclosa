"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  createLeaveRequestSchema,
  type CreateLeaveRequestFormValues,
} from "../../schemas/leave.schema";
import {
  useCreateLeaveRequestMutation,
  usePreviewLeaveRequestMutation,
  useGetActiveLeaveTypesQuery,
} from "../../api/leave-api";
import { DAY_PORTION_OPTIONS } from "../../constants/leave.constants";
import { LeaveGroupBadge } from "../shared/leave-group-badge";
import { LeavePayerBadge } from "../shared/leave-payer-badge";
import type { LeavePreviewResponseDto } from "../../types/leave.types";
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useGetEmployeesQuery } from "@/features/employee";

interface CreateLeaveRequestFormProps {
  isOnBehalf?: boolean;
}

export function CreateLeaveRequestForm({
  isOnBehalf = false,
}: CreateLeaveRequestFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { data: leaveTypesRes, isLoading: isLoadingTypes } = useGetActiveLeaveTypesQuery();
  const leaveTypes = leaveTypesRes?.data || [];
  const { data: employeesData } = useGetEmployeesQuery({ size: 100 }, { skip: !isOnBehalf });
  const employees = employeesData?.items || [];

  const [createRequest, { isLoading: isSubmitting }] = useCreateLeaveRequestMutation();
  const [previewRequest, { isLoading: isPreviewing }] = usePreviewLeaveRequestMutation();

  const [previewData, setPreviewData] = useState<LeavePreviewResponseDto | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStartDate = tomorrow.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateLeaveRequestFormValues>({
    resolver: zodResolver(createLeaveRequestSchema),
    defaultValues: {
      leaveTypeId: "",
      startDate: defaultStartDate,
      endDate: defaultStartDate,
      dayPortion: "FULL_DAY",
      reason: "",
    },
  });

  const selectedLeaveTypeId = watch("leaveTypeId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const dayPortion = watch("dayPortion");

  const selectedLeaveType = leaveTypes.find((t) => t.id === selectedLeaveTypeId);

  // Set default leave type once loaded
  useEffect(() => {
    if (leaveTypes.length > 0 && !selectedLeaveTypeId) {
      setValue("leaveTypeId", leaveTypes[0].id);
    }
  }, [leaveTypes, selectedLeaveTypeId, setValue]);

  // If half day is selected, sync endDate with startDate
  useEffect(() => {
    if (dayPortion !== "FULL_DAY" && startDate && endDate !== startDate) {
      setValue("endDate", startDate);
    }
  }, [dayPortion, startDate, endDate, setValue]);

  // Live preview call whenever key date/type inputs change
  useEffect(() => {
    if (!selectedLeaveTypeId || !startDate || !endDate) return;
    if (new Date(startDate) > new Date(endDate)) return;
    if (dayPortion !== "FULL_DAY" && startDate !== endDate) return;

    const timer = setTimeout(async () => {
      try {
        const res = await previewRequest({
          leaveTypeId: selectedLeaveTypeId,
          startDate,
          endDate,
          dayPortion,
        }).unwrap();
        if (res.data) {
          setPreviewData(res.data);
        }
      } catch {
        setPreviewData(null);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedLeaveTypeId, startDate, endDate, dayPortion, previewRequest]);

  const onSubmit = async (values: CreateLeaveRequestFormValues) => {
    if (previewData && !previewData.isBalanceSufficient) {
      toast.error("Số dư quỹ phép không đủ để nộp đơn này!");
      return;
    }

    try {
      await createRequest({
        employeeId: values.employeeId,
        leaveTypeId: values.leaveTypeId,
        startDate: values.startDate,
        endDate: values.endDate,
        dayPortion: values.dayPortion,
        reason: values.reason,
      }).unwrap();

      toast.success(
        isOnBehalf
          ? "Đã tạo đơn xin nghỉ phép thay nhân viên thành công"
          : "Nộp đơn xin nghỉ phép thành công!"
      );

      startTransition(() => {
        router.push(isOnBehalf ? "/leave/requests" : "/me/leave");
      });
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi nộp đơn nghỉ phép";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Container */}
      <Card className="lg:col-span-2 border border-border">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={isOnBehalf ? "/leave/requests" : "/me/leave"}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle>
              {isOnBehalf
                ? "Tạo đơn xin nghỉ phép thay nhân viên"
                : "Tạo đơn xin nghỉ phép"}
            </CardTitle>
          </div>
          <CardDescription>
            Điền thông tin khoảng thời gian, loại nghỉ và lý do để hệ thống tự động tính ngày công và gửi duyệt
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {isOnBehalf && (
              <div className="space-y-2">
                <Label htmlFor="employeeId">
                  Nhân viên được tạo thay <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="employeeId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger id="employeeId" className="h-9">
                        <SelectValue placeholder="Chọn nhân viên..." />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.employeeCode} - {emp.fullName} ({emp.currentDepartmentName || "---"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Lưu ý: Chỉ HR mới có quyền tạo thay nhân sự khác
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Loại nghỉ phép <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="leaveTypeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                    disabled={isLoadingTypes}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại nghỉ phép" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} ({t.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.leaveTypeId && (
                <p className="text-xs text-destructive">
                  {errors.leaveTypeId.message}
                </p>
              )}

              {selectedLeaveType && (
                <div className="flex items-center gap-2 pt-1">
                  <LeaveGroupBadge group={selectedLeaveType.leaveGroup} />
                  <LeavePayerBadge payer={selectedLeaveType.payer} />
                  {selectedLeaveType.fixedDays != null && (
                    <span className="text-xs text-muted-foreground">
                      (Cố định: {selectedLeaveType.fixedDays} ngày)
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Từ ngày <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Đến ngày <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  disabled={dayPortion !== "FULL_DAY"}
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Buổi nghỉ <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="dayPortion"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn buổi nghỉ" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAY_PORTION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.dayPortion && (
                <p className="text-xs text-destructive">
                  {errors.dayPortion.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Lý do xin nghỉ</Label>
              <Textarea
                id="reason"
                rows={3}
                placeholder="Ghi rõ lý do nghỉ và người bàn giao công việc..."
                {...register("reason")}
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href={isOnBehalf ? "/leave/requests" : "/me/leave"}>
                  Hủy
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={Boolean(isSubmitting || (previewData && !previewData.isBalanceSufficient))}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Đang gửi đơn..." : "Gửi đơn xin nghỉ"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Live Calculation Preview Card */}
      <div className="space-y-4">
        <Card className="border border-primary/20 bg-primary/5 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Xem trước tính toán ngày nghỉ
            </CardTitle>
            <CardDescription className="text-xs">
              Tự động đối soát lịch cuối tuần & lễ Tết
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPreviewing ? (
              <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
                Đang tính toán số ngày nghỉ...
              </div>
            ) : previewData ? (
              <>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted-foreground">
                    Số ngày nghỉ thực tế tính vào công:
                  </span>
                  <div className="text-3xl font-extrabold text-foreground mt-1">
                    {previewData.daysCount}{" "}
                    <span className="text-sm font-normal text-muted-foreground">ngày</span>
                  </div>

                  {(previewData.weekendDays > 0 || previewData.holidayDays > 0) && (
                    <div className="mt-3 text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/60">
                      {previewData.weekendDays > 0 && (
                        <div>
                          • Đã loại trừ: <strong>{previewData.weekendDays} ngày cuối tuần</strong> (T7, CN)
                        </div>
                      )}
                      {previewData.holidayDays > 0 && (
                        <div className="text-purple-600 dark:text-purple-400 font-medium">
                          • Đã loại trừ: <strong>{previewData.holidayDays} ngày lễ Tết</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedLeaveType?.leaveGroup === "ANNUAL" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Số dư hiện tại:</span>
                      <strong className="text-foreground">{previewData.currentRemainingDays} ngày</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Dự kiến trừ:</span>
                      <strong className="text-rose-600">-{previewData.daysCount} ngày</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Số dư còn lại:</span>
                      <strong
                        className={`text-sm ${
                          previewData.projectedRemainingDays >= 0
                            ? "text-emerald-600"
                            : "text-destructive font-bold"
                        }`}
                      >
                        {previewData.projectedRemainingDays} ngày
                      </strong>
                    </div>
                  </div>
                )}

                {!previewData.isBalanceSufficient && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Số dư không đủ</AlertTitle>
                    <AlertDescription className="text-xs">
                      Bạn không đủ ngày phép năm khả dụng để nộp đơn này. Vui lòng giảm số ngày hoặc chuyển sang loại nghỉ việc riêng không lương.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="rounded-lg p-3 bg-muted/40 text-xs flex items-center gap-2">
                  {previewData.requiresApproval ? (
                    <>
                      <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Đơn sẽ được gửi qua quy trình phê duyệt của người quản lý.</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Loại nghỉ này được phê duyệt tự động ngay khi nộp.</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                Chọn loại nghỉ và ngày để xem trước số ngày công và số dư
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

