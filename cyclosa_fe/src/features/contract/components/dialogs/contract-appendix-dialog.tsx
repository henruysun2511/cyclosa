import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateContractAppendixMutation,
  useUpdateContractAppendixMutation,
  useSubmitAppendixApprovalMutation,
  useApproveContractAppendixMutation,
  useRejectContractAppendixMutation,
  useSendAppendixSigningMutation,
  useActivateContractAppendixMutation,
  useDeleteContractAppendixMutation,
} from "../../api/contract-api";
import { ContractStatusBadge } from "../contract-status-badge";
import type { ContractAppendixDetail, ContractAppendixSummary } from "../../types/contract.types";
import { toast } from "sonner";
import {
  FileText,
  Send,
  CheckCircle2,
  XCircle,
  FileSignature,
  Zap,
  Trash2,
} from "lucide-react";

interface ContractAppendixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  contractNumber: string;
  appendix?: ContractAppendixSummary | ContractAppendixDetail | null;
  onSuccess?: () => void;
}

export function ContractAppendixDialog({
  open,
  onOpenChange,
  contractId,
  contractNumber,
  appendix,
  onSuccess,
}: ContractAppendixDialogProps) {
  const isEdit = Boolean(appendix?.id);

  const [appendixNumber, setAppendixNumber] = useState("");
  const [appendixType, setAppendixType] = useState("ADJUST_SALARY");
  const [effectiveDate, setEffectiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reason, setReason] = useState("");
  const [newBaseSalary, setNewBaseSalary] = useState<number | undefined>();
  const [contentChanges, setContentChanges] = useState("");

  const [createAppendix, { isLoading: isCreating }] = useCreateContractAppendixMutation();
  const [updateAppendix, { isLoading: isUpdating }] = useUpdateContractAppendixMutation();
  const [submitApproval, { isLoading: isSubmitting }] = useSubmitAppendixApprovalMutation();
  const [approveAppendix, { isLoading: isApproving }] = useApproveContractAppendixMutation();
  const [rejectAppendix, { isLoading: isRejecting }] = useRejectContractAppendixMutation();
  const [sendSigning, { isLoading: isSendingSigning }] = useSendAppendixSigningMutation();
  const [activateAppendix, { isLoading: isActivating }] = useActivateContractAppendixMutation();
  const [deleteAppendix, { isLoading: isDeleting }] = useDeleteContractAppendixMutation();

  useEffect(() => {
    if (appendix) {
      setAppendixNumber(appendix.appendixNumber || "");
      setAppendixType(appendix.appendixType || "ADJUST_SALARY");
      setEffectiveDate(appendix.effectiveDate || new Date().toISOString().split("T")[0]);
      const detail = appendix as ContractAppendixDetail;
      setReason(detail.reason || "");
      setNewBaseSalary(detail.newBaseSalary || undefined);
      setContentChanges(detail.contentChanges || "");
    } else {
      setAppendixNumber(`PL-${contractNumber}-${Date.now().toString().slice(-4)}`);
      setAppendixType("ADJUST_SALARY");
      setEffectiveDate(new Date().toISOString().split("T")[0]);
      setReason("");
      setNewBaseSalary(undefined);
      setContentChanges("");
    }
  }, [appendix, contractNumber, open]);

  const handleSave = async () => {
    if (!appendixNumber.trim()) {
      toast.error("Vui lòng nhập số phụ lục");
      return;
    }

    try {
      if (isEdit && appendix?.id) {
        await updateAppendix({
          id: appendix.id,
          body: {
            appendixNumber: appendixNumber.trim(),
            appendixType,
            effectiveDate,
            reason: reason.trim() || undefined,
            newBaseSalary: newBaseSalary || undefined,
            contentChanges: contentChanges.trim() || undefined,
          },
        }).unwrap();
        toast.success("Cập nhật phụ lục thành công");
      } else {
        await createAppendix({
          contractId,
          body: {
            appendixNumber: appendixNumber.trim(),
            appendixType,
            effectiveDate,
            reason: reason.trim() || undefined,
            newBaseSalary: newBaseSalary || undefined,
            contentChanges: contentChanges.trim() || undefined,
          },
        }).unwrap();
        toast.success("Tạo phụ lục hợp đồng thành công (bản nháp)");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu phụ lục hợp đồng");
    }
  };

  const handleAction = async (action: string) => {
    if (!appendix?.id) return;
    try {
      if (action === "submit") {
        await submitApproval(appendix.id).unwrap();
        toast.success("Đã gửi phụ lục để phê duyệt");
      } else if (action === "approve") {
        await approveAppendix(appendix.id).unwrap();
        toast.success("Đã phê duyệt phụ lục hợp đồng");
      } else if (action === "reject") {
        const r = window.prompt("Nhập lý do từ chối phê duyệt:");
        if (!r) return;
        await rejectAppendix({ id: appendix.id, body: { reason: r } }).unwrap();
        toast.warning("Đã từ chối phụ lục hợp đồng");
      } else if (action === "sign") {
        await sendSigning(appendix.id).unwrap();
        toast.success("Đã phát lệnh ký số phụ lục hợp đồng");
      } else if (action === "activate") {
        await activateAppendix(appendix.id).unwrap();
        toast.success("Kích hoạt hiệu lực phụ lục thành công");
      } else if (action === "delete") {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phụ lục bản nháp này?")) return;
        await deleteAppendix(appendix.id).unwrap();
        toast.success("Đã xóa phụ lục bản nháp");
        onOpenChange(false);
      }
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Thao tác thất bại");
    }
  };

  const status = appendix?.status || "DRAFT";
  const isDraft = status === "DRAFT";
  const isPendingApproval = status === "PENDING_APPROVAL";
  const isApproved = status === "APPROVED";
  const isInSigning = status === "IN_SIGNING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[92vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {isEdit ? "Chi tiết Phụ lục Hợp đồng" : "Soạn thảo Phụ lục Hợp đồng mới"}
            </DialogTitle>
            {isEdit && <ContractStatusBadge status={status} />}
          </div>
          <DialogDescription>
            Trực thuộc Hợp đồng số: <strong>{contractNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appendixNumber">
                Số phụ lục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="appendixNumber"
                value={appendixNumber}
                onChange={(e) => setAppendixNumber(e.target.value)}
                disabled={!isDraft}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveDate">
                Ngày bắt đầu hiệu lực <span className="text-destructive">*</span>
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                disabled={!isDraft}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="appendixType" className="text-xs font-semibold">Phân loại phụ lục</Label>
            <Select
              value={appendixType}
              onValueChange={(val) => val && setAppendixType(val)}
              disabled={!isDraft}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Chọn phân loại phụ lục">
                  {(val: string) => {
                    if (val === "ADJUST_SALARY") return "Điều chỉnh mức lương / Thu nhập";
                    if (val === "CHANGE_JOB_TITLE") return "Bổ nhiệm / Thay đổi chức danh & phòng ban";
                    if (val === "CHANGE_WORK_LOCATION") return "Thay đổi địa điểm làm việc";
                    return "Sửa đổi các điều khoản thỏa thuận khác";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADJUST_SALARY" label="Điều chỉnh mức lương / Thu nhập">
                  Điều chỉnh mức lương / Thu nhập
                </SelectItem>
                <SelectItem value="CHANGE_JOB_TITLE" label="Bổ nhiệm / Thay đổi chức danh & phòng ban">
                  Bổ nhiệm / Thay đổi chức danh & phòng ban
                </SelectItem>
                <SelectItem value="CHANGE_WORK_LOCATION" label="Thay đổi địa điểm làm việc">
                  Thay đổi địa điểm làm việc
                </SelectItem>
                <SelectItem value="OTHER_TERMS" label="Sửa đổi các điều khoản thỏa thuận khác">
                  Sửa đổi các điều khoản thỏa thuận khác
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              * Chú ý: Theo Bộ luật Lao động 2019, phụ lục hợp đồng không được sửa đổi thời hạn của hợp đồng lao động.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newBaseSalary">Mức lương cơ bản mới (VNĐ/tháng)</Label>
            <Input
              id="newBaseSalary"
              type="number"
              placeholder="VD: 25000000"
              value={newBaseSalary || ""}
              onChange={(e) => setNewBaseSalary(e.target.value ? Number(e.target.value) : undefined)}
              disabled={!isDraft}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do điều chỉnh</Label>
            <Input
              id="reason"
              placeholder="VD: Đánh giá tăng lương định kỳ năm 2026..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={!isDraft}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentChanges">Nội dung thỏa thuận chi tiết sửa đổi</Label>
            <Textarea
              id="contentChanges"
              placeholder="Mô tả cụ thể điều khoản sửa đổi..."
              value={contentChanges}
              onChange={(e) => setContentChanges(e.target.value)}
              disabled={!isDraft}
              rows={3}
            />
          </div>

          {/* Workflow Action Buttons when in edit mode */}
          {isEdit && (
            <div className="pt-2 border-t space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-semibold">
                Quy trình xử lý phụ lục
              </Label>
              <div className="flex flex-wrap gap-2">
                {isDraft && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs text-blue-600"
                      onClick={() => handleAction("submit")}
                      disabled={isSubmitting}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Gửi duyệt
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
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs text-emerald-600"
                      onClick={() => handleAction("approve")}
                      disabled={isApproving}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Phê duyệt
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
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-purple-600"
                    onClick={() => handleAction("sign")}
                    disabled={isSendingSigning}
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    Phát lệnh ký số
                  </Button>
                )}

                {isInSigning && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs text-emerald-600"
                    onClick={() => handleAction("activate")}
                    disabled={isActivating}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Kích hoạt hiệu lực
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {isDraft && (
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo phụ lục"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

