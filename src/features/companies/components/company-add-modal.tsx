"use client";

import React, { useState } from "react";
import { X, Building2 } from "lucide-react";
import type { Company, CompanyPlan, CompanyBillingCycle, CompanyStatus } from "../types/company.types";
import { toast } from "sonner";

export interface CompanyAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (company: Omit<Company, "id">) => void;
}

export function CompanyAddModal({
  open,
  onClose,
  onAdd,
}: CompanyAddModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accountUrl, setAccountUrl] = useState("");
  const [plan, setPlan] = useState<CompanyPlan>("Advanced");
  const [billingCycle, setBillingCycle] = useState<CompanyBillingCycle>("Monthly");
  const [status, setStatus] = useState<CompanyStatus>("Active");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên công ty");
      return;
    }
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    const initials = name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const colorVariants = [
      { bg: "bg-blue-100", text: "text-blue-600" },
      { bg: "bg-purple-100", text: "text-purple-600" },
      { bg: "bg-emerald-100", text: "text-emerald-600" },
      { bg: "bg-orange-100", text: "text-orange-600" },
      { bg: "bg-rose-100", text: "text-rose-600" },
    ];
    const picked = colorVariants[Math.floor(Math.random() * colorVariants.length)];

    onAdd({
      name,
      email,
      accountUrl: accountUrl || `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.example.com`,
      plan,
      billingCycle,
      canUpgrade: true,
      createdDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status,
      logoBg: picked.bg,
      logoColor: picked.text,
      initials,
    });

    toast.success("Thêm công ty thành công!", {
      description: `Công ty ${name} đã được thêm vào hệ thống.`,
    });
    setName("");
    setEmail("");
    setAccountUrl("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Thêm Công Ty Mới
              </h3>
              <p className="text-xs text-muted-foreground">
                Nhập thông tin doanh nghiệp đăng ký dịch vụ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground">
              Tên Doanh Nghiệp <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: CyberTech Global..."
              className="input mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Email Liên Hệ <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="input mt-1.5"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">
                URL Tài Khoản / Tên Miền
              </label>
              <input
                type="text"
                value={accountUrl}
                onChange={(e) => setAccountUrl(e.target.value)}
                placeholder="tencongty.example.com"
                className="input mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Gói Đăng Ký
              </label>
              <select
                value={plan}
                onChange={(e) =>
                  setPlan(e.target.value as CompanyPlan)
                }
                className="select w-full mt-1.5"
              >
                <option value="Basic">Basic Plan</option>
                <option value="Advanced">Advanced Plan</option>
                <option value="Enterprise">Enterprise Plan</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Chu Kỳ Thanh Toán
              </label>
              <select
                value={billingCycle}
                onChange={(e) =>
                  setBillingCycle(e.target.value as CompanyBillingCycle)
                }
                className="select w-full mt-1.5"
              >
                <option value="Monthly">Hàng tháng (Monthly)</option>
                <option value="Yearly">Hàng năm (Yearly)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground">
              Trạng Thái Kích Hoạt
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === "Active"}
                  onChange={() => setStatus("Active")}
                  className="text-primary focus:ring-primary"
                />
                <span>Active (Kích hoạt)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={status === "Inactive"}
                  onChange={() => setStatus("Inactive")}
                  className="text-primary focus:ring-primary"
                />
                <span>Inactive (Tạm ngưng)</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Tạo Công Ty
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const AddCompanyModal = CompanyAddModal;
