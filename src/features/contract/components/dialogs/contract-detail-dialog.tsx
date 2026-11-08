import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useGetContractByIdQuery,
  useGetContractAppendicesQuery,
  useGetContractVersionsQuery,
  useSubmitContractApprovalMutation,
  useApproveContractMutation,
  useRejectContractMutation,
  useSendContractSigningMutation,
  useActivateContractMutation,
  useDeleteContractMutation,
} from "../../api/contract-api";
import { ContractStatusBadge, ContractTypeBadge } from "../contract-status-badge";
import {
  CONTRACT_TYPE_LABELS,
  SIGNING_FORM_LABELS,
} from "../../constants/contract.constants";
import { ContractAppendixDialog } from "./contract-appendix-dialog";
import { ContractSigningDialog } from "./contract-signing-dialog";
import { ContractTerminateDialog } from "./contract-terminate-dialog";
import { toast } from "sonner";
import {
  FileText,
  DollarSign,
  FileSignature,
  History,
  Send,
  CheckCircle2,
  XCircle,
  Zap,
  Trash2,
  FileX,
  Plus,
  Printer,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import type { ContractAppendixSummary } from "../../types/contract.types";

interface ContractDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  onSuccess?: () => void;
}

export function ContractDetailDialog({
  open,
  onOpenChange,
  contractId,
  onSuccess,
}: ContractDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("terms");

  // Sub-dialogs
  const [appendixOpen, setAppendixOpen] = useState(false);
  const [selectedAppendix, setSelectedAppendix] = useState<ContractAppendixSummary | null>(null);
  const [signingOpen, setSigningOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);

  // Queries
  const { data: contract, refetch, isLoading } = useGetContractByIdQuery(contractId, {
    skip: !open || !contractId,
  });

  const { data: appendices = [], refetch: refetchAppendices } = useGetContractAppendicesQuery(
    contractId,
    { skip: !open || !contractId }
  );

  const { data: versions = [] } = useGetContractVersionsQuery(contractId, {
    skip: !open || !contractId,
  });

  // Mutations
  const [submitApproval, { isLoading: isSubmitting }] = useSubmitContractApprovalMutation();
  const [approveContract, { isLoading: isApproving }] = useApproveContractMutation();
  const [rejectContract, { isLoading: isRejecting }] = useRejectContractMutation();
  const [sendSigning, { isLoading: isSendingSigning }] = useSendContractSigningMutation();
  const [activateContract, { isLoading: isActivating }] = useActivateContractMutation();
  const [deleteContract, { isLoading: isDeleting }] = useDeleteContractMutation();

  const handleAction = async (action: string) => {
    try {
      if (action === "submit") {
        await submitApproval(contractId).unwrap();
        toast.success("Đã gửi hợp đồng để phê duyệt");
      } else if (action === "approve") {
        await approveContract(contractId).unwrap();
        toast.success("Đã phê duyệt hợp đồng lao động");
      } else if (action === "reject") {
        const r = window.prompt("Nhập lý do từ chối hợp đồng:");
        if (!r) return;
        await rejectContract({ id: contractId, body: { reason: r } }).unwrap();
        toast.warning("Đã từ chối phê duyệt hợp đồng");
      } else if (action === "send-signing") {
        await sendSigning(contractId).unwrap();
        toast.success("Đã phát lệnh ký số E-Contract tới các bên");
      } else if (action === "activate") {
        await activateContract(contractId).unwrap();
        toast.success("Kích hoạt hợp đồng thành công (Đang hiệu lực)");
      } else if (action === "delete") {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bản nháp hợp đồng này?")) return;
        await deleteContract(contractId).unwrap();
        toast.success("Đã xóa bản nháp hợp đồng");
        onOpenChange(false);
      }
      refetch();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Thao tác thất bại");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!contract) return null;

  const status = contract.status;
  const isDraft = status === "DRAFT";
  const isPendingApproval = status === "PENDING_APPROVAL";
  const isApproved = status === "APPROVED";
  const isInSigning = status === "IN_SIGNING";
  const isActive = status === "ACTIVE";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  Hợp đồng: {contract.contractNumber}
                </DialogTitle>
                <DialogDescription>
                  Nhân viên: <strong>{contract.employeeName}</strong> ({contract.employeeCode})
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <ContractTypeBadge type={contract.contractType} />
                <ContractStatusBadge status={contract.status} />
              </div>
            </div>
          </DialogHeader>

          {/* Workflow Action Bar */}
          <div className="bg-muted/40 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {isDraft && (
                <>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleAction("submit")}
                    disabled={isSubmitting}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Trình phê duyệt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-rose-600"
                    onClick={() => handleAction("delete")}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa nháp
                  </Button>
                </>
              )}

              {isPendingApproval && (
                <>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleAction("approve")}
                    disabled={isApproving}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Phê duyệt hợp đồng
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-rose-600"
                    onClick={() => handleAction("reject")}
                    disabled={isRejecting}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Từ chối
                  </Button>
                </>
              )}

              {isApproved && (
                <Button
                  size="sm"
                  className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleAction("send-signing")}
                  disabled={isSendingSigning}
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Phát lệnh Ký điện tử
                </Button>
              )}

              {isInSigning && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs text-purple-600 border-purple-300"
                    onClick={() => setSigningOpen(true)}
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    Xem tiến độ ký & OTP
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleAction("activate")}
                    disabled={isActivating}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Kích hoạt hiệu lực
                  </Button>
                </>
              )}

              {isActive && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => {
                      setSelectedAppendix(null);
                      setAppendixOpen(true);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Tạo Phụ lục HĐ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs text-rose-600 border-rose-200"
                    onClick={() => setTerminateOpen(true)}
                  >
                    <FileX className="w-3.5 h-3.5" />
                    Chấm dứt / Thanh lý
                  </Button>
                </>
              )}
            </div>

            <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" />
              In hợp đồng
            </Button>
          </div>

          {/* 4 Tabs Chi tiết */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="terms" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" />
                Điều khoản & Lương
              </TabsTrigger>
              <TabsTrigger value="appendices" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" />
                Phụ lục ({appendices.length})
              </TabsTrigger>
              <TabsTrigger value="signers" className="gap-1.5 text-xs">
                <FileSignature className="w-3.5 h-3.5" />
                Tiến độ Ký ({contract.signers?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5 text-xs">
                <History className="w-3.5 h-3.5" />
                Nhật ký & Bản in
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Điều khoản & Lương */}
            <TabsContent value="terms" className="space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <span className="text-muted-foreground">Loại hợp đồng</span>
                  <p className="font-semibold mt-1">
                    {CONTRACT_TYPE_LABELS[contract.contractType]}
                  </p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <span className="text-muted-foreground">Hình thức ký</span>
                  <p className="font-semibold mt-1">
                    {SIGNING_FORM_LABELS[contract.signingForm]}
                  </p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <span className="text-muted-foreground">Thời hạn hiệu lực</span>
                  <p className="font-semibold mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {contract.startDate} → {contract.endDate || "Không xác định"}
                  </p>
                </div>
              </div>

              {/* Lương & Phụ cấp */}
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Gói lương & Chế độ đãi ngộ
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      Hình thức: {contract.salaryPaymentMethod}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {Number(contract.baseSalary).toLocaleString("vi-VN")} VNĐ
                    <span className="text-xs font-normal text-muted-foreground ml-1">/tháng (Lương cơ bản)</span>
                  </div>

                  {contract.allowances && contract.allowances.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        Các khoản phụ cấp hàng tháng:
                      </p>
                      <div className="space-y-1.5">
                        {contract.allowances.map((al, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs py-1 px-2.5 bg-muted/40 rounded border"
                          >
                            <span>{al.allowanceType}</span>
                            <div className="flex items-center gap-3">
                              {al.isInsuranceInclusive && (
                                <Badge variant="outline" className="text-[10px] h-5">
                                  Tính đóng BH
                                </Badge>
                              )}
                              <span className="font-semibold">
                                {Number(al.amount).toLocaleString("vi-VN")} VNĐ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Thông tin công việc & Vị trí */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-muted/30 rounded-lg border space-y-1">
                  <span className="text-muted-foreground">Địa điểm làm việc</span>
                  <p className="font-medium">{contract.workLocation || "Theo thỏa thuận"}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border space-y-1">
                  <span className="text-muted-foreground">Thời giờ làm việc</span>
                  <p className="font-medium">{contract.workingTimeNote || "Theo nội quy lao động"}</p>
                </div>
              </div>

              {contract.terminationDate && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <FileX className="w-4 h-4" />
                    Hợp đồng đã chấm dứt ngày: {contract.terminationDate}
                  </p>
                  <p>Lý do: {contract.terminationReason}</p>
                  {contract.liquidationNotes && <p>Ghi chú thanh lý: {contract.liquidationNotes}</p>}
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Phụ lục Hợp đồng */}
            <TabsContent value="appendices" className="space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Danh mục Phụ lục HĐLĐ</h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => {
                    setSelectedAppendix(null);
                    setAppendixOpen(true);
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm phụ lục mới
                </Button>
              </div>

              <div className="space-y-2">
                {appendices.map((ap) => (
                  <Card
                    key={ap.id}
                    className="cursor-pointer hover:border-primary transition-all"
                    onClick={() => {
                      setSelectedAppendix(ap);
                      setAppendixOpen(true);
                    }}
                  >
                    <CardContent className="p-3.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{ap.appendixNumber}</span>
                          <ContractStatusBadge status={ap.status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Hiệu lực từ: {ap.effectiveDate} • Loại: {ap.appendixType}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Chi tiết →
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {appendices.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-8">
                    Hợp đồng này chưa có phụ lục sửa đổi nào.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Tab 3: Tiến độ Ký số */}
            <TabsContent value="signers" className="space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Danh sách và Chữ ký số các bên
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs text-purple-600"
                  onClick={() => setSigningOpen(true)}
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Mở giao diện Ký số / Kiểm toán
                </Button>
              </div>

              <div className="space-y-2.5">
                {contract.signers?.map((signer) => (
                  <Card key={signer.id} className="border-border/60">
                    <CardContent className="p-3.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{signer.signerName}</span>
                          <Badge variant="outline" className="text-xs">
                            {signer.side === "PARTY_A" ? "Bên A (Công ty)" : "Bên B (Người lao động)"}
                          </Badge>
                          <Badge
                            variant={signer.status === "SIGNED" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {signer.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {signer.signerRoleTitle} • Phương thức: {signer.signingMethod}
                        </p>
                      </div>
                      {signer.signedAt && (
                        <span className="text-xs text-emerald-600 font-mono">
                          {new Date(signer.signedAt).toLocaleString("vi-VN")}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {contract.fileHashSha256 && (
                <div className="p-3 bg-muted/40 rounded-lg border text-xs space-y-1">
                  <span className="text-muted-foreground font-semibold">
                    Mã băm SHA-256 toàn vẹn hợp đồng:
                  </span>
                  <p className="font-mono text-[11px] break-all bg-background p-1.5 rounded border">
                    {contract.fileHashSha256}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Tab 4: Lịch sử & Phiên bản */}
            <TabsContent value="history" className="space-y-3 pt-3">
              <div className="space-y-2">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold">Phiên bản #{ver.versionNumber}</span>
                      <p className="text-muted-foreground mt-0.5">{ver.changeSummary}</p>
                    </div>
                    <span className="text-muted-foreground font-mono">
                      {new Date(ver.changedAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                ))}

                {versions.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-6">
                    Chưa có lịch sử thay đổi phiên bản.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sub Dialogs */}
      {appendixOpen && (
        <ContractAppendixDialog
          open={appendixOpen}
          onOpenChange={setAppendixOpen}
          contractId={contractId}
          contractNumber={contract.contractNumber}
          appendix={selectedAppendix}
          onSuccess={() => {
            refetch();
            refetchAppendices();
          }}
        />
      )}

      {signingOpen && (
        <ContractSigningDialog
          open={signingOpen}
          onOpenChange={setSigningOpen}
          contractId={contractId}
          contractNumber={contract.contractNumber}
          isSelfSigning={true}
          onSuccess={() => refetch()}
        />
      )}

      {terminateOpen && (
        <ContractTerminateDialog
          open={terminateOpen}
          onOpenChange={setTerminateOpen}
          contractId={contractId}
          contractNumber={contract.contractNumber}
          employeeName={contract.employeeName}
          onSuccess={() => {
            refetch();
            onSuccess?.();
          }}
        />
      )}
    </>
  );
}

