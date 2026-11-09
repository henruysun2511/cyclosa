"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { Award } from "lucide-react";
import { useCreateProbationEvaluationMutation } from "../../api/employee-api";
import type { ProbationResult } from "../../types/employee.types";

interface ProbationEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  onSuccess?: () => void;
}

export function ProbationEvaluationDialog({
  open,
  onOpenChange,
  employeeId,
  onSuccess,
}: ProbationEvaluationDialogProps) {
  const [createEvaluation, { isLoading }] = useCreateProbationEvaluationMutation();

  const [result, setResult] = useState<ProbationResult>("PASSED");
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split("T")[0]);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluationDate) {
      toast.error("Vui lòng chọn ngày họp hội đồng đánh giá!");
      return;
    }

    try {
      await createEvaluation({
        employeeId,
        body: {
          result,
          evaluationDate,
          comment: comment.trim() || undefined,
        },
      }).unwrap();

      toast.success("Ghi nhận biên bản đánh giá thử việc thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu đánh giá thử việc!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-[90vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            Biên bản đánh giá kết quả thử việc
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Kết luận đánh giá thử việc <span className="text-destructive">*</span>
            </Label>
            <Select
              value={result}
              onValueChange={(val) => val && setResult(val as ProbationResult)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn kết quả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PASSED">Đạt yêu cầu - Đề xuất ký HĐLĐ chính thức (Passed)</SelectItem>
                <SelectItem value="EXTENDED">Gia hạn thời gian thử việc tối đa theo quy định (Extended)</SelectItem>
                <SelectItem value="FAILED">Không đạt yêu cầu - Chấm dứt thử việc (Failed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Ngày họp hội đồng đánh giá <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Nhận xét chi tiết của Người quản lý / Hội đồng</Label>
            <Textarea
              rows={4}
              placeholder="Đánh giá về thái độ, tính kỷ luật, mức độ hoàn thành KPI, khả năng phối hợp nhóm..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu biên bản đánh giá"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

