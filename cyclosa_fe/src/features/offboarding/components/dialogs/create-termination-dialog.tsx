"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateTerminationMutation } from "../../api/offboarding-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import {
  createTerminationSchema,
  type CreateTerminationFormValues,
} from "../../schemas/offboarding.schema";
import { TERMINATION_REASON_LABELS } from "../../constants/offboarding.constants";

interface CreateTerminationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTerminationDialog({
  open,
  onOpenChange,
}: CreateTerminationDialogProps) {
  const [createTermination, { isLoading }] = useCreateTerminationMutation();
  const { data: employeeData } = useGetEmployeesQuery({ size: 100 });

  const form = useForm<CreateTerminationFormValues>({
    resolver: zodResolver(createTerminationSchema),
    defaultValues: {
      employeeId: "",
      terminationReason: "MUTUAL_AGREEMENT",
      decisionNumber: "",
      decisionDate: new Date().toISOString().split("T")[0],
      actualLastWorkingDate: "",
      successorId: "",
      reasonDetail: "",
      notes: "",
    },
  });

  const onSubmit = async (values: CreateTerminationFormValues) => {
    try {
      await createTermination({
        employeeId: values.employeeId,
        terminationReason: values.terminationReason,
        decisionNumber: values.decisionNumber,
        decisionDate: values.decisionDate,
        actualLastWorkingDate: values.actualLastWorkingDate,
        successorId: values.successorId ? values.successorId : undefined,
        reasonDetail: values.reasonDetail || undefined,
        notes: values.notes || undefined,
      }).unwrap();

      toast.success("Ban hành quyết định chấm dứt HĐLĐ thành công");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể ban hành quyết định chấm dứt HĐLĐ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ban hành Quyết định Chấm dứt Hợp đồng Lao động</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* Nhân viên & Lý do */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhân viên áp dụng <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhân viên" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employeeData?.items?.map((emp) => (
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

              <FormField
                control={form.control}
                name="terminationReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do chấm dứt <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn lý do pháp lý" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(TERMINATION_REASON_LABELS).map(([val, label]) => (
                          <SelectItem key={val} value={val}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Quyết định & Ngày tháng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="decisionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số quyết định <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="VD: QD-CD-2026/01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decisionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày ký quyết định <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actualLastWorkingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày làm việc cuối <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Người kế nhiệm */}
            <FormField
              control={form.control}
              name="successorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhân sự tiếp nhận bàn giao công việc</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "NONE" ? "" : val)}
                    value={field.value || "NONE"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn nhân sự bàn giao (nếu có)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">Chưa chỉ định người tiếp nhận</SelectItem>
                      {employeeData?.items?.map((emp) => (
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

            {/* Căn cứ & Chi tiết lý do */}
            <FormField
              control={form.control}
              name="reasonDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Căn cứ & Chi tiết lý do chấm dứt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Căn cứ theo điều khoản HĐLĐ, biên bản xử lý kỷ luật hoặc thỏa thuận..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
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
                  <FormLabel>Ghi chú nội bộ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Các lưu ý về thanh toán trợ cấp mất việc hoặc nghĩa vụ tài chính..."
                      rows={2}
                      {...field}
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
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang ban hành..." : "Ban hành quyết định"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
