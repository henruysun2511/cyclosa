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
  Calendar,
  Clock,
  UserCheck,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { OrientationSessionDto } from "../../types/onboarding.types";

interface OrientationSessionTableProps {
  sessions: OrientationSessionDto[];
  isLoading: boolean;
  canManage: boolean;
  onOpenAttendance: (session: OrientationSessionDto) => void;
  onCancelSession: (id: string) => void;
}

export function OrientationSessionTable({
  sessions,
  isLoading,
  canManage,
  onOpenAttendance,
  onCancelSession,
}: OrientationSessionTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Đã hoàn thành
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 text-xs"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Đã lên lịch
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="min-w-[220px] text-xs font-semibold">Tên lớp đào tạo</TableHead>
            <TableHead className="w-[180px] text-xs font-semibold">Giảng viên nội bộ</TableHead>
            <TableHead className="w-[190px] text-xs font-semibold">Thời gian tổ chức</TableHead>
            <TableHead className="w-[180px] text-xs font-semibold">Địa điểm / Đường dẫn</TableHead>
            <TableHead className="w-[120px] text-center text-xs font-semibold">Học viên</TableHead>
            <TableHead className="w-[130px] text-xs font-semibold">Trạng thái</TableHead>
            <TableHead className="w-[120px] text-right text-xs font-semibold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : sessions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-36 text-center text-xs text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Calendar className="h-8 w-8 text-muted-foreground/40" />
                  <p>Chưa có lớp đào tạo định hướng nào được tổ chức.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((sess) => (
              <TableRow
                key={sess.id}
                className="hover:bg-muted/25 transition-colors"
              >
                {/* Tên buổi */}
                <TableCell>
                  <span className="font-bold text-xs text-foreground block">
                    {sess.title}
                  </span>
                  {sess.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {sess.description}
                    </p>
                  )}
                </TableCell>

                {/* Giảng viên */}
                <TableCell>
                  <span className="text-xs font-medium text-foreground block">
                    {sess.trainerName}
                  </span>
                  {sess.trainerEmail && (
                    <span className="text-[11px] text-muted-foreground font-mono block">
                      {sess.trainerEmail}
                    </span>
                  )}
                </TableCell>

                {/* Thời gian */}
                <TableCell className="font-mono text-xs text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{sess.startTime.replace("T", " ")}</span>
                  </div>
                  <div className="text-[11px]">Đến: {sess.endTime.replace("T", " ")}</div>
                </TableCell>

                {/* Địa điểm */}
                <TableCell>
                  {sess.meetingLink ? (
                    <a
                      href={sess.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Phòng họp online</span>
                    </a>
                  ) : sess.location ? (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{sess.location}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Văn phòng chính</span>
                  )}
                </TableCell>

                {/* Học viên */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs font-semibold px-2 py-0.5 bg-muted/40"
                  >
                    {sess.attendeeCount || 0}/{sess.maxAttendees}
                  </Badge>
                </TableCell>

                {/* Trạng thái */}
                <TableCell>{getStatusBadge(sess.status)}</TableCell>

                {/* Thao tác */}
                <TableCell className="text-right">
                  {canManage && sess.status === "SCHEDULED" && (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onOpenAttendance(sess)}
                        className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Điểm danh</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancelSession(sess.id)}
                        className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Hủy
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

