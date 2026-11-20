"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetMyOnboardingQuery,
  useCompleteOnboardingTaskMutation,
  OnboardingPageHeader,
  WelcomeHeroCard,
  BuddyCard,
  PortalTaskChecklist,
} from "@/features/onboarding";

export default function MyOnboardingPortalPage() {
  const { data: process, isLoading } = useGetMyOnboardingQuery();
  const [completeTask] = useCompleteOnboardingTaskMutation();

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask({
        id: taskId,
        body: { notes: "Nhân viên xác nhận hoàn thành từ Cổng cá nhân" },
      }).unwrap();
      toast.success("Đã ghi nhận bạn hoàn thành công việc!");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể cập nhật công việc"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải cổng thông tin hội nhập cá nhân...
      </div>
    );
  }

  if (!process) {
    return (
      <div className="p-12 text-center space-y-3 max-w-lg mx-auto">
        <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">
          Bạn không có tiến trình hội nhập nào đang diễn ra
        </h3>
        <p className="text-xs text-muted-foreground">
          Bạn đã hoàn tất giai đoạn thử việc hoặc chưa được gán lộ trình tiếp nhận nhân sự mới.
        </p>
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/me">Về Cổng nhân viên</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Hội nhập nhân sự"
        icon={UserCheck}
        breadcrumbs={[
          { label: "Cổng nhân viên", href: "/me" },
          { label: "Hội nhập nhân sự" },
        ]}
      />

      {/* Banner Chào Mừng & Tiến Độ Tổng */}
      <WelcomeHeroCard process={process} />

      {/* Thông tin Mentor & Quản lý */}
      <BuddyCard
        mentorName={process.mentorName}
        directManagerName={process.directManagerName}
      />

      {/* Checklist Công việc */}
      <PortalTaskChecklist
        tasks={process.tasks || []}
        onCompleteTask={handleCompleteTask}
      />
    </div>
  );
}

