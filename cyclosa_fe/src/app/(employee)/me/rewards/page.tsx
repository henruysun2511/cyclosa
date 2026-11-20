"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  MessageSquareShare,
  Calendar,
  ShieldCheck,
  Send,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMyRewardDecisionsQuery,
  useGetMyComplaintsQuery,
  useCreateMyComplaintMutation,
} from "@/features/reward/api/reward-api";
import {
  REWARD_TYPE_LABELS,
  COMPLAINT_CATEGORY_LABELS,
  COMPLAINT_CATEGORY_OPTIONS,
  COMPLAINT_STATUS_LABELS,
} from "@/features/reward/constants/reward.constants";
import type { ComplaintCategory } from "@/features/reward/types/reward.types";
import { toast } from "sonner";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "---";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "---" : d.toLocaleDateString("vi-VN");
  } catch {
    return "---";
  }
}

export default function EmployeeRewardsPage() {
  const { data: rewardsData, isLoading: loadingRewards } = useGetMyRewardDecisionsQuery();
  const { data: complaintsData, isLoading: loadingComplaints, refetch: refetchComplaints } = useGetMyComplaintsQuery();
  const [createComplaint, { isLoading: submittingComplaint }] = useCreateMyComplaintMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState<ComplaintCategory>("WORKING_CONDITIONS");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const rewards = rewardsData?.data || [];
  const complaints = complaintsData?.data?.items || [];
  const latestReward = rewards[0];

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Vui lòng nhập tiêu đề phản ánh");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung phản ánh");
      return;
    }

    try {
      await createComplaint({
        category,
        subject: subject.trim(),
        content: content.trim(),
      }).unwrap();
      toast.success("Đã gửi phản ánh bảo mật thành công tới phòng Nhân sự");
      setDialogOpen(false);
      setSubject("");
      setContent("");
      refetchComplaints();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Không thể gửi phản ánh";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Trophy className="w-6 h-6 text-primary shrink-0" />
            <span>Khen thưởng & Góp ý</span>
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
            <span className="text-foreground font-medium">Khen thưởng & Góp ý</span>
          </nav>
        </div>
      </div>

      {/* 2. Vinh danh khen thưởng nổi bật */}
      {loadingRewards ? (
        <Card className="rounded-xl border shadow-xs bg-card p-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
        </Card>
      ) : latestReward ? (
        <Card className="rounded-xl border shadow-xs bg-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-600 text-white text-[11px] flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  {REWARD_TYPE_LABELS[latestReward.rewardType] || "Vinh danh thành tích"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Quyết định ngày {formatDate(latestReward.decisionDate)}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {latestReward.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                Người ký quyết định: {latestReward.decidedByEmployeeName || "Ban Giám Đốc"}
                {latestReward.amount ? (
                  <>
                    {" "}• Mức thưởng: <span className="font-bold text-primary">{latestReward.amount.toLocaleString("vi-VN")} VNĐ</span>
                  </>
                ) : null}
              </p>
            </div>

            {latestReward.pushedToPayroll && (
              <Badge variant="outline" className="text-xs font-semibold px-3 py-1">
                Đã đồng bộ chi trả lương
              </Badge>
            )}
          </div>

          {latestReward.reason && (
            <div className="pt-4 text-xs">
              <span className="font-semibold text-foreground">Lý do khen thưởng:</span>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                "{latestReward.reason}"
              </p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="rounded-xl border shadow-xs bg-card p-6 text-center">
          <p className="text-sm font-medium text-foreground">Chưa có quyết định khen thưởng nào được ghi nhận</p>
          <p className="text-xs text-muted-foreground mt-1">Các danh hiệu thi đua và quyết định khen thưởng cá nhân sẽ được vinh danh tại đây</p>
        </Card>
      )}

      {/* 3. Lịch sử quyết định khen thưởng */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold text-foreground">
            Danh mục Quyết định Khen thưởng đã nhận
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Danh hiệu / Quyết định</TableHead>
                  <TableHead className="font-semibold text-xs">Hình thức</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Tiền thưởng</TableHead>
                  <TableHead className="font-semibold text-xs">Ngày ban hành</TableHead>
                  <TableHead className="font-semibold text-xs">Người quyết định</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRewards ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    </TableRow>
                  ))
                ) : rewards.length > 0 ? (
                  rewards.map((rw) => (
                    <TableRow key={rw.id}>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {rw.title}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="text-[10px]">
                          {REWARD_TYPE_LABELS[rw.rewardType] || rw.rewardType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {rw.amount ? `${rw.amount.toLocaleString("vi-VN")} đ` : "---"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(rw.decisionDate)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {rw.decidedByEmployeeName || "Ban Giám Đốc"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-28 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-1.5">
                        <Trophy className="h-7 w-7 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Chưa có quyết định khen thưởng nào</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Lịch sử phản ánh / góp ý bảo mật */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Phản ánh & Góp ý bảo mật đã gửi
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toàn bộ thông tin phản ánh được mã hóa và bảo vệ tính ẩn danh của nhân sự
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-8 gap-1.5 text-xs bg-primary text-white cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gửi phản ánh</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Mã phản ánh</TableHead>
                  <TableHead className="font-semibold text-xs">Chủ đề / Tiêu đề</TableHead>
                  <TableHead className="font-semibold text-xs">Danh mục</TableHead>
                  <TableHead className="font-semibold text-xs">Ngày gửi</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-xs">Kết quả xử lý</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingComplaints ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    </TableRow>
                  ))
                ) : complaints.length > 0 ? (
                  complaints.map((c) => {
                    const statusVariantMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
                      OPEN: "outline",
                      INVESTIGATING: "secondary",
                      RESOLVED: "default",
                      CLOSED: "default",
                    };
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-semibold text-xs text-foreground font-mono">
                          {c.id.substring(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground">
                          {c.subject}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px]">
                            {COMPLAINT_CATEGORY_LABELS[c.category] || c.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(c.submittedAt)}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <Badge variant={statusVariantMap[c.status] || "outline"} className="text-[10px]">
                            {COMPLAINT_STATUS_LABELS[c.status] || c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {c.resolution || "Đang trong tiến trình tiếp nhận & xác minh"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-1.5">
                        <ShieldCheck className="h-7 w-7 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Chưa có phản ánh hoặc khiếu nại nào</p>
                        <p className="text-xs text-muted-foreground">Bạn có thể gửi ý kiến đóng góp hoặc phản ánh để cải thiện môi trường làm việc</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Gửi phản ánh bảo mật */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleCreateComplaint}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Gửi phản ánh / Góp ý bảo mật</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Ý kiến của bạn sẽ được tiếp nhận trực tiếp bởi Ban Thanh tra & Nhân sự theo quy trình bảo mật nghiêm ngặt.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold">
                  Phân loại phản ánh <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => val && setCategory(val as ComplaintCategory)}
                >
                  <SelectTrigger id="category" className="h-9 text-xs">
                    <SelectValue placeholder="Chọn phân loại...">
                      {COMPLAINT_CATEGORY_LABELS[category] || "Chọn phân loại..."}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLAINT_CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs font-semibold">
                  Tiêu đề phản ánh <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="Tóm tắt ngắn gọn nội dung phản ánh..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-semibold">
                  Nội dung chi tiết <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Trình bày cụ thể sự việc, thời gian, địa điểm và đề xuất hướng xử lý..."
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                disabled={submittingComplaint}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-white"
                disabled={submittingComplaint}
              >
                {submittingComplaint && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                Gửi phản ánh
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
