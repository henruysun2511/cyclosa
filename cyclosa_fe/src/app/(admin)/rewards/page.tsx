"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RewardFilters,
  RewardStatsCards,
  RewardTable,
  CreateRewardDialog,
  EditRewardDialog,
  useRewardFilters,
  useGetRewardDecisionsQuery,
  useDeleteRewardDecisionMutation,
  type RewardDecision,
} from "@/features/reward";
import { toast } from "sonner";

export default function RewardsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardDecision | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    search,
    debouncedSearch,
    rewardType,
    from,
    to,
    page,
    size,
    setSearch,
    setRewardType,
    setFrom,
    setTo,
    resetFilters,
  } = useRewardFilters();

  const { data, isLoading, isFetching, refetch } = useGetRewardDecisionsQuery({
    page,
    size,
    keyword: debouncedSearch || undefined,
    rewardType: rewardType || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const { data: allRewardsData } = useGetRewardDecisionsQuery({ size: 200 });
  const allRewards = allRewardsData?.data?.items || [];

  const [deleteReward] = useDeleteRewardDecisionMutation();

  const items = data?.data?.items || [];
  const totalElements = data?.data?.pagination?.total;

  const handleEdit = (reward: RewardDecision) => {
    setEditingReward(reward);
    setEditDialogOpen(true);
  };

  const handleDelete = async (reward: RewardDecision) => {
    if (confirm(`Bạn có chắc chắn muốn xóa quyết định khen thưởng "${reward.title}"?`)) {
      try {
        await deleteReward(reward.id).unwrap();
        toast.success("Xóa quyết định khen thưởng thành công");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể xóa quyết định");
      }
    }
  };

  const handleDetail = (id: string) => {
    // Có thể mở dialog hoặc navigate
    const item = items.find((i: RewardDecision) => i.id === id);
    if (item) {
      handleEdit(item);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header Chuẩn mực theo Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Award className="w-6 h-6 text-primary shrink-0" />
            <span>Khen thưởng nhân viên</span>
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
            <span className="text-foreground font-medium">Khen thưởng</span>
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
            <span>Lập quyết định</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ Thống kê KPI 4 cột chuẩn CYCLOSA theo Rule 03 */}
      <RewardStatsCards
        items={allRewards.length > 0 ? allRewards : items}
        totalElements={allRewards.length > 0 ? allRewards.length : totalElements}
        selectedType={rewardType}
        onFilterType={(type) => setRewardType(type || "ALL")}
        isLoading={isLoading}
      />

      {/* 3. Thanh Bộ lọc 2 hàng theo Rule 03 */}
      <RewardFilters
        search={search}
        onSearchChange={setSearch}
        rewardType={rewardType}
        onRewardTypeChange={setRewardType}
        from={from}
        onFromChange={setFrom}
        to={to}
        onToChange={setTo}
        onReset={resetFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn theo Rule 04 */}
      <RewardTable
        items={items}
        isLoading={isLoading}
        page={page}
        size={size}
        onDetail={handleDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 5. Modals / Dialogs */}
      <CreateRewardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditRewardDialog
        reward={editingReward}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
