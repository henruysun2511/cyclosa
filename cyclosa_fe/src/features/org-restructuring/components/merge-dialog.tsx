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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitMerge, Loader2 } from "lucide-react";
import {
  mergeDepartmentsSchema,
  type MergeDepartmentsFormValues,
} from "../schemas/org-restructuring.schemas";
import type { ScenarioDepartmentTreeNode } from "../types/org-restructuring.types";

interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: ScenarioDepartmentTreeNode[];
  onSubmit: (values: MergeDepartmentsFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function MergeDialog({
  open,
  onOpenChange,
  departments,
  onSubmit,
  isLoading = false,
}: MergeDialogProps) {
  // Phẳng hóa danh sách phòng ban
  const flatDepts = React.useMemo(() => {
    const list: ScenarioDepartmentTreeNode[] = [];
    function walk(node: ScenarioDepartmentTreeNode) {
      if (node.statusInScenario !== "DISSOLVED" && node.statusInScenario !== "MERGED") {
        list.push(node);
      }
      if (node.children) node.children.forEach(walk);
    }
    departments.forEach(walk);
    return list;
  }, [departments]);

  const form = useForm<MergeDepartmentsFormValues>({
    resolver: zodResolver(mergeDepartmentsSchema),
    defaultValues: {
      sourceDepartmentIds: [],
      targetDepartmentId: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: MergeDepartmentsFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <GitMerge className="h-5 w-5 text-purple-600" />
            <span>Sáp nhập Phòng ban (Merge)</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
          {/* Phòng ban nguồn 1 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Phòng ban nguồn cần sáp nhập <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2">
              <Select
                onValueChange={(val) => {
                  if (typeof val === "string" && val.length > 0) {
                    const current = form.watch("sourceDepartmentIds") || [];
                    if (!current.includes(val)) {
                      form.setValue("sourceDepartmentIds", [...current, val]);
                    }
                  }
                }}
              >
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn phòng ban để thêm vào danh sách gộp">
                    {() => "Chọn phòng ban để thêm vào danh sách gộp"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {flatDepts.map((d) => (
                    <SelectItem key={d.id} value={d.id} className="text-xs">
                      {d.name} ({d.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Danh sách đã chọn */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {form.watch("sourceDepartmentIds")?.map((id) => {
                  const dept = flatDepts.find((d) => d.id === id);
                  return (
                    <span
                      key={id}
                      className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <span>{dept?.name || id}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = form.watch("sourceDepartmentIds") || [];
                          form.setValue(
                            "sourceDepartmentIds",
                            current.filter((x) => x !== id)
                          );
                        }}
                        className="text-purple-900 hover:text-destructive"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            {form.formState.errors.sourceDepartmentIds && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.sourceDepartmentIds.message}
              </p>
            )}
          </div>

          {/* Phòng ban đích */}
          <div className="space-y-1.5">
            <Label htmlFor="target" className="text-xs font-medium">
              Phòng ban đích tiếp nhận <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.watch("targetDepartmentId")}
              onValueChange={(val) => form.setValue("targetDepartmentId", val || "")}
            >
              <SelectTrigger id="target" className="text-xs h-9">
                <SelectValue placeholder="Chọn phòng ban tiếp nhận sau sáp nhập" />
              </SelectTrigger>
              <SelectContent>
                {flatDepts.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="text-xs">
                    {d.name} ({d.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.targetDepartmentId && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.targetDepartmentId.message}
              </p>
            )}
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-medium">
              Ghi chú lý do sáp nhập
            </Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="VD: Hợp nhất bộ máy vận hành để tối ưu chi phí..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={isLoading} className="text-xs">
              {isLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              <span>Thực hiện sáp nhập</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
