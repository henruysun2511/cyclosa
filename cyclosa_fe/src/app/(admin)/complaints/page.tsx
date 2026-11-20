"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquareWarning, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ComplaintFilters,
  ComplaintStatsCards,
  ComplaintTable,
  AssignComplaintDialog,
  ResolveComplaintDialog,
  useComplaintFilters,
  useGetComplaintsQuery,
  useStartComplaintInvestigationMutation,
  useCloseComplaintMutation,
  type Complaint,
} from "@/features/reward";
import { toast } from "sonner";

export default function ComplaintsPage() {
  const router = useRouter();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);

  const {
    search,
    debouncedSearch,
    status,
    category,
    page,
    size,
    setSearch,
    setStatus,
    setCategory,
    resetFilters,
  } = useComplaintFilters();

  const { data, isLoading, isFetching, refetch } = useGetComplaintsQuery({
    page,
    size,
    keyword: debouncedSearch || undefined,
    status: status || undefined,
    category: category || undefined,
  });

  const [startInvestigation] = useStartComplaintInvestigationMutation();
  const [closeComplaint] = useCloseComplaintMutation();

  const items = data?.data?.items || [];
  const totalElements = data?.data?.pagination?.total;

  const handleDetail = (id: string) => {
    router.push(`/complaints/${id}`);
  };

  const handleAssign = (item: Complaint) => {
    setSelectedComplaint(item);
    setAssignDialogOpen(true);
  };

  const handleStartInvestigate = async (id: string) => {
    try {
      await startInvestigation(id).unwrap();
      toast.success("Đã chuyển khiếu nại sang trạng thái đang điều tra");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể chuyển trạng thái");
    }
  };

  const handleResolve = (item: Complaint) => {
    setSelectedComplaint(item);
    setResolveDialogOpen(true);
  };

  const handleClose = async (id: string) => {
    if (confirm("Xác nhận đóng hồ sơ khiếu nại này?")) {
      try {
        await closeComplaint(id).unwrap();
        toast.success("Đã đóng hồ sơ khiếu nại");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể đóng hồ sơ");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header Chuẩn mực theo Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <MessageSquareWarning className="w-6 h-6 text-primary shrink-0" />
            <span>Khiếu nại & Phản ánh</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="hover:text-primary transition-colors">
              Khen thưởng & Kỷ luật
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Khiếu nại & Phản ánh</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ Thống kê KPI 4 cột theo Rule 03 */}
      <ComplaintStatsCards
        items={items}
        totalElements={totalElements}
        selectedStatus={status}
        onFilterStatus={(key) => {
          if (!key || key === "ALL") setStatus("ALL");
          else setStatus(key);
        }}
      />

      {/* 3. Thanh Bộ lọc 2 hàng theo Rule 03 */}
      <ComplaintFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        onReset={resetFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn theo Rule 04 */}
      <ComplaintTable
        items={items}
        isLoading={isLoading}
        page={page}
        size={size}
        onDetail={handleDetail}
        onAssign={handleAssign}
        onStartInvestigate={handleStartInvestigate}
        onResolve={handleResolve}
        onClose={handleClose}
      />

      {/* 5. Modals / Dialogs */}
      <AssignComplaintDialog
        complaint={selectedComplaint}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />

      <ResolveComplaintDialog
        complaint={selectedComplaint}
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
      />
    </div>
  );
}
