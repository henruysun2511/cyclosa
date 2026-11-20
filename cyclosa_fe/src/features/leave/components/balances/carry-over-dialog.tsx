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
import {
  carryOverLeaveSchema,
  type CarryOverLeaveFormValues,
} from "../../schemas/leave.schema";
import { useCarryOverLeaveMutation } from "../../api/leave-api";
import { toast } from "sonner";

interface CarryOverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFromYear?: number;
}

export function CarryOverDialog({
  open,
  onOpenChange,
  defaultFromYear,
}: CarryOverDialogProps) {
  const currentYear = new Date().getFullYear();
  const fromYear = defaultFromYear || currentYear - 1;
  const [carryOver, { isLoading }] = useCarryOverLeaveMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CarryOverLeaveFormValues>({
    resolver: zodResolver(carryOverLeaveSchema),
    defaultValues: {
      fromYear,
    },
  });

  const onSubmit = async (values: CarryOverLeaveFormValues) => {
    try {
      const res = await carryOver({
        fromYear: values.fromYear,
      }).unwrap();
      const count = res?.data?.length || 0;
      toast.success(
        `Đã kết chuyển phép tồn từ năm ${values.fromYear} sang năm ${
          values.fromYear + 1
        } (${count} nhân sự)`
      );
      reset();
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi kết chuyển phép tồn";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kết chuyển phép tồn sang năm sau</DialogTitle>
          <DialogDescription>
            Tự động chuyển số ngày phép chưa dùng của năm trước sang năm sau theo hạn mức trần của từng chính sách.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="fromYear">
              Năm nguồn chuyển đi <span className="text-destructive">*</span>
            </Label>
            <Input id="fromYear" type="number" {...register("fromYear")} />
            {errors.fromYear && (
              <p className="text-xs text-destructive">
                {errors.fromYear.message}
              </p>
            )}
          </div>

          <div className="rounded-md border p-3 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300">
            ⚠️ <strong>Lưu ý quan trọng:</strong>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              <li>
                Số ngày chuyển sẽ bị giới hạn bởi trần tối đa (<code>maxCarryoverDays</code>) quy định trong chính sách.
              </li>
              <li>
                Số dư tính toán còn lại của năm nguồn sẽ được chuyển vào cột <code>carriedOverDays</code> của năm sau.
              </li>
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
              {isLoading ? "Đang xử lý..." : "Tiến hành chuyển"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

