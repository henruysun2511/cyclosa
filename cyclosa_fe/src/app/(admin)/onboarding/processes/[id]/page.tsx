"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  ArrowLeft,
  Plus,
  Award,
  Ban,
  User,
  Building2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetOnboardingProcessByIdQuery,
  useCompleteOnboardingTaskMutation,
  useSkipOnboardingTaskMutation,
  useCreateAdHocTaskMutation,
  useAcceptOnboardingProcessMutation,
  useCancelOnboardingProcessMutation,
  OnboardingPageHeader,
  OnboardingStatusBadge,
  ProcessTaskGroupCard,
  TaskCompleteDialog,
  AdHocTaskDialog,
  ProcessAcceptanceModal,
  type OnboardingTaskDto,
  type AdHocTaskFormValues,
} from "@/features/onboarding";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OnboardingProcessDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const processId = resolvedParams.id;

  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ONBOARDING.MANAGE);

  const { data: process, isLoading } =
    useGetOnboardingProcessByIdQuery(processId);

  const [completeTask] = useCompleteOnboardingTaskMutation();
  const [skipTask] = useSkipOnboardingTaskMutation();
  const [createAdHoc] = useCreateAdHocTaskMutation();
  const [acceptProcess] = useAcceptOnboardingProcessMutation();
  const [cancelProcess] = useCancelOnboardingProcessMutation();

  // State modals
  const [activeTaskForComplete, setActiveTaskForComplete] =
    useState<OnboardingTaskDto | null>(null);
  const [showAdHocModal, setShowAdHocModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const handleCompleteTask = async (
    taskId: string,
    notes?: string,
    documentUrl?: string
  ) => {
    try {
      await completeTask({
        id: taskId,
        body: { notes, documentFileUrl: documentUrl },
      }).unwrap();
      toast.success("Đã hoàn thành công việc!");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể đánh dấu hoàn thành công việc"
      );
    }
  };

  const handleSkipTask = async (task: OnboardingTaskDto) => {
    if (!window.confirm(`Bạn có chắc muốn bỏ qua công việc "${task.title}"?`)) {
      return;
    }
    try {
      await skipTask({ id: task.id }).unwrap();
      toast.info("Đã bỏ qua công việc.");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể bỏ qua công việc"
      );
    }
  };

  const handleCreateAdHoc = async (values: AdHocTaskFormValues) => {
    try {
      await createAdHoc({
        processId,
        body: {
          title: values.title,
          description: values.description,
          taskGroup: values.taskGroup,
          dueDate: values.dueDate,
          isMandatory: values.isMandatory,
          assigneeRole: values.assigneeRole,
          documentRequired: values.documentRequired,
        },
      }).unwrap();
      toast.success("Đã thêm công việc phát sinh vào tiến trình!");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể thêm công việc phát sinh"
      );
    }
  };

  const handleAcceptProcess = async (notes?: string) => {
    try {
      await acceptProcess({ id: processId, body: { notes } }).unwrap();
      toast.success(
        "Nghiệm thu tiến trình hội nhập thành công! Chúc mừng nhân sự mới đã gia nhập chính thức."
      );
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể nghiệm thu tiến trình"
      );
    }
  };

  const handleCancelProcess = async () => {
    const reason = window.prompt("Vui lòng nhập lý do hủy bỏ tiến trình hội nhập:");
    if (!reason || !reason.trim()) return;

    try {
      await cancelProcess({
        id: processId,
        body: { reason: reason.trim() },
      }).unwrap();
      toast.info("Đã hủy bỏ tiến trình hội nhập.");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể hủy tiến trình"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải thông tin tiến trình hội nhập...
      </div>
    );
  }

  if (!process) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">
          Không tìm thấy thông tin tiến trình hội nhập này.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/onboarding/processes">Quay lại bảng điều khiển</Link>
        </Button>
      </div>
    );
  }

  const tasks = process.tasks || [];
  const docsTasks = tasks.filter((t) => t.taskGroup === "DOCS");
  const equipTasks = tasks.filter((t) => t.taskGroup === "EQUIPMENT");
  const accountsTasks = tasks.filter((t) => t.taskGroup === "ACCOUNTS");
  const trainingTasks = tasks.filter((t) => t.taskGroup === "TRAINING");
  const orientationTasks = tasks.filter((t) => t.taskGroup === "ORIENTATION");

  const percent = process.progressPercentage || 0;
  const isCompleted = process.status === "COMPLETED";
  const isCancelled = process.status === "CANCELLED";

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title={process.employeeName || "Chi tiết tiến trình"}
        icon={UserPlus}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Tiến trình hội nhập", href: "/onboarding/processes" },
          { label: process.employeeName || "Chi tiết" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link href="/onboarding/processes">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                <span>Quay lại danh sách</span>
              </Link>
            </Button>

            {canManage && !isCompleted && !isCancelled && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdHocModal(true)}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Việc phát sinh</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowAcceptModal(true)}
                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Nghiệm thu thử việc</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelProcess}
                  className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  <Ban className="h-3.5 w-3.5 mr-1" />
                  <span>Hủy tiến trình</span>
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* ── Summary Card ─────────────────────────────────────────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center border border-border shrink-0">
                {process.employeeName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(-2)
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">
                    {process.employeeName}
                  </h2>
                  <span className="font-mono text-xs text-muted-foreground font-normal">
                    ({process.employeeCode})
                  </span>
                  <OnboardingStatusBadge status={process.status} />
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {process.departmentName || "Toàn công ty"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Mentor: {process.mentorName || "Chưa gán"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Mẫu: {process.templateName || "Mẫu chuẩn"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                  <span>Bắt đầu: {process.startDate}</span>
                  <span>Hạn thử việc: {process.probationEndDate}</span>
                </div>
              </div>
            </div>

            {/* Thanh tiến độ tổng quan */}
            <div className="bg-muted/30 border border-border/60 rounded-xl p-4 min-w-[260px] space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-foreground">
                  Tiến độ hoàn tất
                </span>
                <span className="text-lg font-bold font-mono text-primary">
                  {percent}%
                </span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>
                  {process.completedTasks}/{process.totalTasks} đầu việc đã xong
                </span>
                {process.mandatoryUnfinishedTasks > 0 && (
                  <span className="text-amber-600 font-medium">
                    Còn {process.mandatoryUnfinishedTasks} việc bắt buộc
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 5 Nhóm Công Việc Hội Nhập ─────────────────────────────────── */}
      <div className="space-y-4">
        {/* 1. Hồ sơ & Giấy tờ (DOCS) */}
        <ProcessTaskGroupCard
          taskGroup="DOCS"
          tasks={docsTasks}
          canManage={canManage && !isCompleted && !isCancelled}
          onOpenCompleteModal={(t) => setActiveTaskForComplete(t)}
          onSkipTask={handleSkipTask}
        />

        {/* 2. Trang thiết bị (EQUIPMENT) */}
        <ProcessTaskGroupCard
          taskGroup="EQUIPMENT"
          tasks={equipTasks}
          canManage={canManage && !isCompleted && !isCancelled}
          onOpenCompleteModal={(t) => setActiveTaskForComplete(t)}
          onSkipTask={handleSkipTask}
        />

        {/* 3. Tài khoản CNTT (ACCOUNTS) */}
        <ProcessTaskGroupCard
          taskGroup="ACCOUNTS"
          tasks={accountsTasks}
          canManage={canManage && !isCompleted && !isCancelled}
          onOpenCompleteModal={(t) => setActiveTaskForComplete(t)}
          onSkipTask={handleSkipTask}
        />

        {/* 4. Đào tạo chuyên môn (TRAINING) */}
        <ProcessTaskGroupCard
          taskGroup="TRAINING"
          tasks={trainingTasks}
          canManage={canManage && !isCompleted && !isCancelled}
          onOpenCompleteModal={(t) => setActiveTaskForComplete(t)}
          onSkipTask={handleSkipTask}
        />

        {/* 5. Văn hóa & Định hướng (ORIENTATION) */}
        <ProcessTaskGroupCard
          taskGroup="ORIENTATION"
          tasks={orientationTasks}
          canManage={canManage && !isCompleted && !isCancelled}
          onOpenCompleteModal={(t) => setActiveTaskForComplete(t)}
          onSkipTask={handleSkipTask}
        />
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────── */}
      <TaskCompleteDialog
        task={activeTaskForComplete}
        open={Boolean(activeTaskForComplete)}
        onOpenChange={(open) => !open && setActiveTaskForComplete(null)}
        onConfirm={handleCompleteTask}
      />

      <AdHocTaskDialog
        open={showAdHocModal}
        onOpenChange={setShowAdHocModal}
        onConfirm={handleCreateAdHoc}
      />

      <ProcessAcceptanceModal
        process={process}
        open={showAcceptModal}
        onOpenChange={setShowAcceptModal}
        onConfirm={handleAcceptProcess}
      />
    </div>
  );
}

