"use client";

import React, { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AttendancePageHeader,
  CreateRequestDialog,
  useGetMyAttendanceRequestsQuery,
  useCancelAttendanceRequestMutation,
} from "@/features/attendance";
import { MyRequestsTable } from "@/features/attendance/components/requests/my-requests-table";

export default function MyAttendanceRequestsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data: requestsData,
    isLoading,
    refetch,
  } = useGetMyAttendanceRequestsQuery({ page: 0, size: 50 });

  const [cancelRequest, { isLoading: isCancelling }] = useCancelAttendanceRequestMutation();

  const requests = requestsData?.data?.items || [];

  const handleCancel = async (id: string) => {
    try {
      await cancelRequest(id).unwrap();
      toast.success("Đã hủy đơn giải trình thành công");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể hủy đơn");
    }
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Đơn giải trình chấm công"
        breadcrumbs={[
          { label: "Cổng nhân viên", href: "/me" },
          { label: "Bảng công", href: "/me/attendance" },
          { label: "Đơn giải trình" },
        ]}
        icon={FileText}
        actions={
          <Button size="sm" className="h-9 gap-1.5 text-xs bg-primary text-white shadow-xs" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Tạo đơn giải trình
          </Button>
        }
      />

      <MyRequestsTable
        requests={requests}
        isLoading={isLoading}
        onCancelRequest={handleCancel}
        isCancelling={isCancelling}
      />

      <CreateRequestDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

