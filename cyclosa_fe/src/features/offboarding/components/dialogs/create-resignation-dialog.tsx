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
import { useCreateResignationMutation } from "../../api/offboarding-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import {
  createResignationSchema,
  type CreateResignationFormValues,
} from "../../schemas/offboarding.schema";
import { RESIGNATION_REASON_LABELS } from "../../constants/offboarding.constants";
import type { ResignationReason } from "../../types/offboarding.types";

interface CreateResignationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResignationDialog({
  open,
  onOpenChange,
}: CreateResignationDialogProps) {
  const [createResignation, { isLoading }] = useCreateResignationMutation();
  const { data: employeeData } = useGetEmployeesQuery({ size: 100 });

  const form = useForm<CreateResignationFormValues>({
    resolver: zodResolver(createResignationSchema),
    defaultValues: {
      employeeId: "",
      resignationReason: "BETTER_OPPORTUNITY",
      noticeDate: new Date().toISOString().split("T")[0],
      desiredLastWorkingDate: "",
      actualLastWorkingDate: "",
      successorId: "",
      reasonDetail: "",
      notes: "",
    },
  });

  const onSubmit = async (values: CreateResignationFormValues) => {
    try {
      await createResignation({
        employeeId: values.employeeId,
        resignationReason: values.resignationReason,
        noticeDate: values.noticeDate,
        desiredLastWorkingDate: values.desiredLastWorkingDate,
        actualLastWorkingDate: values.actualLastWorkingDate,
        successorId: values.successorId ? values.successorId : undefined,
        reasonDetail: values.reasonDetail || undefined,
        notes: values.notes || undefined,
      }).unwrap();

      toast.success("Tiếp nhận đơn xin thôi việc thành công");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể tạo đơn thôi việc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tiếp nhận Đơn xin thôi việc</DialogTitle>
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
                    <FormLabel>Nhân viên làm đơn <span className="text-destructive">*</span></FormLabel>
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
                name="resignationReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do thôi việc <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn lý do" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(RESIGNATION_REASON_LABELS).map(([val, label]) => (
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

            {/* Các mốc thời gian */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="noticeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày nộp thông báo <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desiredLastWorkingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày mong muốn nghỉ <span className="text-destructive">*</span></FormLabel>
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
                    <FormLabel>Ngày làm việc cuối chốt <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>Nhân sự tiếp nhận bàn giao (Kế nhiệm)</FormLabel>
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

            {/* Chi tiết lý do */}
            <FormField
              control={form.control}
              name="reasonDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi tiết lý do thôi việc</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập chi tiết tâm tư, nguyện vọng hoặc lý do của nhân sự..."
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
                  <FormLabel>Ghi chú nội bộ của HR</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ghi chú thêm về điều khoản hợp đồng hoặc lưu ý..."
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
                {isLoading ? "Đang xử lý..." : "Tiếp nhận đơn"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
