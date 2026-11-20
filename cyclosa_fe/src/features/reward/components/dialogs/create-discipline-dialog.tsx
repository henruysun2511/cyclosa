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
import { Loader2 } from "lucide-react";
import {
  createDisciplineCaseSchema,
  type CreateDisciplineCaseFormValues,
} from "../../schemas/reward.schema";
import { VIOLATION_CATEGORY_OPTIONS } from "../../constants/reward.constants";
import { useCreateDisciplineCaseMutation } from "../../api/reward-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import { toast } from "sonner";

interface CreateDisciplineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDisciplineDialog({
  open,
  onOpenChange,
}: CreateDisciplineDialogProps) {
  const [createCase, { isLoading }] = useCreateDisciplineCaseMutation();
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, size: 100 });
  const employees = employeesData?.items || [];

  const form = useForm<CreateDisciplineCaseFormValues>({
    resolver: zodResolver(createDisciplineCaseSchema),
    defaultValues: {
      employeeId: "",
      violationDate: new Date().toISOString().split("T")[0],
      violationCategory: "ATTENDANCE_BREACH",
      violationDescription: "",
    },
  });

  const onSubmit = async (values: CreateDisciplineCaseFormValues) => {
    try {
      await createCase(values).unwrap();
      toast.success("Mở hồ sơ vi phạm kỷ luật thành công");
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Có lỗi xảy ra khi tạo hồ sơ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Mở hồ sơ vi phạm kỷ luật lao động
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nhân viên vi phạm */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Nhân viên có hành vi vi phạm <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn nhân viên">
                          {(() => {
                            const emp = employees.find((e) => e.id === field.value);
                            return emp ? `${emp.fullName} (${emp.employeeCode})` : undefined;
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName} ({emp.employeeCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Ngày vi phạm & Nhóm hành vi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="violationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Ngày xảy ra vi phạm <span className="text-destructive">*</span>
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
                name="violationCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Nhóm vi phạm <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn nhóm">
                            {VIOLATION_CATEGORY_OPTIONS.find((opt) => opt.value === field.value)?.label}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VIOLATION_CATEGORY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Mô tả vi phạm */}
            <FormField
              control={form.control}
              name="violationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Mô tả tóm tắt hành vi vi phạm <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mô tả chi tiết hành vi, thời gian, địa điểm, sự việc diễn ra..."
                      rows={4}
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
                disabled={isLoading}
                className="h-8 text-xs gap-1.5"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Khởi tạo hồ sơ</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
