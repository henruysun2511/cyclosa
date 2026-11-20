"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSignature,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Building2,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyContractsQuery } from "@/features/contract/api/contract-api";
import {
  CONTRACT_TYPE_LABELS,
  CONTRACT_STATUS_LABELS,
} from "@/features/contract/constants/contract.constants";
import { ContractDetailDialog } from "@/features/contract/components/dialogs/contract-detail-dialog";
import { ContractSigningDialog } from "@/features/contract/components/dialogs/contract-signing-dialog";
import { toast } from "sonner";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "---";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function EmployeeContractsPage() {
  const { data: contracts, isLoading, refetch } = useGetMyContractsQuery();
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [signingOpen, setSigningOpen] = useState(false);
  const [signingContract, setSigningContract] = useState<{ id: string; number: string } | null>(null);

  const contractList = contracts || [];
  const activeContract = contractList.find((c) => c.status === "ACTIVE") || contractList[0];

  const handleOpenDetail = (id: string) => {
    setSelectedContractId(id);
    setDetailOpen(true);
  };

  const handleOpenSigning = (id: string, number: string) => {
    setSigningContract({ id, number });
    setSigningOpen(true);
  };

  const handleDownloadPdf = (contractId: string, contractNumber: string) => {
    // In production, opens the preview-pdf endpoint
    window.open(`/api/v1/contracts/${contractId}/preview-pdf`, "_blank");
    toast.info(`Đang mở tải PDF cho hợp đồng ${contractNumber}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <FileSignature className="w-6 h-6 text-primary shrink-0" />
            <span>Hợp đồng & Ký số</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/me" className="hover:text-primary transition-colors">
              Cổng nhân viên
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Hợp đồng & Ký số</span>
          </nav>
        </div>
      </div>

      {/* 2. Thẻ Hợp đồng hiện hành */}
      {isLoading ? (
        <Card className="rounded-xl border shadow-xs bg-card p-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
        </Card>
      ) : activeContract ? (
        <Card className="rounded-xl border shadow-xs bg-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-[11px] ${activeContract.status === "ACTIVE"
                    ? "bg-emerald-600 text-white"
                    : activeContract.status === "IN_SIGNING"
                      ? "bg-amber-600 text-white"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {CONTRACT_STATUS_LABELS[activeContract.status] || activeContract.status}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {activeContract.contractNumber}
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {CONTRACT_TYPE_LABELS[activeContract.contractType] || "Hợp đồng lao động"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Ngày ký kết: {formatDate(activeContract.signingDate)} • Ngày hiệu lực: {formatDate(activeContract.startDate)}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {activeContract.status === "IN_SIGNING" && (
                <Button
                  asChild
                  size="sm"
                  className="h-9 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs shadow-xs"
                >
                  <Link href={`/me/contracts/signing?id=${activeContract.id}`}>
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>Ký điện tử OTP</span>
                  </Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-xl text-xs"
              >
                <Link href={`/me/contracts/signing?id=${activeContract.id}`}>
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span>Xem văn bản</span>
                </Link>
              </Button>
              <Button
                size="sm"
                onClick={() => handleDownloadPdf(activeContract.id, activeContract.contractNumber)}
                className="h-9 gap-1.5 bg-primary text-white rounded-xl text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải PDF ký số</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-muted-foreground">Vị trí chức danh:</span>
              <p className="font-semibold text-foreground mt-0.5">
                {activeContract.jobTitleName || "Cán bộ nhân viên"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Mức lương cơ bản:</span>
              <p className="font-semibold text-foreground mt-0.5">
                {activeContract.baseSalary
                  ? `${activeContract.baseSalary.toLocaleString("vi-VN")} VNĐ / tháng`
                  : "Theo thỏa thuận"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Phòng ban:</span>
              <p className="font-semibold text-foreground mt-0.5">
                {activeContract.departmentName || "---"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Hình thức ký:</span>
              <p className="font-semibold text-foreground mt-0.5">
                {activeContract.signingForm === "ELECTRONIC" ? "Ký số điện tử (OTP)" : "Ký bản giấy"}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="rounded-xl border shadow-xs bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Hiện chưa có hợp đồng lao động nào đang hiệu lực</p>
        </Card>
      )}

      {/* 3. Lịch sử hợp đồng & Phụ lục */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold text-foreground">
            Lịch sử Hợp đồng & Phụ lục pháp lý
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Số văn bản</TableHead>
                  <TableHead className="font-semibold text-xs">Loại tài liệu</TableHead>
                  <TableHead className="font-semibold text-xs">Ngày ký</TableHead>
                  <TableHead className="font-semibold text-xs">Ngày hiệu lực</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : contractList.length > 0 ? (
                  contractList.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-semibold text-xs text-foreground font-mono">
                        {contract.contractNumber}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {CONTRACT_TYPE_LABELS[contract.contractType] || contract.contractType}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(contract.signingDate)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(contract.startDate)}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge
                          variant={
                            contract.status === "ACTIVE"
                              ? "default"
                              : contract.status === "IN_SIGNING"
                                ? "outline"
                                : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {CONTRACT_STATUS_LABELS[contract.status] || contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        <div className="flex items-center justify-end gap-1">
                          {contract.status === "IN_SIGNING" && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-amber-600 hover:text-amber-700"
                            >
                              <Link href={`/me/contracts/signing?id=${contract.id}`}>
                                Ký số
                              </Link>
                            </Button>
                          )}
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-primary"
                          >
                            <Link href={`/me/contracts/signing?id=${contract.id}`}>
                              Chi tiết
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPdf(contract.id, contract.contractNumber)}
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Tải về
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <FileSignature className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Chưa có hợp đồng lao động nào được ghi nhận</p>
                        <p className="text-xs text-muted-foreground">Hồ sơ hợp đồng điện tử của bạn sẽ hiển thị tại đây khi nhân sự phát hành</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Chi tiết hợp đồng */}
      {selectedContractId && (
        <ContractDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          contractId={selectedContractId}
          onSuccess={refetch}
        />
      )}

      {/* Dialog Ký số hợp đồng OTP */}
      {signingContract && (
        <ContractSigningDialog
          open={signingOpen}
          onOpenChange={setSigningOpen}
          contractId={signingContract.id}
          contractNumber={signingContract.number}
          isSelfSigning={true}
          onSuccess={() => {
            setSigningOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
