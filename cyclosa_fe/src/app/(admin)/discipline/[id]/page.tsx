"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ArrowLeft,
  Calendar,
  FileText,
  Users,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  ArrowUpRight,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DisciplineStatusBadge,
  DisciplineFormBadge,
  DecideDisciplineDialog,
  useGetDisciplineCaseByIdQuery,
  useGetDisciplineEligibilityQuery,
  useAddDisciplineEvidenceMutation,
  useDeleteDisciplineEvidenceMutation,
  useSubmitDismissalMutation,
  VIOLATION_CATEGORY_LABELS,
} from "@/features/reward";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DisciplineDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data, isLoading, refetch } = useGetDisciplineCaseByIdQuery(id);
  const { data: eligibilityData } = useGetDisciplineEligibilityQuery(id);
  const [addEvidence, { isLoading: isAddingEvidence }] =
    useAddDisciplineEvidenceMutation();
  const [deleteEvidence] = useDeleteDisciplineEvidenceMutation();
  const [submitDismissal] = useSubmitDismissalMutation();

  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFileName, setEvidenceFileName] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [decideDialogOpen, setDecideDialogOpen] = useState(false);

  const detail = data?.data;
  const caseInfo = detail?.caseInfo;
  const eligibility = eligibilityData?.data;

  const handleAddEvidence = async () => {
    if (!evidenceDesc.trim()) return;
    try {
      await addEvidence({
        id,
        body: {
          description: evidenceDesc,
          fileName: evidenceFileName || undefined,
          fileUrl: evidenceUrl || undefined,
        },
      }).unwrap();

      toast.success("Thêm bằng chứng vi phạm thành công");
      setEvidenceDesc("");
      setEvidenceFileName("");
      setEvidenceUrl("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể thêm bằng chứng");
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài liệu / bằng chứng này?")) {
      try {
        await deleteEvidence({ caseId: id, evidenceId }).unwrap();
        toast.success("Đã xóa bằng chứng");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể xóa bằng chứng");
      }
    }
  };

  const handleSubmitDismissal = async () => {
    if (
      confirm(
        `Xác nhận chuyển hồ sơ của nhân viên ${caseInfo?.employeeName} sang quy trình phê duyệt SA THẢI?`
      )
    ) {
      try {
        await submitDismissal(id).unwrap();
        toast.success("Đã trình phê duyệt sa thải lao động qua Workflow");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể trình phê duyệt");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!detail || !caseInfo) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">Không tìm thấy hồ sơ kỷ luật này.</p>
        <Button variant="outline" size="sm" onClick={() => router.push("/discipline")}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header Chuẩn mực theo Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <ShieldAlert className="w-6 h-6 text-primary shrink-0" />
            <span>Hồ sơ kỷ luật: {caseInfo.employeeName}</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/discipline" className="hover:text-primary transition-colors">
              Kỷ luật lao động
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{caseInfo.employeeName}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/discipline")}
            className="h-8 text-xs gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </Button>

          {caseInfo.status === "DRAFT" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSubmitDismissal}
                className="h-8 text-xs gap-1.5 text-purple-700 hover:text-purple-800 border-purple-200 bg-purple-50 hover:bg-purple-100"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Trình duyệt sa thải</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setDecideDialogOpen(true)}
                className="h-8 text-xs gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Ban hành quyết định</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin vi phạm & Biên bản cuộc họp */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Thông tin vi phạm */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span>Thông tin hành vi vi phạm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground">Nhân viên vi phạm:</span>
                  <p className="font-semibold text-foreground text-sm mt-0.5">
                    {caseInfo.employeeName} ({caseInfo.employeeCode})
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ngày phát hiện vi phạm:</span>
                  <p className="font-semibold text-foreground mt-0.5">
                    {caseInfo.violationDate}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nhóm hành vi vi phạm:</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {VIOLATION_CATEGORY_LABELS[caseInfo.violationCategory] ||
                      caseInfo.violationCategory}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trạng thái hồ sơ:</span>
                  <div className="mt-0.5">
                    <DisciplineStatusBadge
                      status={caseInfo.status}
                      isExpired={caseInfo.isExpired}
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground">Mô tả chi tiết vi phạm:</span>
                <p className="mt-1 p-3 bg-muted/40 rounded-lg text-foreground leading-relaxed whitespace-pre-wrap">
                  {caseInfo.violationDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card Phiên họp xét kỷ luật */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Biên bản phiên họp xét kỷ luật</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground">Ngày tổ chức họp:</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {detail.meetingDate || (
                      <span className="text-muted-foreground italic">Chưa tổ chức họp</span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Căn cứ nội quy / điều khoản:</span>
                  <p className="font-medium text-foreground mt-0.5">
                    {detail.ruleBasis || (
                      <span className="text-muted-foreground italic">Chưa cập nhật</span>
                    )}
                  </p>
                </div>
              </div>

              {detail.meetingNote && (
                <div>
                  <span className="text-muted-foreground">Tóm tắt biên bản họp:</span>
                  <p className="mt-1 p-3 bg-muted/40 rounded-lg text-foreground whitespace-pre-wrap">
                    {detail.meetingNote}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card Thành phần tham dự phiên họp */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Thành phần tham gia họp kỷ luật ({detail.participants?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {detail.participants && detail.participants.length > 0 ? (
                <div className="divide-y divide-border/60 text-xs">
                  {detail.participants.map((p) => (
                    <div key={p.id} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{p.employeeName}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {p.employeeCode}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {p.participantRole}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-2">
                  Chưa ghi nhận danh sách người tham dự.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Thẩm định BLLĐ & Danh sách bằng chứng */}
        <div className="space-y-6">
          {/* Card Thẩm định điều kiện theo Bộ luật Lao động */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thẩm định BLLĐ & Xóa án tích</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3 text-xs">
              {eligibility && (
                <div
                  className={`p-3 rounded-lg border ${
                    eligibility.eligible
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  <p className="font-semibold flex items-center gap-1.5">
                    {eligibility.eligible ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Đủ điều kiện xử lý kỷ luật
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Có hạn chế kỷ luật theo Luật
                      </>
                    )}
                  </p>
                  <p className="mt-1">
                    Thời hiệu xử lý còn lại:{" "}
                    <strong>{eligibility.remainingLimitationMonths} tháng</strong>
                  </p>
                  {eligibility.restrictionReasons.length > 0 && (
                    <div className="mt-2 space-y-1 text-[11px]">
                      {eligibility.restrictionReasons.map((r, i) => (
                        <div key={i}>• {r}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {caseInfo.status === "DECIDED" && (
                <div className="p-3 bg-muted/40 rounded-lg space-y-1.5">
                  <span className="font-semibold text-foreground">
                    Hình thức đã áp dụng:
                  </span>
                  <div className="mt-1">
                    <DisciplineFormBadge form={caseInfo.disciplineForm} />
                  </div>
                  {caseInfo.expiryDate && (
                    <p className="text-muted-foreground mt-1">
                      Ngày xóa kỷ luật tự động: <strong>{caseInfo.expiryDate}</strong>
                    </p>
                  )}
                  {caseInfo.isExpired && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-600 text-white shadow-2xs">
                      Đã hết thời hiệu kỷ luật (Đương nhiên xóa án)
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card Bằng chứng vi phạm */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-primary" />
                <span>Bằng chứng & Biên bản ({detail.evidences?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              {detail.evidences && detail.evidences.length > 0 ? (
                <div className="divide-y divide-border/60 text-xs">
                  {detail.evidences.map((e) => (
                    <div key={e.id} className="py-2 flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{e.description}</p>
                        {e.fileName && (
                          <a
                            href={e.fileUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline text-[11px] block"
                          >
                            {e.fileName}
                          </a>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {e.createdAt ? e.createdAt.split("T")[0] : ""}
                        </span>
                      </div>
                      {caseInfo.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvidence(e.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-1">
                  Chưa có tài liệu / bằng chứng đính kèm.
                </p>
              )}

              {/* Form thêm bằng chứng mới khi ở trạng thái DRAFT */}
              {caseInfo.status === "DRAFT" && (
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <span className="text-xs font-semibold text-foreground">
                    Bổ sung bằng chứng:
                  </span>
                  <Input
                    placeholder="Mô tả bằng chứng (bản tường trình, camera, file log...)"
                    value={evidenceDesc}
                    onChange={(e) => setEvidenceDesc(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Tên tệp đính kèm..."
                      value={evidenceFileName}
                      onChange={(e) => setEvidenceFileName(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Input
                      placeholder="URL tệp hoặc đường dẫn..."
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddEvidence}
                    disabled={isAddingEvidence || !evidenceDesc.trim()}
                    className="w-full h-8 text-xs gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Đính kèm bằng chứng</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Ban hành quyết định */}
      <DecideDisciplineDialog
        disciplineCase={caseInfo}
        open={decideDialogOpen}
        onOpenChange={setDecideDialogOpen}
      />
    </div>
  );
}

