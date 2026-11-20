"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetJobOpeningsQuery } from "../../api/recruitment-api";
import { INTERNAL_OPPORTUNITY_TYPE_LABELS } from "../../constants/recruitment.constants";
import type {
  CreateInternalOpportunityPayload,
  InternalOpportunityType,
} from "../../types/recruitment.types";

interface InternalOppFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateInternalOpportunityPayload) => Promise<void>;
  isLoading?: boolean;
}

export function InternalOppFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: InternalOppFormDialogProps) {
  const { data: jobData } = useGetJobOpeningsQuery({ size: 100 });
  const jobOpenings = jobData?.items || [];

  const [jobOpeningId, setJobOpeningId] = useState("");
  const [opportunityType, setOpportunityType] = useState<InternalOpportunityType>("TRANSFER");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobOpeningId) return;

    await onSubmit({
      jobOpeningId,
      opportunityType,
      description: description.trim() || undefined,
      applicationDeadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Đăng tin Cơ hội Nghề nghiệp Nội bộ
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mở cơ hội thuyên chuyển, thăng tiến hoặc dự án ngắn hạn cho nhân sự trong toàn tập đoàn.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Chọn vị trí */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Vị trí tuyển dụng liên kết <span className="text-destructive">*</span>
            </Label>
            <Select value={jobOpeningId} onValueChange={(val) => setJobOpeningId(val || "")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn vị trí tuyển dụng">
                  {jobOpenings.find((j) => j.id === jobOpeningId)?.title || "Chọn vị trí"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {jobOpenings.map((job) => (
                  <SelectItem key={job.id} value={job.id} className="text-xs">
                    {job.title} ({job.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loại cơ hội */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Loại cơ hội nội bộ <span className="text-destructive">*</span>
            </Label>
            <Select
              value={opportunityType}
              onValueChange={(val) => {
                if (val) setOpportunityType(val as InternalOpportunityType);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn loại cơ hội">
                  {INTERNAL_OPPORTUNITY_TYPE_LABELS[opportunityType]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(INTERNAL_OPPORTUNITY_TYPE_LABELS) as InternalOpportunityType[]).map(
                  (key) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {INTERNAL_OPPORTUNITY_TYPE_LABELS[key]}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Hạn nộp hồ sơ */}
          <div className="space-y-1.5">
            <Label htmlFor="deadline" className="text-xs font-medium">
              Hạn chót nhân viên nộp đơn
            </Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium">
              Mô tả chi tiết quyền lợi & Tiêu chí thuyên chuyển
            </Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Dự án triển khai giải pháp số hóa tài liệu cho khách hàng ngân hàng..."
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-9 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!jobOpeningId || isLoading}
              className="h-9 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang đăng...</span>
                </>
              ) : (
                <span>Đăng cơ hội nội bộ</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
