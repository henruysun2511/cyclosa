"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Shield, ShieldPlus, Trash2, Loader2, Building2 } from "lucide-react";
import {
  useGetUserRoleAssignmentsQuery,
  useAssignUserRoleMutation,
  useRevokeUserRoleAssignmentMutation,
} from "../api/user-api";
import { useGetRolesQuery } from "@/features/authorization";
import type { UserResponse } from "../types/user.types";
import { toast } from "sonner";

export interface UserRoleAssignmentDialogProps {
  user: UserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserRoleAssignmentDialog({
  user,
  open,
  onOpenChange,
}: UserRoleAssignmentDialogProps) {
  const userId = user?.id || "";

  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useGetUserRoleAssignmentsQuery(userId, { skip: !open || !userId });
  const assignments = assignmentsData?.data || [];

  const { data: rolesData } = useGetRolesQuery(
    { size: 100, sortBy: "name", direction: "asc" },
    { skip: !open }
  );
  const roles = rolesData?.data?.items || [];

  const [assignRole, { isLoading: isAssigning }] = useAssignUserRoleMutation();
  const [revokeRole, { isLoading: isRevoking }] = useRevokeUserRoleAssignmentMutation();

  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>(
    "00000000-0000-0000-0000-000000000001" // Mặc định ID Công ty gốc / Trụ sở chính
  );

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) {
      toast.error("Vui lòng chọn vai trò cần gán");
      return;
    }
    if (!companyId.trim()) {
      toast.error("Vui lòng nhập ID công ty");
      return;
    }

    try {
      const res = await assignRole({
        userId,
        body: {
          roleId: selectedRoleId,
          companyId: companyId.trim(),
        },
      }).unwrap();

      if (res.success) {
        toast.success(`Đã gán vai trò thành công cho ${user?.email}`);
        setSelectedRoleId("");
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể gán vai trò. Vui lòng thử lại.");
    }
  };

  const handleRevokeRole = async (assignmentId: string, roleName: string) => {
    try {
      const res = await revokeRole({
        assignmentId,
        userId,
      }).unwrap();

      if (res.success) {
        toast.success(`Đã thu hồi vai trò "${roleName}" thành công.`);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể thu hồi vai trò. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-6 gap-0 rounded-2xl border-border bg-card shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                Quản lý Vai trò & Phân quyền Tài khoản
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Người dùng: <span className="font-semibold text-foreground">{user?.email}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-4 pb-1">
          {/* 1. Form gán vai trò mới */}
          <form
            onSubmit={handleAssignRole}
            className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3"
          >
            <div className="flex items-center gap-2">
              <ShieldPlus className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Gán thêm vai trò mới</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Chọn vai trò (Chuẩn Quy tắc 11.8) */}
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-foreground">
                  Vai trò cần gán <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedRoleId}
                  onValueChange={(val) => setSelectedRoleId(val || "")}
                >
                  <SelectTrigger className="w-full h-8.5 text-xs rounded-lg border-input bg-background focus-visible:ring-1">
                    <SelectValue placeholder="Chọn vai trò...">
                      {(val: string) => {
                        const target = roles.find((r) => r.id === val);
                        return target ? `${target.name} (${target.code})` : val;
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="text-xs max-h-56">
                    {roles.map((r) => (
                      <SelectItem
                        key={r.id}
                        value={r.id}
                        label={`${r.name} (${r.code})`}
                        className="text-xs cursor-pointer"
                      >
                        <span className="font-medium text-foreground">{r.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground ml-2">
                          ({r.code})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ID Công ty */}
              <div className="space-y-1">
                <Label htmlFor="companyId" className="text-[11px] font-semibold text-foreground">
                  ID Pháp nhân / Công ty <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyId"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="Nhập ID công ty áp dụng..."
                  className="h-8.5 text-xs rounded-lg border-input bg-background font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                size="sm"
                disabled={isAssigning || !selectedRoleId}
                className="h-8 px-3.5 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
              >
                {isAssigning && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                <span>Gán vai trò</span>
              </Button>
            </div>
          </form>

          {/* 2. Danh sách vai trò đã gán */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Danh sách vai trò đang có hiệu lực
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {assignments.length} vai trò
              </span>
            </div>

            <div className="border border-border rounded-xl divide-y divide-border overflow-hidden max-h-56 overflow-y-auto bg-card">
              {isLoadingAssignments ? (
                <div className="p-6 text-center text-xs text-muted-foreground animate-pulse">
                  Đang tải danh sách vai trò...
                </div>
              ) : assignments.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Người dùng này chưa được gán vai trò nào.
                </div>
              ) : (
                assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground">
                          {assignment.roleName}
                        </span>
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {assignment.roleCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">Công ty ID: {assignment.companyId}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isRevoking}
                      onClick={() => handleRevokeRole(assignment.id, assignment.roleName)}
                      className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer"
                      title="Thu hồi vai trò này"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      <span>Thu hồi</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

