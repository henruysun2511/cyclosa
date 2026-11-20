"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  Shield,
  ShieldCheck,
  Lock,
  Users,
  Search,
  Plus,
  Save,
  Check,
  CheckSquare,
  Square,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  Activity,
  Layers,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types & Definitions ──────────────────────────────────────────────
export type DataScope = "ALL" | "DEPARTMENT" | "TEAM" | "OWN" | "NONE";

export interface PermissionItem {
  id: string;
  category: string;
  resource: string;
  code: string;
  view: boolean;
  viewScope: DataScope;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}

export interface SystemRole {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  assignedUsersCount: number;
  permissions: PermissionItem[];
}

// ── Default Permission Matrix Template ───────────────────────────────
const BASE_PERMISSIONS: Omit<PermissionItem, "view" | "create" | "edit" | "delete" | "approve" | "export" | "viewScope">[] = [
  // 1. Quản lý Tổ chức & Cơ cấu
  { id: "org_structure", category: "Cơ cấu & Tổ chức", resource: "Sơ đồ tổ chức & Phòng ban", code: "ORG_STRUCTURE" },
  { id: "org_jobs", category: "Cơ cấu & Tổ chức", resource: "Danh mục Chức danh & Vị trí", code: "ORG_JOB_TITLES" },
  { id: "org_sandbox", category: "Cơ cấu & Tổ chức", resource: "Mô phỏng Sandbox cơ cấu", code: "ORG_SIMULATION" },

  // 2. Hồ sơ & Nhân sự
  { id: "hr_employee", category: "Hồ sơ & Nhân sự", resource: "Hồ sơ nhân viên & Lý lịch", code: "HR_EMPLOYEE" },
  { id: "hr_contract", category: "Hồ sơ & Nhân sự", resource: "Hợp đồng lao động & Phụ lục", code: "HR_CONTRACT" },
  { id: "hr_reward", category: "Hồ sơ & Nhân sự", resource: "Khen thưởng & Kỷ luật", code: "HR_DISCIPLINE" },

  // 3. Chấm công & Nghỉ phép
  { id: "time_attendance", category: "Chấm công & Ca kíp", resource: "Bảng chấm công & Chốt công", code: "TIME_ATTENDANCE" },
  { id: "time_leave", category: "Chấm công & Ca kíp", resource: "Đơn xin nghỉ phép & Tăng ca", code: "TIME_LEAVE" },
  { id: "time_shift", category: "Chấm công & Ca kíp", resource: "Phân ca & Lịch làm việc", code: "TIME_SHIFT" },

  // 4. Tiền lương & Đãi ngộ
  { id: "pay_sheet", category: "Tiền lương & Đãi ngộ", resource: "Bảng tính lương tháng", code: "PAYROLL_SHEET" },
  { id: "pay_policy", category: "Tiền lương & Đãi ngộ", resource: "Chính sách & Công thức lương", code: "PAYROLL_POLICY" },
  { id: "pay_advance", category: "Tiền lương & Đãi ngộ", resource: "Tạm ứng & Chi trả lương", code: "PAYROLL_ADVANCE" },

  // 5. Tuyển dụng & Onboarding
  { id: "rec_job", category: "Tuyển dụng & Đào tạo", resource: "Tin tuyển dụng & Nhu cầu", code: "REC_JOB_POSTING" },
  { id: "rec_candidate", category: "Tuyển dụng & Đào tạo", resource: "Ứng viên & Pipeline", code: "REC_CANDIDATE" },
  { id: "rec_training", category: "Tuyển dụng & Đào tạo", resource: "Kế hoạch đào tạo nội bộ", code: "REC_TRAINING" },

  // 6. Đánh giá & Hiệu suất (KPI)
  { id: "kpi_target", category: "Đánh giá & Hiệu suất", resource: "Mục tiêu & Tiêu chí KPI", code: "KPI_TARGET" },
  { id: "kpi_review", category: "Đánh giá & Hiệu suất", resource: "Đánh giá kỳ hiệu suất", code: "KPI_REVIEW" },

  // 7. Hệ thống & Quản trị
  { id: "sys_users", category: "Hệ thống & Quản trị", resource: "Quản lý tài khoản người dùng", code: "SYS_USERS" },
  { id: "sys_rbac", category: "Hệ thống & Quản trị", resource: "Phân quyền & Vai trò (RBAC)", code: "SYS_ROLES" },
  { id: "sys_audit", category: "Hệ thống & Quản trị", resource: "Nhật ký hệ thống (Audit Log)", code: "SYS_AUDIT_LOG" },
];

