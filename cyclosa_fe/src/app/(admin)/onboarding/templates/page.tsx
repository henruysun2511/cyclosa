"use client";

import React from "react";
import Link from "next/link";
import { Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetOnboardingTemplatesQuery,
  useDeleteOnboardingTemplateMutation,
  useOnboardingTemplateFilters,
  OnboardingPageHeader,
  TemplateFilters,
  TemplateTable,
} from "@/features/onboarding";

export default function OnboardingTemplatesPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ONBOARDING.MANAGE);

  const {
    filters,
    search,
    isActiveParam,
    setSearch,
    setIsActive,
    setPage,
    resetFilters,
  } = useOnboardingTemplateFilters();

  const { data, isLoading } = useGetOnboardingTemplatesQuery(filters);
  const [deleteTemplate] = useDeleteOnboardingTemplateMutation();

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mẫu checklist hội nhập này?")) {
      return;
    }
    try {
      await deleteTemplate(id).unwrap();
      toast.success("Đã xóa mẫu checklist thành công!");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể xóa mẫu checklist"
      );
    }
  };

  const templates = data?.items || [];
  const pagination = data?.pagination || {
    page: 0,
    size: 10,
    total: 0,
    pages: 1,
  };

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Mẫu checklist hội nhập"
        icon={Layers}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Mẫu checklist" },
        ]}
        actions={
          canManage && (
            <Button
              asChild
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Link href="/onboarding/templates/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Tạo mẫu checklist</span>
              </Link>
            </Button>
          )
        }
      />

      <TemplateFilters
        search={search}
        isActiveParam={isActiveParam}
        onSearchChange={setSearch}
        onActiveChange={setIsActive}
        onReset={resetFilters}
      />

      <TemplateTable
        templates={templates}
        isLoading={isLoading}
        page={pagination.page + 1}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        onPageChange={setPage}
        onDelete={handleDelete}
        canManage={canManage}
      />
    </div>
  );
}

