"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreateOnboardingProcessMutation,
  OnboardingPageHeader,
  ProcessForm,
  type OnboardingProcessFormValues,
} from "@/features/onboarding";

export default function NewOnboardingProcessPage() {
  const router = useRouter();
  const [createProcess, { isLoading }] = useCreateOnboardingProcessMutation();

  const handleSubmit = async (values: OnboardingProcessFormValues) => {
    try {
      const res = await createProcess({
        employeeId: values.employeeId,
        templateId: values.templateId,
        startDate: values.startDate,
        probationEndDate: values.probationEndDate,
        mentorId: values.mentorId,
        directManagerId: values.directManagerId,
        notes: values.notes,
      }).unwrap();

      toast.success("Đã khởi tạo tiến trình hội nhập thành công!", {
        description:
          "Hệ thống đã tự động sao chép danh mục đầu việc và gửi yêu cầu cấp tài khoản tới IT.",
      });
      router.push(`/onboarding/processes/${res.id}`);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể khởi tạo tiến trình hội nhập"
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Khởi tạo tiến trình hội nhập"
        icon={UserPlus}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Tiến trình hội nhập", href: "/onboarding/processes" },
          { label: "Tạo mới" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/onboarding/processes">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quay lại danh sách</span>
            </Link>
          </Button>
        }
      />

      <ProcessForm
        isSubmitting={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/onboarding/processes")}
      />
    </div>
  );
}

