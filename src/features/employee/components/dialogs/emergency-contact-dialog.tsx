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
import { toast } from "sonner";
import { Phone } from "lucide-react";
import {
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
} from "../../api/employee-api";
import type { EmergencyContact } from "../../types/employee.types";

interface EmergencyContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  contact?: EmergencyContact | null;
  onSuccess?: () => void;
}

export function EmergencyContactDialog({
  open,
  onOpenChange,
  employeeId,
  contact,
  onSuccess,
}: EmergencyContactDialogProps) {
  const [createContact, { isLoading: isCreating }] = useCreateEmergencyContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateEmergencyContactMutation();

  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const isEditing = !!contact;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (contact && open) {
      setFullName(contact.fullName || "");
      setRelationship(contact.relationship || "");
      setPhone(contact.phone || "");
      setAddress(contact.address || "");
    } else if (open) {
      setFullName("");
      setRelationship("Bố/Mẹ");
      setPhone("");
      setAddress("");
    }
  }, [contact, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.error("Vui lòng điền họ tên và số điện thoại người liên hệ khẩn cấp!");
      return;
    }

    try {
      if (isEditing && contact) {
        await updateContact({
          contactId: contact.id,
          body: {
            fullName,
            relationship,
            phone,
            address: address || null,
          },
        }).unwrap();
        toast.success("Cập nhật người liên hệ khẩn cấp thành công!");
      } else {
        await createContact({
          employeeId,
          body: {
            fullName,
            relationship,
            phone,
            address: address || null,
          },
        }).unwrap();
        toast.success("Thêm người liên hệ khẩn cấp thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu thông tin liên hệ khẩn cấp!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            {isEditing ? "Chỉnh sửa người liên hệ khẩn cấp" : "Thêm người liên hệ khẩn cấp"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Họ và tên thân nhân <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Ví dụ: Nguyễn Văn C"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Mối quan hệ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Vợ, Chồng, Bố, Mẹ..."
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Số điện thoại liên lạc <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Địa chỉ nơi cư trú (Tùy chọn)</Label>
            <Input
              placeholder="Địa chỉ liên hệ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm liên hệ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

