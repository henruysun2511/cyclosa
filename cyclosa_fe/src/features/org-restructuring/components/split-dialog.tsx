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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Split, Plus, Trash2, Loader2 } from "lucide-react";
import type { ScenarioDepartmentTreeNode } from "../types/org-restructuring.types";
import type { CreateScenarioDepartmentFormValues } from "../schemas/org-restructuring.schemas";

interface SplitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: ScenarioDepartmentTreeNode[];
  onSubmit: (data: {
    sourceDepartmentId: string;
    newDepartments: CreateScenarioDepartmentFormValues[];
  }) => Promise<void>;
  isLoading?: boolean;
}

export function SplitDialog({
  open,
  onOpenChange,
  departments,
  onSubmit,
  isLoading = false,
}: SplitDialogProps) {
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

  const [sourceId, setSourceId] = useState("");
  const [newDepts, setNewDepts] = useState<
    { name: string; code: string; targetHeadcount: number }[]
  >([
    { name: "", code: "", targetHeadcount: 5 },
    { name: "", code: "", targetHeadcount: 5 },
  ]);

  const handleAddDept = () => {
    setNewDepts([...newDepts, { name: "", code: "", targetHeadcount: 5 }]);
  };

  const handleRemoveDept = (index: number) => {
    if (newDepts.length <= 2) return;
    setNewDepts(newDepts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId) return;

    const formatted: CreateScenarioDepartmentFormValues[] = newDepts.map((d) => ({
      name: d.name,
      code: d.code,
      targetHeadcount: d.targetHeadcount,
      isPermissionInherited: true,
    }));

    await onSubmit({ sourceDepartmentId: sourceId, newDepartments: formatted });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Split className="h-5 w-5 text-blue-600" />
            <span>Chia tách Phòng ban (Split)</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Phòng ban nguồn cần tách */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Chọn phòng ban cần chia tách <span className="text-destructive">*</span>
            </Label>
            <Select value={sourceId} onValueChange={(val) => setSourceId(val || "")}>
              <SelectTrigger className="text-xs h-9">
                <SelectValue placeholder="Chọn phòng ban nguồn">
                  {(val: string) => {
                    const d = flatDepts.find((item) => item.id === val);
                    return d ? `${d.name} (${d.code})` : "Chọn phòng ban nguồn";
                  }}
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
          </div>

          {/* Danh sách các đơn vị mới phân tách */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Các đơn vị mới sau chia tách</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddDept}
                className="h-6 text-[11px] text-primary"
              >
                <Plus className="h-3 w-3 mr-1" />
                Thêm đơn vị
              </Button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {newDepts.map((dept, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-lg border border-border/80 bg-background space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-foreground">
                      Đơn vị {index + 1}
                    </span>
                    {newDepts.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDept(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Tên đơn vị mới"
                      value={dept.name}
                      onChange={(e) => {
                        const copy = [...newDepts];
                        copy[index].name = e.target.value;
                        setNewDepts(copy);
                      }}
                      className="text-xs h-8"
                      required
                    />
                    <Input
                      placeholder="Mã (VD: ENG-FE)"
                      value={dept.code}
                      onChange={(e) => {
                        const copy = [...newDepts];
                        copy[index].code = e.target.value.toUpperCase();
                        setNewDepts(copy);
                      }}
                      className="text-xs h-8 uppercase font-mono"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
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
            <Button type="submit" size="sm" disabled={isLoading || !sourceId} className="text-xs">
              {isLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              <span>Thực hiện chia tách</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
