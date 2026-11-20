"use client";

import React, { useState } from "react";
import { Sparkles, Plus, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetInternalOpportunitiesQuery,
  useCreateInternalOpportunityMutation,
  useApplyInternalOpportunityMutation,
  RecruitmentPageHeader,
  InternalOppCard,
  InternalOppApplyDialog,
  InternalOppFormDialog,
  type InternalOpportunityDto,
  type CreateInternalOpportunityPayload,
} from "@/features/recruitment";

export default function InternalOpportunitiesPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.RECRUITMENT.OPPORTUNITY_MANAGE) || can(PERMISSIONS.RECRUITMENT.MANAGE);

  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, refetch } = useGetInternalOpportunitiesQuery({
    keyword: search || undefined,
  });

  const [createOpportunity, { isLoading: isCreating }] = useCreateInternalOpportunityMutation();
  const [applyOpportunity, { isLoading: isApplying }] = useApplyInternalOpportunityMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [applyingOpp, setApplyingOpp] = useState<InternalOpportunityDto | null>(null);

  const opportunities = data?.items || [];

  const handleCreateSubmit = async (values: CreateInternalOpportunityPayload) => {
    try {
      await createOpportunity(values).unwrap();
      toast.success("Đăng tin cơ hội nghề nghiệp nội bộ thành công!");
      setIsFormOpen(false);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể đăng cơ hội nội bộ");
    }
  };

  const handleApplySubmit = async (id: string, coverLetter: string) => {
    try {
      await applyOpportunity({ id, body: { coverLetter } }).unwrap();
      toast.success("Nộp đơn ứng tuyển nội bộ thành công! Ban Nhân sự và Quản lý sẽ liên hệ xem xét.");
      setApplyingOpp(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể nộp đơn ứng tuyển");
    }
  };

  const filtered = opportunities.filter((opp) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      opp.jobOpeningTitle?.toLowerCase().includes(term) ||
      opp.departmentName?.toLowerCase().includes(term) ||
      opp.code?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <RecruitmentPageHeader
        title="Cơ hội việc làm nội bộ"
        icon={Sparkles}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Cơ hội nội bộ" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </Button>

            {canManage && (
              <Button
                size="sm"
                onClick={() => setIsFormOpen(true)}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span>Đăng cơ hội mới</span>
              </Button>
            )}
          </>
        }
      />

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo vị trí, phòng ban..."
          className="pl-9 pr-8 h-9 text-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Opportunity Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-56 rounded-2xl border border-border bg-card p-5 space-y-3">
              <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
              <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              <div className="h-16 w-full bg-muted animate-pulse rounded" />
              <div className="h-8 w-28 bg-muted animate-pulse rounded ml-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card space-y-2">
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">
            Hiện tại chưa có cơ hội luân chuyển hoặc dự án nội bộ nào phù hợp với từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((opp) => (
            <InternalOppCard
              key={opp.id}
              opportunity={opp}
              onApply={(item) => setApplyingOpp(item)}
              canManage={canManage}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <InternalOppFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      {/* Apply Modal */}
      <InternalOppApplyDialog
        open={!!applyingOpp}
        onOpenChange={(open) => !open && setApplyingOpp(null)}
        opportunity={applyingOpp}
        onSubmit={handleApplySubmit}
        isLoading={isApplying}
      />
    </div>
  );
}
