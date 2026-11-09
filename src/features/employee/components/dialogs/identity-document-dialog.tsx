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
import { FileText } from "lucide-react";
import {
  useCreateIdentityDocumentMutation,
  useUpdateIdentityDocumentMutation,
} from "../../api/employee-api";
import type { IdentityDocument, IdentityDocumentType } from "../../types/employee.types";

interface IdentityDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  document?: IdentityDocument | null;
  onSuccess?: () => void;
}

export function IdentityDocumentDialog({
  open,
  onOpenChange,
  employeeId,
  document,
  onSuccess,
}: IdentityDocumentDialogProps) {
  const [createDoc, { isLoading: isCreating }] = useCreateIdentityDocumentMutation();
  const [updateDoc, { isLoading: isUpdating }] = useUpdateIdentityDocumentMutation();

  const [documentType, setDocumentType] = useState<IdentityDocumentType>("CITIZEN_ID");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issuePlace, setIssuePlace] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const isEditing = !!document;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (document && open) {
      setDocumentType(document.documentType || "CITIZEN_ID");
      setDocumentNumber(document.documentNumber || "");
      setIssueDate(document.issueDate || "");
      setIssuePlace(document.issuePlace || "");
      setExpiryDate(document.expiryDate || "");
    } else if (open) {
      setDocumentType("CITIZEN_ID");
      setDocumentNumber("");
      setIssueDate("");
      setIssuePlace("Cục Cảnh sát QLHC về TTXH");
      setExpiryDate("");
    }
  }, [document, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentNumber || !issueDate || !issuePlace) {
      toast.error("Vui lòng điền đầy đủ số giấy tờ, ngày cấp và nơi cấp!");
      return;
    }

    try {
      if (isEditing && document) {
        await updateDoc({
          documentId: document.id,
          body: {
            documentType,
            documentNumber,
            issueDate,
            issuePlace,
            expiryDate: expiryDate || null,
          },
        }).unwrap();
        toast.success("Cập nhật giấy tờ định danh thành công!");
      } else {
        await createDoc({
          employeeId,
          body: {
            documentType,
            documentNumber,
            issueDate,
            issuePlace,
            expiryDate: expiryDate || null,
          },
        }).unwrap();
        toast.success("Thêm mới giấy tờ định danh thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu giấy tờ định danh!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[90vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isEditing ? "Chỉnh sửa giấy tờ định danh" : "Thêm giấy tờ định danh mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Loại giấy tờ</Label>
            <Select
              value={documentType}
              onValueChange={(val) => val && setDocumentType(val as IdentityDocumentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại giấy tờ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITIZEN_ID" label="Căn cước công dân (CCCD)">
                  Căn cước công dân (CCCD)
                </SelectItem>
                <SelectItem value="PASSPORT" label="Hộ chiếu (Passport)">
                  Hộ chiếu (Passport)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Số định danh <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder={documentType === "CITIZEN_ID" ? "12 chữ số CCCD" : "Mã số Hộ chiếu"}
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Ngày cấp <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Ngày hết hạn</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Nơi cấp <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Cục Cảnh sát QLHC về TTXH"
              value={issuePlace}
              onChange={(e) => setIssuePlace(e.target.value)}
              required
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
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm giấy tờ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

