"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreateOnboardingTemplateMutation,
  OnboardingPageHeader,
  TemplateForm,
  type OnboardingTemplateFormValues,
} from "@/features/onboarding";

export default function NewOnboardingTemplatePage() {
  const router = useRouter();
  const [createTemplate, { isLoading }] = useCreateOnboardingTemplateMutation();

  const handleSubmit = async (values: OnboardingTemplateFormValues) => {
    try {
      const res = await createTemplate({
        name: values.name,
        description: values.description || undefined,
        departmentId: values.departmentId || undefined,
        isActive: values.isActive,
        items: values.items?.map((it, idx) => ({
          title: it.title,
          description: it.description || undefined,
          taskGroup: it.taskGroup,
          targetDayOffset: it.targetDayOffset,
          sequenceOrder: idx + 1,
          isMandatory: it.isMandatory,
          defaultAssigneeRole: it.defaultAssigneeRole,
          itAccountTypeId: it.itAccountTypeId,
          documentRequired: it.documentRequired,
        })),
      }).unwrap();

      toast.success("Đã tạo mẫu checklist hội nhập mới thành công!");
      router.push(`/onboarding/templates/${res.id}`);
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể tạo mẫu checklist"
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Tạo mẫu checklist hội nhập"
        icon={Layers}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Mẫu checklist", href: "/onboarding/templates" },
          { label: "Tạo mới" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/onboarding/templates">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quay lại danh sách</span>
            </Link>
          </Button>
        }
      />

      <TemplateForm
        isSubmitting={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/onboarding/templates")}
      />
    </div>
  );
}

