"use client";

import React, { useState } from "react";
import { Users, Plus, RefreshCw, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetCandidatesQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useBlacklistCandidateMutation,
  useUnblacklistCandidateMutation,
  useCandidateFilters,
  RecruitmentPageHeader,
  CandidateFilters,
  CandidateTable,
  CandidateFormDialog,
  CandidateBlacklistDialog,
  AiCvParserDropzone,
  type CandidateDto,
  type CandidateFormValues,
  type CvParsedProfileResponse,
} from "@/features/recruitment";

export default function CandidatesPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.RECRUITMENT.CANDIDATE_MANAGE) || can(PERMISSIONS.RECRUITMENT.MANAGE);

  const {
    search,
    debouncedSearch,
    blacklistParam,
    isBlacklisted,
    page,
    size,
    setSearch,
    setIsBlacklisted,
    setPage,
    resetFilters,
  } = useCandidateFilters();

  const { data, isLoading, isFetching, refetch } = useGetCandidatesQuery({
    keyword: debouncedSearch || undefined,
    isBlacklisted,
    page,
    size,
  });

  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const [blacklistCandidate, { isLoading: isBlacklisting }] = useBlacklistCandidateMutation();
  const [unblacklistCandidate] = useUnblacklistCandidateMutation();

  const [showDropzone, setShowDropzone] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<CandidateDto | null>(null);
  const [parsedData, setParsedData] = useState<CvParsedProfileResponse | null>(null);
  const [blacklistingCandidate, setBlacklistingCandidate] = useState<CandidateDto | null>(null);

  const candidates = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || candidates.length;

  const handleOpenCreate = () => {
    setEditingCandidate(null);
    setParsedData(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cand: CandidateDto) => {
    setEditingCandidate(cand);
    setParsedData(null);
    setIsFormOpen(true);
  };

  const handleParsedCvSuccess = (extracted: CvParsedProfileResponse) => {
    setEditingCandidate(null);
    setParsedData(extracted);
    setIsFormOpen(true);
    setShowDropzone(false);
  };

  const handleFormSubmit = async (values: CandidateFormValues) => {
    try {
      if (editingCandidate) {
        await updateCandidate({ id: editingCandidate.id, body: values }).unwrap();
        toast.success("Cập nhật thông tin ứng viên thành công!");
      } else {
        await createCandidate(values).unwrap();
        toast.success("Thêm mới hồ sơ ứng viên thành công!");
      }
      setIsFormOpen(false);
      setEditingCandidate(null);
      setParsedData(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Có lỗi xảy ra khi lưu hồ sơ ứng viên");
    }
  };

  const handleConfirmBlacklist = async (id: string, reason: string) => {
    try {
      await blacklistCandidate({ id, reason }).unwrap();
      toast.success("Đã đưa ứng viên vào danh sách đen (Blacklist).");
      setBlacklistingCandidate(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể đưa ứng viên vào Blacklist");
    }
  };

  const handleUnblacklist = async (id: string) => {
    try {
      await unblacklistCandidate(id).unwrap();
      toast.success("Đã gỡ ứng viên khỏi danh sách đen thành công.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể gỡ Blacklist");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <RecruitmentPageHeader
        title="Hồ sơ ứng viên"
        icon={Users}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Hồ sơ ứng viên" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDropzone(!showDropzone)}
              className="h-8 text-xs text-primary border-primary/20 hover:bg-primary/5"
            >
              <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
              <span>{showDropzone ? "Đóng khu vực tải CV" : "Bóc tách CV bằng AI"}</span>
            </Button>

            {canManage && (
              <Button
                size="sm"
                onClick={handleOpenCreate}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span>Thêm ứng viên thủ công</span>
              </Button>
            )}
          </>
        }
      />

      {/* AI CV Parser Dropzone Area */}
      {showDropzone && (
        <AiCvParserDropzone onParsedSuccess={handleParsedCvSuccess} />
      )}

      {/* Search & Blacklist filter */}
      <CandidateFilters
        search={search}
        blacklistParam={blacklistParam}
        onSearchChange={setSearch}
        onBlacklistChange={setIsBlacklisted}
        onReset={resetFilters}
      />

      {/* Candidate Table */}
      <CandidateTable
        candidates={candidates}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onEdit={handleOpenEdit}
        onBlacklist={(cand) => setBlacklistingCandidate(cand)}
        onUnblacklist={handleUnblacklist}
        canManage={canManage}
      />

      {/* Manual / AI Pre-filled Form Dialog */}
      <CandidateFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingCandidate}
        parsedData={parsedData}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      {/* Blacklist Confirmation Dialog */}
      <CandidateBlacklistDialog
        open={!!blacklistingCandidate}
        onOpenChange={(open) => !open && setBlacklistingCandidate(null)}
        candidate={blacklistingCandidate}
        onConfirm={handleConfirmBlacklist}
        isLoading={isBlacklisting}
      />
    </div>
  );
}
