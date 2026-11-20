"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Award, Plus, RefreshCw, Send, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetOffersQuery,
  useCreateOfferMutation,
  useSendOfferMutation,
  useAcceptOfferMutation,
  useDeclineOfferMutation,
  useConvertOfferToEmployeeMutation,
  useOfferFilters,
  RecruitmentPageHeader,
  OfferFilters,
  OfferTable,
  OfferFormDialog,
  OfferDeclineDialog,
  type OfferDto,
  type CreateOfferPayload,
} from "@/features/recruitment";

export default function OffersPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.RECRUITMENT.OFFER_MANAGE) || can(PERMISSIONS.RECRUITMENT.MANAGE);

  const {
    search,
    debouncedSearch,
    statusParam,
    status,
    page,
    size,
    setSearch,
    setStatus,
    setPage,
    resetFilters,
  } = useOfferFilters();

  const { data, isLoading, isFetching, refetch } = useGetOffersQuery({
    status,
    page,
    size,
  });

  const [createOffer, { isLoading: isCreating }] = useCreateOfferMutation();
  const [sendOffer] = useSendOfferMutation();
  const [acceptOffer] = useAcceptOfferMutation();
  const [declineOffer, { isLoading: isDeclining }] = useDeclineOfferMutation();
  const [convertOfferToEmployee, { isLoading: isConverting }] = useConvertOfferToEmployeeMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [decliningOffer, setDecliningOffer] = useState<OfferDto | null>(null);

  const offers = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || offers.length;

  const handleCreateSubmit = async (payload: CreateOfferPayload) => {
    try {
      await createOffer(payload).unwrap();
      toast.success("Khởi tạo Thư mời nhận việc (Offer Letter) thành công!");
      setIsFormOpen(false);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể tạo Offer Letter");
    }
  };

  const handleSend = async (id: string) => {
    try {
      await sendOffer(id).unwrap();
      toast.success("Đã gửi Thư mời nhận việc qua email cho ứng viên!");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể gửi Offer Letter");
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await acceptOffer(id).unwrap();
      toast.success(
        "Ứng viên đã chấp thuận thư mời nhận việc thành công! Bạn có thể nhấn 'Tiếp nhận 1-Click' để tạo ngay hồ sơ nhân sự và Onboarding.",
        { duration: 5000 }
      );
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể xác nhận chấp thuận Offer");
    }
  };

  const handleConvert = async (offer: OfferDto) => {
    try {
      const res = await convertOfferToEmployee(offer.id).unwrap();
      toast.success(
        `Tiếp nhận thành công! Đã tạo hồ sơ nhân viên ${res.employeeName} (${res.employeeCode}) và tự động kích hoạt tiến trình Onboarding!`,
        { duration: 6000 }
      );
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể tiếp nhận nhân viên");
    }
  };

  const handleConfirmDecline = async (id: string, reason: string) => {
    try {
      await declineOffer({ id, reason }).unwrap();
      toast.success("Đã ghi nhận ứng viên từ chối Offer.");
      setDecliningOffer(null);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể từ chối Offer");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <RecruitmentPageHeader
        title="Thư mời nhận việc"
        icon={Award}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Thư mời nhận việc" },
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
                <span>Lập Offer mới</span>
              </Button>
            )}
          </>
        }
      />

      {/* Filter Bar with Status select - 100% Vietnamese */}
      <OfferFilters
        search={search}
        statusParam={statusParam}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {/* Table */}
      <OfferTable
        offers={offers}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onSend={handleSend}
        onAccept={handleAccept}
        onConvert={handleConvert}
        isConverting={isConverting}
        onDecline={(offer) => setDecliningOffer(offer)}
        canManage={canManage}
      />

      {/* Form Dialog */}
      <OfferFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
      />

      {/* Decline Confirmation Dialog */}
      <OfferDeclineDialog
        open={!!decliningOffer}
        onOpenChange={(open) => !open && setDecliningOffer(null)}
        offer={decliningOffer}
        onConfirm={handleConfirmDecline}
        isLoading={isDeclining}
      />
    </div>
  );
}
