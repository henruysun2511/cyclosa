"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Camera,
  History,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Edit3,
  Award,
  Clock,
  MapPin,
  CalendarDays,
  FileCheck2,
  ChevronRight,
  Download,
  UploadCloud,
  FileBadge,
  Sparkles,
  QrCode,
  Scan,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  StatusBadge,
  SensitiveMask,
  EffectiveDatedHistory,
  EffectiveRecord,
} from "@/components/shared";
import { toast } from "sonner";

interface EmployeeProfileData {
  id: string;
  code: string;
  name: string;
  avatar: string;
  fallbackAvatar?: string;
  initials: string;
  avatarBg: string;
  title: string;
  department: string;
  division: string;
  branch: string;
  email: string;
  phone: string;
  startDate: string;
  tenure: string;
  status: "ACTIVE" | "PROBATION" | "SUSPENDED" | "TERMINATED";
  statusLabel: string;
  workType: string;
  manager: string;
  managerRole: string;
  grade: string;
  dob: string;
  gender: string;
  marital: string;
  nationality: string;
  ethnicity: string;
  cccd: string;
  cccdDate: string;
  cccdPlace: string;
  taxCode: string;
  bankName: string;
  bankBranch: string;
  bankAccount: string;
  salary: number;
  leaveBalance: string;
  kpiScore: string;
  contractType: string;
  contractNumber: string;
  permanentAddress: string;
  currentAddress: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  directReports: Array<{
    id: string;
    code: string;
    name: string;
    title: string;
    department: string;
    status: "ACTIVE" | "PROBATION";
    initials: string;
    avatarBg: string;
  }>;
  assignments: EffectiveRecord[];
}

