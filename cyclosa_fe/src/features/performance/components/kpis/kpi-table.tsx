import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FolderOpen, Pencil, Trash2 } from "lucide-react";
import type { KpiDto } from "../../types/performance.types";

interface KpiTableProps {
  items: KpiDto[];
  isLoading?: boolean;
  page: number;
  size: number;
  onEdit?: (kpi: KpiDto) => void;
  onDelete?: (kpi: KpiDto) => void;
}

export function KpiTable({
  items,
  isLoading,
  page,
  size,
  onEdit,
  onDelete,
}: KpiTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">
                STT
              </TableHead>
              <TableHead className="text-xs font-semibold">Mã & Tên KPI</TableHead>
              <TableHead className="text-xs font-semibold">Phòng ban áp dụng</TableHead>
              <TableHead className="text-xs font-semibold">Đơn vị & Chỉ tiêu mặc định</TableHead>
              <TableHead className="text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-20 text-center text-xs font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* 1. Loading Skeleton */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-7 w-7 rounded-md mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              /* 2. Table-Embedded Empty State */
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Chưa có chỉ số KPI nào</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &quot;Thêm KPI mới&quot; để tạo các chỉ số đo lường hiệu suất dùng chung
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* 3. Table Rows */
              items.map((kpi, index) => (
                <TableRow
                  key={kpi.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {(page - 1) * size + index + 1}
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-mono font-medium text-primary block">
                      {kpi.code}
                    </span>
                    <span className="font-medium text-foreground">
                      {kpi.name}
                    </span>
                    {kpi.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {kpi.description}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {kpi.departmentName ? (
                      <Badge variant="outline" className="font-normal text-[11px]">
                        {kpi.departmentName}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Toàn công ty</span>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {kpi.defaultTarget !== undefined && kpi.defaultTarget !== null
                        ? kpi.defaultTarget.toLocaleString("vi-VN")
                        : "—"}
                    </span>{" "}
                    <span className="text-[11px] text-muted-foreground">
                      ({kpi.unit})
                    </span>
                  </TableCell>

                  <TableCell>
                    {kpi.isActive ? (
                      <Badge variant="default" className="bg-emerald-600 text-white hover:bg-emerald-700">
                        Đang kích hoạt
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        Ngừng áp dụng
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 text-xs">
                        <DropdownMenuItem onClick={() => onEdit?.(kpi)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete?.(kpi)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          Xóa KPI
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
