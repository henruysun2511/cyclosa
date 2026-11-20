"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, RotateCcw, Briefcase, Layers, Pencil, Trash2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { toast } from "sonner";
import {
  useGetAllJobTitlesQuery,
  useDeleteJobTitleMutation,
  useGetAllJobLevelsQuery,
  useDeleteJobLevelMutation,
} from "../../api/organization-api";
import { JobTitleFormDialog } from "../dialogs/job-title-form-dialog";
import { JobLevelFormDialog } from "../dialogs/job-level-form-dialog";
import type { JobTitle } from "../../types/job-title.types";
import type { JobLevel } from "../../types/job-level.types";

interface JobMatrixCatalogTabProps {
  companyId: string;
}

export function JobMatrixCatalogTab({ companyId }: JobMatrixCatalogTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // Job Title Dialog State
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<JobTitle | null>(null);

  // Job Level Dialog State
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<JobLevel | null>(null);

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "title" | "level";
    id: string;
    name: string;
    isLoading: boolean;
  }>({
    open: false,
    type: "title",
    id: "",
    name: "",
    isLoading: false,
  });

  const {
    data: jobTitles = [],
    isLoading: isTitlesLoading,
    refetch: refetchTitles,
  } = useGetAllJobTitlesQuery(companyId, { skip: !companyId });

  const {
    data: jobLevels = [],
    isLoading: isLevelsLoading,
    refetch: refetchLevels,
  } = useGetAllJobLevelsQuery(companyId, { skip: !companyId });

  const [deleteJobTitle] = useDeleteJobTitleMutation();
  const [deleteJobLevel] = useDeleteJobLevelMutation();

  const filteredTitles = useMemo(() => {
    return jobTitles.filter((t) => {
      return (
        debouncedSearch.trim() === "" ||
        t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.code.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    });
  }, [jobTitles, debouncedSearch]);

  const filteredLevels = useMemo(() => {
    return jobLevels.filter((l) => {
      return (
        debouncedSearch.trim() === "" ||
        l.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        l.code.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    });
  }, [jobLevels, debouncedSearch]);

  const handleCreateTitle = () => {
    setSelectedTitle(null);
    setIsTitleOpen(true);
  };

  const handleEditTitle = (title: JobTitle) => {
    setSelectedTitle(title);
    setIsTitleOpen(true);
  };

  const handleCreateLevel = () => {
    setSelectedLevel(null);
    setIsLevelOpen(true);
  };

  const handleEditLevel = (level: JobLevel) => {
    setSelectedLevel(level);
    setIsLevelOpen(true);
  };

  const handleDelete = (type: "title" | "level", id: string, name: string) => {
    setDeleteConfirm({
      open: true,
      type,
      id,
      name,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
      if (deleteConfirm.type === "title") {
        await deleteJobTitle(deleteConfirm.id).unwrap();
        refetchTitles();
        toast.success("Xóa chức danh thành công!");
      } else {
        await deleteJobLevel(deleteConfirm.id).unwrap();
        refetchLevels();
        toast.success("Xóa cấp bậc thành công!");
      }
      setDeleteConfirm((prev) => ({ ...prev, open: false, isLoading: false }));
    } catch {
      toast.error("Không thể xóa bản ghi này! Vui lòng kiểm tra ràng buộc nhân sự và hợp đồng.");
      setDeleteConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Filter Bar 2 hàng (Rule 03) ───────────────────────────── */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
        {/* Hàng 1: Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm chức danh hoặc cấp bậc thẩm quyền theo mã, tên..."
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>

        {/* Hàng 2: Mô tả & Nút Thao tác & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Ma trận gồm {jobTitles.length} chức danh chuyên môn và {jobLevels.length} cấp bậc thẩm quyền
            </span>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Đặt lại
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateTitle}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm chức danh</span>
            </Button>
            <Button
              size="sm"
              onClick={handleCreateLevel}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm cấp bậc</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Bố cục 2 Cột Đối xứng (Grid 2 cols) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột 1: Chức danh chuyên môn (Job Titles) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              Chức danh chuyên môn ({filteredTitles.length})
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                  <TableHead className="w-32 text-xs font-semibold">Mã chức danh</TableHead>
                  <TableHead className="text-xs font-semibold">Tên chức danh chuyên môn</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTitlesLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-center">
                        <div className="h-4 w-6 bg-muted animate-pulse rounded mx-auto" />
                      </TableCell>
                      <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell className="text-center">
                        <div className="h-6 w-12 bg-muted animate-pulse rounded mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredTitles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <EmptyState
                        icon={Briefcase}
                        title="Chưa có chức danh nào"
                        description={
                          searchTerm
                            ? "Không tìm thấy chức danh phù hợp."
                            : "Chưa có danh mục chức danh nào được tạo."
                        }
                        action={
                          <Button size="sm" onClick={handleCreateTitle} className="h-8 gap-1.5 text-xs">
                            <Plus className="h-3.5 w-3.5" />
                            <span>Thêm chức danh</span>
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTitles.map((t, idx) => (
                    <TableRow key={t.id} className="hover:bg-muted/25 transition-colors">
                      <TableCell className="text-center text-slate-500 text-xs font-normal">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {t.code}
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">
                        {t.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-foreground cursor-pointer"
                            onClick={() => handleEditTitle(t)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-destructive cursor-pointer"
                            onClick={() => handleDelete("title", t.id, t.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Cột 2: Thang Cấp bậc thẩm quyền (Job Levels) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Thang Cấp bậc thẩm quyền ({filteredLevels.length})
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-16 text-center text-xs font-semibold">Cấp bậc</TableHead>
                  <TableHead className="w-28 text-xs font-semibold">Mã cấp</TableHead>
                  <TableHead className="text-xs font-semibold">Tên cấp bậc thẩm quyền</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLevelsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-center">
                        <div className="h-4 w-8 bg-muted animate-pulse rounded mx-auto" />
                      </TableCell>
                      <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell className="text-center">
                        <div className="h-6 w-12 bg-muted animate-pulse rounded mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredLevels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <EmptyState
                        icon={Layers}
                        title="Chưa có cấp bậc nào"
                        description={
                          searchTerm
                            ? "Không tìm thấy cấp bậc phù hợp."
                            : "Chưa có thang cấp bậc thẩm quyền nào được thiết lập."
                        }
                        action={
                          <Button size="sm" onClick={handleCreateLevel} className="h-8 gap-1.5 text-xs">
                            <Plus className="h-3.5 w-3.5" />
                            <span>Thêm cấp bậc</span>
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLevels.map((l) => (
                    <TableRow key={l.id} className="hover:bg-muted/25 transition-colors">
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-2xs px-2 font-semibold">
                          Level {l.rankOrder}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {l.code}
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">
                        {l.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-foreground cursor-pointer"
                            onClick={() => handleEditLevel(l)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-destructive cursor-pointer"
                            onClick={() => handleDelete("level", l.id, l.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────── */}
      <JobTitleFormDialog
        open={isTitleOpen}
        onOpenChange={setIsTitleOpen}
        jobTitle={selectedTitle}
        companyId={companyId}
        onSuccess={refetchTitles}
      />

      <JobLevelFormDialog
        open={isLevelOpen}
        onOpenChange={setIsLevelOpen}
        jobLevel={selectedLevel}
        companyId={companyId}
        onSuccess={refetchLevels}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title={`Xác nhận xóa ${deleteConfirm.type === "title" ? "chức danh" : "cấp bậc"}`}
        description={`Bạn có chắc chắn muốn xóa "${deleteConfirm.name}"? Dữ liệu nhân viên đang giữ chức vụ/cấp bậc này có thể bị ảnh hưởng.`}
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy"
        variant="destructive"
        isLoading={deleteConfirm.isLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
