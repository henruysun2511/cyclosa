"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  Edit,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import type { CandidateDto } from "../../types/recruitment.types";

export interface CandidateTableProps {
  candidates: CandidateDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onEdit: (candidate: CandidateDto) => void;
  onBlacklist: (candidate: CandidateDto) => void;
  onUnblacklist: (id: string) => void;
  canManage: boolean;
}

export function CandidateTable({
  candidates,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onEdit,
  onBlacklist,
  onUnblacklist,
  canManage,
}: CandidateTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="min-w-[240px] text-xs font-semibold">Ứng viên</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Vị trí hiện tại</TableHead>
              <TableHead className="w-[110px] text-center text-xs font-semibold">Kinh nghiệm</TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold">Kỹ năng nổi bật</TableHead>
              <TableHead className="w-[120px] text-xs font-semibold">Nguồn hồ sơ</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[60px] text-right text-xs font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-32 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-xs text-muted-foreground">
                  Không tìm thấy ứng viên nào phù hợp với bộ lọc tìm kiếm.
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((cand) => {
                return (
                  <TableRow key={cand.id} className="hover:bg-muted/25 transition-colors">
                    {/* Họ tên & Avatar & Liên hệ */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-border">
                          {getInitials(cand.fullName)}
                        </div>
                        <div className="space-y-0.5">
                          <Link
                            href={`/recruitment/candidates/${cand.id}`}
                            className="font-bold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{cand.fullName}</span>
                            <span className="font-mono text-[10px] text-muted-foreground font-normal">
                              ({cand.code})
                            </span>
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {cand.email}
                            </span>
                            {cand.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {cand.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Vị trí & Công ty hiện tại */}
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-medium text-foreground">
                          {cand.currentPosition || "Chưa cập nhật"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {cand.currentCompany || "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Kinh nghiệm */}
                    <TableCell className="text-center">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {cand.yearsOfExperience ?? 0} năm
                      </span>
                    </TableCell>

                    {/* Kỹ năng */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(cand.skills || []).slice(0, 3).map((s, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 font-normal"
                          >
                            {s.skillName}
                          </Badge>
                        ))}
                        {(cand.skills?.length || 0) > 3 && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            +{(cand.skills?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Nguồn ứng viên */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {cand.source || "Nộp trực tiếp"}
                      </span>
                    </TableCell>

                    {/* Trạng thái Blacklist */}
                    <TableCell>
                      {cand.isBlacklisted ? (
                        <Badge
                          variant="destructive"
                          className="text-[11px] font-medium bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                        >
                          Blacklist
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                        >
                          Hợp lệ
                        </Badge>
                      )}
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-xs">
                          <DropdownMenuItem asChild>
                            <Link href={`/recruitment/candidates/${cand.id}`} className="flex items-center">
                              <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              <span>Xem chi tiết hồ sơ</span>
                            </Link>
                          </DropdownMenuItem>

                          {canManage && (
                            <DropdownMenuItem onClick={() => onEdit(cand)}>
                              <Edit className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              <span>Chỉnh sửa thông tin</span>
                            </DropdownMenuItem>
                          )}

                          {canManage && (
                            <>
                              <DropdownMenuSeparator />
                              {cand.isBlacklisted ? (
                                <DropdownMenuItem
                                  onClick={() => onUnblacklist(cand.id)}
                                  className="text-emerald-600 focus:text-emerald-700"
                                >
                                  <ShieldCheck className="h-3.5 w-3.5 mr-2" />
                                  <span>Gỡ khỏi Blacklist</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => onBlacklist(cand)}
                                  className="text-rose-600 focus:text-rose-700"
                                >
                                  <ShieldAlert className="h-3.5 w-3.5 mr-2" />
                                  <span>Đưa vào Blacklist</span>
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          Hiển thị{" "}
          <strong className="text-foreground font-mono">{candidates.length}</strong> /{" "}
          <strong className="text-foreground font-mono">{totalItems}</strong> ứng viên
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-mono text-xs text-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

