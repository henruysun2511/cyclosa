"use client";

import React, { useEffect, useState } from "react";
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
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "../../api/organization-api";
import type { Company } from "../../types/organization.types";

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  onSuccess?: () => void;
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  company,
  onSuccess,
}: CompanyFormDialogProps) {
  const isEditing = Boolean(company);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (company) {
      setCode(company.code);
      setName(company.name);
      setTaxCode(company.taxCode || "");
      setAddress(company.address || "");
      setPhone(company.phone || "");
      setEmail(company.email || "");
      setStatus(company.status);
    } else {
      setCode("");
      setName("");
      setTaxCode("");
      setAddress("");
      setPhone("");
      setEmail("");
      setStatus("ACTIVE");
    }
  }, [company, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên công ty");
      return;
    }
    if (!isEditing && !code.trim()) {
      toast.error("Vui lòng nhập mã công ty");
      return;
    }

    try {
      if (isEditing && company) {
        await updateCompany({
          id: company.id,
          body: {
            name: name.trim(),
            taxCode: taxCode.trim() || undefined,
            address: address.trim() || undefined,
            phone: phone.trim() || undefined,
            email: email.trim() || undefined,
            status,
          },
        }).unwrap();
        toast.success("Cập nhật thông tin công ty thành công!");
      } else {
        await createCompany({
          code: code.trim().toUpperCase(),
          name: name.trim(),
          taxCode: taxCode.trim() || undefined,
          address: address.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
        }).unwrap();
        toast.success("Tạo mới công ty thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi khi lưu thông tin công ty!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Công ty / Pháp nhân" : "Thêm mới Công ty / Pháp nhân"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-1">
              <Label htmlFor="company-code">Mã công ty *</Label>
              <Input
                id="company-code"
                placeholder="CYC_CORP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isEditing}
                required
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="company-name">Tên công ty / pháp nhân *</Label>
              <Input
                id="company-name"
                placeholder="Tập đoàn CYCLOSA"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company-tax">Mã số thuế</Label>
              <Input
                id="company-tax"
                placeholder="0109998888"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company-phone">Số điện thoại</Label>
              <Input
                id="company-phone"
                placeholder="02473008888"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-email">Email liên hệ</Label>
            <Input
              id="company-email"
              type="email"
              placeholder="contact@cyclosa.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-address">Địa chỉ trụ sở</Label>
            <Input
              id="company-address"
              placeholder="Tòa nhà Keangnam Landmark 72, Nam Từ Liêm, Hà Nội"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="company-status">Trạng thái hoạt động</Label>
              <Select value={status} onValueChange={(val) => val && setStatus(val as "ACTIVE" | "INACTIVE")}>
                <SelectTrigger id="company-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Hoạt động (ACTIVE)</SelectItem>
                  <SelectItem value="INACTIVE">Tạm ngưng (INACTIVE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo công ty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

