import { Search, Filter, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERFORMANCE_CYCLE_STATUS_LABELS } from "../../constants/performance.constants";

interface CycleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  onReset: () => void;
}

export function CycleFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  year,
  onYearChange,
  onReset,
}: CycleFiltersProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: "ALL", label: "Tất cả các năm" },
    { value: (currentYear + 1).toString(), label: `Năm ${currentYear + 1}` },
    { value: currentYear.toString(), label: `Năm ${currentYear}` },
    { value: (currentYear - 1).toString(), label: `Năm ${currentYear - 1}` },
    { value: (currentYear - 2).toString(), label: `Năm ${currentYear - 2}` },
  ];

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm kỳ đánh giá theo tên, mô tả..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Bộ lọc trạng thái, năm + nút đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc Trạng thái */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Trạng thái:
          </span>
          <Select value={status} onValueChange={(val) => onStatusChange(val || "ALL")}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="DRAFT">
                {PERFORMANCE_CYCLE_STATUS_LABELS.DRAFT}
              </SelectItem>
              <SelectItem value="ACTIVE">
                {PERFORMANCE_CYCLE_STATUS_LABELS.ACTIVE}
              </SelectItem>
              <SelectItem value="CLOSED">
                {PERFORMANCE_CYCLE_STATUS_LABELS.CLOSED}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lọc Năm */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Năm đánh giá:
          </span>
          <Select value={year} onValueChange={(val) => onYearChange(val || "ALL")}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả các năm" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
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
