"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  UserPlus,
  Sparkles,
  Users,
  Calendar,
  Building2,
  Trash2,
  Pencil,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetSuccessionPlanByIdQuery,
  useAddSuccessionCandidateMutation,
  useUpdateSuccessionCandidateMutation,
  useRemoveSuccessionCandidateMutation,
  useGetSuccessionSuggestionsQuery,
  AddCandidateDialog,
  RISK_LEVEL_CONFIG,
  READINESS_CONFIG,
  type SuccessionCandidateItem,
  type AddCandidateFormValues,
} from "@/features/career";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";

export default function SuccessionPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedCandidate, setSelectedCandidate] = useState<SuccessionCandidateItem | null>(null);

  const {
    data: plan,
    isLoading: isPlanLoading,
    refetch,
  } = useGetSuccessionPlanByIdQuery(planId);

  const {
    data: suggestions,
    isLoading: isSuggestionsLoading,
  } = useGetSuccessionSuggestionsQuery(planId);

  const { data: employeesData } = useGetEmployeesQuery({ size: 100 });

  const [addCandidate, { isLoading: isAdding }] = useAddSuccessionCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateSuccessionCandidateMutation();
  const [removeCandidate] = useRemoveSuccessionCandidateMutation();

  const employeesList = (employeesData?.items || []).map((e: any) => ({
    id: e.id,
    fullName: e.fullName || `${e.lastName} ${e.firstName}`,
    employeeCode: e.employeeCode,
  }));

  const handleOpenAdd = () => {
    setDialogMode("add");
    setSelectedCandidate(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cand: SuccessionCandidateItem) => {
    setDialogMode("edit");
    setSelectedCandidate(cand);
    setDialogOpen(true);
  };

  const handleRemove = async (cand: SuccessionCandidateItem) => {
    if (confirm(`Gỡ bỏ nhân viên "${cand.employeeName}" khỏi danh sách ứng viên kế cận?`)) {
      try {
        await removeCandidate({ planId, employeeId: cand.employeeId }).unwrap();
        toast.success(`Đã gỡ bỏ ứng viên "${cand.employeeName}" thành công!`);
      } catch (err) {
        showApiErrorToast(err, "Không thể gỡ bỏ ứng viên. Vui lòng thử lại!");
      }
    }
  };

  const handleQuickAddSuggestion = async (sug: any) => {
    try {
      await addCandidate({
        planId,
        employeeId: sug.employeeId,
        readiness: "READY_1_2_YEARS",
        developmentNotes: sug.matchingFactors?.join("; ") || sug.recommendationReason,
      }).unwrap();
      toast.success("Đã thêm ứng viên từ gợi ý AI thành công!");
    } catch (err) {
      showApiErrorToast(err, "Không thể thêm ứng viên từ gợi ý AI. Vui lòng thử lại!");
    }
  };

  const handleDialogSubmit = async (values: AddCandidateFormValues) => {
    try {
      if (dialogMode === "add") {
        await addCandidate({
          planId,
          employeeId: values.employeeId,
          readiness: values.readiness,
          developmentNotes: values.developmentNotes,
        }).unwrap();
        toast.success("Thêm mới ứng viên kế nhiệm thành công!");
      } else if (selectedCandidate) {
        await updateCandidate({
          planId,
          employeeId: selectedCandidate.employeeId,
          readiness: values.readiness,
          developmentNotes: values.developmentNotes,
        }).unwrap();
        toast.success("Cập nhật ứng viên kế nhiệm thành công!");
      }
      setDialogOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể lưu thông tin ứng viên. Vui lòng thử lại!");
    }
  };

  if (isPlanLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-muted-foreground">Không tìm thấy thông tin kế hoạch kế nhiệm.</p>
        <Button onClick={() => router.push("/career/succession")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const riskConfig = RISK_LEVEL_CONFIG[plan.riskLevel];

  return (
    <div className="space-y-6 pb-12">
      {/* Rule 02: Header trang & Breadcrumbs chuẩn 100% */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Compass className="w-6 h-6 text-primary shrink-0" />
            <span>Chi tiết kế hoạch kế nhiệm</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/career/succession" className="hover:text-primary transition-colors">
              Kế hoạch kế nhiệm
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {plan.jobTitleName} - {plan.departmentName}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/career/succession")}
            className="h-8 text-xs gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Chỉ định ứng viên kế cận</span>
          </Button>
        </div>
      </div>

      {/* Thông tin tổng quan vị trí */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {plan.jobTitleName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>{plan.departmentName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${riskConfig?.className}`}
              >
                Mức rủi ro: {riskConfig?.label || plan.riskLevel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tổng số ứng viên</p>
              <p className="text-xl font-bold font-mono text-foreground">
                {plan.candidates?.length || 0}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Sẵn sàng ngay (0-3 tháng)</p>
              <p className="text-xl font-bold font-mono text-emerald-600">
                {plan.candidates?.filter((c) => c.readiness === "READY_NOW").length || 0}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ngày rà soát định kỳ</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5 pt-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {plan.reviewDate ? new Date(plan.reviewDate).toLocaleDateString("vi-VN") : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Người đương nhiệm */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Nhân sự đang đương nhiệm
          </h3>

          {plan.currentHolderName ? (
            <div className="flex items-center gap-3 pt-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-base font-bold shrink-0">
                {plan.currentHolderName.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground">
                  {plan.currentHolderName}
                </h4>
                <p className="text-xs font-mono text-muted-foreground">
                  Mã NV: {plan.currentHolderCode}
                </p>
                <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Đang hoạt động
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm font-medium text-amber-600">Vị trí hiện đang khuyết</p>
              <p className="text-xs text-muted-foreground mt-1">
                Cần ưu tiên đẩy nhanh tiến độ bổ nhiệm ứng viên kế cận.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách ứng viên kế cận */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Danh sách nhân sự kế cận ({plan.candidates?.length || 0})</span>
          </h3>
        </div>

        <div className="rounded-md border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">STT</TableHead>
                <TableHead>Ứng viên kế cận</TableHead>
                <TableHead>Vị trí & Phòng ban hiện tại</TableHead>
                <TableHead className="w-44 text-center">Mức độ sẵn sàng</TableHead>
                <TableHead>Kế hoạch đào tạo & Ghi chú</TableHead>
                <TableHead className="w-20 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!plan.candidates || plan.candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-36 text-center text-muted-foreground">
                    Chưa có ứng viên kế cận nào trong kế hoạch này. Bấm &quot;Chỉ định ứng viên kế cận&quot; hoặc chọn từ gợi ý bên dưới.
                  </TableCell>
                </TableRow>
              ) : (
                plan.candidates.map((cand, idx) => {
                  const readConfig = READINESS_CONFIG[cand.readiness];

                  return (
                    <TableRow key={cand.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm text-foreground">
                          {cand.employeeName}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {cand.employeeCode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium text-foreground">
                          {cand.currentJobTitleName || "Chức danh tương đương"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cand.currentDepartmentName || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${readConfig?.className}`}
                        >
                          {readConfig?.label || cand.readiness}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">
                          {cand.developmentNotes || "Theo lộ trình mentoring chuẩn"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(cand)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(cand)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Gợi ý ứng viên sáng giá từ Talent Pool */}
      {suggestions && suggestions.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Gợi ý ứng viên sáng giá từ Kho nhân tài
                </h3>
                <p className="text-xs text-muted-foreground">
                  Thuật toán tự động đối sánh kỹ năng và tiềm năng phát triển của nhân viên
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {suggestions.length} Ứng viên tiềm năng
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {suggestions.map((sug) => (
              <div
                key={sug.employeeId}
                className="rounded-lg border border-border bg-card p-3.5 space-y-2.5 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {sug.employeeName}
                      </h4>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        {sug.employeeCode}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-2xs">
                      {sug.matchScore}% Phù hợp
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {sug.jobTitleName || "Chuyên viên"} • {sug.departmentName || "Khối nội bộ"}
                  </p>

                  <div className="space-y-1 pt-1">
                    {sug.matchingFactors?.map((f: string, i: number) => (
                      <p key={i} className="text-[11px] text-muted-foreground line-clamp-1">
                        • {f}
                      </p>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAddSuggestion(sug)}
                  className="w-full h-8 text-xs text-primary border-primary/30 hover:bg-primary/10 mt-2"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Thêm vào kế hoạch
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Candidate Dialog */}
      <AddCandidateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedCandidate}
        employees={employeesList}
        onSubmit={handleDialogSubmit}
        isSubmitting={isAdding || isUpdating}
      />
    </div>
  );
}
