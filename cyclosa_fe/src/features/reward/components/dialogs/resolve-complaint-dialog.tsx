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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  resolveComplaintSchema,
  type ResolveComplaintFormValues,
} from "../../schemas/reward.schema";
import { useResolveComplaintMutation } from "../../api/reward-api";
import type { Complaint } from "../../types/reward.types";
import { toast } from "sonner";

interface ResolveComplaintDialogProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResolveComplaintDialog({
  complaint,
  open,
  onOpenChange,
}: ResolveComplaintDialogProps) {
  const [resolveComplaint, { isLoading }] = useResolveComplaintMutation();

  const form = useForm<ResolveComplaintFormValues>({
    resolver: zodResolver(resolveComplaintSchema),
    defaultValues: {
      resolution: "",
    },
  });

  const onSubmit = async (values: ResolveComplaintFormValues) => {
    if (!complaint) return;
    try {
      await resolveComplaint({
        id: complaint.id,
        body: values,
      }).unwrap();

      toast.success("Ghi nhận phương án giải quyết khiếu nại thành công");
      form.reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Có lỗi xảy ra khi ghi nhận phương án");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Ghi nhận phương án giải quyết khiếu nại
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
          <span className="font-semibold text-muted-foreground">Khiếu nại:</span>
          <p className="font-medium text-foreground">{complaint?.subject}</p>
          <p className="text-muted-foreground line-clamp-2">{complaint?.content}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">
                    Kết luận xác minh & Phương án giải quyết <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ghi rõ kết luận xác minh, căn cứ quy định và biện pháp xử lý hoặc khắc phục quyền lợi cho người lao động..."
                      rows={5}
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
                className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Ghi nhận giải quyết</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

