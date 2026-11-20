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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSaveExitInterviewMutation } from "../../api/offboarding-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import {
  saveExitInterviewSchema,
  type SaveExitInterviewFormValues,
} from "../../schemas/offboarding.schema";
import type { ExitInterview } from "../../types/offboarding.types";

interface ExitInterviewDialogProps {
  requestId: string;
  interview: ExitInterview | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExitInterviewDialog({
  requestId,
  interview,
  open,
  onOpenChange,
}: ExitInterviewDialogProps) {
  const [saveExitInterview, { isLoading }] = useSaveExitInterviewMutation();
  const { data: employeeData } = useGetEmployeesQuery({ size: 100 });

  const form = useForm<SaveExitInterviewFormValues>({
    resolver: zodResolver(saveExitInterviewSchema),
    defaultValues: {
      interviewerId: "",
      interviewDate: new Date().toISOString().split("T")[0],
      primaryReason: "",
      workingEnvironmentFeedback: "",
      managementFeedback: "",
      compensationFeedback: "",
      improvementSuggestions: "",
      willingToRecommend: false,
      notes: "",
    },
  });

  useEffect(() => {
    if (interview) {
      form.reset({
        interviewerId: interview.interviewerId,
        interviewDate: interview.interviewDate,
        primaryReason: interview.primaryReason || "",
        workingEnvironmentFeedback: interview.workingEnvironmentFeedback || "",
        managementFeedback: interview.managementFeedback || "",
        compensationFeedback: interview.compensationFeedback || "",
        improvementSuggestions: interview.improvementSuggestions || "",
        willingToRecommend: Boolean(interview.willingToRecommend),
        notes: interview.notes || "",
      });
    }
  }, [interview, form]);

  const onSubmit = async (values: SaveExitInterviewFormValues) => {
    try {
      await saveExitInterview({
        requestId,
        payload: {
          interviewerId: values.interviewerId,
          interviewDate: values.interviewDate,
          primaryReason: values.primaryReason || undefined,
          workingEnvironmentFeedback: values.workingEnvironmentFeedback || undefined,
          managementFeedback: values.managementFeedback || undefined,
          compensationFeedback: values.compensationFeedback || undefined,
          improvementSuggestions: values.improvementSuggestions || undefined,
          willingToRecommend: values.willingToRecommend,
          notes: values.notes || undefined,
        },
      }).unwrap();

      toast.success("Ghi nhận phỏng vấn thôi việc thành công");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể lưu phỏng vấn thôi việc");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Khảo sát Phỏng vấn thôi việc</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interviewerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người phỏng vấn (HR) <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn người phỏng vấn" />
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
                name="interviewDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày phỏng vấn <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="primaryReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do chính yếu chia sẻ trong buổi phỏng vấn</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Muốn thử thách ở lĩnh vực mới, chuyển sang môi trường hybrid..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workingEnvironmentFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phản hồi về môi trường làm việc</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Văn hóa doanh nghiệp, đồng nghiệp, công cụ..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managementFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phản hồi về quản lý trực tiếp</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Giao việc, hỗ trợ, phong cách lãnh đạo..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="compensationFeedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phản hồi về lương thưởng & phúc lợi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Mức lương, thưởng, bảo hiểm, chế độ..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="improvementSuggestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đề xuất cải thiện cho công ty</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Các giải pháp công ty nên áp dụng để giữ chân nhân tài..." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="willingToRecommend"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Sẵn sàng giới thiệu bạn bè / ứng viên gia nhập công ty
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú bảo mật của HR</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Đánh giá tổng quan của HR sau buổi phỏng vấn..." rows={2} {...field} />
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
                {isLoading ? "Đang lưu..." : "Lưu kết quả phỏng vấn"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
