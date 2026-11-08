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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTerminateContractMutation } from "../../api/contract-api";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface ContractTerminateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  contractNumber: string;
  employeeName: string;
  onSuccess?: () => void;
}

export function ContractTerminateDialog({
  open,
  onOpenChange,
  contractId,
  contractNumber,
  employeeName,
  onSuccess,
}: ContractTerminateDialogProps) {
  const [terminationDate, setTerminationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [terminationReason, setTerminationReason] = useState("");
  const [liquidationNotes, setLiquidationNotes] = useState("");

  const [terminateContract, { isLoading }] = useTerminateContractMutation();

  const handleConfirm = async () => {
    if (!terminationDate) {
      toast.error("Vui lòng chọn ngày chấm dứt hợp đồng");
      return;
    }
    if (!terminationReason.trim()) {
      toast.error("Vui lòng nhập lý do chấm dứt hợp đồng");
      return;
    }

    try {
      await terminateContract({
        id: contractId,
        body: {
          terminationDate,
          terminationReason: terminationReason.trim(),
          liquidationNotes: liquidationNotes.trim() || undefined,
        },
      }).unwrap();

      toast.success("Chấm dứt hợp đồng lao động thành công");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể chấm dứt hợp đồng lao động");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="w-5 h-5" />
            Chấm dứt / Thanh lý Hợp đồng
          </DialogTitle>
          <DialogDescription>
            Hành động này sẽ chấm dứt hiệu lực của hợp đồng số{" "}
            <strong>{contractNumber}</strong> thuộc nhân sự{" "}
            <strong>{employeeName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="terminationDate">
              Ngày chấm dứt hiệu lực <span className="text-destructive">*</span>
            </Label>
            <Input
              id="terminationDate"
              type="date"
              value={terminationDate}
              onChange={(e) => setTerminationDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terminationReason">
              Lý do chấm dứt hợp đồng <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="terminationReason"
              placeholder="VD: Hai bên thỏa thuận chấm dứt HĐLĐ theo Điều 34 BLLĐ 2019..."
              value={terminationReason}
              onChange={(e) => setTerminationReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liquidationNotes">Biên bản thanh lý / Ghi chú bàn giao</Label>
            <Textarea
              id="liquidationNotes"
              placeholder="Ghi chú về việc bàn giao tài sản, thanh toán trợ cấp thôi việc..."
              value={liquidationNotes}
              onChange={(e) => setLiquidationNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận chấm dứt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

