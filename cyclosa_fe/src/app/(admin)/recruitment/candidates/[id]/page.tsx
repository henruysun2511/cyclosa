"use client";

import React, { use } from "react";
import Link from "next/link";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetCandidateByIdQuery,
  RecruitmentPageHeader,
  CvPreviewComparator,
} from "@/features/recruitment";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CandidateDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: candidate, isLoading } = useGetCandidateByIdQuery(id);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải hồ sơ ứng viên...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">Không tìm thấy thông tin ứng viên này.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/recruitment/candidates">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <RecruitmentPageHeader
        title={candidate.fullName}
        icon={User}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Hồ sơ ứng viên", href: "/recruitment/candidates" },
          { label: candidate.fullName },
        ]}
        actions={
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/recruitment/candidates">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quay lại danh sách</span>
            </Link>
          </Button>
        }
      />

      <CvPreviewComparator
        candidate={candidate}
        onSaveTalentPool={() => toast.info("Đã lưu ứng viên vào Ngân hàng Tài năng dài hạn.")}
      />
    </div>
  );
}

