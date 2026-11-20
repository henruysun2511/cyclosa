"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Kanban,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  Search,
  X,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetApplicationsQuery,
  useUpdateApplicationStageMutation,
  useRejectApplicationMutation,
  useTriggerAiScreeningMutation,
  useGetJobOpeningsQuery,
  useApplicationFilters,
  RecruitmentPageHeader,
  AtsKanbanBoard,
  ApplicationTable,
  AiScreeningScorecard,
  type ApplicationDto,
  type ApplicationStage,
} from "@/features/recruitment";
import { ConfirmReasonDialog } from "@/components/shared/confirm-reason-dialog";

export default function AtsPipelinePage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.RECRUITMENT.APPLICATION_MANAGE) || can(PERMISSIONS.RECRUITMENT.MANAGE);

  const {
    search,
    debouncedSearch,
    jobOpeningId,
    stageParam,
    stage,
    viewMode,
    onlyHighAiScore,
    page,
    size,
    setSearch,
    setJobOpeningId,
    setStage,
    setViewMode,
    setOnlyHighAiScore,
    setPage,
    resetFilters,
  } = useApplicationFilters();

  const { data: jobOpeningsData } = useGetJobOpeningsQuery({ size: 100 });
  const jobOpenings = jobOpeningsData?.items || [];

  const { data, isLoading, isFetching, refetch } = useGetApplicationsQuery({
    keyword: debouncedSearch || undefined,
    jobOpeningId: jobOpeningId === "ALL" ? undefined : jobOpeningId,
    stage,
    minAiScore: onlyHighAiScore ? 85 : undefined,
    page,
    size,
  });

  const [updateStage] = useUpdateApplicationStageMutation();
  const [rejectApplication] = useRejectApplicationMutation();
  const [triggerAi, { isLoading: isRetriggering }] = useTriggerAiScreeningMutation();

  const [scorecardApp, setScorecardApp] = useState<ApplicationDto | null>(null);
  const [rejectingApp, setRejectingApp] = useState<ApplicationDto | null>(null);

  const applications = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || applications.length;

  const handleMoveStage = async (id: string, newStage: ApplicationStage) => {
    try {
      await updateStage({ id, body: { stage: newStage } }).unwrap();
      toast.success(`Đã chuyển ứng viên sang giai đoạn: ${newStage}`);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể chuyển giai đoạn ứng tuyển");
    }
  };

  const handleRetriggerAi = async (appId: string) => {
    try {
      await triggerAi(appId).unwrap();
      toast.success("AI đã hoàn thành phân tích và cập nhật lại Match Score!");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể chạy lại đánh giá AI");
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingApp) return;
    try {
      await rejectApplication({
        id: rejectingApp.id,
        body: { reason, sendEmailNotification: true },
      }).unwrap();
      toast.success(`Đã từ chối hồ sơ ứng viên ${rejectingApp.candidateName}.`);
      setRejectingApp(null);
      setScorecardApp(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể từ chối hồ sơ");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <RecruitmentPageHeader
        title="Hồ sơ ứng tuyển"
        icon={Kanban}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Hồ sơ ứng tuyển" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center border border-border rounded-md p-0.5 bg-muted/30">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                  viewMode === "kanban"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Xem dạng Kanban Board"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Bảng</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded text-xs transition-colors flex items-center gap-1 ${
                  viewMode === "table"
                    ? "bg-background text-foreground font-semibold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Xem dạng danh sách"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>

            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link href="/recruitment/interviews">
                <Calendar className="h-3.5 w-3.5 mr-1 text-purple-600" />
                <span>Lịch phỏng vấn</span>
              </Link>
            </Button>

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
          </div>
        }
      />

      {/* Filter Bar with Job Opening Selector & AI High Match Switch */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border rounded-xl p-3 shadow-2xs">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm ứng viên, mã hồ sơ..."
              className="pl-9 pr-8 h-9 text-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Chọn vị trí tuyển dụng */}
          <div className="w-full sm:w-64">
            <Select value={jobOpeningId} onValueChange={(val) => setJobOpeningId(val || "ALL")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Lọc theo vị trí tuyển dụng">
                  {jobOpeningId === "ALL"
                    ? "Tất cả vị trí tuyển dụng"
                    : jobOpenings.find((j) => j.id === jobOpeningId)?.title || "Chọn vị trí"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  Tất cả vị trí tuyển dụng
                </SelectItem>
                {jobOpenings.map((job) => (
                  <SelectItem key={job.id} value={job.id} className="text-xs">
                    {job.title} ({job.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nút lọc AI Match Score > 85% */}
          <button
            type="button"
            onClick={() => setOnlyHighAiScore(!onlyHighAiScore)}
            className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              onlyHighAiScore
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>AI Match Score cao (&gt; 85%)</span>
          </button>
        </div>

        {(search || jobOpeningId !== "ALL" || onlyHighAiScore) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            <span>Đặt lại</span>
          </Button>
        )}
      </div>

      {/* Main View: Kanban vs Table */}
      {viewMode === "kanban" ? (
        <AtsKanbanBoard
          applications={applications}
          onMoveStage={handleMoveStage}
          onOpenScorecard={(app) => setScorecardApp(app)}
        />
      ) : (
        <ApplicationTable
          applications={applications}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
          onOpenScorecard={(app) => setScorecardApp(app)}
          onReject={(app) => setRejectingApp(app)}
          canManage={canManage}
        />
      )}

      {/* AI Scorecard Drawer / Modal */}
      <AiScreeningScorecard
        open={!!scorecardApp}
        onOpenChange={(open) => !open && setScorecardApp(null)}
        application={scorecardApp}
        onRetriggerAi={handleRetriggerAi}
        onMoveToInterview={(app) => {
          handleMoveStage(app.id, "INTERVIEW");
          setScorecardApp(null);
        }}
        onReject={(app) => {
          setScorecardApp(null);
          setRejectingApp(app);
        }}
        isRetriggering={isRetriggering}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmReasonDialog
        open={!!rejectingApp}
        onOpenChange={(open) => !open && setRejectingApp(null)}
        title="Từ chối Hồ sơ Ứng tuyển"
        description={`Xác nhận từ chối hồ sơ ứng viên ${rejectingApp?.candidateName}. Hệ thống sẽ gửi email cảm ơn tự động.`}
        confirmText="Xác nhận từ chối"
        variant="destructive"
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
