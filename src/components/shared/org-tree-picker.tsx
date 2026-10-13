"use client";

import React, { useState } from "react";
import { Building2, ChevronDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrgTree, DepartmentNode, MOCK_ORG_TREE } from "./org-tree";
import { cn } from "@/lib/utils";

export interface OrgTreePickerProps {
  value?: DepartmentNode | null;
  onChange: (node: DepartmentNode | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  data?: DepartmentNode[];
}

export function OrgTreePicker({
  value,
  onChange,
  placeholder = "Chọn phòng ban / đơn vị...",
  disabled = false,
  className,
  data = MOCK_ORG_TREE,
}: OrgTreePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between w-full h-10 px-3 py-2 text-sm bg-white border border-input rounded-md cursor-pointer hover:border-slate-400 transition-colors",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none bg-slate-50",
          className
        )}
        onClick={() => !disabled && setOpen(true)}
      >
        {value ? (
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium text-foreground truncate">{value.name}</span>
            <span className="text-xs text-muted-foreground font-mono">({value.code})</span>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}

        <div className="flex items-center gap-1 ml-2 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              className="p-0.5 hover:bg-slate-100 rounded text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Chọn phòng ban trực thuộc</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-2">
            <OrgTree
              data={data}
              selectedId={value?.id}
              onSelect={(node) => {
                onChange(node);
                setOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