function generateRolePermissions(roleCode: string): PermissionItem[] {
  return BASE_PERMISSIONS.map((base) => {
    switch (roleCode) {
      case "SUPER_ADMIN":
        return {
          ...base,
          view: true,
          viewScope: "ALL",
          create: true,
          edit: true,
          delete: true,
          approve: true,
          export: true,
        };
      case "EXECUTIVE":
        return {
          ...base,
          view: true,
          viewScope: "ALL",
          create: false,
          edit: false,
          delete: false,
          approve: true,
          export: true,
        };
      case "HR_DIRECTOR":
        return {
          ...base,
          view: true,
          viewScope: "ALL",
          create: base.category.includes("Nhân sự") || base.category.includes("Tuyển dụng") || base.category.includes("Chấm công"),
          edit: base.category.includes("Nhân sự") || base.category.includes("Tuyển dụng") || base.category.includes("Chấm công"),
          delete: base.category.includes("Nhân sự"),
          approve: true,
          export: true,
        };
      case "MANAGER":
        return {
          ...base,
          view: !base.category.includes("Hệ thống"),
          viewScope: "DEPARTMENT",
          create: base.code === "TIME_LEAVE" || base.code === "REC_JOB_POSTING" || base.code === "KPI_TARGET",
          edit: base.code === "TIME_LEAVE" || base.code === "KPI_REVIEW",
          delete: false,
          approve: base.code === "TIME_LEAVE" || base.code === "TIME_ATTENDANCE" || base.code === "KPI_REVIEW",
          export: base.category.includes("Chấm công") || base.category.includes("Đánh giá"),
        };
      case "ACCOUNTANT":
        return {
          ...base,
          view: base.category.includes("Tiền lương") || base.category.includes("Chấm công") || base.code === "HR_EMPLOYEE",
          viewScope: "ALL",
          create: base.category.includes("Tiền lương"),
          edit: base.category.includes("Tiền lương"),
          delete: false,
          approve: base.code === "PAYROLL_ADVANCE",
          export: true,
        };
      case "EMPLOYEE":
        return {
          ...base,
          view: base.code === "HR_EMPLOYEE" || base.code === "TIME_ATTENDANCE" || base.code === "TIME_LEAVE" || base.code === "PAYROLL_SHEET" || base.code === "KPI_TARGET",
          viewScope: "OWN",
          create: base.code === "TIME_LEAVE",
          edit: base.code === "TIME_LEAVE",
          delete: false,
          approve: false,
          export: base.code === "PAYROLL_SHEET",
        };
      case "LEGAL_OFFICER":
        return {
          ...base,
          view: base.category.includes("Cơ cấu") || base.code === "HR_CONTRACT" || base.code === "HR_DISCIPLINE",
          viewScope: "ALL",
          create: base.code === "HR_DISCIPLINE",
          edit: base.code === "HR_CONTRACT",
          delete: false,
          approve: base.code === "HR_CONTRACT",
          export: true,
        };
      default:
        return {
          ...base,
          view: true,
          viewScope: "DEPARTMENT",
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: false,
        };
    }
  });
}

