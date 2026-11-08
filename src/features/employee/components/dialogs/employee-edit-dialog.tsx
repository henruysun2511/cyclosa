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
import { useUpdateEmployeeMutation } from "../../api/employee-api";
import type { EmployeeDetail, Gender, UpdateEmployeeInput } from "../../types/employee.types";

interface EmployeeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeDetail | null;
  onSuccess?: () => void;
}

export function EmployeeEditDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeEditDialogProps) {
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

  const [formData, setFormData] = useState<UpdateEmployeeInput>({
    lastName: "",
    firstName: "",
    dateOfBirth: "",
    gender: "MALE",
    phone: "",
    personalEmail: "",
    address: "",
    startDate: "",
    probationEndDate: "",
    personalTaxCode: "",
    socialInsuranceNumber: "",
    portraitUrl: "",
  });

  useEffect(() => {
    if (employee && open) {
      setFormData({
        lastName: employee.lastName || "",
        firstName: employee.firstName || "",
        dateOfBirth: employee.dateOfBirth || "",
        gender: employee.gender || "MALE",
        phone: employee.phone || "",
        personalEmail: employee.personalEmail || "",
        address: employee.address || "",
        startDate: employee.startDate || "",
        probationEndDate: employee.probationEndDate || "",
        personalTaxCode: employee.personalTaxCode || "",
        socialInsuranceNumber: employee.socialInsuranceNumber || "",
        portraitUrl: employee.portraitUrl || "",
      });
    }
  }, [employee, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    if (!formData.lastName || !formData.firstName) {
      toast.error("Vui lòng nhập đầy đủ Họ và Tên!");
      return;
    }
    if (!formData.phone) {
      toast.error("Vui lòng nhập số điện thoại liên hệ!");
      return;
    }

    try {
      await updateEmployee({ id: employee.id, body: formData }).unwrap();
      toast.success("Cập nhật thông tin lý lịch nhân sự thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể cập nhật hồ sơ nhân sự!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Chỉnh sửa lý lịch & thông tin pháp lý nhân sự
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Họ và tên */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Họ và tên đệm <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Nguyễn Văn"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Tên chính <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="An"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Ngày sinh & Giới tính */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Ngày sinh <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Giới tính</Label>
              <Select
                value={formData.gender}
                onValueChange={(val) => setFormData({ ...formData, gender: (val || "MALE") as Gender })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SĐT & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Số điện thoại liên hệ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="0912345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email cá nhân</Label>
              <Input
                type="email"
                placeholder="nguyenvanan@gmail.com"
                value={formData.personalEmail || ""}
                onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Địa chỉ cư trú hiện tại</Label>
            <Input
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Thuế & BHXH */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mã số thuế TNCN</Label>
              <Input
                placeholder="10 hoặc 13 chữ số"
                value={formData.personalTaxCode || ""}
                onChange={(e) => setFormData({ ...formData, personalTaxCode: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mã số sổ BHXH</Label>
              <Input
                placeholder="10 chữ số BHXH"
                value={formData.socialInsuranceNumber || ""}
                onChange={(e) => setFormData({ ...formData, socialInsuranceNumber: e.target.value })}
              />
            </div>
          </div>

          {/* Ngày vào làm & Hạn thử việc */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Ngày vào làm việc</Label>
              <Input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hạn kết thúc thử việc</Label>
              <Input
                type="date"
                value={formData.probationEndDate || ""}
                onChange={(e) => setFormData({ ...formData, probationEndDate: e.target.value })}
              />
            </div>
          </div>

          {/* Link ảnh chân dung */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Đường dẫn ảnh thẻ chân dung (URL)</Label>
            <Input
              placeholder="https://res.cloudinary.com/.../avatar.jpg"
              value={formData.portraitUrl || ""}
              onChange={(e) => setFormData({ ...formData, portraitUrl: e.target.value })}
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
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
