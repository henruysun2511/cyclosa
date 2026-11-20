"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generateBalancesSchema,
  type GenerateBalancesFormValues,
} from "../../schemas/leave.schema";
import { useGenerateLeaveBalancesMutation } from "../../api/leave-api";
import { toast } from "sonner";

interface GenerateBalancesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultYear?: number;
}

export function GenerateBalancesDialog({
  open,
  onOpenChange,
  defaultYear,
}: GenerateBalancesDialogProps) {
  const currentYear = defaultYear || new Date().getFullYear();
  const [generateBalances, { isLoading }] = useGenerateLeaveBalancesMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenerateBalancesFormValues>({
    resolver: zodResolver(generateBalancesSchema),
    defaultValues: {
      year: currentYear,
      notes: "Cấp quỹ phép đầu năm theo chính sách công ty",
    },
  });

  const onSubmit = async (values: GenerateBalancesFormValues) => {
    try {
      const res = await generateBalances({
        year: values.year,
        notes: values.notes,
      }).unwrap();
      const count = res?.data?.length || 0;
      toast.success(`Đã cấp thành công quỹ phép năm ${values.year} (${count} bản ghi)`);
      reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi cấp quỹ phép";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cấp quỹ phép năm hàng loạt</DialogTitle>
          <DialogDescription>
            Hệ thống sẽ tự động quét hợp đồng và thâm niên của nhân viên để tính số ngày phép theo tỷ lệ thời gian và thâm niên.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="year">
              Năm cấp quỹ phép <span className="text-destructive">*</span>
            </Label>
            <Input id="year" type="number" {...register("year")} />
            {errors.year && (
              <p className="text-xs text-destructive">{errors.year.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú cấp quỹ</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Ghi chú quyết định cấp quỹ phép..."
              {...register("notes")}
            />
          </div>

          <div className="rounded-md border p-3 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-blue-800 dark:text-blue-300">
            💡 <strong>Quy tắc tính:</strong>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              <li>Nhân viên vào làm trong năm: tính theo tỷ lệ số tháng làm việc (pro-rata).</li>
              <li>Thâm niên: tự động cộng thưởng ngày nghỉ dựa trên số năm công tác.</li>
              <li>Nếu nhân viên đã có quỹ phép trong năm, số ngày được cấp sẽ được cập nhật lại.</li>
            </ul>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Bắt đầu cấp quỹ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