const INITIAL_ROLES: SystemRole[] = [
  {
    id: "r_super",
    name: "Super Admin",
    code: "SUPER_ADMIN",
    description: "Toàn quyền quản trị hệ thống, cấu hình tham số và thiết lập bảo mật tối cao",
    isSystem: true,
    assignedUsersCount: 2,
    permissions: generateRolePermissions("SUPER_ADMIN"),
  },
  {
    id: "r_exec",
    name: "Executive / Ban Giám Đốc",
    code: "EXECUTIVE",
    description: "Phê duyệt các quyết sách nhân sự cấp cao, xem báo cáo tổng hợp toàn tập đoàn",
    isSystem: true,
    assignedUsersCount: 4,
    permissions: generateRolePermissions("EXECUTIVE"),
  },
  {
    id: "r_hrd",
    name: "HR Director",
    code: "HR_DIRECTOR",
    description: "Quản trị toàn bộ vòng đời nhân sự, tuyển dụng, tiền lương và cơ cấu tổ chức",
    isSystem: false,
    assignedUsersCount: 3,
    permissions: generateRolePermissions("HR_DIRECTOR"),
  },
  {
    id: "r_mgr",
    name: "Department Manager",
    code: "MANAGER",
    description: "Quản lý nhân viên trực thuộc phòng ban, duyệt nghỉ phép, phân ca và đánh giá KPI",
    isSystem: true,
    assignedUsersCount: 28,
    permissions: generateRolePermissions("MANAGER"),
  },
  {
    id: "r_acc",
    name: "Kế toán / Accountant",
    code: "ACCOUNTANT",
    description: "Quản trị kỳ tính lương, kiểm tra bảng công, tạm ứng và chi trả thu nhập",
    isSystem: true,
    assignedUsersCount: 6,
    permissions: generateRolePermissions("ACCOUNTANT"),
  },
  {
    id: "r_emp",
    name: "Nhân viên (ESS)",
    code: "EMPLOYEE",
    description: "Cổng tự phục vụ của nhân viên: xem phiếu lương, tạo đơn nghỉ phép, xem lịch làm việc",
    isSystem: true,
    assignedUsersCount: 450,
    permissions: generateRolePermissions("EMPLOYEE"),
  },
  {
    id: "r_legal",
    name: "Chuyên viên Pháp chế",
    code: "LEGAL_OFFICER",
    description: "Kiểm tra tính tuân thủ pháp lý của hợp đồng, nội quy lao động và cảnh báo rủi ro",
    isSystem: false,
    assignedUsersCount: 4,
    permissions: generateRolePermissions("LEGAL_OFFICER"),
  },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<SystemRole[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("r_mgr");
  const [searchRole, setSearchRole] = useState("");
  const [searchResource, setSearchResource] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [cloneFromRoleId, setCloneFromRoleId] = useState("r_emp");

  // Selected Role Object
  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // Filtered Roles (Left Column)
  const filteredRoles = useMemo(() => {
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(searchRole.toLowerCase()) ||
        r.code.toLowerCase().includes(searchRole.toLowerCase()) ||
        r.description.toLowerCase().includes(searchRole.toLowerCase())
    );
  }, [roles, searchRole]);

  // Filtered Permissions (Right Column Matrix)
  const filteredPermissions = useMemo(() => {
    if (!selectedRole) return [];
    return selectedRole.permissions.filter((p) => {
      const matchText =
        p.resource.toLowerCase().includes(searchResource.toLowerCase()) ||
        p.code.toLowerCase().includes(searchResource.toLowerCase()) ||
        p.category.toLowerCase().includes(searchResource.toLowerCase());
      const matchCategory = selectedCategory === "ALL" || p.category === selectedCategory;
      return matchText && matchCategory;
    });
  }, [selectedRole, searchResource, selectedCategory]);

  // Distinct Categories for Filter Tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    BASE_PERMISSIONS.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, []);

  // Update specific permission action
  const handleToggleAction = (
    permId: string,
    action: "view" | "create" | "edit" | "delete" | "approve" | "export"
  ) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const updatedPerms = role.permissions.map((p) => {
          if (p.id !== permId) return p;
          const nextVal = !p[action];
          // If turning off view, auto unset viewScope to NONE or keep
          return {
            ...p,
            [action]: nextVal,
          };
        });
        return { ...role, permissions: updatedPerms };
      })
    );
  };

  // Update view data scope
  const handleScopeChange = (permId: string, scope: DataScope) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const updatedPerms = role.permissions.map((p) => {
          if (p.id !== permId) return p;
          return {
            ...p,
            viewScope: scope,
            view: scope !== "NONE",
          };
        });
        return { ...role, permissions: updatedPerms };
      })
    );
  };

  // Toggle entire column across filtered items
  const handleToggleColumn = (action: "view" | "create" | "edit" | "delete" | "approve" | "export") => {
    const allChecked = filteredPermissions.every((p) => p[action]);
    const nextVal = !allChecked;

    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const targetIds = new Set(filteredPermissions.map((fp) => fp.id));
        const updatedPerms = role.permissions.map((p) => {
          if (!targetIds.has(p.id)) return p;
          return { ...p, [action]: nextVal };
        });
        return { ...role, permissions: updatedPerms };
      })
    );
    toast.success(nextVal ? `Đã bật tất cả quyền [${action.toUpperCase()}]` : `Đã tắt tất cả quyền [${action.toUpperCase()}]`);
  };

  // Toggle entire row for a resource
  const handleToggleRow = (permId: string) => {
    const item = selectedRole.permissions.find((p) => p.id === permId);
    if (!item) return;
    const allActive = item.view && item.create && item.edit && item.delete && item.approve && item.export;
    const nextVal = !allActive;

    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const updatedPerms = role.permissions.map((p) => {
          if (p.id !== permId) return p;
          return {
            ...p,
            view: nextVal,
            create: nextVal,
            edit: nextVal,
            delete: nextVal,
            approve: nextVal,
            export: nextVal,
          };
        });
        return { ...role, permissions: updatedPerms };
      })
    );
  };

  // Batch actions
  const handleSelectAll = (selectAll: boolean) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== selectedRoleId) return role;
        const updatedPerms = role.permissions.map((p) => ({
          ...p,
          view: selectAll,
          create: selectAll,
          edit: selectAll,
          delete: selectAll,
          approve: selectAll,
          export: selectAll,
        }));
        return { ...role, permissions: updatedPerms };
      })
    );
    toast.success(selectAll ? "Đã bật toàn bộ quyền hạn" : "Đã bỏ chọn toàn bộ quyền hạn");
  };

  // Save current role matrix
  const handleSaveMatrix = () => {
    toast.success(`Đã lưu cấu hình ma trận phân quyền cho vai trò [${selectedRole.name}] thành công!`);
  };

  // Create new role
  const handleCreateRole = () => {
    if (!newRoleName.trim() || !newRoleCode.trim()) {
      toast.error("Vui lòng nhập tên và mã vai trò");
      return;
    }
    const templateRole = roles.find((r) => r.id === cloneFromRoleId) || roles[0];
    const newId = `r_custom_${Date.now()}`;
    const newRole: SystemRole = {
      id: newId,
      name: newRoleName.trim(),
      code: newRoleCode.trim().toUpperCase(),
      description: newRoleDesc.trim() || "Vai trò người dùng tùy chỉnh trong hệ thống",
      isSystem: false,
      assignedUsersCount: 0,
      permissions: JSON.parse(JSON.stringify(templateRole.permissions)),
    };
    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleId(newId);
    setCreateRoleModalOpen(false);
    setNewRoleName("");
    setNewRoleCode("");
    setNewRoleDesc("");
    toast.success(`Đã tạo vai trò mới: ${newRole.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header & Breadcrumb ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Vai trò & Phân quyền Hệ thống
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              RBAC MATRIX
            </Badge>
          </div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Hệ thống & Cấu hình
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Vai trò & Phân quyền</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => handleSelectAll(false)}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>Reset quyền</span>
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
            onClick={handleSaveMatrix}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            <span>Lưu phân quyền</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Two-Column Layout (Left: Roles List, Right: Permission Matrix) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── 2.1. CỘT TRÁI: DANH SÁCH VAI TRÒ (4 Cols) ────────────────── */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="p-4 border-b border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold">Danh sách Vai trò</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs font-mono font-medium">
                  {filteredRoles.length} vai trò
                </Badge>
              </div>

              {/* Search Roles */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm vai trò, mã code..."
                  value={searchRole}
                  onChange={(e) => setSearchRole(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </CardHeader>

            <CardContent className="p-2 space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredRoles.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all cursor-pointer relative flex flex-col gap-1.5",
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-2xs ring-1 ring-primary"
                        : "border-border bg-card hover:bg-muted/50 hover:border-border/80"
                    )}
                  >
                    {/* Top Row: Icon + Name + Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-md flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {role.isSystem ? (
                            <Lock className="h-3.5 w-3.5" />
                          ) : (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "font-semibold text-xs truncate leading-snug",
                              isSelected ? "text-primary" : "text-foreground"
                            )}
                          >
                            {role.name}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {role.code}
                          </div>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 border",
                          role.isSystem
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        )}
                      >
                        {role.isSystem ? "Hệ thống" : "Tùy chỉnh"}
                      </span>
                    </div>

                    {/* Middle: Short Description */}
                    <p className="text-[11px] text-muted-foreground line-clamp-1 leading-normal">
                      {role.description}
                    </p>

                    {/* Bottom: User Count */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{role.assignedUsersCount} người dùng</span>
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-primary flex items-center gap-0.5">
                          Đang chọn <Check className="h-3 w-3 inline" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredRoles.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  Không tìm thấy vai trò phù hợp
                </div>
              )}
            </CardContent>

            <div className="p-3 border-t border-border bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs border-dashed"
                onClick={() => setCreateRoleModalOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span>Thêm vai trò mới</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* ── 2.2. CỘT PHẢI: MA TRẬN PHÂN QUYỀN TƯƠNG ỨNG (8 Cols) ──────── */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-4">
          {/* Header Info Panel của Vai Trò Được Chọn */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="p-4 sm:p-5 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-foreground">
                          {selectedRole.name}
                        </h2>
                        <Badge variant="outline" className="font-mono text-[11px]">
                          {selectedRole.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedRole.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleSelectAll(true)}
                  >
                    <CheckSquare className="h-3 w-3 mr-1 text-primary" />
                    <span>Chọn tất cả</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleSelectAll(false)}
                  >
                    <Square className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>Bỏ tất cả</span>
                  </Button>
                </div>
              </div>

              {/* Filter Row: Category Tabs + Search input */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border mt-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <Button
                    size="sm"
                    variant={selectedCategory === "ALL" ? "default" : "outline"}
                    className={cn(
                      "h-7 text-xs px-2.5",
                      selectedCategory === "ALL" && "bg-primary text-white hover:bg-primary/90"
                    )}
                    onClick={() => setSelectedCategory("ALL")}
                  >
                    Tất cả ({selectedRole.permissions.length})
                  </Button>
                  {categories.map((cat) => {
                    const count = selectedRole.permissions.filter((p) => p.category === cat).length;
                    const isCurrent = selectedCategory === cat;
                    return (
                      <Button
                        key={cat}
                        size="sm"
                        variant={isCurrent ? "default" : "outline"}
                        className={cn(
                          "h-7 text-xs px-2.5",
                          isCurrent && "bg-primary text-white hover:bg-primary/90"
                        )}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat} ({count})
                      </Button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-56 shrink-0">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Lọc tài nguyên, mã..."
                    value={searchResource}
                    onChange={(e) => setSearchResource(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              </div>
            </CardHeader>

            {/* Permission Matrix Table */}
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="py-2.5 px-4 font-semibold text-foreground w-[28%]">
                      Chức năng / Nghiệp vụ
                    </th>
                    <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                      <div
                        onClick={() => handleToggleColumn("view")}
                        className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                        title="Nhấp để bật/tắt toàn bộ cột Xem"
                      >
                        <span>Xem (View)</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                      <div
                        onClick={() => handleToggleColumn("create")}
                        className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                        title="Nhấp để bật/tắt toàn bộ cột Tạo mới"
                      >
                        <span>Tạo mới</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                      <div
                        onClick={() => handleToggleColumn("edit")}
                        className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                        title="Nhấp để bật/tắt toàn bộ cột Chỉnh sửa"
                      >
                        <span>Sửa</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                      <div
                        onClick={() => handleToggleColumn("delete")}
                        className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                        title="Nhấp để bật/tắt toàn bộ cột Xóa"
                      >
                        <span>Xóa</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                      <div
                        onClick={() => handleToggleColumn("approve")}
                        className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                        title="Nhấp để bật/tắt toàn bộ cột Phê duyệt"
                      >
                        <span>Phê duyệt</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                      <div
                        onClick={() => handleToggleColumn("export")}
                        className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                        title="Nhấp để bật/tắt toàn bộ cột Xuất file"
                      >
                        <span>Xuất DL</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPermissions.map((row) => {
                    const anyChecked =
                      row.view || row.create || row.edit || row.delete || row.approve || row.export;
                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          "hover:bg-muted/50 transition-colors",
                          anyChecked ? "bg-card" : "bg-muted/10 opacity-70"
                        )}
                      >
                        {/* Resource Column */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="font-semibold text-foreground text-xs leading-snug">
                                {row.resource}
                              </div>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-primary font-medium">{row.code}</span>
                                <span>•</span>
                                <span>{row.category}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-primary"
                              onClick={() => handleToggleRow(row.id)}
                              title="Bật/Tắt tất cả quyền cho mục này"
                            >
                              Cả dòng
                            </Button>
                          </div>
                        </td>

                        {/* 1. View Checkbox + Scope Selector */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <input
                              type="checkbox"
                              checked={row.view}
                              onChange={() => handleToggleAction(row.id, "view")}
                              style={{ accentColor: "#DC2626" }}
                              className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                            />
                            {row.view && (
                              <select
                                value={row.viewScope}
                                onChange={(e) => handleScopeChange(row.id, e.target.value as DataScope)}
                                className="h-5 px-1 text-[10px] font-mono rounded border border-border bg-background text-foreground focus:border-primary focus:outline-none"
                              >
                                <option value="ALL">Toàn ty</option>
                                <option value="DEPARTMENT">Phòng ban</option>
                                <option value="TEAM">Nhóm</option>
                                <option value="OWN">Cá nhân</option>
                              </select>
                            )}
                          </div>
                        </td>

                        {/* 2. Create Checkbox (Red) */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.create}
                            onChange={() => handleToggleAction(row.id, "create")}
                            style={{ accentColor: "#DC2626" }}
                            className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                          />
                        </td>

                        {/* 3. Edit Checkbox (Red) */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.edit}
                            onChange={() => handleToggleAction(row.id, "edit")}
                            style={{ accentColor: "#DC2626" }}
                            className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                          />
                        </td>

                        {/* 4. Delete Checkbox (Red) */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.delete}
                            onChange={() => handleToggleAction(row.id, "delete")}
                            style={{ accentColor: "#DC2626" }}
                            className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                          />
                        </td>

                        {/* 5. Approve Checkbox (Red) */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.approve}
                            onChange={() => handleToggleAction(row.id, "approve")}
                            style={{ accentColor: "#DC2626" }}
                            className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                          />
                        </td>

                        {/* 6. Export Checkbox (Red) */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={row.export}
                            onChange={() => handleToggleAction(row.id, "export")}
                            style={{ accentColor: "#DC2626" }}
                            className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredPermissions.length === 0 && (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  Không tìm thấy tài nguyên nào phù hợp bộ lọc
                </div>
              )}
            </CardContent>

            {/* Footer Summary & Save */}
            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                <span>
                  Đang hiển thị <strong className="text-foreground">{filteredPermissions.length}</strong> chức năng phân quyền cho vai trò{" "}
                  <strong className="text-foreground">{selectedRole.name}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={handleSaveMatrix}
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  <span>Lưu cấu hình quyền</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── 3. Dialog Thêm Vai Trò Mới ───────────────────────────────── */}
      <Dialog open={createRoleModalOpen} onOpenChange={setCreateRoleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Thêm Vai trò Mới vào Hệ thống</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground block">
                Tên vai trò *
              </label>
              <Input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="VD: Trưởng Nhóm Dự Án (Tech Lead)"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground block">
                Mã định danh vai trò (Role Code) *
              </label>
              <Input
                value={newRoleCode}
                onChange={(e) => setNewRoleCode(e.target.value)}
                placeholder="VD: TECH_LEAD"
                className="h-8 text-xs font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground block">
                Kế thừa cấu hình quyền ban đầu từ
              </label>
              <select
                value={cloneFromRoleId}
                onChange={(e) => setCloneFromRoleId(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground block">
                Mô tả trách nhiệm & phạm vi
              </label>
              <textarea
                rows={2}
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                placeholder="Ghi chú tóm tắt trách nhiệm của vai trò này..."
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setCreateRoleModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
              onClick={handleCreateRole}
            >
              Khởi tạo vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
