"use client";

import React, { useState } from "react";
import { KeyRound, Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetItAccountRequestsQuery,
  useProvisionItAccountMutation,
  useFailItAccountMutation,
  useItRequestFilters,
  OnboardingPageHeader,
  ItRequestTable,
  ItProvisionDialog,
  IT_REQUEST_STATUS_OPTIONS,
  type ItAccountRequestDto,
  type ProvisionItAccountFormValues,
} from "@/features/onboarding";

export default function ItRequestsPage() {
  const { can } = usePermission();
  const canHandleIt =
    can(PERMISSIONS.ONBOARDING.IT_HANDLE) || can(PERMISSIONS.ONBOARDING.MANAGE);

  const {
    filters,
    search,
    status,
    setSearch,
    setStatus,
    setPage,
  } = useItRequestFilters();

  const { data, isLoading } = useGetItAccountRequestsQuery(filters);
  const [provisionIt] = useProvisionItAccountMutation();
  const [failIt] = useFailItAccountMutation();

  const [activeRequest, setActiveRequest] =
    useState<ItAccountRequestDto | null>(null);

  const handleConfirmProvision = async (
    values: ProvisionItAccountFormValues
  ) => {
    if (!activeRequest) return;
    try {
      await provisionIt({
        id: activeRequest.id,
        body: values,
      }).unwrap();
      toast.success(
        `Đã cấp phát tài khoản ${activeRequest.itAccountTypeName} thành công cho ${activeRequest.employeeName}!`
      );
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể hoàn tất cấp phát tài khoản"
      );
    }
  };

  const handleFailProvision = async (reason: string) => {
    if (!activeRequest) return;
    try {
      await failIt({
        id: activeRequest.id,
        body: { failureReason: reason },
      }).unwrap();
      toast.info("Đã đánh dấu yêu cầu cấp tài khoản thất bại.");
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          "Không thể cập nhật trạng thái thất bại"
      );
    }
  };

  const requests = data?.items || [];
  const pagination = data?.pagination || {
    page: 0,
    size: 10,
    total: 0,
    pages: 1,
  };

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Hàng đợi cấp tài khoản CNTT"
        icon={KeyRound}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Cấp tài khoản CNTT" },
        ]}
      />

      {/* Bộ lọc hàng đợi */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên nhân viên, mã NV..."
            className="pl-9 text-sm h-9 bg-background"
          />
        </div>

        {/* Row 2: Selects + Reset */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <KeyRound className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
            <Select value={status} onValueChange={(val) => setStatus(val || "ALL")}>
              <SelectTrigger className="w-full h-8 text-xs bg-background">
                <SelectValue placeholder="Trạng thái yêu cầu" />
              </SelectTrigger>
              <SelectContent>
                {IT_REQUEST_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatus("ALL");
            }}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </Button>
        </div>
      </div>

      <ItRequestTable
        requests={requests}
        isLoading={isLoading}
        page={pagination.page + 1}
        totalPages={pagination.pages}
        totalItems={pagination.total}
        onPageChange={setPage}
        canHandleIt={canHandleIt}
        onOpenProvision={(req) => setActiveRequest(req)}
      />

      <ItProvisionDialog
        request={activeRequest}
        open={Boolean(activeRequest)}
        onOpenChange={(open) => !open && setActiveRequest(null)}
        onConfirm={handleConfirmProvision}
        onFail={handleFailProvision}
      />
    </div>
  );
}

