"use client";

import React, { use } from "react";
import Link from "next/link";
import { User, ArrowLeft, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetApplicationByIdQuery,
  useGetCandidateByIdQuery,
  useUpdateApplicationStageMutation,
  RecruitmentPageHeader,
  CvPreviewComparator,
} from "@/features/recruitment";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;

  const { data: application, isLoading: isLoadingApp } = useGetApplicationByIdQuery(applicationId);
  const candidateId = application?.candidateId || "";
  const { data: candidate, isLoading: isLoadingCandidate } = useGetCandidateByIdQuery(candidateId, {
    skip: !candidateId,
  });

  const [updateStage] = useUpdateApplicationStageMutation();

  const handleApproveForInterview = async () => {
    try {
      await updateStage({ id: applicationId, body: { stage: "INTERVIEW" } }).unwrap();
      toast.success("Đã phê duyệt ứng viên vào Vòng Phỏng Vấn (Round 1)!", {
        description: "Hồ sơ đã được tự động chuyển tiếp sang ATS Pipeline và lịch phỏng vấn.",
      });
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message || "Không thể phê duyệt ứng viên"
      );
    }
  };

  const handleReject = async () => {
    try {
      await updateStage({ id: applicationId, body: { stage: "REJECTED" } }).unwrap();
      toast.info("Đã chuyển hồ sơ sang trạng thái Không phù hợp.");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message || "Không thể từ chối hồ sơ"
      );
    }
  };

  if (isLoadingApp || isLoadingCandidate) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải hồ sơ thẩm định CV ứng viên...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">Không tìm thấy thông tin hồ sơ ứng tuyển này.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/recruitment/applications">Quay lại ATS Pipeline</Link>
        </Button>
      </div>
    );
  }

  const fallbackCandidate = candidate || {
    id: application.candidateId,
    code: "CAN-" + application.code,
    fullName: application.candidateName || "Ứng viên",
    email: application.candidateEmail || "ungvien@cyclosa.vn",
    phone: application.candidatePhone,
    source: application.source || "Nộp trực tiếp",
    yearsOfExperience: 5,
    skills: [],
    isActive: true,
    isBlacklisted: false,
    createdAt: application.appliedDate,
  };

  return (
    <div className="space-y-6 pb-16">
      <RecruitmentPageHeader
        title={`Thẩm định hồ sơ: ${application.candidateName || "Ứng viên"}`}
        icon={Kanban}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Hồ sơ ứng tuyển", href: "/recruitment/applications" },
          { label: application.candidateName || "Chi tiết" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm" className="h-8 text-xs cursor-pointer">
            <Link href="/recruitment/applications">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quay lại danh sách</span>
            </Link>
          </Button>
        }
      />

      <CvPreviewComparator
        candidate={fallbackCandidate}
        application={application}
        onApproveForInterview={handleApproveForInterview}
        onReject={handleReject}
        onSaveTalentPool={() => toast.info("Đã lưu ứng viên vào Ngân hàng Tài năng dài hạn.")}
      />
    </div>
  );
}
