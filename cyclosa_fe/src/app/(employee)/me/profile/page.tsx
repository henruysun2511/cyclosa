"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Building2,
  Phone,
  CreditCard,
  FileText,
  MapPin,
  Briefcase,
  KeyRound,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store/hooks";
import { ProfileForm, SecurityForm } from "@/features/settings";
import { useGetMyProfileQuery } from "@/features/employee";

export default function EmployeeProfilePage() {
  const authUser = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Nạp thông tin hồ sơ nhân sự liên kết (nếu có)
  const { data: employeeDetail, isLoading: isEmpLoading } = useGetMyProfileQuery();

  const employeeCode = employeeDetail?.employeeCode || "---";
  const fullName = employeeDetail?.fullName || authUser?.name || authUser?.email || "Chưa cập nhật";
  const jobTitle = employeeDetail?.currentAssignment?.jobTitleName || "Cán bộ nhân viên";
  const department = employeeDetail?.currentAssignment?.departmentName || "---";
  const phone = employeeDetail?.phone || "Chưa cập nhật";
  const address = employeeDetail?.address || "Chưa cập nhật";
  const bankName = employeeDetail?.bankAccount?.bankName || "Chưa thiết lập";
  const accountNumber = employeeDetail?.bankAccount?.accountNumber || "Chưa thiết lập";
  const accountHolder = fullName ? fullName.toUpperCase() : "---";
  const personalTaxCode = employeeDetail?.personalTaxCode || "Chưa cập nhật";
  const idCard = employeeDetail?.identityDocuments?.[0]?.documentNumber || "Chưa cập nhật";
  const idIssueDate = employeeDetail?.identityDocuments?.[0]?.issueDate || "---";
  const idIssuePlace = employeeDetail?.identityDocuments?.[0]?.issuePlace || "---";

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <User className="w-6 h-6 text-primary shrink-0" />
            <span>Thông tin cá nhân</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/me" className="hover:text-primary transition-colors">
              Cổng nhân viên
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Thông tin cá nhân</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button variant="outline" size="sm" asChild className="h-9 gap-1.5 text-xs">
            <Link href="/me/contracts">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Xem Hợp đồng LĐ</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Tabs chuyển đổi giữa Hồ sơ và Đổi mật khẩu */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "profile" | "security")}
        className="space-y-6"
      >
        <TabsList className="grid w-full sm:w-[460px] grid-cols-2">
          <TabsTrigger value="profile" className="gap-2 text-xs font-semibold">
            <User className="h-4 w-4" />
            <span>Hồ sơ & Thông tin cá nhân</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 text-xs font-semibold">
            <KeyRound className="h-4 w-4" />
            <span>Bảo mật & Đổi mật khẩu</span>
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: HỒ SƠ & THÔNG TIN CÁ NHÂN --- */}
        <TabsContent value="profile" className="space-y-6 mt-0">
          {/* Form cập nhật thông tin tài khoản & Avatar (chuẩn Admin Settings ProfileForm) */}
          <ProfileForm />

          {/* Khối thông tin nhân sự chuyên sâu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thẻ 1: Thông tin công việc & Định danh */}
            <Card className="rounded-xl border border-border bg-card shadow-xs">
              <CardHeader className="p-5 border-b">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Hồ sơ công việc & Định danh nhân sự</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Thông tin nhân sự chính thức được quản lý bởi phòng Nhân sự
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                {isEmpLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Mã nhân viên:</span>
                      <span className="font-semibold text-foreground font-mono">{employeeCode}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Chức vụ / Vị trí:</span>
                      <span className="font-semibold text-primary">{jobTitle}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Phòng ban:</span>
                      <span className="font-semibold text-foreground">{department}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Số điện thoại liên hệ:</span>
                      <span className="font-semibold text-foreground">{phone}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Số CCCD / Hộ chiếu:</span>
                      <span className="font-semibold text-foreground font-mono">{idCard}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Ngày cấp & Nơi cấp:</span>
                      <span className="font-semibold text-foreground">{idIssueDate} {idIssuePlace !== "---" ? `(${idIssuePlace})` : ""}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Địa chỉ thường trú:</span>
                      <span className="font-semibold text-foreground">{address}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Thẻ 2: Tài khoản nhận lương & Thuế */}
            <Card className="rounded-xl border border-border bg-card shadow-xs">
              <CardHeader className="p-5 border-b">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span>Tài khoản chi trả lương & Thuế TNCN</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Tài khoản ngân hàng thụ hưởng dùng cho kỳ chi trả lương hàng tháng
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                {isEmpLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Ngân hàng thụ hưởng:</span>
                      <span className="font-semibold text-foreground">{bankName}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Số tài khoản:</span>
                      <span className="font-semibold text-foreground font-mono text-sm">{accountNumber}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Chủ tài khoản:</span>
                      <span className="font-semibold text-foreground uppercase">{accountHolder}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Mã số thuế cá nhân (TNCN):</span>
                      <span className="font-semibold text-foreground font-mono">{personalTaxCode}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border/60">
                      <span className="text-muted-foreground">Trạng thái tài khoản:</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã xác minh chính chủ
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Phiếu lương kỳ gần nhất:</span>
                      <Link
                        href="/me/payroll"
                        className="text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Tra cứu phiếu lương</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB 2: BẢO MẬT & ĐỔI MẬT KHẨU --- */}
        <TabsContent value="security" className="space-y-6 mt-0">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
