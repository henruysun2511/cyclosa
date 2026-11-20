"use client";

import { useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  decideDisciplineSchema,
  type DecideDisciplineFormValues,
} from "../../schemas/reward.schema";
import {
  useDecideDisciplineMutation,
  useGetDisciplineEligibilityQuery,
} from "../../api/reward-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import type { DisciplineCase } from "../../types/reward.types";
import { toast } from "sonner";

interface DecideDisciplineDialogProps {
  disciplineCase: DisciplineCase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DecideDisciplineDialog({
  disciplineCase,
  open,
  onOpenChange,
}: DecideDisciplineDialogProps) {
  const [decideDiscipline, { isLoading }] = useDecideDisciplineMutation();
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, size: 100 });
  const employees = employeesData?.items || [];

  const { data: eligibilityData, isFetching: isCheckingEligibility } =
    useGetDisciplineEligibilityQuery(disciplineCase?.id || "", {
      skip: !disciplineCase?.id || !open,
    });
  const eligibility = eligibilityData?.data;

  const form = useForm<DecideDisciplineFormValues>({
    resolver: zodResolver(decideDisciplineSchema),
    defaultValues: {
      disciplineForm: "KHIEN_TRACH",
      salaryExtensionMonths: undefined,
      ruleBasis: "",
      meetingDate: new Date().toISOString().split("T")[0],
      meetingNote: "",
      reason: "",
      decidedByEmployeeId: "",
      decidedAt: new Date().toISOString().split("T")[0],
    },
  });

  const selectedForm = form.watch("disciplineForm");

  useEffect(() => {
    if (disciplineCase) {
      form.reset({
        disciplineForm: "KHIEN_TRACH",
        salaryExtensionMonths: undefined,
        ruleBasis: "",
        meetingDate: new Date().toISOString().split("T")[0],
        meetingNote: "",
        reason: "",
        decidedByEmployeeId: "",
        decidedAt: new Date().toISOString().split("T")[0],
      });
    }
  }, [disciplineCase, form]);

  const onSubmit = async (values: DecideDisciplineFormValues) => {
    if (!disciplineCase) return;
    try {
      await decideDiscipline({
        id: disciplineCase.id,
        body: values,
      }).unwrap();

      toast.success("Ban hành quyết định kỷ luật thành công");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Có lỗi xảy ra khi ban hành quyết định");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Ban hành quyết định kỷ luật lao động
          </DialogTitle>
        </DialogHeader>

        {/* Thông tin nhân viên & Thẩm định điều kiện */}
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
            <span className="font-semibold text-muted-foreground">Nhân viên vi phạm:</span>
            <p className="font-medium text-foreground">
              {disciplineCase?.employeeName} ({disciplineCase?.employeeCode})
            </p>
            <p className="text-muted-foreground">{disciplineCase?.violationDescription}</p>
          </div>

          {/* Thẩm định tự động theo BLLĐ */}
          {isCheckingEligibility ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang thẩm định điều kiện và thời hiệu xử lý kỷ luật...</span>
            </div>
          ) : eligibility ? (
            eligibility.eligible ? (
              <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle className="text-xs font-semibold">Đủ điều kiện xử lý</AlertTitle>
                <AlertDescription className="text-xs">
                  Thời hiệu còn {eligibility.remainingLimitationMonths} tháng. Không thuộc diện hạn chế kỷ luật.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-xs font-semibold">Cảnh báo hạn chế / Hết thời hiệu</AlertTitle>
                <AlertDescription className="text-xs space-y-1 mt-1">
                  {eligibility.restrictionReasons.map((r, i) => (
                    <div key={i}>• {r}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )
          ) : null}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Hình thức kỷ luật */}
            <FormField
              control={form.control}
              name="disciplineForm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Hình thức kỷ luật áp dụng <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn hình thức kỷ luật">
                          {field.value === "KHIEN_TRACH"
                            ? "Khiển trách (Thời hiệu xóa án: 03 tháng)"
                            : field.value === "KEO_DAI_NANG_LUONG"
                            ? "Kéo dài thời hạn nâng lương (Thời hiệu xóa án: 06 tháng)"
                            : field.value === "CACH_CHUC"
                            ? "Cách chức (Thời hiệu xóa án: 06 tháng)"
                            : undefined}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="KHIEN_TRACH">Khiển trách (Thời hiệu xóa án: 03 tháng)</SelectItem>
                      <SelectItem value="KEO_DAI_NANG_LUONG">
                        Kéo dài thời hạn nâng lương (Thời hiệu xóa án: 06 tháng)
                      </SelectItem>
                      <SelectItem value="CACH_CHUC">Cách chức (Thời hiệu xóa án: 06 tháng)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Số tháng kéo dài nâng lương (nếu có) */}
            {selectedForm === "KEO_DAI_NANG_LUONG" && (
              <FormField
                control={form.control}
                name="salaryExtensionMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Số tháng kéo dài nâng lương (Tối đa 06 tháng) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="6"
                        placeholder="Nhập từ 1 đến 6..."
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                        className="h-9 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )}

            {/* Căn cứ nội quy */}
            <FormField
              control={form.control}
              name="ruleBasis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Căn cứ Nội quy / Quy chế công ty <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ví dụ: Căn cứ Điều 15 Khoản 2 Nội quy lao động 2024..."
                      className="h-9 text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Ngày họp & Ngày ký quyết định */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Ngày họp xét kỷ luật <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-9 text-xs" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decidedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Ngày ban hành quyết định <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-9 text-xs" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Người ký quyết định */}
            <FormField
              control={form.control}
              name="decidedByEmployeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Người có thẩm quyền ký quyết định <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn người ký quyết định">
                          {employees.find((e) => e.id === field.value)?.fullName}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Tóm tắt biên bản họp */}
            <FormField
              control={form.control}
              name="meetingNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Tóm tắt nội dung phiên họp xét kỷ luật
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ghi nhận ý kiến người lao động, đại diện BCH Công đoàn..."
                      rows={3}
                      className="text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="h-8 text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || (eligibility && !eligibility.eligible)}
                className="h-8 text-xs gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Ban hành quyết định</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
