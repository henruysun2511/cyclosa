"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Building2,
  MapPin,
  Briefcase,
  Award,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetEmployeeByIdQuery,
  useConfirmOfficialMutation,
  useDeleteIdentityDocumentMutation,
  useDeleteDependentMutation,
  useDeleteEmergencyContactMutation,
} from "../../api/employee-api";
import type {
  EmployeeStatus,
  IdentityDocument,
  Dependent,
  EmergencyContact,
} from "../../types/employee.types";

import { EmployeeEditDialog } from "./employee-edit-dialog";
import { WorkAssignmentDialog } from "./work-assignment-dialog";
import { IdentityDocumentDialog } from "./identity-document-dialog";
import { BankAccountDialog } from "./bank-account-dialog";
import { DependentDialog } from "./dependent-dialog";
import { EmergencyContactDialog } from "./emergency-contact-dialog";
import { StatusChangeDialog } from "./status-change-dialog";
import { ProbationEvaluationDialog } from "./probation-evaluation-dialog";

interface EmployeeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string | null;
  onSuccess?: () => void;
}

export function EmployeeDetailDialog({
  open,
  onOpenChange,
  employeeId,
  onSuccess,
}: EmployeeDetailDialogProps) {
  const { data: employee, isLoading, refetch } = useGetEmployeeByIdQuery(
    employeeId || "",
    { skip: !employeeId || !open }
  );

  const [confirmOfficial, { isLoading: isConfirming }] = useConfirmOfficialMutation();
  const [deleteDoc] = useDeleteIdentityDocumentMutation();
  const [deleteDep] = useDeleteDependentMutation();
  const [deleteContact] = useDeleteEmergencyContactMutation();

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

  const handleConfirmOfficial = async () => {
    if (!employeeId) return;
    try {
      await confirmOfficial(employeeId).unwrap();
      toast.success("Đã phê duyệt chuyển nhân viên sang trạng thái Chính thức (ACTIVE)!");
      refetch();
      onSuccess?.();
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
    if (!window.confirm("Bạn có chắc chắn muốn xóa người liên hệ khẩn cấp này?")) return;
    try {
      await deleteContact(id).unwrap();
      toast.success("Đã xóa người liên hệ khẩn cấp!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa người liên hệ!");
    }
  };

  const getStatusBadge = (status?: EmployeeStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-600 text-white">Chính thức (Active)</Badge>;
      case "PROBATION":
        return <Badge className="bg-amber-600 text-white">Thử việc (Probation)</Badge>;
      case "ON_LEAVE":
        return <Badge className="bg-blue-600 text-white">Nghỉ chế độ</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-rose-600 text-white">Tạm hoãn / Đình chỉ</Badge>;
      case "TERMINATED":
        return <Badge className="bg-slate-500 text-white">Đã thôi việc</Badge>;
      default:
        return <Badge variant="outline">Chưa xác định</Badge>;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                  {employee?.portraitUrl ? (
                    <img
                      src={employee.portraitUrl}
                      alt={employee.fullName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    employee?.firstName?.charAt(0) || <User className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    <span>{employee?.fullName || "Đang tải hồ sơ..."}</span>
                    <span className="font-mono text-xs text-muted-foreground font-normal">
                      ({employee?.employeeCode})
                    </span>
                  </DialogTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>Ngày vào làm: {employee?.startDate || "---"}</span>
                    <span>•</span>
                    {getStatusBadge(employee?.currentStatus)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs h-8"
                  onClick={() => setOpenEditProfile(true)}
                  disabled={!employee}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Sửa lý lịch
                </Button>

                {employee?.currentStatus === "PROBATION" && (
                  <Button
                    size="sm"
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    onClick={handleConfirmOfficial}
                    disabled={isConfirming}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isConfirming ? "Đang xử lý..." : "Chuyển chính thức"}
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {isLoading || !employee ? (
            <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
              Đang tải dữ liệu hồ sơ nhân sự...
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full pt-2">
              <TabsList className="grid grid-cols-5 w-full text-xs">
                <TabsTrigger value="overview">Lý lịch cá nhân</TabsTrigger>
                <TabsTrigger value="assignment">Công tác 3 chiều</TabsTrigger>
                <TabsTrigger value="documents">Giấy tờ & Ngân hàng</TabsTrigger>
                <TabsTrigger value="family">Người phụ thuộc & Khẩn cấp</TabsTrigger>
                <TabsTrigger value="lifecycle">Vòng đời & Thử việc</TabsTrigger>
              </TabsList>

              {/* Tab 1: Lý lịch cá nhân */}
              <TabsContent value="overview" className="space-y-4 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Thông tin định danh & liên hệ
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Họ và tên:</span>
                        <span className="font-semibold">{employee.fullName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Ngày sinh:</span>
                        <span className="font-medium">{employee.dateOfBirth}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Giới tính:</span>
                        <span className="font-medium">
                          {employee.gender === "MALE" ? "Nam" : employee.gender === "FEMALE" ? "Nữ" : "Khác"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Số điện thoại:</span>
                        <span className="font-mono font-medium">{employee.phone}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Email cá nhân:</span>
                        <span className="font-medium">{employee.personalEmail || "---"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Địa chỉ cư trú:</span>
                        <span className="font-medium">{employee.address || "---"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Thông tin pháp lý & Thuế - Bảo hiểm
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Mã nhân viên:</span>
                        <span className="font-mono font-bold text-primary">{employee.employeeCode}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Mã số thuế TNCN:</span>
                        <span className="font-mono font-medium">{employee.personalTaxCode || "Chưa đăng ký"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Mã sổ BHXH:</span>
                        <span className="font-mono font-medium">{employee.socialInsuranceNumber || "Chưa đăng ký"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Tài khoản User liên kết:</span>
                        <span className="font-medium">
                          {employee.userId ? (
                            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                              Đã cấp tài khoản
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-400">
                              Chưa cấp
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Ngày vào làm việc:</span>
                        <span className="font-medium">{employee.startDate}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-muted-foreground">Hạn thử việc:</span>
                        <span className="font-medium">{employee.probationEndDate || "Không áp dụng"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Công tác 3 chiều */}
              <TabsContent value="assignment" className="space-y-4 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Bộ 3 chiều công tác hiện hành
                  </span>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs h-8"
                    onClick={() => setOpenWorkAssignment(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Bổ nhiệm / Luân chuyển 3 chiều
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-blue-700" />
                      Chiều 1: Phòng ban
                    </div>
                    <div className="text-sm font-semibold text-blue-950">
                      {employee.currentAssignment?.departmentName || "---"}
                    </div>
                    <div className="text-2xs text-blue-600">
                      Mã đơn vị: {employee.currentAssignment?.departmentCode || "---"}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-700" />
                      Chiều 2: Chi nhánh (GPS)
                    </div>
                    <div className="text-sm font-semibold text-emerald-950">
                      {employee.currentAssignment?.branchName || "---"}
                    </div>
                    <div className="text-2xs text-emerald-600">
                      Mã: {employee.currentAssignment?.branchCode || "---"}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-amber-700" />
                      Chiều 3: Chức danh & Cấp bậc
                    </div>
                    <div className="text-sm font-semibold text-amber-950">
                      {employee.currentAssignment?.jobTitleName || "---"}
                    </div>
                    <div className="text-2xs text-amber-700 font-medium">
                      Cấp bậc: {employee.currentAssignment?.jobLevelName || "---"} (Bậc {employee.currentAssignment?.jobLevelRank || 1})
                    </div>
                  </div>
                </div>

                {/* Lịch sử công tác */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                    Lịch sử phân công công tác theo thời gian ({employee.workAssignments?.length || 0} bản ghi)
                  </div>
                  <div className="divide-y text-xs">
                    {employee.workAssignments?.map((a) => (
                      <div key={a.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <div className="font-semibold text-foreground">
                            {a.jobTitleName} ({a.jobLevelName}) • {a.departmentName}
                          </div>
                          <div className="text-muted-foreground text-2xs mt-0.5">
                            Chi nhánh: {a.branchName} | Quản lý: {a.managerEmployeeName || "Không có"} | Loại hình: {a.employmentType}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="font-mono text-2xs">
                            Từ {a.effectiveFrom}
                          </Badge>
                          <div className="text-2xs text-muted-foreground mt-0.5">
                            Lý do: {a.changeReason}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Giấy tờ định danh & Ngân hàng */}
              <TabsContent value="documents" className="space-y-4 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Giấy tờ định danh */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-primary" />
                        Giấy tờ định danh ({employee.identityDocuments?.length || 0})
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          setSelectedDoc(null);
                          setOpenIdentityDoc(true);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        Thêm
                      </Button>
                    </div>

                    {employee.identityDocuments?.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-4 text-center">
                        Chưa cập nhật giấy tờ định danh.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {employee.identityDocuments?.map((doc) => (
                          <div key={doc.id} className="p-2.5 rounded bg-slate-50 border text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">
                                {doc.documentType === "CITIZEN_ID" ? "Căn cước công dân" : "Hộ chiếu"}:{" "}
                                <span className="font-mono text-primary">{doc.documentNumber}</span>
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-500 hover:text-primary"
                                  onClick={() => {
                                    setSelectedDoc(doc);
                                    setOpenIdentityDoc(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-rose-500 hover:text-rose-700"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-2xs text-muted-foreground">
                              Ngày cấp: {doc.issueDate} | Nơi cấp: {doc.issuePlace}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tài khoản ngân hàng */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Tài khoản nhận lương chính thức
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => setOpenBankAccount(true)}
                      >
                        <Edit className="h-3 w-3" />
                        {employee.bankAccount ? "Sửa" : "Cài đặt"}
                      </Button>
                    </div>

                    {employee.bankAccount ? (
                      <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngân hàng:</span>
                          <span className="font-bold text-foreground">{employee.bankAccount.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chi nhánh:</span>
                          <span className="font-medium">{employee.bankAccount.bankBranchName || "---"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số tài khoản:</span>
                          <span className="font-mono font-bold text-primary text-sm">
                            {employee.bankAccount.accountNumber}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground py-4 text-center">
                        Chưa thiết lập tài khoản ngân hàng nhận lương.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 4: Người phụ thuộc & Khẩn cấp */}
              <TabsContent value="family" className="space-y-4 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Người phụ thuộc */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        Người phụ thuộc ({employee.dependents?.length || 0})
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          setSelectedDependent(null);
                          setOpenDependent(true);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        Thêm
                      </Button>
                    </div>

                    {employee.dependents?.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-4 text-center">
                        Chưa đăng ký người phụ thuộc giảm trừ gia cảnh.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {employee.dependents?.map((dep) => (
                          <div key={dep.id} className="p-2.5 rounded bg-slate-50 border text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">{dep.fullName}</span>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-2xs">
                                  {dep.relationship}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-500 hover:text-primary"
                                  onClick={() => {
                                    setSelectedDependent(dep);
                                    setOpenDependent(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-rose-500 hover:text-rose-700"
                                  onClick={() => handleDeleteDependent(dep.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-2xs text-muted-foreground">
                              Ngày sinh: {dep.dateOfBirth} | Giảm trừ từ: {dep.taxDeductionFrom || "---"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Liên hệ khẩn cấp */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-primary" />
                        Người liên hệ khẩn cấp ({employee.emergencyContacts?.length || 0})
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => {
                          setSelectedContact(null);
                          setOpenEmergencyContact(true);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        Thêm
                      </Button>
                    </div>

                    {employee.emergencyContacts?.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-4 text-center">
                        Chưa đăng ký người liên hệ khẩn cấp.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {employee.emergencyContacts?.map((c) => (
                          <div key={c.id} className="p-2.5 rounded bg-slate-50 border text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">
                                {c.fullName} ({c.relationship})
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-primary font-bold mr-2">{c.phone}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-slate-500 hover:text-primary"
                                  onClick={() => {
                                    setSelectedContact(c);
                                    setOpenEmergencyContact(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-rose-500 hover:text-rose-700"
                                  onClick={() => handleDeleteContact(c.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-2xs text-muted-foreground">
                              Địa chỉ: {c.address || "---"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 5: Vòng đời & Thử việc */}
              <TabsContent value="lifecycle" className="space-y-4 pt-3">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs h-8"
                    onClick={() => setOpenStatusChange(true)}
                  >
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    Đổi trạng thái làm việc
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs h-8"
                    onClick={() => setOpenProbationEval(true)}
                  >
                    <Award className="h-3.5 w-3.5" />
                    Đánh giá thử việc
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lịch sử trạng thái */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Lịch sử trạng thái làm việc ({employee.statusHistory?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {employee.statusHistory?.map((s) => (
                        <div key={s.id} className="p-2.5 rounded bg-slate-50 border text-xs flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{getStatusBadge(s.status)}</div>
                            <div className="text-2xs text-muted-foreground mt-1">{s.note || "Không có ghi chú"}</div>
                          </div>
                          <span className="font-mono text-2xs text-muted-foreground">Từ {s.effectiveFrom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kết quả đánh giá thử việc */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Đánh giá thử việc ({employee.probationEvaluations?.length || 0})
                    </h4>
                    {employee.probationEvaluations?.length === 0 ? (
                      <div className="text-xs text-muted-foreground py-4 text-center">
                        Chưa có phiếu đánh giá thử việc nào được ghi nhận.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {employee.probationEvaluations?.map((ev) => (
                          <div key={ev.id} className="p-2.5 rounded bg-slate-50 border text-xs space-y-1">
                            <div className="flex justify-between font-semibold">
                              <span>Ngày đánh giá: {ev.evaluationDate}</span>
                              <Badge className={ev.result === "PASSED" ? "bg-emerald-600" : "bg-amber-600"}>
                                {ev.result}
                              </Badge>
                            </div>
                            <div className="text-2xs text-muted-foreground">
                              Đánh giá bởi: {ev.evaluatedByEmployeeName || "---"}
                            </div>
                            {ev.comment && (
                              <div className="text-2xs italic text-slate-600 bg-white p-2 rounded border mt-1">
                                "{ev.comment}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sub Dialogs */}
      {employee && (
        <>
          <EmployeeEditDialog
            open={openEditProfile}
            onOpenChange={setOpenEditProfile}
            employee={employee}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />

          <WorkAssignmentDialog
            open={openWorkAssignment}
            onOpenChange={setOpenWorkAssignment}
            employeeId={employee.id}
            companyId={employee.companyId}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />

          <IdentityDocumentDialog
            open={openIdentityDoc}
            onOpenChange={setOpenIdentityDoc}
            employeeId={employee.id}
            document={selectedDoc}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />

          <BankAccountDialog
            open={openBankAccount}
            onOpenChange={setOpenBankAccount}
            employeeId={employee.id}
            bankAccount={employee.bankAccount}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />

          <DependentDialog
            open={openDependent}
            onOpenChange={setOpenDependent}
            employeeId={employee.id}
            dependent={selectedDependent}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />

          <EmergencyContactDialog
            open={openEmergencyContact}
            onOpenChange={setOpenEmergencyContact}
            employeeId={employee.id}
            contact={selectedContact}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />

          <StatusChangeDialog
            open={openStatusChange}
            onOpenChange={setOpenStatusChange}
            employeeId={employee.id}
            currentStatus={employee.currentStatus}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />

          <ProbationEvaluationDialog
            open={openProbationEval}
            onOpenChange={setOpenProbationEval}
            employeeId={employee.id}
            onSuccess={() => {
              refetch();
              onSuccess?.();
            }}
          />
        </>
      )}
    </>
  );
}
