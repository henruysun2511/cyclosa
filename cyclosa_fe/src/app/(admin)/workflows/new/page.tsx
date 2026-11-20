"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitFork } from "lucide-react";
import { toast } from "sonner";
import {
  WorkflowDefinitionForm,
  useCreateWorkflowDefinitionMutation,
  type WorkflowDefinitionFormValues,
} from "@/features/workflow";

export default function NewWorkflowDefinitionPage() {
  const router = useRouter();
  const [createWorkflow, { isLoading }] = useCreateWorkflowDefinitionMutation();

  const handleSubmit = async (values: WorkflowDefinitionFormValues) => {
    try {
      await createWorkflow({
        companyId: values.companyId,
        requestType: values.requestType,
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
      }).unwrap();

      toast.success("Tạo mới quy trình phê duyệt thành công!");
      router.push("/workflows");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tạo quy trình phê duyệt.");
    }
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Header: Title on top, Breadcrumb underneath */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <GitFork className="w-6 h-6 text-primary" />
          Thiết lập Quy trình Phê duyệt Mới
        </h1>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/workflows" className="hover:text-primary transition-colors">
            Quy trình phê duyệt
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Tạo mới</span>
        </nav>
      </div>

      {/* 2. Full Page Step Builder Form */}
      <WorkflowDefinitionForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

