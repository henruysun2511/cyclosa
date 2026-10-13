"use client";

import React, { useState } from "react";
import { Search, Check, ChevronDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface EmployeeSummary {
  id: string | number;
  code: string;
  name: string;
  departmentName: string;
  jobTitle: string;
  avatarUrl?: string;
  status?: string;
}

export const MOCK_EMPLOYEES_SAMPLE: EmployeeSummary[] = [
  { id: 1, code: "EMP001", name: "Nguyễn Văn An", departmentName: "Ban Giám Đốc", jobTitle: "Tổng Giám Đốc", status: "ACTIVE" },
  { id: 2, code: "EMP002", name: "Trần Thị Mai", departmentName: "Phòng Nhân Sự", jobTitle: "Trưởng Phòng Nhân Sự", status: "ACTIVE" },
  { id: 3, code: "EMP003", name: "Lê Hoàng Nam", departmentName: "Phòng Công Nghệ", jobTitle: "Technical Lead", status: "ACTIVE" },
  { id: 4, code: "EMP004", name: "Phạm Minh Tuấn", departmentName: "Phòng Công Nghệ", jobTitle: "Senior Frontend Engineer", status: "ACTIVE" },
  { id: 5, code: "EMP005", name: "Hoàng Thảo Linh", departmentName: "Phòng Kế Toán", jobTitle: "Kế Toán Trưởng", status: "ACTIVE" },
  { id: 6, code: "EMP006", name: "Vũ Đức Long", departmentName: "Phòng Kinh Doanh", jobTitle: "Sales Manager", status: "ACTIVE" },
  { id: 7, code: "EMP007", name: "Đặng Bích Ngọc", departmentName: "Phòng Pháp Chế", jobTitle: "Chuyên Viên Pháp Chế", status: "ACTIVE" },
];

export interface EmployeePickerProps {
  value?: EmployeeSummary | null;
  onChange: (employee: EmployeeSummary | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  employees?: EmployeeSummary[];
}

export function EmployeePicker({
  value,
  onChange,
  placeholder = "Chọn nhân viên...",
  disabled = false,
  className,
  employees = MOCK_EMPLOYEES_SAMPLE,
}: EmployeePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.code.toLowerCase().includes(q) ||
      emp.departmentName.toLowerCase().includes(q) ||
      emp.jobTitle.toLowerCase().includes(q)
    );
  });

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
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {value.name.charAt(0)}
            </div>
            <div className="truncate text-foreground font-medium">
              {value.name} <span className="text-muted-foreground text-xs font-normal">({value.code} - {value.jobTitle})</span>
            </div>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Chọn nhân viên</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo họ tên, mã nhân viên, phòng ban, chức danh..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border border rounded-md">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => {
                  const isSelected = value?.id === emp.id;
                  return (
                    <div
                      key={emp.id}
                      className={cn(
                        "flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors",
                        isSelected && "bg-primary/5"
                      )}
                      onClick={() => {
                        onChange(emp);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border text-slate-700 flex items-center justify-center font-bold text-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                            {emp.name}
                            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600 font-normal">
                              {emp.code}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {emp.jobTitle} • {emp.departmentName}
                          </div>
                        </div>
                      </div>

                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy nhân viên nào phù hợp.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
