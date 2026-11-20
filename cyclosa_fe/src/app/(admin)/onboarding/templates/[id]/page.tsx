"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetOnboardingTemplateByIdQuery,
  useUpdateOnboardingTemplateMutation,
  OnboardingPageHeader,
  TemplateForm,
  type OnboardingTemplateFormValues,
} from "@/features/onboarding";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditOnboardingTemplatePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const { data: template, isLoading: isFetching } =
    useGetOnboardingTemplateByIdQuery(id);
  const [updateTemplate, { isLoading: isUpdating }] =
    useUpdateOnboardingTemplateMutation();

  const handleSubmit = async (values: OnboardingTemplateFormValues) => {
    try {
      await updateTemplate({
        id,
        body: {
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
        },
      }).unwrap();

      toast.success("Đã cập nhật mẫu checklist hội nhập thành công!");
      router.push("/onboarding/templates");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể cập nhật mẫu checklist"
      );
    }
  };

  if (isFetching) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải thông tin mẫu checklist...
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">
          Không tìm thấy mẫu checklist hội nhập này.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/onboarding/templates">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title={template.name || "Chỉnh sửa mẫu checklist"}
        icon={Layers}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Mẫu checklist", href: "/onboarding/templates" },
          { label: template.name },
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
        initialData={template}
        isSubmitting={isUpdating}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/onboarding/templates")}
      />
    </div>
  );
}

