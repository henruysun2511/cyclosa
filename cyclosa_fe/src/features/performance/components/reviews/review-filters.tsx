import { Search, Calendar, Building2, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REVIEW_STATUS_LABELS } from "../../constants/performance.constants";

interface OptionItem {
  id: string;
  name: string;
}

interface ReviewFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  cycleId: string;
  onCycleChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  cycles: OptionItem[];
  departments: OptionItem[];
  onReset: () => void;
}

export function ReviewFilters({
  search,
  onSearchChange,
  cycleId,
  onCycleChange,
  departmentId,
  onDepartmentChange,
  status,
  onStatusChange,
  cycles,
  departments,
  onReset,
}: ReviewFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm phiếu theo tên nhân viên, mã nhân viên..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Bộ lọc kỳ đánh giá, phòng ban, trạng thái + nút đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc Kỳ đánh giá */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Kỳ đánh giá:
          </span>
          <Select value={cycleId} onValueChange={(val) => onCycleChange(val || "ALL")}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả kỳ đánh giá">
                {(val: string) => (!val || val === "ALL" ? "Tất cả kỳ đánh giá" : cycles.find((c) => c.id === val)?.name || val)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả kỳ đánh giá</SelectItem>
              {cycles.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc Phòng ban */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
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
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc Trạng thái */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
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
              <SelectItem value="DRAFT">{REVIEW_STATUS_LABELS.DRAFT}</SelectItem>
              <SelectItem value="SELF_REVIEWED">
                {REVIEW_STATUS_LABELS.SELF_REVIEWED}
              </SelectItem>
              <SelectItem value="MANAGER_REVIEWED">
                {REVIEW_STATUS_LABELS.MANAGER_REVIEWED}
              </SelectItem>
              <SelectItem value="FINALIZED">
                {REVIEW_STATUS_LABELS.FINALIZED}
              </SelectItem>
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
