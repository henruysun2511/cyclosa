"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Unlock,
  FolderOpen,
  Search,
  Filter,
  FileText,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { showApiErrorToast } from '@/lib/api-error';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useGetLegalHoldsQuery,
  useReleaseLegalHoldMutation,
} from '@/features/digital-records/api/digital-records-api';
import type { DocumentLegalHold } from '@/features/digital-records/types/digital-records.types';

export default function LegalHoldsPage() {
  const [selectedHold, setSelectedHold] = useState<DocumentLegalHold | null>(null);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [releaseNote, setReleaseNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RELEASED'>('ALL');

  const { data: holdsData, isLoading, refetch } = useGetLegalHoldsQuery({});
  const [releaseMutation, { isLoading: isReleasing }] = useReleaseLegalHoldMutation();

  const handleRelease = async () => {
    if (!selectedHold || !releaseNote.trim()) return;

    try {
      await releaseMutation({
        holdId: selectedHold.id,
        data: { releaseNote: releaseNote.trim() },
      }).unwrap();

      toast.success("Gỡ bỏ lệnh tạm giữ pháp lý thành công!");
      setReleaseOpen(false);
      setReleaseNote('');
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Không thể gỡ bỏ lệnh tạm giữ pháp lý. Vui lòng thử lại!");
    }
  };

  const holds = holdsData?.items || [];

  // KPI Calculations
  const totalCount = holds.length;
  const activeCount = holds.filter((h) => !h.isReleased).length;
  const releasedCount = holds.filter((h) => h.isReleased).length;
  const affectedDocsCount = new Set(holds.map((h) => h.documentId)).size;

  // Filtered List
  const filteredHolds = useMemo(() => {
    return holds.filter((h) => {
      const matchSearch =
        !searchQuery.trim() ||
        h.holdCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.documentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.documentCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.reason?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && !h.isReleased) ||
        (statusFilter === 'RELEASED' && h.isReleased);

      return matchSearch && matchStatus;
    });
  }, [holds, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header chuẩn mực theo Golden Standard (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <ShieldAlert className="w-6 h-6 text-primary shrink-0" />
            <span>Tạm giữ pháp lý hồ sơ</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/documents" className="hover:text-primary transition-colors">
              Hồ sơ số hóa
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tạm giữ pháp lý</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8 gap-1.5 text-xs border-border hover:bg-muted font-semibold"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards chuẩn mực theo Golden Standard (Rule 03) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng lệnh tạm giữ */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Tổng lệnh tạm giữ</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{totalCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Toàn hệ thống</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Đang có hiệu lực */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Đang có hiệu lực</p>
            <p className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">{activeCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-rose-600">Khóa hủy tuyệt đối</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Đã giải tỏa */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Đã giải tỏa</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{releasedCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-emerald-600">Hoàn tất vụ việc</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Hồ sơ chịu ảnh hưởng */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Hồ sơ liên quan</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{affectedDocsCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Tài liệu bảo lưu</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 shrink-0">
            <FileText className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar chuẩn mực theo Rule 03 */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="relative md:col-span-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã lệnh, tên tài liệu, lý do tạm giữ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                if (val) setStatusFilter(val as 'ALL' | 'ACTIVE' | 'RELEASED');
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue>
                  {statusFilter === 'ALL'
                    ? 'Tất cả trạng thái'
                    : statusFilter === 'ACTIVE'
                    ? 'Đang có hiệu lực'
                    : 'Đã giải tỏa'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Đang có hiệu lực</SelectItem>
                <SelectItem value="RELEASED">Đã giải tỏa</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || statusFilter !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="h-9 text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu chuẩn mực theo Rule 04 */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[150px] text-xs font-semibold">Mã lệnh</TableHead>
              <TableHead className="text-xs font-semibold">Tài liệu áp dụng</TableHead>
              <TableHead className="text-xs font-semibold">Lý do & Căn cứ tạm giữ</TableHead>
              <TableHead className="text-xs font-semibold">Người ban hành / Ngày</TableHead>
              <TableHead className="text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-28 text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell><Skeleton className="h-4 w-28 font-mono" /></TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredHolds.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Không tìm thấy lệnh tạm giữ pháp lý nào</p>
                    <p className="text-xs text-muted-foreground">
                      Kho tài liệu đang hoạt động theo chu trình lưu trữ thông thường
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredHolds.map((h) => (
                <TableRow key={h.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-foreground">
                    {h.holdCode}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground text-xs">{h.documentTitle || 'Tài liệu'}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">{h.documentCode}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {h.reason}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1 max-w-[280px] truncate" title={h.note}>
                      {h.note || '---'}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">{h.placedByUserName || 'Chuyên viên Pháp chế'}</div>
                    <div className="text-muted-foreground text-[11px] font-mono">{h.placedAt?.substring(0, 10)}</div>
                  </TableCell>
                  <TableCell>
                    {h.isReleased ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-2xs">
                        <ShieldCheck className="h-3 w-3" /> Đã gỡ bỏ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs">
                        <ShieldAlert className="h-3 w-3" /> Đang hiệu lực
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!h.isReleased && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedHold(h);
                          setReleaseOpen(true);
                        }}
                        className="h-8 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 font-semibold"
                      >
                        <Unlock className="h-3.5 w-3.5" /> Gỡ tạm giữ
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal gỡ bỏ lệnh tạm giữ chuẩn mực theo Rule 05 */}
      <Dialog open={releaseOpen} onOpenChange={setReleaseOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Unlock className="h-5 w-5 text-emerald-600" /> Gỡ bỏ Lệnh Tạm giữ Pháp lý
            </DialogTitle>
            <DialogDescription className="text-xs">
              Xác nhận vụ việc/tranh chấp đã được xử lý xong để đưa hồ sơ về chu trình quản lý thông thường
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rel-note" className="text-xs font-semibold">Căn cứ / Lý do gỡ tạm giữ *</Label>
              <Textarea
                id="rel-note"
                rows={3}
                placeholder="VD: Tranh chấp đã được Tòa án tuyên án có hiệu lực pháp luật, cuộc thanh tra kết thúc..."
                value={releaseNote}
                onChange={(e) => setReleaseNote(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReleaseOpen(false)}
              disabled={isReleasing}
              className="h-8 text-xs border-border"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleRelease}
              disabled={!releaseNote.trim() || isReleasing}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isReleasing ? 'Đang gỡ...' : 'Xác nhận Giải tỏa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
