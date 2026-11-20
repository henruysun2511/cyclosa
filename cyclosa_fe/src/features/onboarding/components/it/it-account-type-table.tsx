"use client";

import React from "react";
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
  KeyRound,
  ShieldCheck,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { ItAccountTypeDto } from "../../types/onboarding.types";

interface ItAccountTypeTableProps {
  types: ItAccountTypeDto[];
  isLoading: boolean;
  canManage: boolean;
  onEdit: (type: ItAccountTypeDto) => void;
  onDelete: (id: string) => void;
}

export function ItAccountTypeTable({
  types,
  isLoading,
  canManage,
  onEdit,
  onDelete,
}: ItAccountTypeTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[140px] text-xs font-semibold">Mã loại</TableHead>
            <TableHead className="min-w-[200px] text-xs font-semibold">Tên loại tài khoản CNTT</TableHead>
            <TableHead className="w-[240px] text-xs font-semibold">Quy cách đặt tên (Pattern)</TableHead>
            <TableHead className="w-[140px] text-xs font-semibold">Yêu cầu VPN</TableHead>
            <TableHead className="w-[130px] text-xs font-semibold">Trạng thái</TableHead>
            <TableHead className="w-[100px] text-right text-xs font-semibold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : types.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-36 text-center text-xs text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <KeyRound className="h-8 w-8 text-muted-foreground/40" />
                  <p>Chưa có loại tài khoản CNTT nào được định nghĩa.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            types.map((t) => (
              <TableRow key={t.id} className="hover:bg-muted/25 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {t.code}
                </TableCell>

                <TableCell>
                  <span className="font-bold text-xs text-foreground block">
                    {t.name}
                  </span>
                  {t.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {t.description}
                    </p>
                  )}
                </TableCell>

                <TableCell className="font-mono text-xs text-muted-foreground">
                  {t.usernamePattern || "—"}
                </TableCell>

                <TableCell>
                  {t.requiresVpn ? (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] font-medium"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Bắt buộc VPN
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Không</span>
                  )}
                </TableCell>

                <TableCell>
                  {t.isActive ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Đang kích hoạt
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-600 border-slate-200 text-xs font-medium"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Tạm ngưng
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {canManage && (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(t)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(t.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

