"use client";

import React, { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetOrientationSessionsQuery,
  useCreateOrientationSessionMutation,
  useMarkAttendanceMutation,
  useCancelOrientationSessionMutation,
  useOrientationSessionFilters,
  OnboardingPageHeader,
  OrientationSessionTable,
  OrientationSessionDialog,
  BatchAttendanceDialog,
  type OrientationSessionDto,
  type OrientationSessionFormValues,
} from "@/features/onboarding";

export default function OrientationSessionsPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ONBOARDING.MANAGE);

  const { filters } = useOrientationSessionFilters();
  const { data, isLoading } = useGetOrientationSessionsQuery(filters);

  const [createSession] = useCreateOrientationSessionMutation();
  const [markAttendance] = useMarkAttendanceMutation();
  const [cancelSession] = useCancelOrientationSessionMutation();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeSessionForAttendance, setActiveSessionForAttendance] =
    useState<OrientationSessionDto | null>(null);

  const handleCreate = async (values: OrientationSessionFormValues) => {
    try {
      await createSession({
        title: values.title,
        description: values.description,
        trainerName: values.trainerName,
        trainerEmail: values.trainerEmail || undefined,
        location: values.location,
        meetingLink: values.meetingLink || undefined,
        startTime: values.startTime,
        endTime: values.endTime,
        maxAttendees: values.maxAttendees,
        attendeeEmployeeIds: values.attendeeEmployeeIds,
      }).unwrap();
      toast.success("Đã lên lịch lớp đào tạo định hướng thành công!");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể lên lịch lớp đào tạo"
      );
    }
  };

  const handleAttendance = async (
    attendedEmployeeIds: string[],
    notes?: string
  ) => {
    if (!activeSessionForAttendance) return;
    try {
      await markAttendance({
        id: activeSessionForAttendance.id,
        body: { attendedEmployeeIds, notes },
      }).unwrap();
      toast.success("Đã lưu kết quả điểm danh thành công!", {
        description:
          "Công việc Văn hóa & Định hướng của các học viên có mặt đã được tự động hoàn thành.",
      });
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể lưu điểm danh"
      );
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lớp đào tạo định hướng này?")) {
      return;
    }
    try {
      await cancelSession(id).unwrap();
      toast.info("Đã hủy lớp đào tạo định hướng.");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể hủy lớp đào tạo"
      );
    }
  };

  const sessions = data?.items || [];

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Lịch đào tạo định hướng"
        icon={Calendar}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Đào tạo định hướng" },
        ]}
        actions={
          canManage && (
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Tạo buổi đào tạo</span>
            </Button>
          )
        }
      />

      <OrientationSessionTable
        sessions={sessions}
        isLoading={isLoading}
        canManage={canManage}
        onOpenAttendance={(sess) => setActiveSessionForAttendance(sess)}
        onCancelSession={handleCancel}
      />

      <OrientationSessionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onConfirm={handleCreate}
      />

      <BatchAttendanceDialog
        session={activeSessionForAttendance}
        open={Boolean(activeSessionForAttendance)}
        onOpenChange={(open) => !open && setActiveSessionForAttendance(null)}
        onConfirm={handleAttendance}
      />
    </div>
  );
}

