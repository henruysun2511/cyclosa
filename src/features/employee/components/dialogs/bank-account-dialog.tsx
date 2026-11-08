"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { useUpdateBankAccountMutation } from "../../api/employee-api";
import type { BankAccount } from "../../types/employee.types";

const POPULAR_BANKS = [
  "Vietcombank (VCB)",
  "Techcombank (TCB)",
  "BIDV",
  "VietinBank",
  "MB Bank (MBB)",
  "ACB",
  "VPBank",
  "TPBank",
  "Sacombank",
  "HDBank",
  "VIB",
  "SHB",
  "Khác",
];

interface BankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  bankAccount?: BankAccount | null;
  onSuccess?: () => void;
}

export function BankAccountDialog({
  open,
  onOpenChange,
  employeeId,
  bankAccount,
  onSuccess,
}: BankAccountDialogProps) {
  const [updateBank, { isLoading }] = useUpdateBankAccountMutation();

  const [bankName, setBankName] = useState("Vietcombank (VCB)");
  const [customBankName, setCustomBankName] = useState("");
  const [bankBranchName, setBankBranchName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    if (bankAccount && open) {
      if (POPULAR_BANKS.includes(bankAccount.bankName)) {
        setBankName(bankAccount.bankName);
        setCustomBankName("");
      } else {
        setBankName("Khác");
        setCustomBankName(bankAccount.bankName || "");
      }
      setBankBranchName(bankAccount.bankBranchName || "");
      setAccountNumber(bankAccount.accountNumber || "");
    } else if (open) {
      setBankName("Vietcombank (VCB)");
      setCustomBankName("");
      setBankBranchName("");
      setAccountNumber("");
    }
  }, [bankAccount, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalBankName = bankName === "Khác" ? customBankName.trim() : bankName;

    if (!finalBankName) {
      toast.error("Vui lòng nhập tên ngân hàng!");
      return;
    }
    if (!accountNumber) {
      toast.error("Vui lòng nhập số tài khoản ngân hàng!");
      return;
    }

    try {
      await updateBank({
        employeeId,
        body: {
          bankName: finalBankName,
          bankBranchName: bankBranchName || null,
          accountNumber,
        },
      }).unwrap();

      toast.success("Cập nhật thông tin tài khoản ngân hàng thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể cập nhật tài khoản ngân hàng!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Cài đặt tài khoản nhận lương chính thức
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tên ngân hàng</Label>
            <Select value={bankName} onValueChange={(val) => val && setBankName(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngân hàng" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_BANKS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {bankName === "Khác" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Nhập tên ngân hàng khác <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Ví dụ: Standard Chartered, Shinhan..."
                value={customBankName}
                onChange={(e) => setCustomBankName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Số tài khoản ngân hàng <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Nhập chính xác số tài khoản"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Chi nhánh ngân hàng (Tùy chọn)</Label>
            <Input
              placeholder="Ví dụ: Chi nhánh Hoàn Kiếm, Hà Nội"
              value={bankBranchName}
              onChange={(e) => setBankBranchName(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu tài khoản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

