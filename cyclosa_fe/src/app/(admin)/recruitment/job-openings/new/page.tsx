"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateJobOpeningMutation,
  useGetRecruitmentRequestByIdQuery,
  RecruitmentPageHeader,
  JobOpeningForm,
  type CreateJobOpeningPayload,
} from "@/features/recruitment";

interface PageProps {
  searchParams: Promise<{ fromRequestId?: string }>;
}

export default function NewJobOpeningPage({ searchParams }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(searchParams);
  const fromRequestId = resolvedParams?.fromRequestId;

  const { data: requestData } = useGetRecruitmentRequestByIdQuery(fromRequestId || "", {
    skip: !fromRequestId,
  });

  const [createJobOpening, { isLoading }] = useCreateJobOpeningMutation();

  const handleSubmit = async (payload: CreateJobOpeningPayload) => {
    try {
      const result = await createJobOpening(payload).unwrap();
      toast.success("Khởi tạo vị trí tuyển dụng thành công!");
      router.push(`/recruitment/job-openings/${result.id}`);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Có lỗi xảy ra khi tạo vị trí tuyển dụng");
    }
  };

  const initialValues: Partial<CreateJobOpeningPayload> = requestData
    ? {
        title: requestData.title,
        departmentId: requestData.departmentId,
        totalNeeded: requestData.headcount,
        employmentType: requestData.employmentType,
        description: requestData.jobDescription || requestData.reason,
        requirements: requestData.requirements,
        minSalary: requestData.minSalary,
        maxSalary: requestData.maxSalary,
        deadline: requestData.targetDate,
      }
    : {};

  return (
    <div className="space-y-6 pb-12">
      <RecruitmentPageHeader
        title="Khởi tạo vị trí tuyển dụng"
        icon={Briefcase}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Vị trí tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Tạo mới" },
        ]}
      />

      <JobOpeningForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
