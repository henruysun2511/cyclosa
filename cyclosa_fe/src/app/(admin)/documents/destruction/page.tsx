"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  CheckCircle2,
  Clock,
  FileText,
  FileCheck,
  Plus,
  RefreshCw,
  FolderOpen,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetDestructionCandidatesQuery,
  useGetDestructionProposalsQuery,
  useCreateDestructionProposalMutation,
  useVoteDestructionProposalMutation,
  useExecuteDestructionMutation,
} from "@/features/digital-records/api/digital-records-api";
import type {
  DestructionProposalSummary,
  CouncilVote,
} from "@/features/digital-records/types/digital-records.types";

export default function DestructionPage() {
  const [activeTab, setActiveTab] = useState<"proposals" | "candidates">("proposals");

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [proposalCode, setProposalCode] = useState(
    `PROP-DEST-${new Date().getFullYear()}-001`
  );
  const [reason, setReason] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // Vote modal
  const [selectedProposalForVote, setSelectedProposalForVote] =
    useState<DestructionProposalSummary | null>(null);
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [voteOption, setVoteOption] = useState<CouncilVote>("APPROVE");
  const [voteComment, setVoteComment] = useState("");

  // Execute modal
  const [selectedProposalForExec, setSelectedProposalForExec] =
    useState<DestructionProposalSummary | null>(null);
  const [execModalOpen, setExecModalOpen] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [sha256Cert, setSha256Cert] = useState("");

  // Queries
  const {
    data: candidates = [],
    isLoading: isCandidatesLoading,
    isFetching: isCandidatesFetching,
    refetch: refetchCandidates,
  } = useGetDestructionCandidatesQuery();

  const {
    data: proposalsData,
    isLoading: isProposalsLoading,
    isFetching: isProposalsFetching,
    refetch: refetchProposals,
  } = useGetDestructionProposalsQuery({});

  const [createProposalMutation, { isLoading: isCreating }] =
    useCreateDestructionProposalMutation();
  const [voteMutation, { isLoading: isVoting }] = useVoteDestructionProposalMutation();
  const [execMutation, { isLoading: isExecuting }] = useExecuteDestructionMutation();

  const proposals = proposalsData?.items || [];
  const isFetching = isCandidatesFetching || isProposalsFetching;

  // Tính toán số liệu KPI
  const pendingCount = proposals.filter((p) => p.status === "COUNCIL_REVIEW").length;
  const approvedCount = proposals.filter((p) => p.status === "APPROVED").length;
  const executedCount = proposals.filter((p) => p.status === "EXECUTED").length;

  const handleCreateProposal = async () => {
    if (!proposalCode.trim() || !reason.trim() || selectedCandidates.length === 0) return;

    try {
      await createProposalMutation({
        proposalCode: proposalCode.trim().toUpperCase(),
        reason: reason.trim(),
        requiredApprovalRatio: 100.0,
        documentIds: selectedCandidates,
        councilMembers: [
          {
            employeeId:
              candidates[0]?.employeeId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            councilRole: "CHAIRPERSON",
          },
        ],
      }).unwrap();

      toast.success("Lập đề xuất tiêu hủy tài liệu thành công!");
      setCreateOpen(false);
      setSelectedCandidates([]);
      setReason("");
      refetchProposals();
      refetchCandidates();
    } catch (err) {
      showApiErrorToast(err, "Không thể lập đề xuất tiêu hủy. Vui lòng thử lại!");
    }
  };

  const handleVote = async () => {
    if (!selectedProposalForVote) return;

    try {
      await voteMutation({
        id: selectedProposalForVote.id,
        data: { vote: voteOption, comment: voteComment.trim() },
      }).unwrap();

      toast.success("Gửi biểu quyết hội đồng thành công!");
      setVoteModalOpen(false);
      setVoteComment("");
      refetchProposals();
    } catch (err) {
      showApiErrorToast(err, "Không thể gửi biểu quyết. Vui lòng thử lại!");
    }
  };

  const handleExecute = async () => {
    if (!selectedProposalForExec || !evidenceUrl.trim()) return;

    try {
      await execMutation({
        id: selectedProposalForExec.id,
        data: {
          evidenceFileUrl: evidenceUrl.trim(),
          certificateSha256:
            sha256Cert.trim() ||
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
      }).unwrap();

      toast.success("Thực thi tiêu hủy tài liệu thành công!");
      setExecModalOpen(false);
      setEvidenceUrl("");
      setSha256Cert("");
      refetchProposals();
      refetchCandidates();
    } catch (err) {
      showApiErrorToast(err, "Không thể thực thi tiêu hủy. Vui lòng kiểm tra lại biên bản!");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header chuẩn mực theo Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Flame className="w-6 h-6 text-rose-600 shrink-0" />
            <span>Hội đồng tiêu hủy tài liệu</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/documents" className="hover:text-primary transition-colors">
              Kho lưu trữ & số hóa
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Hội đồng tiêu hủy</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetchProposals();
              refetchCandidates();
            }}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          {candidates.length > 0 && (
            <Button
              size="sm"
              onClick={() => {
                setSelectedCandidates(candidates.map((c) => c.id));
                setCreateOpen(true);
              }}
              className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5 shadow-xs"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Lập đề xuất hủy ({candidates.length})</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Thẻ KPI Thống kê 4 cột chuẩn Rule 03 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tổng đề xuất</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {proposals.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Chờ hội đồng xét</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {pendingCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đã thông qua</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {approvedCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Ứng viên hết hạn</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {candidates.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabs danh sách theo Rule 04 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="proposals" className="text-xs gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>Danh sách đề xuất ({proposals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="candidates" className="text-xs gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span>Tài liệu hết hạn lưu trữ ({candidates.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Danh sách đề xuất tiêu hủy */}
        <TabsContent value="proposals" className="mt-4">
          <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-36 text-xs font-semibold">Mã đề xuất</TableHead>
                    <TableHead className="text-xs font-semibold">Lý do tiêu hủy</TableHead>
                    <TableHead className="w-32 text-xs font-semibold">Số tài liệu</TableHead>
                    <TableHead className="w-48 text-xs font-semibold">Biểu quyết Hội đồng</TableHead>
                    <TableHead className="w-36 text-xs font-semibold">Trạng thái</TableHead>
                    <TableHead className="w-32 text-right text-xs font-semibold">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {p.proposalCode}
                      </TableCell>
                      <TableCell className="text-xs max-w-[280px] truncate" title={p.reason}>
                        {p.reason}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        <Badge variant="secondary">{p.totalItems} tài liệu</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-semibold">{p.approvedVotes} Đồng ý</span>
                          <span>•</span>
                          <span className="text-rose-600 font-semibold">{p.rejectedVotes} Bác bỏ</span>
                          <span className="text-muted-foreground text-[11px]">/ {p.totalCouncilMembers}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.status === "APPROVED" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-2xs">
                            Hội đồng thông qua
                          </span>
                        )}
                        {p.status === "COUNCIL_REVIEW" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600 text-white shadow-2xs">
                            <Clock className="h-3 w-3" /> Chờ biểu quyết
                          </span>
                        )}
                        {p.status === "EXECUTED" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-white shadow-2xs">
                            Đã hủy hoàn tất
                          </span>
                        )}
                        {p.status === "REJECTED" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs">
                            Bác bỏ tiêu hủy
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1.5">
                        {p.status === "COUNCIL_REVIEW" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProposalForVote(p);
                              setVoteModalOpen(true);
                            }}
                            className="h-8 text-xs gap-1 text-primary border-primary/20 hover:bg-primary/5"
                          >
                            <FileCheck className="h-3.5 w-3.5" />
                            <span>Biểu quyết</span>
                          </Button>
                        )}

                        {p.status === "APPROVED" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedProposalForExec(p);
                              setExecModalOpen(true);
                            }}
                            className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1 shadow-xs"
                          >
                            <Flame className="h-3.5 w-3.5" />
                            <span>Thực thi hủy</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {proposals.length === 0 && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">Chưa có đề xuất tiêu hủy nào</p>
                          <p className="text-xs text-muted-foreground">
                            Các đề xuất sau khi thành lập Hội đồng xét hủy sẽ xuất hiện tại đây
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Danh sách ứng viên hết hạn lưu trữ */}
        <TabsContent value="candidates" className="mt-4">
          <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-36 text-xs font-semibold">Mã tài liệu</TableHead>
                    <TableHead className="text-xs font-semibold">Tiêu đề tài liệu</TableHead>
                    <TableHead className="w-36 text-xs font-semibold">Loại tài liệu</TableHead>
                    <TableHead className="w-44 text-xs font-semibold">Nhân viên sở hữu</TableHead>
                    <TableHead className="w-36 text-xs font-semibold">Hạn lưu trữ</TableHead>
                    <TableHead className="w-32 text-xs font-semibold">Điều kiện hủy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold text-foreground">
                        {c.documentCode}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {c.title}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary">{c.documentTypeName}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.employeeFullName || "---"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-rose-600 font-semibold">
                        {c.retentionUntil || "Hết hạn"}
                      </TableCell>
                      <TableCell>
                        {c.isLegalHold ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs">
                            Bị tạm giữ
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-2xs">
                            Đủ điều kiện
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {candidates.length === 0 && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <ShieldCheck className="h-8 w-8 text-emerald-600/40" />
                          <p className="text-sm font-medium">Không có tài liệu nào hết hạn lưu trữ</p>
                          <p className="text-xs text-muted-foreground">
                            Tất cả hồ sơ trong kho đều đang trong thời hạn bảo quản hợp lệ
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Lập đề xuất hủy */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-rose-600" />
              <span>Lập đề xuất tiêu hủy tài liệu</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Trình Hội đồng thẩm định tiêu hủy các tài liệu đã hết thời hạn lưu trữ bắt buộc
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="prop-code" className="text-xs font-semibold">
                Mã đề xuất *
              </Label>
              <Input
                id="prop-code"
                value={proposalCode}
                onChange={(e) => setProposalCode(e.target.value)}
                className="h-9 font-mono text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prop-reason" className="text-xs font-semibold">
                Lý do tiêu hủy theo luật định *
              </Label>
              <Textarea
                id="prop-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Hợp đồng cộng tác viên đã lưu kho đủ 5 năm theo quy định..."
                className="text-xs"
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-1">
              <span className="font-semibold text-foreground">
                Số lượng tài liệu đưa vào đề xuất:
              </span>{" "}
              <Badge variant="secondary" className="font-mono">
                {selectedCandidates.length} tài liệu
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-1">
                Yêu cầu tỷ lệ đồng thuận của Hội đồng: 100% thành viên chấp thuận.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(false)}
              className="h-9 text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCreateProposal}
              disabled={isCreating || !reason.trim() || selectedCandidates.length === 0}
              className="h-8 text-xs gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isCreating ? "Đang gửi..." : "Gửi Hội đồng xét duyệt"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Biểu quyết của Hội đồng */}
      <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <span>Biểu quyết tiêu hủy tài liệu</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mã đề xuất: {selectedProposalForVote?.proposalCode}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Ý kiến biểu quyết *</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={voteOption === "APPROVE" ? "default" : "outline"}
                  onClick={() => setVoteOption("APPROVE")}
                  className={`h-9 text-xs gap-1.5 ${
                    voteOption === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Đồng ý tiêu hủy</span>
                </Button>

                <Button
                  type="button"
                  variant={voteOption === "REJECT" ? "default" : "outline"}
                  onClick={() => setVoteOption("REJECT")}
                  className={`h-9 text-xs gap-1.5 ${
                    voteOption === "REJECT" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Không đồng ý</span>
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vote-comment" className="text-xs font-semibold">
                Nhận xét / Căn cứ biểu quyết
              </Label>
              <Textarea
                id="vote-comment"
                rows={3}
                value={voteComment}
                onChange={(e) => setVoteComment(e.target.value)}
                placeholder="Nhập căn cứ pháp lý hoặc lý do biểu quyết..."
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setVoteModalOpen(false)}
              className="h-9 text-xs"
            >
              Đóng
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleVote}
              disabled={isVoting}
              className="h-9 text-xs gap-1.5 shadow-xs"
            >
              <span>{isVoting ? "Đang gửi..." : "Xác nhận biểu quyết"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Thực thi tiêu hủy */}
      <Dialog open={execModalOpen} onOpenChange={setExecModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-rose-600" />
              <span>Thực thi tiêu hủy tài liệu</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mã đề xuất: {selectedProposalForExec?.proposalCode} (Đã được Hội đồng phê duyệt)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="evidence-url" className="text-xs font-semibold">
                Đường dẫn Biên bản tiêu hủy có chữ ký Hội đồng *
              </Label>
              <Input
                id="evidence-url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://storage.cyclosa.com/evidence/bien_ban_huy_2026.pdf"
                className="h-9 font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cert-sha" className="text-xs font-semibold">
                Mã băm SHA-256 của Biên bản tiêu hủy *
              </Label>
              <Input
                id="cert-sha"
                value={sha256Cert}
                onChange={(e) => setSha256Cert(e.target.value)}
                placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                className="h-9 font-mono text-xs"
              />
            </div>

            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3 text-xs text-rose-800 space-y-1 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" /> Cảnh báo quan trọng:
              </p>
              <p className="text-[11px] leading-relaxed">
                Hành động này sẽ chuyển trạng thái toàn bộ tài liệu trong danh mục sang
                DESTROYED vĩnh viễn và không thể phục hồi. Biên bản chứng thực sẽ được lưu vào
                Audit Trail.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExecModalOpen(false)}
              className="h-9 text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleExecute}
              disabled={isExecuting || !evidenceUrl.trim()}
              className="h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white gap-1.5 shadow-xs"
            >
              <Flame className="w-4 h-4" />
              <span>{isExecuting ? "Đang xử lý..." : "Xác nhận thực thi"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
