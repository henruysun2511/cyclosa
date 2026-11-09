"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitFork, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  WorkflowDefinitionForm,
  useGetWorkflowDefinitionByIdQuery,
  useUpdateWorkflowDefinitionMutation,
  type WorkflowDefinitionFormValues,
} from "@/features/workflow";

export default function EditWorkflowDefinitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { data: workflow, isLoading: isFetching } = useGetWorkflowDefinitionByIdQuery(id);
  const [updateWorkflow, { isLoading: isUpdating }] = useUpdateWorkflowDefinitionMutation();

  const handleSubmit = async (values: WorkflowDefinitionFormValues) => {
    try {
      await updateWorkflow({
        id,
        body: {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
          steps: values.steps.map((s, idx) => ({
            stepOrder: idx + 1,
            stepName: s.stepName.trim(),
            approverType: s.approverType,
            approverRoleId: s.approverRoleId || null,
            approverEmployeeId: s.approverEmployeeId || null,
            conditionType: s.conditionType,
            conditionThreshold: s.conditionThreshold ? Number(s.conditionThreshold) : null,
          })),
        },
      }).unwrap();

      toast.success("Cập nhật quy trình phê duyệt thành công!");
      router.push("/settings/workflows");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể cập nhật quy trình phê duyệt.");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        Không tìm thấy thông tin quy trình phê duyệt.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* 1. Header: Title on top, Breadcrumb underneath */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <GitFork className="w-6 h-6 text-primary" />
          Chỉnh sửa Quy trình Phê duyệt
        </h1>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/settings/workflows" className="hover:text-primary transition-colors">
            Quy trình phê duyệt
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Chỉnh sửa</span>
        </nav>
      </div>

      {/* 2. Full Page Step Builder Form */}
      <WorkflowDefinitionForm
        mode="edit"
        initialData={workflow}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}

