import { Search, Building2, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentOption {
  id: string;
  name: string;
}

interface KpiFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  isActive: string;
  onIsActiveChange: (value: string) => void;
  departments: DepartmentOption[];
  onReset: () => void;
}

export function KpiFilterBar({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  isActive,
  onIsActiveChange,
  departments,
  onReset,
}: KpiFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm chỉ số KPI theo mã, tên, mô tả..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Bộ lọc phòng ban, trạng thái + nút đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc Phòng ban */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Phòng ban:
          </span>
          <Select value={departmentId} onValueChange={(val) => onDepartmentChange(val || "ALL")}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả phòng ban">
                {(val: string) => (!val || val === "ALL" ? "Tất cả phòng ban" : departments.find((d) => d.id === val)?.name || val)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc Trạng thái Kích hoạt */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Trạng thái:
          </span>
          <Select value={isActive} onValueChange={(val) => onIsActiveChange(val || "ALL")}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Đang kích hoạt</SelectItem>
              <SelectItem value="false">Ngừng kích hoạt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nút Đặt lại */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          <span>Đặt lại</span>
        </Button>
      </div>
    </div>
  );
}
