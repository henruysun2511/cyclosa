"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Shield,
  Trash2,
  FolderOpen,
  Search,
  Clock,
  CheckCircle2,
  Archive,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { showApiErrorToast } from '@/lib/api-error';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetRetentionPoliciesQuery,
  useCreateRetentionPolicyMutation,
  useDeleteRetentionPolicyMutation,
} from '@/features/digital-records/api/digital-records-api';
import type { RetentionStartEvent } from '@/features/digital-records/types/digital-records.types';

export default function RetentionSettingsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [retentionMonths, setRetentionMonths] = useState(60);
  const [startEvent, setStartEvent] = useState<RetentionStartEvent>('ARCHIVED_DATE');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: policiesData, isLoading, refetch } = useGetRetentionPoliciesQuery({});
  const [createMutation, { isLoading: isCreating }] = useCreateRetentionPolicyMutation();
  const [deleteMutation] = useDeleteRetentionPolicyMutation();

  const handleCreate = async () => {
    if (!name.trim() || retentionMonths <= 0) return;

    try {
      await createMutation({
        name: name.trim(),
        description: description.trim() || undefined,
        retentionMonths: Number(retentionMonths),
        startEvent,
      }).unwrap();

      toast.success("Thêm mới chính sách lưu trữ thành công!");
      setCreateOpen(false);
      setName('');
      setDescription('');
      setRetentionMonths(60);
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Không thể tạo chính sách lưu trữ. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chính sách lưu trữ này?')) {
      try {
        await deleteMutation(id).unwrap();
        toast.success("Xóa chính sách lưu trữ thành công!");
        refetch();
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa chính sách lưu trữ. Vui lòng thử lại!");
      }
    }
  };

  const policies = policiesData?.items || [];

  // KPI calculations
  const totalCount = policies.length;
  const longTermCount = policies.filter((p) => p.retentionMonths >= 120).length;
  const shortTermCount = policies.filter((p) => p.retentionMonths < 120).length;
  const activeCount = policies.filter((p) => p.isActive).length;

  const filteredPolicies = useMemo(() => {
    return policies.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    });
  }, [policies, searchQuery]);

  const getStartEventLabel = (event: RetentionStartEvent) => {
    switch (event) {
      case 'ARCHIVED_DATE':
        return 'Ngày nộp lưu kho';
      case 'EMPLOYMENT_END_DATE':
        return 'Ngày chấm dứt HĐLĐ';
      case 'CONTRACT_END_DATE':
        return 'Ngày kết thúc hợp đồng';
      case 'DOCUMENT_EXPIRY_DATE':
        return 'Ngày tài liệu hết hiệu lực';
      default:
        return event;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header chuẩn mực theo Golden Standard (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Shield className="w-6 h-6 text-primary shrink-0" />
            <span>Chính sách lưu trữ hồ sơ</span>
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
            <span className="text-foreground font-medium">Chính sách lưu trữ</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm chính sách</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards chuẩn mực theo Golden Standard (Rule 03) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng chính sách */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Tổng chính sách</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{totalCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Đã ban hành</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shrink-0">
            <Shield className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Lưu trữ dài hạn (>= 10 năm) */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Lưu trữ dài hạn (&ge; 10 năm)</p>
            <p className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{longTermCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-indigo-600">Bảo quản trọng yếu</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shrink-0">
            <Archive className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Lưu trữ ngắn hạn (< 10 năm) */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Lưu trữ ngắn hạn (&lt; 10 năm)</p>
            <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">{shortTermCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-amber-600">Theo vụ việc / hồ sơ</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Đang áp dụng */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Đang áp dụng</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{activeCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-emerald-600">Hiệu lực hiện hành</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar chuẩn mực Rule 03 */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm chính sách lưu trữ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="h-9 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              Đặt lại
            </Button>
          )}
        </div>
      </div>

      {/* Bảng dữ liệu chuẩn mực Rule 04 */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-semibold">Tên chính sách & Quy định</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Thời hạn lưu trữ</TableHead>
              <TableHead className="w-[200px] text-xs font-semibold">Sự kiện kích hoạt tính hạn</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-20 text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-7 w-7 rounded-md ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredPolicies.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Chưa có chính sách lưu trữ nào được tìm thấy</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &quot;Thêm chính sách&quot; để định nghĩa thời hạn lưu trữ hồ sơ theo quy định
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPolicies.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-foreground text-sm">{p.name}</div>
                    {p.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">{p.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs font-medium">
                      {p.retentionMonths} tháng ({(p.retentionMonths / 12).toFixed(1)} năm)
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {getStartEventLabel(p.startEvent)}
                  </TableCell>
                  <TableCell>
                    {p.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-2xs">
                        Đang áp dụng
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-white shadow-2xs">
                        Ngừng áp dụng
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(p.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Xóa chính sách"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal tạo mới chuẩn mực theo Rule 05 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Thêm chính sách lưu trữ</DialogTitle>
            <DialogDescription className="text-xs">
              Thiết lập quy định thời hạn bảo quản hồ sơ nhân sự
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="policy-name" className="text-xs font-semibold">Tên chính sách *</Label>
              <Input
                id="policy-name"
                placeholder="VD: Hồ sơ tuyển dụng - 5 năm, Hợp đồng lao động - 10 năm..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="retention-months" className="text-xs font-semibold">Thời hạn (Tháng) *</Label>
                <Input
                  id="retention-months"
                  type="number"
                  min={1}
                  value={retentionMonths}
                  onChange={(e) => setRetentionMonths(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="start-event" className="text-xs font-semibold">Sự kiện tính hạn *</Label>
                <Select
                  value={startEvent}
                  onValueChange={(val) => {
                    if (val) setStartEvent(val as RetentionStartEvent);
                  }}
                >
                  <SelectTrigger id="start-event" className="h-9 text-xs">
                    <SelectValue>
                      {getStartEventLabel(startEvent)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARCHIVED_DATE">Ngày nộp lưu kho</SelectItem>
                    <SelectItem value="EMPLOYMENT_END_DATE">Ngày nhân viên thôi việc</SelectItem>
                    <SelectItem value="CONTRACT_END_DATE">Ngày hết hạn hợp đồng</SelectItem>
                    <SelectItem value="DOCUMENT_EXPIRY_DATE">Ngày hết hạn giấy tờ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="policy-desc" className="text-xs font-semibold">Mô tả căn cứ quy định</Label>
              <Textarea
                id="policy-desc"
                rows={3}
                placeholder="Căn cứ Luật Lưu trữ, Nghị định hướng dẫn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(false)}
              disabled={isCreating}
              className="h-8 text-xs border-border"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isCreating ? 'Đang lưu...' : 'Tạo chính sách'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
