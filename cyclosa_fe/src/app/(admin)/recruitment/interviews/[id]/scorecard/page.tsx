"use client";

import React, { use } from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetInterviewByIdQuery,
  useSubmitScorecardMutation,
  RecruitmentPageHeader,
  BlindGradingScorecard,
  type SubmitScorecardPayload,
} from "@/features/recruitment";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InterviewScorecardPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: interview, isLoading } = useGetInterviewByIdQuery(id);
  const [submitScorecard, { isLoading: isSubmitting }] = useSubmitScorecardMutation();

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải thông tin buổi phỏng vấn & tiêu chí chấm điểm...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">Không tìm thấy buổi phỏng vấn này.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/recruitment/interviews">Quay lại Lịch</Link>
        </Button>
      </div>
    );
  }

  const handleSubmitScorecard = async (payload: SubmitScorecardPayload) => {
    try {
      await submitScorecard(payload).unwrap();
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể lưu phiếu chấm điểm");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <RecruitmentPageHeader
        title="Phiếu chấm điểm phỏng vấn"
        icon={Lock}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Lịch phỏng vấn", href: "/recruitment/interviews" },
          { label: "Phiếu chấm điểm" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/recruitment/interviews">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quay lại Lịch</span>
            </Link>
          </Button>
        }
      />

      <BlindGradingScorecard
        interview={interview}
        currentEmployeeId="emp_current_user"
        onSubmitScorecard={handleSubmitScorecard}
        isLoading={isSubmitting}
      />
    </div>
  );
}
