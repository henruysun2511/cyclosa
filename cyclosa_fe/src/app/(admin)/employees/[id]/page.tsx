"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  Users,
  FileText,
  CreditCard,
  History,
  CheckCircle2,
  Copy,
  Check,
  Edit,
  Award,
  Clock,
  MapPin,
  ChevronRight,
  Download,
  Plus,
  Trash2,
  Scan,
  Coins,
  FileBadge,
  HeartHandshake,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetEmployeeByIdQuery,
  useGetDirectReportsQuery,
  useConfirmOfficialMutation,
  useDeleteIdentityDocumentMutation,
  useDeleteDependentMutation,
  useDeleteEmergencyContactMutation,
  useRevokeFaceEnrollmentMutation,
} from "@/features/employee/api/employee-api";
import {
  EMPLOYEE_STATUS_LABELS,
  EMPLOYEE_STATUS_VARIANTS,
  EMPLOYMENT_TYPE_LABELS,
  GENDER_LABELS,
} from "@/features/employee/constants/employee.constants";
import type {
  IdentityDocument,
  Dependent,
  EmergencyContact,
  EmployeeStatus,
} from "@/features/employee/types/employee.types";

import { EmployeeFormDialog } from "@/features/employee/components/dialogs/employee-form-dialog";
import { WorkAssignmentDialog } from "@/features/employee/components/dialogs/work-assignment-dialog";
import { IdentityDocumentDialog } from "@/features/employee/components/dialogs/identity-document-dialog";
import { BankAccountDialog } from "@/features/employee/components/dialogs/bank-account-dialog";
import { DependentDialog } from "@/features/employee/components/dialogs/dependent-dialog";
import { EmergencyContactDialog } from "@/features/employee/components/dialogs/emergency-contact-dialog";
import { StatusChangeDialog } from "@/features/employee/components/dialogs/status-change-dialog";
import { ProbationEvaluationDialog } from "@/features/employee/components/dialogs/probation-evaluation-dialog";

interface PageProps {
  params: Promise<{ id: string }>;
}

function calculateTenure(startDate?: string | null): string {
  if (!startDate) return "Chưa xác định";
  const start = new Date(startDate);
  const now = new Date();
  if (isNaN(start.getTime())) return "Chưa xác định";

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0 && months > 0) return `${years} năm ${months} tháng`;
  if (years > 0) return `${years} năm`;
  if (months > 0) return `${months} tháng`;
  return "Dưới 1 tháng";
}

