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
import { Users } from "lucide-react";
import {
  useCreateDependentMutation,
  useUpdateDependentMutation,
} from "../../api/employee-api";
import type { Dependent, DependentRelationship } from "../../types/employee.types";

interface DependentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  dependent?: Dependent | null;
  onSuccess?: () => void;
}

export function DependentDialog({
  open,
  onOpenChange,
  employeeId,
  dependent,
  onSuccess,
}: DependentDialogProps) {
  const [createDep, { isLoading: isCreating }] = useCreateDependentMutation();
  const [updateDep, { isLoading: isUpdating }] = useUpdateDependentMutation();

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [relationship, setRelationship] = useState<DependentRelationship>("CHILD");
  const [identityNumber, setIdentityNumber] = useState("");
  const [taxDeductionFrom, setTaxDeductionFrom] = useState("");
  const [taxDeductionTo, setTaxDeductionTo] = useState("");

  const isEditing = !!dependent;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (dependent && open) {
      setFullName(dependent.fullName || "");
      setDateOfBirth(dependent.dateOfBirth || "");
      setRelationship(dependent.relationship || "CHILD");
      setIdentityNumber(dependent.identityNumber || "");
      setTaxDeductionFrom(dependent.taxDeductionFrom || "");
      setTaxDeductionTo(dependent.taxDeductionTo || "");
    } else if (open) {
      setFullName("");
      setDateOfBirth("");
      setRelationship("CHILD");
      setIdentityNumber("");
      setTaxDeductionFrom(new Date().toISOString().split("T")[0]);
      setTaxDeductionTo("");
    }
  }, [dependent, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dateOfBirth) {
      toast.error("Vui lòng điền họ tên và ngày sinh của người phụ thuộc!");
      return;
    }

    try {
      if (isEditing && dependent) {
        await updateDep({
          dependentId: dependent.id,
          body: {
            fullName,
            dateOfBirth,
            relationship,
            identityNumber: identityNumber || null,
            taxDeductionFrom: taxDeductionFrom || null,
            taxDeductionTo: taxDeductionTo || null,
          },
        }).unwrap();
        toast.success("Cập nhật người phụ thuộc thành công!");
      } else {
        await createDep({
          employeeId,
          body: {
            fullName,
            dateOfBirth,
            relationship,
            identityNumber: identityNumber || null,
            taxDeductionFrom: taxDeductionFrom || null,
            taxDeductionTo: taxDeductionTo || null,
          },
        }).unwrap();
        toast.success("Đăng ký người phụ thuộc thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu thông tin người phụ thuộc!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {isEditing ? "Chỉnh sửa người phụ thuộc" : "Đăng ký người phụ thuộc giảm trừ gia cảnh"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Họ và tên người phụ thuộc <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Nguyễn Văn B"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Ngày sinh <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Quan hệ</Label>
              <Select
                value={relationship}
                onValueChange={(val) => val && setRelationship(val as DependentRelationship)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quan hệ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHILD">Con ruột / Con nuôi (Child)</SelectItem>
                  <SelectItem value="SPOUSE">Vợ / Chồng (Spouse)</SelectItem>
                  <SelectItem value="PARENT">Bố / Mẹ (Parent)</SelectItem>
                  <SelectItem value="SIBLING">Anh / Chị / Em ruột</SelectItem>
                  <SelectItem value="OTHER">Thân nhân khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Mã định danh / Số CCCD / Giấy khai sinh</Label>
            <Input
              placeholder="Nhập mã định danh cá nhân"
              value={identityNumber}
              onChange={(e) => setIdentityNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tính giảm trừ từ ngày</Label>
              <Input
                type="date"
                value={taxDeductionFrom}
                onChange={(e) => setTaxDeductionFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hết hạn giảm trừ</Label>
              <Input
                type="date"
                value={taxDeductionTo}
                onChange={(e) => setTaxDeductionTo(e.target.value)}
              />
            </div>
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
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Thêm người phụ thuộc"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
