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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Target, Pencil, Trash2 } from "lucide-react";
import { GoalStatusBadge } from "../performance-badges";
import type { PerformanceGoalDto, ReviewStatus } from "../../types/performance.types";

interface GoalTableProps {
  goals: PerformanceGoalDto[];
  reviewStatus: ReviewStatus;
  onEdit?: (goal: PerformanceGoalDto) => void;
  onDelete?: (goal: PerformanceGoalDto) => void;
}

export function GoalTable({
  goals,
  reviewStatus,
  onEdit,
  onDelete,
}: GoalTableProps) {
  const isFinalized = reviewStatus === "FINALIZED";

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">
                STT
              </TableHead>
              <TableHead className="text-xs font-semibold">Tên mục tiêu / Chỉ số KPI</TableHead>
              <TableHead className="text-xs font-semibold text-center">Chỉ tiêu (Target)</TableHead>
              <TableHead className="text-xs font-semibold text-center">Trọng số</TableHead>
              <TableHead className="text-xs font-semibold text-center">Điểm tự chấm</TableHead>
              <TableHead className="text-xs font-semibold text-center">Điểm Quản lý</TableHead>
              <TableHead className="text-xs font-semibold">Tiến độ</TableHead>
              {!isFinalized && (
                <TableHead className="w-16 text-center text-xs font-semibold">
                  Thao tác
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {goals.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={isFinalized ? 7 : 8}
                  className="h-36 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <Target className="h-7 w-7 text-muted-foreground/40" />
                    <p className="text-xs font-medium">Chưa có mục tiêu nào được thiết lập</p>
                    <p className="text-[11px] text-muted-foreground">
                      Bấm &quot;Thêm mục tiêu&quot; để giao KPI và phân bổ trọng số cho nhân sự
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              goals.map((goal, index) => (
                <TableRow
                  key={goal.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-medium text-foreground block">
                      {goal.name}
                    </span>
                    {goal.kpiName && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                          {goal.kpiCode}
                        </Badge>
                        <span>{goal.kpiName}</span>
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-center text-xs text-muted-foreground">
                    {goal.targetValue !== undefined && goal.targetValue !== null ? (
                      <span className="font-medium text-foreground">
                        {goal.targetValue.toLocaleString("vi-VN")}{" "}
                        <span className="text-[10px] text-muted-foreground">
                          {goal.kpiUnit || ""}
                        </span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell className="text-center text-xs font-semibold text-foreground">
                    {goal.weight}%
                  </TableCell>

                  <TableCell className="text-center text-xs">
                    {goal.selfScore !== undefined && goal.selfScore !== null ? (
                      <div>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {Number(goal.selfScore).toFixed(1)}
                        </span>
                        {goal.selfComment && (
                          <span
                            className="block text-[10px] text-muted-foreground truncate max-w-[120px] mx-auto"
                            title={goal.selfComment}
                          >
                            &quot;{goal.selfComment}&quot;
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center text-xs">
                    {goal.managerScore !== undefined && goal.managerScore !== null ? (
                      <div>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {Number(goal.managerScore).toFixed(1)}
                        </span>
                        {goal.managerComment && (
                          <span
                            className="block text-[10px] text-muted-foreground truncate max-w-[120px] mx-auto"
                            title={goal.managerComment}
                          >
                            &quot;{goal.managerComment}&quot;
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <GoalStatusBadge status={goal.status} />
                  </TableCell>

                  {!isFinalized && (
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 text-xs">
                          <DropdownMenuItem onClick={() => onEdit?.(goal)}>
                            <Pencil className="w-3.5 h-3.5 mr-2" />
                            Sửa mục tiêu
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete?.(goal)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Xóa mục tiêu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
