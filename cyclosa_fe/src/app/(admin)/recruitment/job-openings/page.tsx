"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Briefcase, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetJobOpeningsQuery,
  useCloseJobOpeningMutation,
  useDeleteJobOpeningMutation,
  usePublishJobPostingMutation,
  useJobOpeningFilters,
  RecruitmentPageHeader,
  JobOpeningStatsCards,
  JobOpeningFilters,
  JobOpeningTable,
  JobPostingDialog,
  type JobOpeningDto,
  type PublishJobPostingPayload,
} from "@/features/recruitment";

export default function JobOpeningsPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.RECRUITMENT.OPENING_MANAGE) || can(PERMISSIONS.RECRUITMENT.MANAGE);

  // Filter & Pagination hook sync URL search params
  const {
    search,
    debouncedSearch,
    statusParam,
    status,
    employmentTypeParam,
    employmentType,
    page,
    size,
    setSearch,
    setStatus,
    setEmploymentType,
    setPage,
    resetFilters,
  } = useJobOpeningFilters();

  // RTK Query
  const { data, isLoading, isFetching, refetch } = useGetJobOpeningsQuery({
    keyword: debouncedSearch || undefined,
    status,
    employmentType,
    page,
    size,
  });

  const [closeJobOpening] = useCloseJobOpeningMutation();
  const [deleteJobOpening] = useDeleteJobOpeningMutation();
  const [publishPosting, { isLoading: isPublishing }] = usePublishJobPostingMutation();

  // Local state for modals
  const [postingModalOpening, setPostingModalOpening] = useState<JobOpeningDto | null>(null);

  const openings = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || openings.length;

  // Handlers
  const handleOpenPostingModal = (opening: JobOpeningDto) => {
    setPostingModalOpening(opening);
  };

  const handlePublishPosting = async (payload: PublishJobPostingPayload) => {
    try {
      await publishPosting(payload).unwrap();
      toast.success("Xuất bản tin tuyển dụng lên kênh đối tác thành công!");
      setPostingModalOpening(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể xuất bản tin đăng");
    }
  };

  const handleCloseOpening = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn đóng đợt tuyển dụng cho vị trí này?")) return;
    try {
      await closeJobOpening(id).unwrap();
      toast.success("Đã đóng vị trí tuyển dụng thành công.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể đóng vị trí");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vị trí tuyển dụng này?")) return;
    try {
      await deleteJobOpening(id).unwrap();
      toast.success("Đã xóa vị trí tuyển dụng thành công.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể xóa vị trí tuyển dụng");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <RecruitmentPageHeader
        title="Vị trí tuyển dụng"
        icon={Briefcase}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Vị trí tuyển dụng" },
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

            {canManage && (
              <Button asChild size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/recruitment/job-openings/new">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  <span>Tạo vị trí tuyển dụng</span>
                </Link>
              </Button>
            )}
          </>
        }
      />

      {/* KPI Stats Cards */}
      <JobOpeningStatsCards openings={openings} totalFromPagination={totalItems} />

      {/* Search & Filters */}
      <JobOpeningFilters
        search={search}
        statusParam={statusParam}
        employmentTypeParam={employmentTypeParam}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onEmploymentTypeChange={setEmploymentType}
        onReset={resetFilters}
      />

      {/* Job Opening Table */}
      <JobOpeningTable
        openings={openings}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onOpenPostingModal={handleOpenPostingModal}
        onCloseOpening={handleCloseOpening}
        onDelete={handleDelete}
        canManage={canManage}
      />

      {/* Post to Channel Modal */}
      <JobPostingDialog
        open={!!postingModalOpening}
        onOpenChange={(open) => !open && setPostingModalOpening(null)}
        jobOpening={postingModalOpening}
        onSubmit={handlePublishPosting}
        isLoading={isPublishing}
      />
    </div>
  );
}