const EMPLOYEES_MAP: Record<string, EmployeeProfileData> = {
  emp_1: {
    id: "emp_1",
    code: "EMP001",
    name: "Nguyễn Văn An",
    avatar: "/avatars/emp_1.jpg",
    fallbackAvatar:
      "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/480996638_1342553063760417_7964550011938015903_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeHEdkhTLRcncB85kXMY8ULwV4wR2A7xZgNXjBHYDvFmA7DmzxeFA_9SFqIyAst5rA_kMfjCzdqdN3zygxs-7Ug6&_nc_ohc=btWu47l5ifQQ7kNvwGHLDDz&_nc_oc=AdoacFtolA0BJKtRcG4CMN7PY2uiQ_z7uTYWsEwkCegYYG1Q8WlLP9P4-wCIO36yAsy9zc08dQKaBfYHMBR6IlMi&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&_nc_gid=NJZg0FH9bTnN7ydx3BfDDw&_nc_ss=782a8&oh=00_AQPrW22IiV3X4l0_IwTttt75tTH4W8Ch5OA5Z3eUVgjIPw&oe=6AD423DD",
    initials: "NA",
    avatarBg: "bg-red-600 text-white",
    title: "Tổng Giám Đốc (CEO)",
    department: "Ban Giám Đốc",
    division: "Khối Điều Hành Doanh Nghiệp",
    branch: "Trụ Sở Chính — Tòa Nhà FSI Tower",
    email: "an.nguyen@cyclosa.vn",
    phone: "0901 234 567",
    startDate: "01/01/2020",
    tenure: "6 năm 9 tháng",
    status: "ACTIVE",
    statusLabel: "Chính thức",
    workType: "Toàn thời gian (Full-time)",
    manager: "Hội Đồng Quản Trị (BOD)",
    managerRole: "Đại hội đồng Cổ đông & HĐQT",
    grade: "Bậc C-Level (Executive)",
    dob: "15/08/1982",
    gender: "Nam",
    marital: "Đã kết hôn",
    nationality: "Việt Nam",
    ethnicity: "Kinh",
    cccd: "001082003891",
    cccdDate: "12/04/2021",
    cccdPlace: "Cục Cảnh sát QLHC về TTXH",
    taxCode: "8029183491",
    bankName: "Ngân hàng TMCP Kỹ Thương (Techcombank)",
    bankBranch: "Hội Sở Miền Bắc — Hà Nội",
    bankAccount: "1902888999888",
    salary: 120000000,
    leaveBalance: "18.5 / 20 ngày",
    kpiScore: "98.5% (Hạng S - Xuất sắc)",
    contractType: "HĐLĐ Vô thời hạn",
    contractNumber: "HĐ-2020/001-BOD",
    permanentAddress: "Biệt thự BT05, KĐT Ngoại Giao Đoàn, P. Xuân Tảo, Q. Bắc Từ Liêm, Hà Nội",
    currentAddress: "Biệt thự BT05, KĐT Ngoại Giao Đoàn, P. Xuân Tảo, Q. Bắc Từ Liêm, Hà Nội",
    emergencyContact: {
      name: "Nguyễn Thu Trang",
      relation: "Vợ",
      phone: "0988 776 554",
    },
    directReports: [
      {
        id: "emp_3",
        code: "EMP003",
        name: "Lê Hoàng Nam",
        title: "Technical Lead (CTO)",
        department: "Khối Công Nghệ",
        status: "ACTIVE",
        initials: "HN",
        avatarBg: "bg-emerald-600 text-white",
      },
      {
        id: "emp_2",
        code: "EMP002",
        name: "Trần Thị Mai",
        title: "Trưởng Phòng Nhân Sự (CHRO)",
        department: "Khối Quản Trị Nhân Sự",
        status: "ACTIVE",
        initials: "TM",
        avatarBg: "bg-blue-600 text-white",
      },
      {
        id: "emp_5",
        code: "EMP005",
        name: "Hoàng Thảo Linh",
        title: "Kế Toán Trưởng (CFO)",
        department: "Khối Tài Chính",
        status: "ACTIVE",
        initials: "TL",
        avatarBg: "bg-amber-600 text-white",
      },
      {
        id: "emp_10",
        code: "EMP010",
        name: "Vũ Đình Trọng",
        title: "Giám Đốc Kinh Doanh Toàn Quốc (CCO)",
        department: "Khối Phát Triển Thị Trường",
        status: "ACTIVE",
        initials: "VT",
        avatarBg: "bg-indigo-600 text-white",
      },
    ],
    assignments: [
      {
        id: 1,
        effectiveFrom: "01/01/2022",
        effectiveTo: null,
        title: "Tổng Giám Đốc (Chief Executive Officer)",
        departmentName: "Ban Giám Đốc — Trụ Sở Chính",
        salaryOrGrade: "Bậc C-Level — 120,000,000 ₫",
        decisionNumber: "QĐ-HĐQT-2022/01",
        changeReason: "Hội Đồng Quản Trị bổ nhiệm Tổng Giám Đốc nhiệm kỳ 2022 - 2027",
        isCurrent: true,
      },
      {
        id: 2,
        effectiveFrom: "01/01/2020",
        effectiveTo: "31/12/2021",
        title: "Phó Tổng Giám Đốc Vận Hành (COO)",
        departmentName: "Ban Giám Đốc — Trụ Sở Chính",
        salaryOrGrade: "Bậc Executive — 95,000,000 ₫",
        decisionNumber: "QĐ-HĐQT-2020/05",
        changeReason: "Bổ nhiệm chính thức phụ trách toàn diện khối vận hành",
        isCurrent: false,
      },
    ],
  },
  emp_4: {
    id: "emp_4",
    code: "EMP004",
    name: "Phạm Minh Tuấn",
    avatar: "",
    initials: "PT",
    avatarBg: "bg-purple-600 text-white",
    title: "Senior Frontend Engineer & Team Lead",
    department: "Phòng Phát Triển Frontend",
    division: "Khối Công Nghệ",
    branch: "Trụ Sở Chính — Tòa Nhà FSI Tower",
    email: "tuan.pham@cyclosa.vn",
    phone: "0974 567 890",
    startDate: "01/08/2022",
    tenure: "4 năm 2 tháng",
    status: "ACTIVE",
    statusLabel: "Chính thức",
    workType: "Toàn thời gian (Full-time)",
    manager: "Lê Hoàng Nam",
    managerRole: "Technical Lead (CTO)",
    grade: "Bậc Kỹ Sư L5",
    dob: "20/11/1992",
    gender: "Nam",
    marital: "Độc thân",
    nationality: "Việt Nam",
    ethnicity: "Kinh",
    cccd: "001294008123",
    cccdDate: "15/09/2021",
    cccdPlace: "Cục Cảnh sát QLHC về TTXH",
    taxCode: "8394018294",
    bankName: "Ngân hàng TMCP Kỹ Thương (Techcombank)",
    bankBranch: "Chi nhánh Cầu Giấy — Hà Nội",
    bankAccount: "19036888999999",
    salary: 38000000,
    leaveBalance: "11.0 / 14 ngày",
    kpiScore: "94.0% (Hạng A - Rất tốt)",
    contractType: "HĐLĐ Vô thời hạn",
    contractNumber: "HĐ-2023/182-DEV",
    permanentAddress: "Số 45 Ngõ 120 Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội",
    currentAddress: "Số 45 Ngõ 120 Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội",
    emergencyContact: {
      name: "Phạm Văn Thành",
      relation: "Bố",
      phone: "0912 334 556",
    },
    directReports: [
      {
        id: "emp_6",
        code: "EMP088",
        name: "Đặng Minh Tân",
        title: "Junior Backend Engineer",
        department: "Phòng Phát Triển Backend",
        status: "PROBATION",
        initials: "MT",
        avatarBg: "bg-teal-600 text-white",
      },
      {
        id: "emp_8",
        code: "EMP095",
        name: "Lê Thị Hương",
        title: "Frontend Developer",
        department: "Phòng Phát Triển Frontend",
        status: "ACTIVE",
        initials: "LH",
        avatarBg: "bg-pink-600 text-white",
      },
    ],
    assignments: [
      {
        id: 1,
        effectiveFrom: "01/01/2024",
        effectiveTo: null,
        title: "Senior Frontend Engineer & Team Lead",
        departmentName: "Phòng Phát Triển Frontend (Khối Công Nghệ)",
        salaryOrGrade: "Bậc L5 — 38,000,000 ₫",
        decisionNumber: "QĐ-BN-2024/012",
        changeReason: "Bổ nhiệm phụ trách nhóm giao diện hệ thống",
        isCurrent: true,
      },
      {
        id: 2,
        effectiveFrom: "01/08/2022",
        effectiveTo: "31/12/2023",
        title: "Senior Frontend Engineer",
        departmentName: "Khối Công Nghệ",
        salaryOrGrade: "Bậc L5 — 30,000,000 ₫",
        decisionNumber: "QĐ-BN-2022/105",
        changeReason: "Tiếp nhận chính thức sau thử việc",
        isCurrent: false,
      },
    ],
  },
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "emp_1";

  // Lookup profile or default to emp_1
  const employee = useMemo(() => {
    return EMPLOYEES_MAP[rawId] || EMPLOYEES_MAP["emp_1"];
  }, [rawId]);

  const [activeTab, setActiveTab] = useState<
    "overview" | "personal" | "assignments" | "attendance" | "face"
  >("overview");

  // Avatar state with robust fallback
  const [avatarSrc, setAvatarSrc] = useState<string>(employee.avatar);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Dialog states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [newAvatarInput, setNewAvatarInput] = useState(employee.avatar || "");

  // Update avatar when employee changes
  React.useEffect(() => {
    setAvatarSrc(employee.avatar);
    setNewAvatarInput(employee.avatar || "");
  }, [employee]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Đã sao chép ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveAvatar = () => {
    if (!newAvatarInput.trim()) {
      toast.error("Vui lòng nhập đường dẫn ảnh hợp lệ");
      return;
    }
    setAvatarSrc(newAvatarInput.trim());
    setIsAvatarModalOpen(false);
    toast.success("Cập nhật ảnh đại diện thành công!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Top Navigation & Breadcrumbs ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/employees"
            className="inline-flex items-center gap-1.5 font-medium hover:text-foreground text-muted-foreground transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Danh sách nhân sự</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-foreground font-semibold font-mono">
            {employee.code}
          </span>
          <span className="text-slate-300">/</span>
          <span className="truncate max-w-[200px] text-slate-600 font-medium">
            {employee.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-white font-mono text-xs border-slate-200 text-slate-700 font-semibold px-2.5 py-0.5"
          >
            Mã định danh: {employee.code}
          </Badge>
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold px-2.5 py-0.5"
          >
            ● {employee.statusLabel}
          </Badge>
        </div>
      </div>

      {/* ── Executive Profile Header Card ──────────────────────────── */}
      <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {/* Top subtle brand accent line */}
        <div className="h-1.5 bg-[#DC2626] w-full" />

        <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            {/* Avatar block */}
            <div className="relative group shrink-0">
              <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-slate-100 flex items-center justify-center relative">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={employee.name}
                    onError={() => {
                      if (
                        avatarSrc !== employee.fallbackAvatar &&
                        employee.fallbackAvatar
                      ) {
                        setAvatarSrc(employee.fallbackAvatar);
                      }
                    }}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div
                    className={`h-full w-full flex items-center justify-center font-bold text-3xl ${employee.avatarBg}`}
                  >
                    {employee.initials}
                  </div>
                )}
              </div>

              {/* Online status indicator */}
              <span className="absolute bottom-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-white"></span>
              </span>

              {/* Hover action to change avatar */}
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                title="Thay đổi ảnh đại diện"
                className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-2xs font-medium cursor-pointer shadow-sm"
              >
                <Camera className="h-4 w-4" />
                <span>Đổi ảnh</span>
              </button>
            </div>

            {/* Profile info block */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  {employee.name}
                </h1>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200"
                >
                  {employee.code}
                </Badge>
                <StatusBadge status={employee.status} customLabel={employee.statusLabel} />
                <Badge className="bg-rose-50 text-[#DC2626] border border-rose-200 text-2xs font-semibold px-2 py-0.5">
                  {employee.grade}
                </Badge>
              </div>

              {/* Roles & Organization */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  {employee.title}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {employee.department}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {employee.branch}
                </span>
              </div>

              {/* Quick Contact & Metadata */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleCopy(employee.email, "Email")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors font-mono text-2xs cursor-pointer group"
                >
                  <Mail className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                  <span>{employee.email}</span>
                  {copiedField === "Email" ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-2.5 w-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(employee.phone, "Số điện thoại")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors font-mono text-2xs cursor-pointer group"
                >
                  <Phone className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                  <span>{employee.phone}</span>
                  {copiedField === "Số điện thoại" ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-2.5 w-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-2xs">
                  <User className="h-3 w-3 text-slate-400" />
                  <span>Quản lý: <strong>{employee.manager}</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2.5 lg:self-center shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Đang tạo tệp hồ sơ sơ yếu lý lịch định dạng PDF...");
              }}
              className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs font-medium"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              Xuất hồ sơ (PDF)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs font-medium"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              Chỉnh sửa hồ sơ
            </Button>
            <Button
              size="sm"
              onClick={() => setIsDecisionOpen(true)}
              className="bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs h-9 shadow-xs font-semibold px-3.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
              Bổ nhiệm / Điều chuyển
            </Button>
          </div>
        </div>

        {/* ── Executive Metric Bar (4 KPI Cards) ────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-200 divide-x divide-y lg:divide-y-0 divide-slate-200 bg-slate-50/60">
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium mb-1">
              <span>Thâm niên công tác</span>
              <Clock className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {employee.tenure}
            </div>
            <p className="text-2xs text-slate-500 mt-0.5">
              Từ ngày {employee.startDate}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium mb-1">
              <span>Quỹ phép năm</span>
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {employee.leaveBalance}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "85%" }} />
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium mb-1">
              <span>Hợp đồng lao động</span>
              <FileCheck2 className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {employee.contractType}
            </div>
            <p className="text-2xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Hiệu lực pháp lý
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground text-2xs font-medium mb-1">
              <span>Đánh giá KPI gần nhất</span>
              <Award className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {employee.kpiScore}
            </div>
            <p className="text-2xs text-slate-500 mt-0.5">
              Chu kỳ đánh giá Q3/2026
            </p>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "overview"
              ? "border-[#DC2626] text-[#DC2626] font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Tổng quan 360°</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("personal")}
          className={`pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "personal"
              ? "border-[#DC2626] text-[#DC2626] font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Hồ sơ cá nhân & Tài chính</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assignments")}
          className={`pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "assignments"
              ? "border-[#DC2626] text-[#DC2626] font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="h-4 w-4" />
          <span>Lịch sử bổ nhiệm & HĐLĐ</span>
          <Badge variant="secondary" className="text-2xs font-mono h-4.5 px-1.5">
            {employee.assignments.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("attendance")}
          className={`pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "attendance"
              ? "border-[#DC2626] text-[#DC2626] font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Chấm công & Nghỉ phép</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("face")}
          className={`pb-3.5 px-1 transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "face"
              ? "border-[#DC2626] text-[#DC2626] font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Scan className="h-4 w-4" />
          <span>Sinh trắc học Face ID</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* ── TAB 1: TỔNG QUAN 360° ─────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left Columns (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Position & Job Info Card */}
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4 text-[#DC2626]" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Thông tin Vị trí & Cơ cấu Tổ chức
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-2xs font-normal">
                  Chính thức
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-xs">
                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Chức danh đảm nhiệm
                    </span>
                    <strong className="text-slate-900 font-semibold text-sm">
                      {employee.title}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Phòng ban / Đơn vị
                    </span>
                    <strong className="text-slate-900 font-semibold text-sm">
                      {employee.department}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Khối trực thuộc
                    </span>
                    <span className="text-slate-800 font-medium">
                      {employee.division}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Cấp bậc / Bậc chức danh
                    </span>
                    <span className="text-slate-800 font-medium">
                      {employee.grade}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Hình thức làm việc
                    </span>
                    <span className="text-slate-800 font-medium">
                      {employee.workType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Ca làm việc tiêu chuẩn
                    </span>
                    <span className="text-slate-800 font-medium">
                      Hành chính (08:00 - 17:30 • Thứ 2 - Thứ 6)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Địa điểm làm việc chính
                    </span>
                    <span className="text-slate-800 font-medium">
                      {employee.branch}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-2xs mb-0.5">
                      Cấp trên trực tiếp (Báo cáo cho)
                    </span>
                    <span className="text-slate-800 font-semibold">
                      {employee.manager} ({employee.managerRole})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Direct Reports Card */}
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-[#DC2626]" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Đội ngũ Báo cáo Trực tiếp (Direct Reports)
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="font-mono text-2xs">
                  {employee.directReports.length} nhân sự
                </Badge>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                {employee.directReports.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${sub.avatarBg}`}
                      >
                        {sub.initials}
                      </div>
                      <div>
                        <Link
                          href={`/employees/${sub.id}`}
                          className="font-semibold text-slate-900 text-xs hover:text-[#DC2626] transition-colors flex items-center gap-1.5"
                        >
                          <span>{sub.name}</span>
                          <span className="font-mono text-2xs text-slate-400 font-normal">
                            ({sub.code})
                          </span>
                        </Link>
                        <p className="text-2xs text-slate-500">
                          {sub.title} • {sub.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={sub.status} />
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700"
                      >
                        <Link href={`/employees/${sub.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compensation & Benefits Overview */}
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-[#DC2626]" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Chính sách Đãi ngộ & Phúc lợi Doanh nghiệp
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-slate-500 text-2xs block">
                      Bảo hiểm Xã hội & Y tế bắt buộc
                    </span>
                    <strong className="text-slate-900 block font-semibold">
                      BHXH - BHYT - BHTN
                    </strong>
                    <p className="text-2xs text-emerald-600 font-medium">
                      Đóng đúng quy định mức trần nhà nước
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-slate-500 text-2xs block">
                      Bảo hiểm Sức khỏe Nâng cao
                    </span>
                    <strong className="text-slate-900 block font-semibold">
                      Bảo Việt Care VIP (Gói C-Level)
                    </strong>
                    <p className="text-2xs text-emerald-600 font-medium">
                      Hạn mức 550,000,000 ₫/năm (Bao gồm nội/ngoại trú)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-slate-500 text-2xs block">
                      Khám sức khỏe tổng quát định kỳ
                    </span>
                    <strong className="text-slate-900 block font-semibold">
                      BV Đa Khoa Quốc Tế Vinmec
                    </strong>
                    <p className="text-2xs text-slate-600">
                      Gói tầm soát sức khỏe toàn diện hàng năm
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-slate-500 text-2xs block">
                      Phương tiện & Công tác phí
                    </span>
                    <strong className="text-slate-900 block font-semibold">
                      Xe đưa đón công vụ + Vé máy bay C-Class
                    </strong>
                    <p className="text-2xs text-slate-600">
                      Theo định mức quy chế tài chính ban lãnh đạo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1 col) */}
          <div className="space-y-6">
            {/* Checklist & Document Status */}
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-5 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Hồ sơ Pháp lý & Giấy tờ
                </CardTitle>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-2xs">
                  100% Hoàn tất
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800">Căn cước công dân gắn chip</span>
                  </div>
                  <span className="text-2xs text-slate-500 font-mono">Đã xác thực</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800">Bằng Thạc sĩ Quản trị (MBA)</span>
                  </div>
                  <span className="text-2xs text-slate-500 font-mono">Công chứng</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800">Quyết định bổ nhiệm BOD</span>
                  </div>
                  <span className="text-2xs text-slate-500 font-mono">Lưu trữ</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800">Giấy khám sức khỏe định kỳ</span>
                  </div>
                  <span className="text-2xs text-slate-500 font-mono">Năm 2026</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800">Thỏa thuận bảo mật thông tin (NDA)</span>
                  </div>
                  <span className="text-2xs text-slate-500 font-mono">Ký số</span>
                </div>
              </CardContent>
            </Card>

            {/* Assets Handed Over */}
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-5 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Tài sản Doanh nghiệp Cấp phát
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 block">
                      MacBook Pro 16&quot; M3 Max (64GB)
                    </span>
                    <span className="text-2xs text-slate-500 font-mono">
                      Serial: C02G901XMD6R • Bàn giao 10/2024
                    </span>
                  </div>
                  <Badge variant="outline" className="text-2xs font-mono">
                    TS-00192
                  </Badge>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 block">
                      Thẻ Từ Ra Vào VIP & Thẻ Đỗ Xe B2
                    </span>
                    <span className="text-2xs text-slate-500 font-mono">
                      Mã thẻ: VIP-FSI-001 (Tòa nhà FSI Tower)
                    </span>
                  </div>
                  <Badge variant="outline" className="text-2xs font-mono">
                    Active
                  </Badge>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 block">
                      SIM Hotline Công Vụ Doanh Nghiệp
                    </span>
                    <span className="text-2xs text-slate-500 font-mono">
                      Số thuê bao: 0901 234 567 (MobiFone Corp)
                    </span>
                  </div>
                  <Badge variant="outline" className="text-2xs font-mono">
                    Postpaid
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick module cross-links */}
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-5 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Hồ sơ Liên Phân hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <Link
                  href="/contracts"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <FileText className="h-4 w-4 text-[#DC2626]" /> Hợp đồng lao động
                  </span>
                  <Badge variant="secondary" className="text-2xs">
                    {employee.contractNumber}
                  </Badge>
                </Link>

                <Link
                  href="/attendance/overview"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <Calendar className="h-4 w-4 text-emerald-600" /> Bảng chấm công tháng
                  </span>
                  <span className="font-mono text-2xs font-semibold text-emerald-700">
                    22.0 / 22 công
                  </span>
                </Link>

                <Link
                  href="/payroll"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-slate-800 font-medium">
                    <CreditCard className="h-4 w-4 text-blue-600" /> Phiếu lương & Quyết toán
                  </span>
                  <span className="font-mono text-2xs text-slate-600">Kỳ T09/2026</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 2: HỒ SƠ CÁ NHÂN & TÀI CHÍNH ───────────────────────── */}
      {activeTab === "personal" && (
        <div className="space-y-6">
          {/* Identity & Background Card */}
          <Card className="shadow-2xs border-slate-200">
            <CardHeader className="py-4 px-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-[#DC2626]" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Sơ Yếu Lý Lịch & Thông Tin Nhân Thân
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-slate-500 block text-2xs mb-0.5">Ngày sinh</span>
                  <strong className="text-slate-900 font-mono text-sm">
                    {employee.dob}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-2xs mb-0.5">Giới tính</span>
                  <strong className="text-slate-900 text-sm">
                    {employee.gender}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-2xs mb-0.5">Tình trạng hôn nhân</span>
                  <strong className="text-slate-900 text-sm">
                    {employee.marital}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-2xs mb-0.5">Quốc tịch</span>
                  <strong className="text-slate-900 text-sm">
                    {employee.nationality}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-2xs mb-0.5">Dân tộc</span>
                  <strong className="text-slate-900 text-sm">
                    {employee.ethnicity}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-2xs mb-0.5">Tôn giáo</span>
                  <strong className="text-slate-900 text-sm">Không</strong>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="text-slate-500 block text-2xs mb-1">
                    Địa chỉ thường trú (theo CCCD)
                  </span>
                  <p className="text-slate-800 font-medium">
                    {employee.permanentAddress}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block text-2xs mb-1">
                    Địa chỉ cư trú hiện tại
                  </span>
                  <p className="text-slate-800 font-medium">
                    {employee.currentAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensitive & Financial Card */}
          <Card className="shadow-2xs border-slate-200">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#DC2626]" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Dữ Liệu Nhạy Cảm & Tài Khoản Chi Trả Lương (GDPR / Nghị định 13)
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-2xs font-normal text-slate-500">
                Bảo vệ mã hóa
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 block text-2xs">
                    Số Căn cước công dân (CCCD gắn chip)
                  </span>
                  <SensitiveMask value={employee.cccd} maskType="id_card" />
                  <p className="text-2xs text-slate-400 mt-1">
                    Cấp ngày {employee.cccdDate} tại {employee.cccdPlace}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block text-2xs">
                    Mã số thuế thu nhập cá nhân (MST TNCN)
                  </span>
                  <SensitiveMask value={employee.taxCode} maskType="general" />
                  <p className="text-2xs text-slate-400 mt-1">
                    Chi cục Thuế Quận Cầu Giấy quản lý
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block text-2xs">
                    Mức lương cơ bản thỏa thuận (Net / Gross)
                  </span>
                  <SensitiveMask value={employee.salary} maskType="salary" />
                  <p className="text-2xs text-slate-400 mt-1">
                    Phân quyền C-Level: Chỉ thành viên HĐQT & Trưởng Khối Nhân sự xem được
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 block text-2xs">
                    Tài khoản ngân hàng nhận lương
                  </span>
                  <SensitiveMask value={employee.bankAccount} maskType="bank_account" />
                  <p className="text-2xs text-slate-500 mt-1">
                    {employee.bankName} — {employee.bankBranch}
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Thông tin Liên hệ Khẩn cấp
                </h4>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <strong className="text-slate-900 text-sm">
                      {employee.emergencyContact.name}
                    </strong>
                    <span className="text-slate-500 ml-2">
                      ({employee.emergencyContact.relation})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-800 font-semibold">
                      {employee.emergencyContact.phone}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(employee.emergencyContact.phone, "SĐT khẩn cấp")}
                      className="h-7 text-2xs"
                    >
                      Sao chép
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 3: LỊCH SỬ BỔ NHIỆM & HỢP ĐỒNG ─────────────────────── */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <Card className="shadow-2xs border-slate-200">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Lịch Sử Bổ Nhiệm & Tiến Trình Công Tác (Effective-Dated)
                </CardTitle>
                <p className="text-2xs text-slate-500 mt-0.5">
                  Theo dõi biến động chức danh, cấp bậc và quyết định nhân sự theo mốc thời gian
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsDecisionOpen(true)}
                className="bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs h-8"
              >
                Tạo quyết định mới
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <EffectiveDatedHistory records={employee.assignments} />
            </CardContent>
          </Card>

          {/* Contracts List */}
          <Card className="shadow-2xs border-slate-200">
            <CardHeader className="py-4 px-6 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">
                Danh Sách Hợp Đồng Lao Động Đã Ký
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {employee.contractType}
                      </span>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-2xs">
                        Đang hiệu lực
                      </Badge>
                      <Badge variant="outline" className="font-mono text-2xs">
                        {employee.contractNumber}
                      </Badge>
                    </div>
                    <p className="text-2xs text-slate-500">
                      Hiệu lực từ 01/01/2023 • Ký số điện tử VNPT-CA • Đại diện công ty: Hội đồng Quản trị
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Tải bản ký số
                  </Button>
                </div>

                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-500">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700">
                        Hợp đồng lao động có thời hạn (36 tháng)
                      </span>
                      <Badge variant="outline" className="text-2xs text-slate-400">
                        Hết hạn
                      </Badge>
                      <Badge variant="outline" className="font-mono text-2xs text-slate-400">
                        HĐ-2020/001-BOD
                      </Badge>
                    </div>
                    <p className="text-2xs text-slate-400">
                      01/01/2020 — 31/12/2022 • Đã chuyển tiếp sang HĐ vô thời hạn
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 shrink-0">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Xem lưu trữ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 4: CHẤM CÔNG & NGHỈ PHÉP ──────────────────────────── */}
      {activeTab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Tổng Hợp Chuyên Cần & Công Tháng 10/2026
                </CardTitle>
                <Badge variant="outline" className="font-mono text-2xs">
                  Tháng hiện tại
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-2xs text-slate-500 block mb-1">Công chuẩn tháng</span>
                    <strong className="text-xl font-bold text-slate-900 font-mono">22.0</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-2xs text-emerald-700 block mb-1">Công thực tế</span>
                    <strong className="text-xl font-bold text-emerald-700 font-mono">22.0</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-2xs text-slate-500 block mb-1">Đi muộn / Về sớm</span>
                    <strong className="text-xl font-bold text-slate-900 font-mono">0 lần</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-2xs text-slate-500 block mb-1">Tỷ lệ đúng giờ</span>
                    <strong className="text-xl font-bold text-emerald-600 font-mono">100%</strong>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-semibold text-slate-800 mb-2">
                    Lịch sử chấm công tuần này:
                  </h4>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {["T2 (05/10)", "T3 (06/10)", "T4 (07/10)", "T5 (08/10)", "T6 (09/10)"].map(
                      (day, idx) => (
                        <div key={day} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                          <span className="text-2xs text-slate-500 block font-mono">{day}</span>
                          <span className="text-2xs font-semibold text-emerald-600 block mt-1">
                            {idx <= 2 ? "07:55 - 18:05" : "Chưa đến"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave history */}
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-6 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Lịch Sử Đăng Ký Nghỉ Phép Gần Nhất
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">Nghỉ phép thường niên (1.0 ngày)</strong>
                      <span className="text-2xs text-slate-500">
                        Ngày 18/08/2026 • Lý do: Việc gia đình • Người duyệt: Hội đồng Quản trị
                      </span>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-2xs">
                      Đã duyệt
                    </Badge>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block">Nghỉ phép thường niên (0.5 ngày)</strong>
                      <span className="text-2xs text-slate-500">
                        Chiều ngày 12/06/2026 • Lý do: Tham dự hội nghị cấp cao
                      </span>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-2xs">
                      Đã duyệt
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Leave Balance Overview */}
          <div className="space-y-6">
            <Card className="shadow-2xs border-slate-200">
              <CardHeader className="py-4 px-5 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Chi Tiết Quỹ Phép Năm 2026
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Phép năm tiêu chuẩn</span>
                  <strong className="text-slate-900 font-mono">12.0 ngày</strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Phép thâm niên công tác</span>
                  <strong className="text-slate-900 font-mono">+6.0 ngày</strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Chế độ phép ban điều hành</span>
                  <strong className="text-slate-900 font-mono">+2.0 ngày</strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Tổng quỹ phép trong năm</span>
                  <strong className="text-slate-900 font-mono font-bold text-sm">20.0 ngày</strong>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Đã sử dụng</span>
                  <span className="text-rose-600 font-mono font-semibold">-1.5 ngày</span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <span className="text-emerald-900 font-semibold text-xs">Phép còn lại</span>
                  <strong className="text-emerald-800 font-mono text-base font-bold">
                    18.5 ngày
                  </strong>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 5: SINH TRẮC HỌC FACE ID ──────────────────────────── */}
      {activeTab === "face" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-2xs border-slate-200">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Dữ Liệu Khuôn Mặt Sinh Trắc Học (Face ID AI)
                </CardTitle>
                <p className="text-2xs text-slate-500 mt-0.5">
                  Mẫu khuôn mặt vector hóa dùng cho hệ thống cửa Turnstile & máy chấm công toàn công ty
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-2xs font-semibold">
                ● Đã kích hoạt
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Face Scanning Mock Frame with User Avatar */}
                <div className="relative h-44 w-44 rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-lg bg-slate-900 shrink-0 flex items-center justify-center group">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Biometric face"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-800 flex items-center justify-center text-white text-3xl font-bold">
                      {employee.initials}
                    </div>
                  )}

                  {/* AI Detection overlay bounding box */}
                  <div className="absolute inset-4 border border-dashed border-emerald-400 rounded-lg pointer-events-none flex flex-col justify-between p-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400 font-semibold bg-black/60 px-1 py-0.5 rounded">
                      <span>CONF: 99.8%</span>
                      <span>LIVENESS: OK</span>
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400 text-center bg-black/60 py-0.5 rounded">
                      ID: {employee.code}
                    </div>
                  </div>

                  {/* Laser scan line effect */}
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] top-1/2 -translate-y-1/2 opacity-75" />
                </div>

                {/* Biometric Metadata */}
                <div className="space-y-3.5 text-xs flex-1 w-full">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-2xs text-slate-500 block">Độ khớp khuôn mặt (Score)</span>
                      <strong className="text-emerald-700 font-mono text-base font-bold">
                        99.8% (Rất cao)
                      </strong>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-2xs text-slate-500 block">Kiểm tra Chống giả mạo (Anti-Spoof)</span>
                      <strong className="text-emerald-700 font-mono text-base font-bold">
                        PASSED (3D Depth)
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-slate-600">
                    <p className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span>Thuật toán AI</span>
                      <span className="font-mono font-semibold text-slate-800">
                        ArcFace-v4 Enterprise
                      </span>
                    </p>
                    <p className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span>Mã băm Vector (Feature Hash)</span>
                      <span className="font-mono text-2xs text-slate-700">
                        0x8F9A...B30C (512-dim)
                      </span>
                    </p>
                    <p className="flex items-center justify-between py-1">
                      <span>Thời gian cập nhật mẫu</span>
                      <span className="font-mono text-slate-700">
                        12/08/2026 14:22
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs h-8"
                    >
                      <Camera className="h-3.5 w-3.5 mr-1.5" />
                      Chụp / Tải ảnh mẫu mới
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success("Đã đồng bộ mẫu Face ID đến 12 thiết bị toàn quốc!")}
                      className="text-xs h-8 border-slate-200"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Đồng bộ thiết bị
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Devices & Recent Scans */}
          <Card className="shadow-2xs border-slate-200">
            <CardHeader className="py-4 px-5 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">
                Nhật Ký Quét Face ID Gần Nhất
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-medium">Turnstile Cổng A — FSI Tower</strong>
                  <span className="font-mono text-2xs text-emerald-600 font-bold">07:55 Hôm nay</span>
                </div>
                <p className="text-2xs text-slate-500">
                  Xác thực thành công • Điểm khớp: 99.8%
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-medium">Cửa VIP Tầng 18 — FSI Tower</strong>
                  <span className="font-mono text-2xs text-emerald-600 font-bold">18:10 Hôm qua</span>
                </div>
                <p className="text-2xs text-slate-500">
                  Xác thực thành công • Điểm khớp: 99.7%
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-medium">Turnstile Cổng A — FSI Tower</strong>
                  <span className="font-mono text-2xs text-emerald-600 font-bold">07:58 Hôm qua</span>
                </div>
                <p className="text-2xs text-slate-500">
                  Xác thực thành công • Điểm khớp: 99.9%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── MODAL: CHỈNH SỬA THÔNG TIN ────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Chỉnh Sửa Thông Tin Nhân Sự — {employee.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Cập nhật các trường thông tin cơ bản của nhân sự. Các thay đổi về chức danh hoặc lương sẽ yêu cầu tạo quyết định bổ nhiệm chính thức.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="emp-name" className="text-xs">Họ và tên</Label>
              <Input id="emp-name" defaultValue={employee.name} className="h-9 text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emp-code" className="text-xs">Mã nhân sự</Label>
              <Input id="emp-code" defaultValue={employee.code} disabled className="h-9 text-xs bg-slate-50 font-mono" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emp-email" className="text-xs">Email công vụ</Label>
              <Input id="emp-email" defaultValue={employee.email} className="h-9 text-xs font-mono" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emp-phone" className="text-xs">Số điện thoại</Label>
              <Input id="emp-phone" defaultValue={employee.phone} className="h-9 text-xs font-mono" />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="emp-address" className="text-xs">Địa chỉ thường trú</Label>
              <Input id="emp-address" defaultValue={employee.permanentAddress} className="h-9 text-xs" />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsEditOpen(false);
                toast.success("Đã cập nhật thông tin nhân sự thành công!");
              }}
              className="bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL: QUYẾT ĐỊNH BỔ NHIỆM / ĐIỀU CHUYỂN ───────────────── */}
      <Dialog open={isDecisionOpen} onOpenChange={setIsDecisionOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Khởi Tạo Quyết Định Nhân Sự / Bổ Nhiệm
            </DialogTitle>
            <DialogDescription className="text-xs">
              Quyết định này sẽ được ghi vào chuỗi Effective-Dated History của nhân viên {employee.name} ({employee.code}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs">Loại quyết định</Label>
              <Input defaultValue="Quyết định bổ nhiệm chức vụ kiêm nhiệm" className="h-9 text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Số quyết định</Label>
                <Input defaultValue="QĐ-BN-2026/088" className="h-9 text-xs font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Ngày có hiệu lực</Label>
                <Input defaultValue="01/11/2026" className="h-9 text-xs font-mono" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Chức danh bổ nhiệm mới</Label>
              <Input defaultValue={employee.title} className="h-9 text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Lý do điều chuyển / Bổ nhiệm</Label>
              <Input defaultValue="Quy hoạch nhân sự cấp cao kỳ 2026 - 2030" className="h-9 text-xs" />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDecisionOpen(false)}
              className="text-xs"
            >
              Đóng
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsDecisionOpen(false);
                toast.success("Đã khởi tạo quyết định nhân sự và gửi luồng phê duyệt BOD!");
              }}
              className="bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs"
            >
              Gửi phê duyệt quyết định
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL: THAY ĐỔI ẢNH ĐẠI DIỆN ───────────────────────────── */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Thay Đổi Ảnh Đại Diện & Dữ Liệu Face ID
            </DialogTitle>
            <DialogDescription className="text-xs">
              Nhập đường dẫn ảnh mới hoặc sử dụng ảnh chất lượng cao để làm đại diện và trích xuất sinh trắc học khuôn mặt.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-2xl overflow-hidden ring-4 ring-slate-100 shadow-md bg-slate-100 flex items-center justify-center">
                {newAvatarInput ? (
                  <img
                    src={newAvatarInput}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-slate-300" />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatar-url" className="text-xs">Đường dẫn URL ảnh</Label>
              <Input
                id="avatar-url"
                value={newAvatarInput}
                onChange={(e) => setNewAvatarInput(e.target.value)}
                placeholder="https://... hoặc /avatars/emp_1.jpg"
                className="h-9 text-xs font-mono"
              />
              <p className="text-2xs text-slate-500">
                Ảnh hiện tại đã được lưu trữ an toàn tại hệ thống CYCLOSA.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAvatarModalOpen(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAvatar}
              className="bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs"
            >
              Cập nhật ảnh đại diện
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
