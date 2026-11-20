"use client";

import React from "react";
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
import { resolveIssueSchema, type ResolveIssueValues } from "../../schemas/workplace.schema";
import type { WorkplaceIssue } from "../../types/workplace.types";

interface IssueResolveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue: WorkplaceIssue | null;
  onSubmit: (issueId: string, resolutionNote: string) => Promise<void>;
  isLoading?: boolean;
}

export function IssueResolveDialog({
  open,
  onOpenChange,
  issue,
  onSubmit,
  isLoading,
}: IssueResolveDialogProps) {
  const form = useForm<ResolveIssueValues>({
    resolver: zodResolver(resolveIssueSchema),
    defaultValues: {
      resolutionNote: "",
    },
  });

  const handleSubmit = async (values: ResolveIssueValues) => {
    if (!issue) return;
    await onSubmit(issue.id, values.resolutionNote);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Nghiệm thu & Đóng sự cố</DialogTitle>
        </DialogHeader>

        {issue && (
          <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1">
            <p className="font-semibold text-foreground">{issue.title}</p>
            <p className="text-muted-foreground">Vị trí: {issue.floorName || "Khu vực chung"}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resolutionNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold">Ghi chú kết quả khắc phục *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mô tả các công việc đã thực hiện để khắc phục sự cố..."
                      className="text-xs resize-none"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                {isLoading && <span className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                <span>Xác nhận Nghiệm thu</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
