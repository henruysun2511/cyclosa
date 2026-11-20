"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Layers,
  Shield,
  Trash2,
  FolderOpen,
  Search,
  Lock,
  FileCheck,
  FileText,
  SlidersHorizontal,
  X,
  Sparkles,
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetDocumentTypesQuery,
  useCreateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
  useGetActiveRetentionPoliciesQuery,
  useAddMetadataFieldMutation,
  useDeleteMetadataFieldMutation,
} from '@/features/digital-records/api/digital-records-api';
import type {
  DocumentType,
  DocumentMetadataField,
  CreateDocumentMetadataFieldRequest,
  MetadataDataType,
} from '@/features/digital-records/types/digital-records.types';

function toFieldKey(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

interface DraftField {
  fieldKey: string;
  label: string;
  dataType: MetadataDataType;
  isRequired: boolean;
}

const METADATA_DATA_TYPE_MAP: Record<MetadataDataType, string> = {
  TEXT: 'Văn bản (TEXT)',
  DATE: 'Ngày tháng (DATE)',
  NUMBER: 'Số (NUMBER)',
  BOOLEAN: 'Đúng / Sai',
  SELECT: 'Danh sách lựa chọn',
};

export default function DocumentTypesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [retentionPolicyId, setRetentionPolicyId] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSensitive, setFilterSensitive] = useState<'ALL' | 'SENSITIVE' | 'STANDARD'>('ALL');

  // Quản lý metadata fields trong form Tạo mới
  const [draftFields, setDraftFields] = useState<DraftField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldDataType, setNewFieldDataType] = useState<MetadataDataType>('TEXT');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // Quản lý metadata fields cho loại tài liệu đã tồn tại
  const [selectedTypeForFields, setSelectedTypeForFields] = useState<DocumentType | null>(null);
  const [fieldsModalOpen, setFieldsModalOpen] = useState(false);
  const [manageFieldLabel, setManageFieldLabel] = useState('');
  const [manageFieldKey, setManageFieldKey] = useState('');
  const [manageFieldDataType, setManageFieldDataType] = useState<MetadataDataType>('TEXT');
  const [manageFieldRequired, setManageFieldRequired] = useState(false);

  const { data: typesData, isLoading, refetch } = useGetDocumentTypesQuery({});
  const { data: retentionPolicies = [] } = useGetActiveRetentionPoliciesQuery();

  const [createMutation, { isLoading: isCreating }] = useCreateDocumentTypeMutation();
  const [deleteMutation] = useDeleteDocumentTypeMutation();
  const [addFieldMutation, { isLoading: isAddingField }] = useAddMetadataFieldMutation();
  const [deleteFieldMutation, { isLoading: isDeletingField }] = useDeleteMetadataFieldMutation();

  const handleAddDraftField = () => {
    if (!newFieldLabel.trim()) return;
    const finalKey = newFieldKey.trim() || toFieldKey(newFieldLabel);
    if (!finalKey) return;

    // Tránh trùng key
    if (draftFields.some((f) => f.fieldKey === finalKey)) {
      alert('Mã trường đã tồn tại trong danh sách!');
      return;
    }

    setDraftFields((prev) => [
      ...prev,
      {
        label: newFieldLabel.trim(),
        fieldKey: finalKey,
        dataType: newFieldDataType,
        isRequired: newFieldRequired,
      },
    ]);

    setNewFieldLabel('');
    setNewFieldKey('');
    setNewFieldDataType('TEXT');
    setNewFieldRequired(false);
  };

  const handleRemoveDraftField = (index: number) => {
    setDraftFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!code.trim() || !name.trim()) return;

    try {
      const payloadFields: CreateDocumentMetadataFieldRequest[] = draftFields.map((f, idx) => ({
        fieldKey: f.fieldKey,
        label: f.label,
        dataType: f.dataType,
        isRequired: f.isRequired,
        displayOrder: idx + 1,
      }));

      await createMutation({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        retentionPolicyId: retentionPolicyId || undefined,
        isSensitive,
        description: description.trim() || undefined,
        metadataFields: payloadFields.length > 0 ? payloadFields : undefined,
      }).unwrap();

      toast.success("Thêm mới loại tài liệu thành công!");
      setCreateOpen(false);
      setCode('');
      setName('');
      setRetentionPolicyId('');
      setIsSensitive(false);
      setDescription('');
      setDraftFields([]);
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Không thể tạo loại tài liệu. Vui lòng kiểm tra lại thông tin!");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa loại tài liệu này?')) {
      try {
        await deleteMutation(id).unwrap();
        toast.success("Xóa loại tài liệu thành công!");
        refetch();
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa loại tài liệu. Vui lòng thử lại!");
      }
    }
  };

  const handleOpenFieldsModal = (type: DocumentType) => {
    setSelectedTypeForFields(type);
    setManageFieldLabel('');
    setManageFieldKey('');
    setManageFieldDataType('TEXT');
    setManageFieldRequired(false);
    setFieldsModalOpen(true);
  };

  const handleAddLiveField = async () => {
    if (!selectedTypeForFields || !manageFieldLabel.trim()) return;
    const finalKey = manageFieldKey.trim() || toFieldKey(manageFieldLabel);
    if (!finalKey) return;

    try {
      await addFieldMutation({
        typeId: selectedTypeForFields.id,
        data: {
          label: manageFieldLabel.trim(),
          fieldKey: finalKey,
          dataType: manageFieldDataType,
          isRequired: manageFieldRequired,
          displayOrder: (selectedTypeForFields.metadataFields?.length || 0) + 1,
        },
      }).unwrap();

      toast.success("Thêm trường siêu dữ liệu bóc tách thành công!");
      setManageFieldLabel('');
      setManageFieldKey('');
      setManageFieldDataType('TEXT');
      setManageFieldRequired(false);
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Không thể thêm trường siêu dữ liệu. Vui lòng thử lại!");
    }
  };

  const handleDeleteLiveField = async (fieldId: string) => {
    if (!selectedTypeForFields) return;
    if (confirm('Bạn có chắc muốn xóa trường siêu dữ liệu này?')) {
      try {
        await deleteFieldMutation({
          typeId: selectedTypeForFields.id,
          fieldId,
        }).unwrap();
        toast.success("Xóa trường siêu dữ liệu thành công!");
        refetch();
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa trường siêu dữ liệu. Vui lòng thử lại!");
      }
    }
  };

  const types = typesData?.items || [];

  // Update selectedTypeForFields from fresh data when refetched
  const currentSelectedType = useMemo(() => {
    if (!selectedTypeForFields) return null;
    return types.find((t) => t.id === selectedTypeForFields.id) || selectedTypeForFields;
  }, [types, selectedTypeForFields]);

  // KPI Calculations
  const totalCount = types.length;
  const sensitiveCount = types.filter((t) => t.isSensitive).length;
  const withPolicyCount = types.filter((t) => !!t.retentionPolicyId).length;
  const standardCount = totalCount - sensitiveCount;

  // Filtered List
  const filteredTypes = useMemo(() => {
    return types.filter((t) => {
      const matchSearch =
        !searchQuery.trim() ||
        t.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSensitive =
        filterSensitive === 'ALL' ||
        (filterSensitive === 'SENSITIVE' && t.isSensitive) ||
        (filterSensitive === 'STANDARD' && !t.isSensitive);

      return matchSearch && matchSensitive;
    });
  }, [types, searchQuery, filterSensitive]);

  const selectedPolicy = retentionPolicies.find((p) => p.id === retentionPolicyId);

  return (
    <div className="space-y-6">
      {/* Header chuẩn mực theo Golden Standard (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Layers className="w-6 h-6 text-primary shrink-0" />
            <span>Danh mục loại tài liệu & Metadata</span>
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
            <span className="text-foreground font-medium">Danh mục loại tài liệu</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm loại tài liệu</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards chuẩn mực theo Golden Standard (Rule 03) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng loại tài liệu */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Tổng loại hồ sơ</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{totalCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Đã cấu hình bóc tách</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shrink-0">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Tài liệu nhạy cảm cao */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Nhạy cảm cao</p>
            <p className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">{sensitiveCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-rose-600">Kiểm soát bảo mật</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shrink-0">
            <Lock className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Có chính sách lưu trữ */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Đã gắn chính sách</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{withPolicyCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-emerald-600">Chu trình tự động</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
            <FileCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Hồ sơ tiêu chuẩn */}
        <div className="flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Hồ sơ phổ thông</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{standardCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Quy trình thông thường</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 shrink-0">
            <FileText className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar chuẩn mực Rule 03 */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="relative md:col-span-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã loại, tên loại tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Select
              value={filterSensitive}
              onValueChange={(val) => {
                if (val) setFilterSensitive(val as 'ALL' | 'SENSITIVE' | 'STANDARD');
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue>
                  {filterSensitive === 'ALL'
                    ? 'Tất cả phân loại'
                    : filterSensitive === 'SENSITIVE'
                    ? 'Nhạy cảm cao'
                    : 'Tiêu chuẩn'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả phân loại</SelectItem>
                <SelectItem value="SENSITIVE">Nhạy cảm cao</SelectItem>
                <SelectItem value="STANDARD">Tiêu chuẩn</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || filterSensitive !== 'ALL') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterSensitive('ALL');
                }}
                className="h-9 text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu chuẩn mực Rule 04 */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[140px] text-xs font-semibold">Mã loại</TableHead>
              <TableHead className="text-xs font-semibold">Tên loại tài liệu</TableHead>
              <TableHead className="text-xs font-semibold">Chính sách lưu trữ áp dụng</TableHead>
              <TableHead className="text-xs font-semibold">Trường siêu dữ liệu bóc tách (Metadata)</TableHead>
              <TableHead className="w-[150px] text-xs font-semibold">Bảo mật</TableHead>
              <TableHead className="w-24 text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell><Skeleton className="h-4 w-20 font-mono" /></TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-28 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-7 w-7 rounded-md ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredTypes.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Chưa có loại tài liệu nào phù hợp</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &quot;Thêm loại tài liệu&quot; để tạo cấu hình phân loại hồ sơ và thiết lập trường bóc tách OCR
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTypes.map((t) => (
                <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-foreground">
                    {t.code}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground text-sm">{t.name}</div>
                    {t.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {t.retentionPolicyName ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 font-normal">
                        {t.retentionPolicyName} ({t.retentionMonths} tháng)
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Chưa gắn</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[360px]">
                      {t.metadataFields?.map((f) => (
                        <span
                          key={f.id}
                          className="text-[11px] bg-muted/80 text-foreground px-2 py-0.5 rounded border border-border/60 flex items-center gap-1"
                        >
                          <span className="font-medium">{f.label}</span>
                          <span className="text-[9px] font-mono text-muted-foreground">({f.dataType})</span>
                        </span>
                      ))}
                      {(!t.metadataFields || t.metadataFields.length === 0) && (
                        <span className="text-xs text-muted-foreground italic">Chưa có trường nào</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenFieldsModal(t)}
                        className="h-6 px-1.5 text-[11px] text-primary hover:text-primary gap-1"
                        title="Quản lý trường metadata"
                      >
                        <SlidersHorizontal className="h-3 w-3" />
                        <span>Cấu hình ({t.metadataFields?.length || 0})</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {t.isSensitive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs">
                        <Shield className="h-3 w-3" /> Nhạy cảm cao
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-white shadow-2xs">
                        Tiêu chuẩn
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenFieldsModal(t)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Cấu hình trường Metadata"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Xóa loại tài liệu"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 1. Modal tạo mới loại tài liệu kèm trường Metadata (Rule 05) */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Thêm loại tài liệu & Cấu hình Metadata</DialogTitle>
            <DialogDescription className="text-xs">
              Định nghĩa danh mục hồ sơ và các trường siêu dữ liệu bóc tách phục vụ OCR/AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="type-code" className="text-xs font-semibold">Mã loại *</Label>
                <Input
                  id="type-code"
                  placeholder="CCCD, DEGREE, CONTRACT..."
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type-name" className="text-xs font-semibold">Tên loại tài liệu *</Label>
                <Input
                  id="type-name"
                  placeholder="Căn cước công dân..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Chính sách lưu trữ áp dụng</Label>
              <Select value={retentionPolicyId} onValueChange={(val) => setRetentionPolicyId(val || '')}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue>
                    {selectedPolicy
                      ? `${selectedPolicy.name} (${selectedPolicy.retentionMonths} tháng)`
                      : 'Chọn chính sách lưu trữ'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {retentionPolicies.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.retentionMonths} tháng)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="sensitive-switch" className="text-xs font-semibold cursor-pointer">
                  Tài liệu nhạy cảm cao
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Yêu cầu bảo mật nâng cao và kiểm soát quyền truy cập chặt chẽ.
                </p>
              </div>
              <Switch id="sensitive-switch" checked={isSensitive} onCheckedChange={setIsSensitive} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type-desc" className="text-xs font-semibold">Mô tả loại tài liệu</Label>
              <Textarea
                id="type-desc"
                rows={2}
                placeholder="Mục đích sử dụng, yêu cầu scan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* KHU VỰC CẤU HÌNH TRƯỜNG METADATA ĐỘNG */}
            <div className="border border-border rounded-xl p-3.5 space-y-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Các trường siêu dữ liệu trích xuất OCR ({draftFields.length})
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Tự động hiển thị trên form thẩm định Split-screen
                </span>
              </div>

              {/* Form thêm nhanh trường */}
              <div className="p-3 bg-background rounded-lg border border-border/80 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div className="sm:col-span-5 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Tên trường hiển thị *</Label>
                    <Input
                      placeholder="VD: Số CCCD, Ngày cấp..."
                      value={newFieldLabel}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewFieldLabel(val);
                        if (!newFieldKey) {
                          setNewFieldKey(toFieldKey(val));
                        }
                      }}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Mã trường (Key)</Label>
                    <Input
                      placeholder="so_cccd, ngay_cap..."
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(toFieldKey(e.target.value))}
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Kiểu dữ liệu</Label>
                    <Select
                      value={newFieldDataType}
                      onValueChange={(val) => setNewFieldDataType(val as MetadataDataType)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Chọn kiểu dữ liệu">
                          {METADATA_DATA_TYPE_MAP[newFieldDataType]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Văn bản (TEXT)</SelectItem>
                        <SelectItem value="DATE">Ngày tháng (DATE)</SelectItem>
                        <SelectItem value="NUMBER">Số (NUMBER)</SelectItem>
                        <SelectItem value="BOOLEAN">Đúng / Sai</SelectItem>
                        <SelectItem value="SELECT">Danh sách lựa chọn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="rounded border-border h-3.5 w-3.5 text-primary"
                    />
                    <span>Bắt buộc có giá trị khi thẩm định</span>
                  </label>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddDraftField}
                    disabled={!newFieldLabel.trim()}
                    className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5 font-medium"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Thêm trường</span>
                  </Button>
                </div>
              </div>

              {/* Danh sách trường đã thêm vào danh sách draft */}
              {draftFields.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {draftFields.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-md bg-background border border-border text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{f.label}</span>
                        <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                          {f.fieldKey}
                        </code>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                          {f.dataType}
                        </Badge>
                        {f.isRequired && (
                          <span className="text-[10px] text-rose-600 font-medium">Bắt buộc</span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDraftField(idx)}
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground py-2 italic">
                  Chưa có trường metadata nào được thêm (bạn có thể thêm sau khi tạo).
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateOpen(false);
                setDraftFields([]);
              }}
              disabled={isCreating}
              className="h-8 text-xs border-border"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!code.trim() || !name.trim() || isCreating}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isCreating ? 'Đang lưu...' : 'Tạo loại tài liệu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Modal quản lý trường Metadata cho Loại tài liệu đã có sẵn (Rule 05) */}
      <Dialog open={fieldsModalOpen} onOpenChange={setFieldsModalOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <span>Quản lý trường Metadata: {currentSelectedType?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mã loại: <span className="font-mono font-semibold">{currentSelectedType?.code}</span> • Cấu hình các trường bóc tách OCR phục vụ hồ sơ số hóa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Form thêm mới trường vào loại tài liệu hiện tại */}
            <div className="p-3.5 bg-muted/30 rounded-xl border border-border space-y-3">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-primary" /> Thêm trường metadata mới
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Tên trường hiển thị *</Label>
                  <Input
                    placeholder="VD: Số quyết định..."
                    value={manageFieldLabel}
                    onChange={(e) => {
                      const val = e.target.value;
                      setManageFieldLabel(val);
                      if (!manageFieldKey) setManageFieldKey(toFieldKey(val));
                    }}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Mã trường (Key)</Label>
                  <Input
                    placeholder="so_quyet_dinh..."
                    value={manageFieldKey}
                    onChange={(e) => setManageFieldKey(toFieldKey(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Kiểu dữ liệu</Label>
                  <Select
                    value={manageFieldDataType}
                    onValueChange={(val) => setManageFieldDataType(val as MetadataDataType)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Chọn kiểu dữ liệu">
                        {METADATA_DATA_TYPE_MAP[manageFieldDataType]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Văn bản</SelectItem>
                      <SelectItem value="DATE">Ngày tháng</SelectItem>
                      <SelectItem value="NUMBER">Số</SelectItem>
                      <SelectItem value="BOOLEAN">Đúng / Sai</SelectItem>
                      <SelectItem value="SELECT">Danh sách</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={manageFieldRequired}
                    onChange={(e) => setManageFieldRequired(e.target.checked)}
                    className="rounded border-border h-3.5 w-3.5 text-primary"
                  />
                  <span>Bắt buộc nhập</span>
                </label>

                <Button
                  size="sm"
                  onClick={handleAddLiveField}
                  disabled={!manageFieldLabel.trim() || isAddingField}
                  className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>{isAddingField ? 'Đang thêm...' : 'Lưu trường'}</span>
                </Button>
              </div>
            </div>

            {/* Danh sách các trường đang áp dụng */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground">
                Danh sách trường hiện có ({currentSelectedType?.metadataFields?.length || 0})
              </span>

              {currentSelectedType?.metadataFields && currentSelectedType.metadataFields.length > 0 ? (
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {currentSelectedType.metadataFields.map((f: DocumentMetadataField) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{f.label}</span>
                          <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                            {f.dataType}
                          </Badge>
                          {f.isRequired && (
                            <span className="text-[10px] text-rose-600 font-medium">Bắt buộc</span>
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          Key: {f.fieldKey}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLiveField(f.id)}
                        disabled={isDeletingField}
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Xóa trường này"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed rounded-xl text-xs text-muted-foreground">
                  Loại tài liệu này hiện chưa có trường metadata nào. Hãy dùng form phía trên để thêm trường mới!
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFieldsModalOpen(false)}
              className="h-8 text-xs border-border"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
