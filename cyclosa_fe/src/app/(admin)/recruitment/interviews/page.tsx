"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Plus, RefreshCw, Sparkles, Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  useGetInterviewsQuery,
  useScheduleInterviewMutation,
  useCompleteInterviewMutation,
  useCancelInterviewMutation,
  useInterviewFilters,
  RecruitmentPageHeader,
  InterviewTable,
  InterviewScheduleDialog,
  AiStarQuestionsModal,
  type InterviewDto,
  type ScheduleInterviewFormValues,
} from "@/features/recruitment";
import {
  INTERVIEW_STATUS_OPTIONS,
  INTERVIEW_ROUND_TYPE_OPTIONS,
} from "@/features/recruitment/constants/recruitment.constants";

export default function InterviewsPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.RECRUITMENT.INTERVIEW_MANAGE) || can(PERMISSIONS.RECRUITMENT.MANAGE);

  const {
    search,
    debouncedSearch,
    statusParam,
    status,
    roundTypeParam,
    roundType,
    page,
    size,
    setSearch,
    setStatus,
    setRoundType,
    setPage,
    resetFilters,
  } = useInterviewFilters();

  const { data, isLoading, isFetching, refetch } = useGetInterviewsQuery({
    status,
    roundType,
    page,
    size,
  });

  const [scheduleInterview, { isLoading: isScheduling }] = useScheduleInterviewMutation();
  const [completeInterview] = useCompleteInterviewMutation();
  const [cancelInterview] = useCancelInterviewMutation();

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [starModalInterview, setStarModalInterview] = useState<InterviewDto | null>(null);

  const interviews = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || interviews.length;

  const handleScheduleSubmit = async (values: ScheduleInterviewFormValues) => {
    try {
      await scheduleInterview(values).unwrap();
      toast.success("Lên lịch phỏng vấn và gửi thông báo cho hội đồng thành công!");
      setIsScheduleOpen(false);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể lên lịch phỏng vấn");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeInterview(id).unwrap();
      toast.success("Đã hoàn thành buổi phỏng vấn.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể hoàn thành buổi phỏng vấn");
    }
  };

  const handleCancel = async (id: string) => {
    const reason = window.prompt("Nhập lý do hủy buổi phỏng vấn:");
    if (!reason) return;
    try {
      await cancelInterview({ id, reason }).unwrap();
      toast.success("Đã hủy lịch phỏng vấn.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể hủy lịch");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <RecruitmentPageHeader
        title="Lịch phỏng vấn"
        icon={Calendar}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Lịch phỏng vấn" },
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
                onClick={() => setIsScheduleOpen(true)}
                className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span>Lên lịch phỏng vấn mới</span>
              </Button>
            )}
          </>
        }
      />

      {/* Filter Bar with Status & Round Type - 100% Vietnamese */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border rounded-xl p-3 shadow-2xs">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo ứng viên, mã lịch..."
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

          {/* Trạng thái lịch */}
          <div className="w-full sm:w-48">
            <Select value={statusParam} onValueChange={(val) => setStatus(val || "ALL")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn trạng thái">
                  {statusParam === "ALL"
                    ? "Tất cả trạng thái"
                    : INTERVIEW_STATUS_OPTIONS.find((o) => o.value === statusParam)?.label || "Tất cả trạng thái"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem value="SCHEDULED" className="text-xs">
                  Đã lên lịch
                </SelectItem>
                <SelectItem value="COMPLETED" className="text-xs">
                  Đã hoàn thành
                </SelectItem>
                <SelectItem value="CANCELLED" className="text-xs">
                  Đã hủy bỏ
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vòng phỏng vấn */}
          <div className="w-full sm:w-56">
            <Select value={roundTypeParam} onValueChange={(val) => setRoundType(val || "ALL")}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn vòng phỏng vấn">
                  {roundTypeParam === "ALL"
                    ? "Tất cả vòng phỏng vấn"
                    : INTERVIEW_ROUND_TYPE_OPTIONS.find((o) => o.value === roundTypeParam)?.label ||
                      "Tất cả vòng phỏng vấn"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_ROUND_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(search || statusParam !== "ALL" || roundTypeParam !== "ALL") && (
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

      {/* Interview Table */}
      <InterviewTable
        interviews={interviews}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onOpenStarQuestions={(int) => setStarModalInterview(int)}
        onComplete={handleComplete}
        onCancel={handleCancel}
        canManage={canManage}
      />

      {/* Schedule Dialog */}
      <InterviewScheduleDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        onSubmit={handleScheduleSubmit}
        isLoading={isScheduling}
      />

      {/* AI STAR Questions Modal */}
      <AiStarQuestionsModal
        open={!!starModalInterview}
        onOpenChange={(open) => !open && setStarModalInterview(null)}
        roundId={starModalInterview?.roundId || "round_01"}
        jobTitle={starModalInterview?.jobOpeningTitle}
      />
    </div>
  );
}
