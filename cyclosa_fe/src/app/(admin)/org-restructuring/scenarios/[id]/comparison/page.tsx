"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GitCompare, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgDiffView } from "@/features/org-restructuring/components/org-diff-view";
import {
  useGetScenarioDetailQuery,
  useGetDiffQuery,
} from "@/features/org-restructuring/api/org-restructuring-api";

export default function OrgComparisonPage() {
  const params = useParams();
  const scenarioId = params.id as string;

  const { data: scenario, isLoading: isLoadingScenario } = useGetScenarioDetailQuery(scenarioId);
  const { data: diffData, isLoading: isLoadingDiff } = useGetDiffQuery(scenarioId);

  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumbs chuẩn Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <GitCompare className="w-6 h-6 text-primary shrink-0" />
            <span>So sánh Đối chiếu Tái cơ cấu: {scenario?.name || "Kịch bản"}</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/organization" className="hover:text-primary transition-colors">
              Quản lý tổ chức
            </Link>
            <span>/</span>
            <Link href="/org-restructuring/scenarios" className="hover:text-primary transition-colors">
              Kịch bản tái cơ cấu
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">So sánh đối chiếu Diff</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button variant="outline" size="sm" asChild className="h-9 text-xs">
            <Link href={`/org-restructuring/scenarios/${scenarioId}/workbench`}>
              <SlidersHorizontal className="w-4 h-4 mr-1.5 text-primary" />
              <span>Bàn làm việc Sandbox</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-9 text-xs">
            <Link href="/org-restructuring/scenarios">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Danh sách kịch bản</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Main Comparison Diff View */}
      <OrgDiffView diffData={diffData} isLoading={isLoadingScenario || isLoadingDiff} />
    </div>
  );
}
