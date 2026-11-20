"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  useGetOffboardingRequestsQuery,
  useGetOffboardingStatisticsQuery,
  useDeleteOffboardingRequestMutation,
} from "@/features/offboarding/api/offboarding-api";
import { useOffboardingFilters } from "@/features/offboarding/hooks/use-offboarding-filters";
import { OffboardingStatsCards } from "@/features/offboarding/components/offboarding-stats-cards";
import { OffboardingFilters } from "@/features/offboarding/components/offboarding-filters";
import { OffboardingTable } from "@/features/offboarding/components/offboarding-table";
import { CreateResignationDialog } from "@/features/offboarding/components/dialogs/create-resignation-dialog";
import { CreateTerminationDialog } from "@/features/offboarding/components/dialogs/create-termination-dialog";
import { ApproveResignationDialog } from "@/features/offboarding/components/dialogs/approve-resignation-dialog";
import { RejectResignationDialog } from "@/features/offboarding/components/dialogs/reject-resignation-dialog";
import type { OffboardingRequest } from "@/features/offboarding/types/offboarding.types";

export default function OffboardingPage() {
  const {
    filters,
    isPending,
    setSearch,
    setType,
    setStatus,
    setPage,
    resetFilters,
  } = useOffboardingFilters();

  const { data: statsData, isLoading: isStatsLoading } =
    useGetOffboardingStatisticsQuery();

  const { data: requestsData, isLoading: isTableLoading } =
    useGetOffboardingRequestsQuery({
      search: filters.debouncedSearch || undefined,
      type: filters.type,
      status: filters.status,
      page: filters.page,
      size: filters.size,
    });

  const [deleteRequest] = useDeleteOffboardingRequestMutation();

  // Dialog States
  const [openResignation, setOpenResignation] = useState(false);
  const [openTermination, setOpenTermination] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OffboardingRequest | null>(null);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const handleApprove = (req: OffboardingRequest) => {
    setSelectedRequest(req);
    setOpenApprove(true);
  };

  const handleReject = (req: OffboardingRequest) => {
    setSelectedRequest(req);
    setOpenReject(true);
  };

  const handleDelete = async (req: OffboardingRequest) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa hồ sơ của nhân viên ${req.employeeName}?`)) {
      return;
    }
    try {
      await deleteRequest(req.id).unwrap();
      toast.success("Xóa hồ sơ thôi việc thành công");
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể xóa hồ sơ");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header chuẩn Rule 02: Không bọc icon box, không subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Thôi việc & Bàn giao</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setOpenTermination(true)}
            className="h-9 shadow-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Quyết định chấm dứt HĐLĐ
          </Button>
          <Button
            onClick={() => setOpenResignation(true)}
            className="h-9 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Tiếp nhận đơn thôi việc
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards chuẩn CYCLOSA (Rule 03: 4 cột + Sparkline + Click Filter) */}
      <OffboardingStatsCards
        stats={statsData?.data}
        selectedStatus={filters.status}
        onFilterStatus={(st) => setStatus(st || "ALL")}
        isLoading={isStatsLoading}
      />

      {/* Bộ lọc (Rule 03: 2 hàng) */}
      <OffboardingFilters
        search={filters.search}
        onSearchChange={setSearch}
        type={filters.type}
        onTypeChange={setType}
        status={filters.status}
        onStatusChange={setStatus}
        onReset={resetFilters}
        isPending={isPending}
      />

      {/* Bảng dữ liệu & Embedded Empty State (Rule 04) */}
      <OffboardingTable
        data={requestsData?.data?.items || []}
        isLoading={isTableLoading}
        page={filters.page}
        totalPages={requestsData?.data?.pagination?.pages || 1}
        totalElements={requestsData?.data?.pagination?.total || 0}
        onPageChange={setPage}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <CreateResignationDialog
        open={openResignation}
        onOpenChange={setOpenResignation}
      />

      <CreateTerminationDialog
        open={openTermination}
        onOpenChange={setOpenTermination}
      />

      <ApproveResignationDialog
        request={selectedRequest}
        open={openApprove}
        onOpenChange={setOpenApprove}
      />

      <RejectResignationDialog
        request={selectedRequest}
        open={openReject}
        onOpenChange={setOpenReject}
      />
    </div>
  );
}
