"use client";

import { use, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetPayrollPeriodByIdQuery,
  useGetPayrollPeriodSummaryQuery,
  useGetPayrollRecordsByPeriodQuery,
} from "@/features/payroll/api/payroll-api";
import { PeriodDetailHeader } from "@/features/payroll/components/period-detail/period-detail-header";
import { PeriodSummaryCards } from "@/features/payroll/components/period-detail/period-summary-cards";
import { PeriodAnomalyAlert } from "@/features/payroll/components/period-detail/period-anomaly-alert";
import { PayrollMatrixTable } from "@/features/payroll/components/period-detail/payroll-matrix-table";
import { PaymentList } from "@/features/payroll/components/payments/payment-list";
import { PayslipList } from "@/features/payroll/components/payslips/payslip-list";
import { PayrollRecordDrawer } from "@/features/payroll/components/record-detail/payroll-record-drawer";
import { ManualAdjustmentDialog } from "@/features/payroll/components/record-detail/manual-adjustment-dialog";
import { PeriodPrecheckDialog } from "@/features/payroll/components/periods/period-precheck-dialog";
import type { PayrollRecordDto } from "@/features/payroll/types/payroll.types";
import { RefreshCw, AlertCircle, TableProperties, CreditCard, FileText } from "lucide-react";

export default function PeriodDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const periodId = resolvedParams.id;

  const { data: periodData, isLoading: isPeriodLoading, isError: isPeriodError, refetch: refetchPeriod } =
    useGetPayrollPeriodByIdQuery(periodId);
  const { data: summaryData, refetch: refetchSummary } =
    useGetPayrollPeriodSummaryQuery(periodId);
  const { data: recordsData, isLoading: isRecordsLoading, isError: isRecordsError, refetch: refetchRecords } =
    useGetPayrollRecordsByPeriodQuery(periodId);

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [adjustRecord, setAdjustRecord] = useState<PayrollRecordDto | null>(null);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);

  const [precheckOpen, setPrecheckOpen] = useState(false);

  const period = periodData?.data;
  const summary = summaryData?.data;
  const records = recordsData?.data || [];

  const handleViewTrace = (recordId: string) => {
    setSelectedRecordId(recordId);
    setDrawerOpen(true);
  };

  const handleManualAdjust = (record: PayrollRecordDto) => {
    setAdjustRecord(record);
    setAdjustDialogOpen(true);
  };

  const handleRecalculated = () => {
    refetchPeriod();
    refetchSummary();
    refetchRecords();
  };

  if (isPeriodLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isPeriodError || !period) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-base font-semibold">Không tìm thấy thông tin kỳ lương</p>
      </div>
    );
  }

  const isPeriodLocked = period.status === "LOCKED" || period.status === "APPROVED";

  return (
    <div className="space-y-6">
      {/* Header Điều hành */}
      <PeriodDetailHeader
        period={period}
        onRecalculateClick={() => setPrecheckOpen(true)}
        refetch={handleRecalculated}
      />

      {/* 4 Thẻ KPI Chỉ số theo Rule 03 */}
      <PeriodSummaryCards summary={summary} />

      {/* Alert Cảnh báo Bất thường (Lương âm, Thuế âm, Lệch > 30%) */}
      <PeriodAnomalyAlert
        anomalies={summary?.anomalies}
        onViewRecord={handleViewTrace}
      />

      {/* Phân hệ Tabs chức năng */}
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="matrix" className="gap-2">
            <TableProperties className="h-4 w-4" />
            Ma trận bảng lương ({records.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Chi trả ngân hàng
          </TabsTrigger>
          <TabsTrigger value="payslips" className="gap-2">
            <FileText className="h-4 w-4" />
            Phiếu lương nhân viên
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          <PayrollMatrixTable
            records={records}
            isLoading={isRecordsLoading}
            isError={isRecordsError}
            onViewTrace={handleViewTrace}
            onManualAdjust={handleManualAdjust}
            isPeriodLocked={isPeriodLocked}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentList periodId={periodId} />
        </TabsContent>

        <TabsContent value="payslips" className="space-y-4">
          <PayslipList periodId={periodId} />
        </TabsContent>
      </Tabs>

      {/* Drawer Truy vết Công thức */}
      <PayrollRecordDrawer
        recordId={selectedRecordId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Modal Điều chỉnh thủ công */}
      <ManualAdjustmentDialog
        record={adjustRecord}
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        onSuccess={handleRecalculated}
      />

      {/* Modal Kiểm tra & Tính lương */}
      <PeriodPrecheckDialog
        periodId={periodId}
        open={precheckOpen}
        onOpenChange={setPrecheckOpen}
        onCalculated={handleRecalculated}
      />
    </div>
  );
}

