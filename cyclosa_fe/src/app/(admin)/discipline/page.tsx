"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DisciplineFilters,
  DisciplineStatsCards,
  DisciplineTable,
  CreateDisciplineDialog,
  DecideDisciplineDialog,
  useDisciplineFilters,
  useGetDisciplineCasesQuery,
  useSubmitDismissalMutation,
  type DisciplineCase,
} from "@/features/reward";
import { toast } from "sonner";

export default function DisciplinePage() {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [decidingCase, setDecidingCase] = useState<DisciplineCase | null>(null);
  const [decideDialogOpen, setDecideDialogOpen] = useState(false);

  const {
    search,
    debouncedSearch,
    status,
    disciplineForm,
    page,
    size,
    setSearch,
    setStatus,
    setDisciplineForm,
    resetFilters,
  } = useDisciplineFilters();

  const { data, isLoading, isFetching, refetch } = useGetDisciplineCasesQuery({
    page,
    size,
    keyword: debouncedSearch || undefined,
    status: status || undefined,
    disciplineForm: disciplineForm || undefined,
  });

  const { data: allCasesData } = useGetDisciplineCasesQuery({ size: 200 });

  const [submitDismissal] = useSubmitDismissalMutation();

  const items = data?.data?.items || [];
  const totalElements = data?.data?.pagination?.total;

  const handleDetail = (id: string) => {
    router.push(`/discipline/${id}`);
  };

  const handleDecide = (item: DisciplineCase) => {
    setDecidingCase(item);
    setDecideDialogOpen(true);
  };

  const handleSubmitDismissal = async (item: DisciplineCase) => {
    if (
      confirm(
        `Xác nhận chuyển hồ sơ của nhân viên ${item.employeeName} sang quy trình phê duyệt SA THẢI?`
      )
    ) {
      try {
        await submitDismissal(item.id).unwrap();
        toast.success("Đã trình phê duyệt sa thải lao động qua Workflow");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể trình phê duyệt sa thải");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header Chuẩn mực theo Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <ShieldAlert className="w-6 h-6 text-primary shrink-0" />
            <span>Kỷ luật lao động</span>
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
            <span className="text-foreground font-medium">Kỷ luật lao động</span>
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

          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mở hồ sơ vi phạm</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ Thống kê KPI 4 cột theo Rule 03 */}
      <DisciplineStatsCards
        items={allCasesData?.data?.items || items}
        totalElements={allCasesData?.data?.pagination?.total || totalElements}
        selectedStatus={status}
        onFilterStatus={(st) => setStatus(st || "ALL")}
        isLoading={isLoading}
      />

      {/* 3. Thanh Bộ lọc 2 hàng theo Rule 03 */}
      <DisciplineFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        disciplineForm={disciplineForm}
        onDisciplineFormChange={setDisciplineForm}
        onReset={resetFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn theo Rule 04 */}
      <DisciplineTable
        items={items}
        isLoading={isLoading}
        page={page}
        size={size}
        onDetail={handleDetail}
        onDecide={handleDecide}
        onSubmitDismissal={handleSubmitDismissal}
      />

      {/* 5. Modals / Dialogs */}
      <CreateDisciplineDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <DecideDisciplineDialog
        disciplineCase={decidingCase}
        open={decideDialogOpen}
        onOpenChange={setDecideDialogOpen}
      />
    </div>
  );
}
