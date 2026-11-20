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
  createRewardDecisionSchema,
  type CreateRewardDecisionFormValues,
} from "../../schemas/reward.schema";
import { REWARD_TYPE_OPTIONS } from "../../constants/reward.constants";
import { useCreateRewardDecisionMutation } from "../../api/reward-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import { toast } from "sonner";

interface CreateRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRewardDialog({
  open,
  onOpenChange,
}: CreateRewardDialogProps) {
  const [createDecision, { isLoading }] = useCreateRewardDecisionMutation();
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, size: 100 });
  const employees = employeesData?.items || [];

  const form = useForm<CreateRewardDecisionFormValues>({
    resolver: zodResolver(createRewardDecisionSchema),
    defaultValues: {
      employeeId: "",
      rewardType: "MONETARY_BONUS",
      title: "",
      reason: "",
      amount: undefined,
      decidedByEmployeeId: "",
      decisionDate: new Date().toISOString().split("T")[0],
    },
  });

  const selectedRewardType = form.watch("rewardType");

  const onSubmit = async (values: CreateRewardDecisionFormValues) => {
    try {
      await createDecision({
        employeeId: values.employeeId,
        rewardType: values.rewardType,
        title: values.title,
        reason: values.reason,
        amount: values.rewardType === "MONETARY_BONUS" ? Number(values.amount) : undefined,
        decidedByEmployeeId: values.decidedByEmployeeId,
        decisionDate: values.decisionDate,
      }).unwrap();

      toast.success("Lập quyết định khen thưởng thành công");
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Có lỗi xảy ra khi tạo quyết định");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Lập quyết định khen thưởng mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nhân viên được khen thưởng */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Nhân viên được khen thưởng <span className="text-destructive">*</span>
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

            {/* Hình thức khen thưởng */}
            <FormField
              control={form.control}
              name="rewardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Hình thức khen thưởng <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Chọn hình thức khen thưởng">
                          {REWARD_TYPE_OPTIONS.find((opt) => opt.value === field.value)?.label}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REWARD_TYPE_OPTIONS.map((opt) => (
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

            {/* Tiêu đề / Danh hiệu */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Danh hiệu / Nội dung khen thưởng <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ví dụ: Nhân viên xuất sắc Quý III, Giải thưởng cống hiến..."
                      className="h-9 text-xs"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Số tiền thưởng (nếu là MONETARY_BONUS) */}
            {selectedRewardType === "MONETARY_BONUS" && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Số tiền thưởng (VNĐ) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1000"
                        step="1000"
                        placeholder="Nhập số tiền thưởng..."
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

            {/* Người ký quyết định & Ngày quyết định */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="decidedByEmployeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Người ký quyết định <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Chọn người ký">
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

              <FormField
                control={form.control}
                name="decisionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">
                      Ngày ban hành <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-9 text-xs" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Lý do khen thưởng */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Căn cứ / Lý do khen thưởng
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mô tả thành tích, đóng góp nổi bật của nhân viên..."
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
                disabled={isLoading}
                className="h-8 text-xs gap-1.5"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Lập quyết định</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
