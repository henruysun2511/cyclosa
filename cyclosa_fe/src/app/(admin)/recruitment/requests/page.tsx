"use client";

import React, { useState } from "react";
import { Plus, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetRecruitmentRequestsQuery,
  useCreateRecruitmentRequestMutation,
  useUpdateRecruitmentRequestMutation,
  useSubmitRecruitmentRequestMutation,
  useApproveRecruitmentRequestMutation,
  useRejectRecruitmentRequestMutation,
  useDeleteRecruitmentRequestMutation,
  useRecruitmentRequestFilters,
  RecruitmentPageHeader,
  RequestStatsCards,
  RequestFilters,
  RequestTable,
  RequestFormDialog,
  RequestDetailDrawer,
  type RecruitmentRequestDto,
  type RecruitmentRequestFormValues,
} from "@/features/recruitment";
import { ConfirmReasonDialog } from "@/components/shared/confirm-reason-dialog";

export default function RecruitmentRequestsPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.RECRUITMENT.REQUEST_MANAGE) || can(PERMISSIONS.RECRUITMENT.MANAGE);
  const canApprove = can(PERMISSIONS.RECRUITMENT.REQUEST_APPROVE) || can(PERMISSIONS.RECRUITMENT.MANAGE);

  // Filter & Pagination hook sync URL search params
  const {
    search,
    debouncedSearch,
    statusParam,
    status,
    departmentId,
    page,
    size,
    setSearch,
    setStatus,
    setDepartmentId,
    setPage,
    resetFilters,
  } = useRecruitmentRequestFilters();

  // RTK Query
  const { data, isLoading, isFetching, refetch } = useGetRecruitmentRequestsQuery({
    keyword: debouncedSearch || undefined,
    status,
    departmentId: departmentId || undefined,
    page,
    size,
  });

  const [createRequest, { isLoading: isCreating }] = useCreateRecruitmentRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRecruitmentRequestMutation();
  const [submitRequest] = useSubmitRecruitmentRequestMutation();
  const [approveRequest] = useApproveRecruitmentRequestMutation();
  const [rejectRequest] = useRejectRecruitmentRequestMutation();
  const [deleteRequest] = useDeleteRecruitmentRequestMutation();

  // Local state for modals & drawers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RecruitmentRequestDto | null>(null);
  const [detailRequest, setDetailRequest] = useState<RecruitmentRequestDto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const requests = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || requests.length;

  // Handlers
  const handleOpenCreate = () => {
    setEditingRequest(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (request: RecruitmentRequestDto) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (request: RecruitmentRequestDto) => {
    setDetailRequest(request);
    setIsDetailOpen(true);
  };

  const handleFormSubmit = async (values: RecruitmentRequestFormValues) => {
    try {
      if (editingRequest) {
        await updateRequest({ id: editingRequest.id, body: values }).unwrap();
        toast.success("Cập nhật đề xuất tuyển dụng thành công!");
      } else {
        await createRequest(values).unwrap();
        toast.success("Tạo đề xuất tuyển dụng thành công!");
      }
      setIsFormOpen(false);
      setEditingRequest(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Có lỗi xảy ra khi lưu đề xuất tuyển dụng");
    }
  };

  const handleSubmitForApproval = async (id: string) => {
    try {
      await submitRequest(id).unwrap();
      toast.success("Đã trình duyệt đề xuất lên cấp có thẩm quyền!");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể trình duyệt đề xuất");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id).unwrap();
      toast.success("Phê duyệt đề xuất tuyển dụng thành công! Vị trí đã sẵn sàng để tạo đợt tuyển.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Có lỗi xảy ra khi phê duyệt đề xuất");
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingId) return;
    try {
      await rejectRequest({ id: rejectingId, reason }).unwrap();
      toast.success("Đã từ chối đề xuất tuyển dụng.");
      setRejectingId(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể từ chối đề xuất");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đề xuất tuyển dụng này?")) return;
    try {
      await deleteRequest(id).unwrap();
      toast.success("Đã xóa đề xuất tuyển dụng thành công.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể xóa đề xuất");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <RecruitmentPageHeader
        title="Đề xuất tuyển dụng"
        icon={FileText}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/requests" },
          { label: "Đề xuất tuyển dụng" },
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
              <Button
                size="sm"
                onClick={handleOpenCreate}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span>Tạo đề xuất mới</span>
              </Button>
            )}
          </>
        }
      />

      {/* KPI Stats Cards with Sparklines */}
      <RequestStatsCards requests={requests} totalFromPagination={totalItems} />

      {/* Search & Filters */}
      <RequestFilters
        search={search}
        statusParam={statusParam}
        departmentId={departmentId}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDepartmentChange={setDepartmentId}
        onReset={resetFilters}
      />

      {/* Request Table */}
      <RequestTable
        requests={requests}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onViewDetail={handleOpenDetail}
        onEdit={handleOpenEdit}
        onSubmit={handleSubmitForApproval}
        onApprove={handleApprove}
        onReject={(id) => setRejectingId(id)}
        onDelete={handleDelete}
        canManage={canManage}
        canApprove={canApprove}
      />

      {/* Create / Edit Dialog */}
      <RequestFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingRequest}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      {/* Detail Drawer */}
      <RequestDetailDrawer
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={detailRequest}
        onSubmit={handleSubmitForApproval}
        onApprove={handleApprove}
        onReject={(id) => {
          setIsDetailOpen(false);
          setRejectingId(id);
        }}
        canApprove={canApprove}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmReasonDialog
        open={!!rejectingId}
        onOpenChange={(open) => !open && setRejectingId(null)}
        title="Từ chối Đề xuất Tuyển dụng"
        description="Vui lòng nhập lý do từ chối để thông báo cho người lập đề xuất điều chỉnh định biên ngân sách."
        confirmText="Xác nhận từ chối"
        variant="destructive"
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