export default function EmployeeDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const employeeId = resolvedParams.id;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "overview" | "personal" | "assignments" | "family" | "lifecycle" | "face"
  >("overview");

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Queries
  const {
    data: employee,
    isLoading,
    isError,
    refetch,
  } = useGetEmployeeByIdQuery(employeeId, {
    skip: !employeeId,
  });

  const { data: directReports = [] } = useGetDirectReportsQuery(employeeId, {
    skip: !employeeId,
  });

  // Mutations
  const [confirmOfficial, { isLoading: isConfirming }] = useConfirmOfficialMutation();
  const [deleteDoc] = useDeleteIdentityDocumentMutation();
  const [deleteDep] = useDeleteDependentMutation();
  const [deleteContact] = useDeleteEmergencyContactMutation();
  const [revokeFace, { isLoading: isRevokingFace }] = useRevokeFaceEnrollmentMutation();

  // Sub-dialog states
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openWorkAssignment, setOpenWorkAssignment] = useState(false);
  const [openIdentityDoc, setOpenIdentityDoc] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<IdentityDocument | null>(null);
  const [openBankAccount, setOpenBankAccount] = useState(false);
  const [openDependent, setOpenDependent] = useState(false);
  const [selectedDependent, setSelectedDependent] = useState<Dependent | null>(null);
  const [openEmergencyContact, setOpenEmergencyContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [openStatusChange, setOpenStatusChange] = useState(false);
  const [openProbationEval, setOpenProbationEval] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Đã sao chép ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmOfficial = async () => {
    if (!employeeId) return;
    try {
      await confirmOfficial(employeeId).unwrap();
      toast.success("Đã phê duyệt chuyển nhân viên sang trạng thái Chính thức (ACTIVE)!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể chuyển chính thức!");
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giấy tờ định danh này?")) return;
    try {
      await deleteDoc(id).unwrap();
      toast.success("Đã xóa giấy tờ định danh!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa giấy tờ định danh!");
    }
  };

  const handleDeleteDependent = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người phụ thuộc này?")) return;
    try {
      await deleteDep(id).unwrap();
      toast.success("Đã xóa người phụ thuộc!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa người phụ thuộc!");
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa liên hệ khẩn cấp này?")) return;
    try {
      await deleteContact(id).unwrap();
      toast.success("Đã xóa người liên hệ khẩn cấp!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa liên hệ khẩn cấp!");
    }
  };

  const handleRevokeFace = async (enrollmentId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn thu hồi dữ liệu khuôn mặt sinh trắc học này?"))
      return;
    try {
      await revokeFace({
        enrollmentId,
        body: { reason: "Thu hồi theo yêu cầu của quản trị viên" },
      }).unwrap();
      toast.success("Đã thu hồi dữ liệu khuôn mặt!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể thu hồi dữ liệu khuôn mặt!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải hồ sơ nhân sự 360°...</p>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 text-center space-y-4 border rounded-xl bg-card shadow-xs">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Không tìm thấy hồ sơ nhân viên
          </h2>
          <p className="text-xs text-muted-foreground">
            Nhân viên không tồn tại hoặc bạn không có quyền truy cập hồ sơ này.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Link href="/employees">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials =
    `${employee.lastName?.charAt(0) || ""}${employee.firstName?.charAt(0) || "NV"}`.toUpperCase() ||
    "NV";

  const statusVariant =
    EMPLOYEE_STATUS_VARIANTS[employee.currentStatus] || EMPLOYEE_STATUS_VARIANTS.ACTIVE;

  const tenure = calculateTenure(employee.startDate);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── 1. Top Header & Điều hướng ───────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 -ml-1 text-slate-500">
              <Link href="/employees" title="Quay lại danh sách">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <span>Hồ sơ Chi tiết Nhân sự: {employee.fullName}</span>
              </h1>
              <Badge
                variant="outline"
                className="bg-card font-mono text-xs border-border text-foreground font-semibold px-2.5 py-0.5"
              >
                {employee.employeeCode}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs font-semibold px-2.5 py-0.5", statusVariant.className)}
              >
                ● {statusVariant.label}
              </Badge>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 ml-10">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/employees" className="hover:text-primary transition-colors">
              Danh sách nhân sự
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium font-mono">
              {employee.employeeCode}
            </span>
          </nav>
        </div>
      </div>

      {/* ── 2. Executive Profile Header Card ──────────────────────────── */}
      <div className="relative rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
        {/* Top subtle brand accent line */}
        <div className="h-1.5 bg-primary w-full" />

        <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Avatar block */}
            <div className="relative group shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden ring-4 ring-background shadow-md bg-muted flex items-center justify-center relative border border-border">
                {employee.portraitUrl ? (
                  <img
                    src={employee.portraitUrl}
                    alt={employee.fullName}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-3xl bg-primary/10 text-primary">
                    {initials}
                  </div>
                )}
              </div>

              {/* Online status indicator */}
              <span className="absolute bottom-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-background"></span>
              </span>
            </div>

            {/* Profile info block */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {employee.fullName}
                </h1>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs font-bold bg-muted text-foreground px-2 py-0.5 border border-border"
                >
                  {employee.employeeCode}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-xs font-semibold px-2 py-0.5", statusVariant.className)}
                >
                  {statusVariant.label}
                </Badge>
                {employee.currentJobLevelName && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2 py-0.5">
                    {employee.currentJobLevelName}
                  </Badge>
                )}
              </div>

              {/* Roles & Organization (3 Dimensions) */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  {employee.currentJobTitleName || "Chuyên viên"}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  {employee.currentDepartmentName || "Phòng ban chung"}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {employee.currentBranchName || "Trụ sở chính"}
                </span>
              </div>

              {/* Quick Contact & Metadata */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {employee.personalEmail && (
                  <button
                    type="button"
                    onClick={() => handleCopy(employee.personalEmail!, "Email")}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground border border-border transition-colors font-mono text-xs cursor-pointer group"
                    title="Nhấp để sao chép Email"
                  >
                    <Mail className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                    <span>{employee.personalEmail}</span>
                    {copiedField === "Email" ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                )}

                {employee.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(employee.phone, "Số điện thoại")}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-foreground border border-border transition-colors font-mono text-xs cursor-pointer group"
                    title="Nhấp để sao chép Số điện thoại"
                  >
                    <Phone className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                    <span>{employee.phone}</span>
                    {copiedField === "Số điện thoại" ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                )}

                {employee.currentManagerName && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border text-xs">
                    <User className="h-3 w-3 text-primary" />
                    <span>
                      Quản lý: <strong className="text-foreground">{employee.currentManagerName}</strong>
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2.5 lg:self-center shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-9 text-xs border-border text-foreground hover:bg-muted font-medium gap-1.5"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>In hồ sơ</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenEditProfile(true)}
              className="h-9 text-xs border-border text-foreground hover:bg-muted font-medium gap-1.5"
            >
              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Sửa lý lịch</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setOpenWorkAssignment(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9 shadow-xs font-semibold px-3.5 gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Bổ nhiệm / Điều chuyển</span>
            </Button>

            {employee.currentStatus === "PROBATION" && (
              <Button
                size="sm"
                onClick={handleConfirmOfficial}
                disabled={isConfirming}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 shadow-xs font-semibold px-3.5 gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isConfirming ? "Đang xử lý..." : "Chuyển chính thức"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* ── 3. Executive Metric Bar (4 KPI Cards) ────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border divide-x divide-y lg:divide-y-0 divide-border bg-muted/20">
          {/* Thâm niên */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Thâm niên công tác</span>
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {tenure}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Từ ngày {employee.startDate || "---"}
            </p>
          </div>

          {/* Vị trí & Cấp bậc */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Chức danh & Cấp bậc</span>
              <Award className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
              {employee.currentJobTitleName || "Chuyên viên"}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {employee.currentJobLevelName || "Bậc tiêu chuẩn"}
            </p>
          </div>

          {/* Hình thức làm việc */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Hình thức làm việc</span>
              <Briefcase className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {employee.currentEmploymentType
                ? EMPLOYMENT_TYPE_LABELS[employee.currentEmploymentType] ||
                  employee.currentEmploymentType
                : "Chính thức (Full-time)"}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {EMPLOYEE_STATUS_LABELS[employee.currentStatus] || employee.currentStatus}
            </p>
          </div>

          {/* Hồ sơ đính kèm & Giảm trừ */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium mb-1">
              <span>Người phụ thuộc & Pháp lý</span>
              <HeartHandshake className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {employee.dependents?.length || 0} người phụ thuộc
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {employee.identityDocuments?.length || 0} giấy tờ định danh
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Sub Navigation Tabs ──────────────────────────────────── */}
      <div className="flex border-b border-border gap-2 sm:gap-6 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={cn(
            "pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer",
            activeTab === "overview"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-4 w-4" />
          <span>Tổng quan 360°</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={cn(
            "pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer",
            activeTab === "personal"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <CreditCard className="h-4 w-4" />
          <span>Hồ sơ pháp lý & Tài chính</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assignments")}
          className={cn(
            "pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer",
            activeTab === "assignments"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="h-4 w-4" />
          <span>Lịch sử bổ nhiệm (3 chiều)</span>
          <Badge variant="secondary" className="text-[10px] font-mono h-4.5 px-1.5">
            {employee.workAssignments?.length || 0}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("family")}
          className={cn(
            "pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer",
            activeTab === "family"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <HeartHandshake className="h-4 w-4" />
          <span>Người phụ thuộc & Khẩn cấp</span>
          <Badge variant="secondary" className="text-[10px] font-mono h-4.5 px-1.5">
            {(employee.dependents?.length || 0) + (employee.emergencyContacts?.length || 0)}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("lifecycle")}
          className={cn(
            "pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer",
            activeTab === "lifecycle"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Vòng đời & Thử việc</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("face")}
          className={cn(
            "pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer",
            activeTab === "face"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Scan className="h-4 w-4" />
          <span>Sinh trắc học Face ID</span>
          {employee.faceEnrollment && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* ── 5. Nội dung Tab chi tiết ─────────────────────────────────── */}

      {/* TAB 1: TỔNG QUAN 360° */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái (2 cột) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vị trí & Cơ cấu tổ chức 3 chiều */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">
                    Thông tin Vị trí & Cơ cấu Tổ chức (Bộ 3 Chiều)
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenWorkAssignment(true)}
                  className="h-7 text-xs gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Điều chuyển
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-0.5">
                      Chiều 3: Chức danh chuyên môn
                    </span>
                    <strong className="text-foreground font-semibold text-sm">
                      {employee.currentJobTitleName || "Chưa thiết lập"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-0.5">
                      Chiều 1: Phòng ban / Đơn vị
                    </span>
                    <strong className="text-foreground font-semibold text-sm">
                      {employee.currentDepartmentName || "Chưa thiết lập"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-0.5">
                      Chiều 2: Chi nhánh / Địa điểm làm việc
                    </span>
                    <span className="text-foreground font-medium">
                      {employee.currentBranchName || "Trụ sở chính"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-0.5">
                      Cấp bậc / Khung bậc chức danh
                    </span>
                    <span className="text-foreground font-medium">
                      {employee.currentJobLevelName || "Tiêu chuẩn"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-0.5">
                      Hình thức lao động
                    </span>
                    <span className="text-foreground font-medium">
                      {employee.currentEmploymentType
                        ? EMPLOYMENT_TYPE_LABELS[employee.currentEmploymentType] ||
                          employee.currentEmploymentType
                        : "Chính thức (Full-time)"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-0.5">
                      Cấp trên trực tiếp (Báo cáo cho)
                    </span>
                    <span className="text-foreground font-semibold">
                      {employee.currentManagerName || "Ban Giám đốc"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin cá nhân & cư trú */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">
                    Thông tin Cá nhân & Nơi cư trú
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenEditProfile(true)}
                  className="h-7 text-xs gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Chỉnh sửa
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Họ và tên:</span>
                    <strong className="text-foreground">{employee.fullName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Ngày sinh:</span>
                    <span className="font-mono text-foreground font-medium">
                      {employee.dateOfBirth}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Giới tính:</span>
                    <span className="text-foreground font-medium">
                      {GENDER_LABELS[employee.gender] || employee.gender}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <span className="font-mono text-foreground font-medium">
                      {employee.phone}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border sm:col-span-2">
                    <span className="text-muted-foreground">Email cá nhân:</span>
                    <span className="font-mono text-foreground font-medium">
                      {employee.personalEmail || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border sm:col-span-2">
                    <span className="text-muted-foreground">Địa chỉ thường trú / Chỗ ở hiện nay:</span>
                    <span className="text-foreground font-medium text-right max-w-md">
                      {employee.address || "Chưa cập nhật địa chỉ"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cột phải (1 cột): Đội ngũ báo cáo trực tiếp & Thống kê nhanh */}
          <div className="space-y-6">
            {/* Direct Reports Card */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">
                    Cấp dưới trực tiếp ({directReports.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border max-h-[360px] overflow-y-auto">
                {directReports.map((sub) => {
                  const subInitials =
                    `${sub.lastName?.charAt(0) || ""}${sub.firstName?.charAt(0) || "NV"}`.toUpperCase() ||
                    "NV";
                  return (
                    <div
                      key={sub.id}
                      className="p-3.5 flex items-center justify-between hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {subInitials}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/employees/${sub.id}`}
                            className="font-semibold text-foreground text-xs hover:text-primary transition-colors block truncate"
                          >
                            {sub.fullName}
                          </Link>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {sub.currentJobTitleName || "Nhân viên"} • {sub.employeeCode}
                          </p>
                        </div>
                      </div>

                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <Link href={`/employees/${sub.id}`} title="Xem hồ sơ">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}

                {directReports.length === 0 && (
                  <p className="p-6 text-xs text-muted-foreground italic text-center">
                    Không có nhân sự nào báo cáo trực tiếp.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Trạng thái thử việc / Hợp đồng */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-4 px-6 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Mốc thời gian quan trọng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Ngày tiếp nhận vào làm:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {employee.startDate}
                  </span>
                </div>
                {employee.probationEndDate && (
                  <div className="flex justify-between items-center py-1 border-b border-border">
                    <span className="text-muted-foreground">Ngày kết thúc thử việc:</span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {employee.probationEndDate}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Trạng thái hiện tại:</span>
                  <Badge variant="outline" className={statusVariant.className}>
                    {statusVariant.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: HỒ SƠ PHÁP LÝ & TÀI CHÍNH */}
      {activeTab === "personal" && (
        <div className="space-y-6">
          {/* Giấy tờ định danh */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileBadge className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Giấy tờ Định danh cá nhân (CCCD / Hộ chiếu)
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedDoc(null);
                  setOpenIdentityDoc(true);
                }}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Thêm giấy tờ
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.identityDocuments?.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs relative group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-semibold">
                        {doc.documentType === "CITIZEN_ID" ? "Căn cước công dân (CCCD)" : "Hộ chiếu (Passport)"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setOpenIdentityDoc(true);
                          }}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Sửa"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          title="Xóa"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold font-mono text-foreground">
                        {doc.documentNumber}
                      </p>
                      <p className="text-muted-foreground">
                        Ngày cấp: <span className="font-mono text-foreground">{doc.issueDate}</span>
                        {doc.expiryDate && (
                          <span> • Hết hạn: <span className="font-mono text-foreground">{doc.expiryDate}</span></span>
                        )}
                      </p>
                      <p className="text-muted-foreground">Nơi cấp: {doc.issuePlace}</p>
                    </div>
                  </div>
                ))}

                {(!employee.identityDocuments || employee.identityDocuments.length === 0) && (
                  <p className="text-xs text-muted-foreground italic col-span-2 py-4 text-center">
                    Chưa có giấy tờ định danh nào được cập nhật. Nhấn &quot;Thêm giấy tờ&quot; để bổ sung.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tài khoản ngân hàng & Thuế / BHXH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tài khoản ngân hàng */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <CardTitle className="text-sm font-bold text-foreground">
                    Tài khoản Ngân hàng thụ hưởng
                  </CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpenBankAccount(true)}
                  className="h-7 text-xs gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Cập nhật
                </Button>
              </CardHeader>
              <CardContent className="p-6 text-xs space-y-3">
                {employee.bankAccount ? (
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
                      {employee.bankAccount.bankName}
                    </span>
                    <p className="text-base font-bold font-mono text-foreground">
                      {employee.bankAccount.accountNumber}
                    </p>
                    {employee.bankAccount.bankBranchName && (
                      <p className="text-[11px] text-muted-foreground">
                        Chi nhánh: {employee.bankAccount.bankBranchName}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    Chưa thiết lập tài khoản ngân hàng chi trả lương.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Mã số thuế & BHXH */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-4 px-6 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Mã số Thuế TNCN & Bảo hiểm Xã hội
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-xs space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Mã số thuế cá nhân:</span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {employee.personalTaxCode || "Chưa có MST"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Số sổ BHXH / BHYT:</span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {employee.socialInsuranceNumber || "Chưa cấp sổ"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: LỊCH SỬ BỔ NHIỆM & ĐIỀU CHUYỂN */}
      {activeTab === "assignments" && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                Lịch sử Bổ nhiệm & Luân chuyển Công tác (Bộ 3 Chiều)
              </CardTitle>
            </div>
            <Button
              size="sm"
              onClick={() => setOpenWorkAssignment(true)}
              className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Quyết định bổ nhiệm mới</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {employee.workAssignments?.map((assign, idx) => (
                <div
                  key={assign.id || idx}
                  className={cn(
                    "p-4 rounded-xl border text-xs space-y-2 transition-all",
                    idx === 0
                      ? "border-primary/40 bg-primary/5 shadow-2xs"
                      : "border-border bg-muted/20"
                  )}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-foreground">
                        {assign.jobTitleName || "Chức danh đảm nhiệm"}
                      </strong>
                      {idx === 0 && (
                        <Badge className="bg-primary text-primary-foreground text-[10px]">
                          Hiện tại
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-muted-foreground text-[11px]">
                      Hiệu lực từ: <strong>{assign.effectiveFrom}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-muted-foreground">
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">Phòng ban:</span>
                      <span className="font-medium text-foreground">{assign.departmentName || "---"}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">Chi nhánh:</span>
                      <span className="font-medium text-foreground">{assign.branchName || "---"}</span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-muted-foreground/70">Cấp bậc:</span>
                      <span className="font-medium text-foreground">{assign.jobLevelName || "---"}</span>
                    </div>
                  </div>

                  {assign.changeReason && (
                    <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                      Lý do thay đổi: <span className="italic">{assign.changeReason}</span>
                    </p>
                  )}
                </div>
              ))}

              {(!employee.workAssignments || employee.workAssignments.length === 0) && (
                <p className="text-xs text-muted-foreground italic text-center py-8">
                  Chưa có lịch sử bổ nhiệm công tác nào.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: NGƯỜI PHỤ THUỘC & KHẨN CẤP */}
      {activeTab === "family" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Người phụ thuộc */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Người Phụ thuộc giảm trừ gia cảnh ({employee.dependents?.length || 0})
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedDependent(null);
                  setOpenDependent(true);
                }}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Thêm
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {employee.dependents?.map((dep) => (
                <div
                  key={dep.id}
                  className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{dep.fullName}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {dep.relationship}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Ngày sinh: <span className="font-mono text-foreground">{dep.dateOfBirth}</span>
                      {dep.identityNumber && <span> • CCCD/Mã số: {dep.identityNumber}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedDependent(dep);
                        setOpenDependent(true);
                      }}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDependent(dep.id)}
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {(!employee.dependents || employee.dependents.length === 0) && (
                <p className="text-xs text-muted-foreground italic text-center py-6">
                  Chưa đăng ký người phụ thuộc giảm trừ gia cảnh.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Liên hệ khẩn cấp */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Người Liên hệ Khẩn cấp ({employee.emergencyContacts?.length || 0})
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedContact(null);
                  setOpenEmergencyContact(true);
                }}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Thêm
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {employee.emergencyContacts?.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{c.fullName}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {c.relationship}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-[11px] font-mono">
                      Điện thoại: <strong className="text-foreground">{c.phone}</strong>
                    </p>
                    {c.address && <p className="text-muted-foreground text-[11px]">{c.address}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedContact(c);
                        setOpenEmergencyContact(true);
                      }}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteContact(c.id)}
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {(!employee.emergencyContacts || employee.emergencyContacts.length === 0) && (
                <p className="text-xs text-muted-foreground italic text-center py-6">
                  Chưa có thông tin người liên hệ khẩn cấp.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: VÒNG ĐỜI & THỬ VIỆC */}
      {activeTab === "lifecycle" && (
        <div className="space-y-6">
          {/* Lịch sử trạng thái */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Lịch sử Thay đổi Trạng thái Làm việc
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpenStatusChange(true)}
                className="h-7 text-xs gap-1"
              >
                <Edit className="h-3 w-3" />
                Thay đổi trạng thái
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {employee.statusHistory?.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-semibold",
                            EMPLOYEE_STATUS_VARIANTS[st.status]?.className
                          )}
                        >
                          {EMPLOYEE_STATUS_LABELS[st.status] || st.status}
                        </Badge>
                        <span className="font-mono text-muted-foreground text-[11px]">
                          Áp dụng từ: <strong>{st.effectiveFrom}</strong>
                        </span>
                      </div>
                      {st.note && (
                        <p className="text-muted-foreground text-[11px] mt-1 italic">
                          Ghi chú: {st.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {(!employee.statusHistory || employee.statusHistory.length === 0) && (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    Chưa có lịch sử thay đổi trạng thái.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Đánh giá thử việc */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Đánh giá Thử việc & Xét chuyển Chính thức
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpenProbationEval(true)}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Đánh giá thử việc
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {employee.probationEvaluations?.map((evalItem) => (
                  <div
                    key={evalItem.id}
                    className="p-4 rounded-xl border border-border bg-muted/20 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          evalItem.result === "PASSED"
                            ? "bg-emerald-600 text-white"
                            : evalItem.result === "FAILED"
                            ? "bg-rose-600 text-white"
                            : "bg-amber-600 text-white"
                        }
                      >
                        {evalItem.result === "PASSED"
                          ? "Đạt thử việc (PASSED)"
                          : evalItem.result === "FAILED"
                          ? "Không đạt (FAILED)"
                          : "Kéo dài thử việc (EXTENDED)"}
                      </Badge>
                      <span className="font-mono text-muted-foreground text-[11px]">
                        Ngày đánh giá: {evalItem.evaluationDate}
                      </span>
                    </div>
                    {evalItem.evaluatedByEmployeeName && (
                      <p className="text-muted-foreground text-[11px]">
                        Người đánh giá: <strong>{evalItem.evaluatedByEmployeeName}</strong>
                      </p>
                    )}
                    {evalItem.comment && (
                      <p className="text-foreground text-xs italic bg-background p-2.5 rounded border">
                        {evalItem.comment}
                      </p>
                    )}
                  </div>
                ))}

                {(!employee.probationEvaluations || employee.probationEvaluations.length === 0) && (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    Chưa có đánh giá thử việc nào được ghi nhận.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: SINH TRẮC HỌC FACE ID */}
      {activeTab === "face" && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="py-4 px-6 border-b border-border bg-muted/20">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Scan className="h-4 w-4 text-primary" />
              Đăng ký Khuôn mặt Sinh trắc học (Face ID Chấm công)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {employee.faceEnrollment ? (
              <div className="max-w-xl p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <strong className="text-sm text-foreground">
                      Đã đăng ký nhận diện khuôn mặt
                    </strong>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                    Đang kích hoạt
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Điểm chất lượng mẫu nhận diện:</span>
                    <strong className="text-foreground font-mono">
                      {employee.faceEnrollment.qualityScore}%
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Xác thực tính sống (Liveness):</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                      {employee.faceEnrollment.livenessVerified ? "✓ Đã kiểm định" : "Chưa kiểm định"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời điểm ghi nhận mẫu:</span>
                    <span className="font-mono text-foreground">
                      {new Date(employee.faceEnrollment.enrolledAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokeFace(employee.faceEnrollment!.id)}
                    disabled={isRevokingFace}
                    className="h-8 text-xs"
                  >
                    Thu hồi dữ liệu khuôn mặt
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <Scan className="h-10 w-10 mx-auto text-muted-foreground/40" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">
                    Chưa đăng ký khuôn mặt chấm công
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Nhân viên có thể thực hiện đăng ký khuôn mặt trực tiếp qua ứng dụng di động hoặc camera điểm danh của công ty.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── 6. Sub Dialogs ───────────────────────────────────────────── */}
      {openEditProfile && (
        <EmployeeFormDialog
          open={openEditProfile}
          onOpenChange={setOpenEditProfile}
          companyId={employee.companyId}
          employee={employee}
          onSuccess={() => refetch()}
        />
      )}

      {openWorkAssignment && (
        <WorkAssignmentDialog
          open={openWorkAssignment}
          onOpenChange={setOpenWorkAssignment}
          employeeId={employee.id}
          companyId={employee.companyId}
          onSuccess={() => refetch()}
        />
      )}

      {openIdentityDoc && (
        <IdentityDocumentDialog
          open={openIdentityDoc}
          onOpenChange={setOpenIdentityDoc}
          employeeId={employee.id}
          document={selectedDoc}
          onSuccess={() => refetch()}
        />
      )}

      {openBankAccount && (
        <BankAccountDialog
          open={openBankAccount}
          onOpenChange={setOpenBankAccount}
          employeeId={employee.id}
          bankAccount={employee.bankAccount}
          onSuccess={() => refetch()}
        />
      )}

      {openDependent && (
        <DependentDialog
          open={openDependent}
          onOpenChange={setOpenDependent}
          employeeId={employee.id}
          dependent={selectedDependent}
          onSuccess={() => refetch()}
        />
      )}

      {openEmergencyContact && (
        <EmergencyContactDialog
          open={openEmergencyContact}
          onOpenChange={setOpenEmergencyContact}
          employeeId={employee.id}
          contact={selectedContact}
          onSuccess={() => refetch()}
        />
      )}

      {openStatusChange && (
        <StatusChangeDialog
          open={openStatusChange}
          onOpenChange={setOpenStatusChange}
          employeeId={employee.id}
          currentStatus={employee.currentStatus as EmployeeStatus}
          onSuccess={() => refetch()}
        />
      )}

      {openProbationEval && (
        <ProbationEvaluationDialog
          open={openProbationEval}
          onOpenChange={setOpenProbationEval}
          employeeId={employee.id}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
