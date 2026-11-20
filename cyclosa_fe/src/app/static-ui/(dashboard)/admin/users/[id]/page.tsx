"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Lock,
  Unlock,
  Mail,
  Shield,
  Trash2,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, ConfirmReasonDialog } from "@/components/shared";

export default function UserDetailPage() {
  const [status, setStatus] = useState<"ACTIVE" | "LOCKED" | "PENDING_ACTIVATION">("ACTIVE");
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [activationSent, setActivationSent] = useState(false);

  const [rolesList, setRolesList] = useState([
    { companyName: "Công ty Cổ phần Công nghệ FSI", roleName: "HR Director", scope: "ALL" },
    { companyName: "Công ty Cổ phần Công nghệ FSI", roleName: "Department Manager", scope: "DEPARTMENT" },
  ]);

  const handleResendActivation = () => {
    setActivationSent(true);
    setTimeout(() => setActivationSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/admin/users">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Quay lại danh sách tài khoản
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">RBAC-02</Badge>
      </div>

      {/* ── User Overview Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
            TM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">Trần Thị Mai</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              mai.tran@cyclosa.vn • Mã NV: <strong>EMP002</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status === "PENDING_ACTIVATION" && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 text-indigo-600 border-indigo-200"
              onClick={handleResendActivation}
            >
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              {activationSent ? "Đã gửi lại email!" : "Gửi lại email kích hoạt"}
            </Button>
          )}

          {status === "ACTIVE" ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 text-rose-600 border-rose-200 hover:bg-rose-50"
              onClick={() => setLockModalOpen(true)}
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Khóa tài khoản
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-9 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              onClick={() => setStatus("ACTIVE")}
            >
              <Unlock className="h-3.5 w-3.5 mr-1.5" />
              Mở khóa tài khoản
            </Button>
          )}
        </div>
      </div>

      {/* ── User Account Info Card ──────────────────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardHeader className="py-4 px-6 border-b border-border">
          <CardTitle className="text-sm font-semibold">Thông tin đăng nhập & Bảo mật</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block text-2xs">Email tài khoản</span>
            <strong className="text-foreground font-mono">mai.tran@cyclosa.vn</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-2xs">Đăng nhập lần cuối</span>
            <strong className="text-foreground font-mono">04/10/2026 09:12:45</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-2xs">Phương thức xác thực</span>
            <strong className="text-foreground">Email + Mật khẩu / Google SSO</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-2xs">Trạng thái kích hoạt</span>
            <strong className="text-emerald-600 font-semibold">Đã xác thực email & kích hoạt</strong>
          </div>
        </CardContent>
      </Card>

      {/* ── Role Assignments across Companies ───────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardHeader className="py-4 px-6 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Vai trò được phân công theo Pháp nhân / Công ty</CardTitle>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Gán vai trò mới
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border text-muted-foreground uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Công ty áp dụng</th>
                <th className="py-3 px-4">Vai trò (Role)</th>
                <th className="py-3 px-4">Phạm vi dữ liệu</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rolesList.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-foreground">{r.companyName}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="font-semibold text-2xs">{r.roleName}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{r.scope}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                      onClick={() => setRolesList(rolesList.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Lock Account Reason Modal */}
      <ConfirmReasonDialog
        open={lockModalOpen}
        onOpenChange={setLockModalOpen}
        title="Khóa tài khoản người dùng"
        description="Khi bị khóa, người dùng sẽ bị chấm dứt phiên làm việc ngay lập tức và không thể đăng nhập lại cho đến khi được mở khóa."
        reasonLabel="Lý do khóa tài khoản"
        reasonPlaceholder="Nhập lý do khóa (vi phạm chính sách bảo mật, tạm nghỉ việc...)..."
        confirmText="Xác nhận khóa"
        variant="destructive"
        onConfirm={async () => {
          setStatus("LOCKED");
          setLockModalOpen(false);
        }}
      />
    </div>
  );
}
