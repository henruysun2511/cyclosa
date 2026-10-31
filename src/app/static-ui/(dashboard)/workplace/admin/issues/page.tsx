"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wrench,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Compass,
  User,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FacilityIssue {
  id: string;
  code: string;
  title: string;
  location: string;
  category: "ĐIỆN_LẠNH" | "MẠNG_LAN" | "NỘI_THẤT" | "THIẾT_BỊ";
  priority: "KHẨN_CẤP" | "CAO" | "TRUNG_BÌNH";
  reporterName: string;
  assigneeName: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export default function FacilityIssuesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  const [issues, setIssues] = useState<FacilityIssue[]>([
    {
      id: "iss_01",
      code: "TK-2026-089",
      title: "Máy lạnh tầng 3 khu Backend phả gió quá lạnh",
      location: "Tầng 3 • Zone A Kỹ thuật",
      category: "ĐIỆN_LẠNH",
      priority: "CAO",
      reporterName: "Nguyễn Văn An",
      assigneeName: "Vũ Văn Cường (Kỹ thuật viên)",
      status: "IN_PROGRESS",
      createdAt: "Hôm nay, 09:15"
    },
    {
      id: "iss_02",
      code: "TK-2026-088",
      title: "Chập chờn cổng mạng LAN tại Bàn A-202",
      location: "Bàn A-202 • Tầng 3",
      category: "MẠNG_LAN",
      priority: "KHẨN_CẤP",
      reporterName: "Phạm Minh Tuấn",
      assigneeName: "Nguyễn Hải Đăng (IT Admin)",
      status: "IN_PROGRESS",
      createdAt: "Hôm nay, 08:30"
    },
    {
      id: "iss_03",
      code: "TK-2026-087",
      title: "Ghế Ergonomic Bàn B-104 bị kẹt cần nâng hạ",
      location: "Bàn B-104 • Tầng 3",
      category: "NỘI_THẤT",
      priority: "TRUNG_BÌNH",
      reporterName: "Nguyễn Thu Hà",
      assigneeName: "Chưa phân công",
      status: "OPEN",
      createdAt: "Hôm qua, 16:45"
    },
    {
      id: "iss_04",
      code: "TK-2026-086",
      title: "Đèn LED rọi bàn A-021 bị chập chờn",
      location: "Bàn A-021 • Tầng 3",
      category: "ĐIỆN_LẠNH",
      priority: "TRUNG_BÌNH",
      reporterName: "Trần Bảo Ngọc",
      assigneeName: "Vũ Văn Cường (Kỹ thuật viên)",
      status: "RESOLVED",
      createdAt: "05/10/2026"
    },
    {
      id: "iss_05",
      code: "TK-2026-085",
      title: "Máy in tầng 3 hết giấy và kẹt khay nạp 2",
      location: "Cụm máy in • Tầng 3",
      category: "THIẾT_BỊ",
      priority: "CAO",
      reporterName: "Đỗ Kim Oanh",
      assigneeName: "Trần Mai Phương (Office Admin)",
      status: "RESOLVED",
      createdAt: "04/10/2026"
    }
  ]);

  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      if (filterStatus !== "ALL" && iss.status !== filterStatus) return false;
      if (filterPriority !== "ALL" && iss.priority !== filterPriority) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          iss.code.toLowerCase().includes(term) ||
          iss.title.toLowerCase().includes(term) ||
          iss.location.toLowerCase().includes(term) ||
          iss.reporterName.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [issues, filterStatus, filterPriority, searchTerm]);

  const handleUpdateStatus = (id: string, newStatus: FacilityIssue["status"]) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, status: newStatus } : iss))
    );
    toast.success("Đã cập nhật trạng thái phiếu xử lý sự cố!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <span>Sự cố Cơ sở vật chất & Helpdesk</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Office Helpdesk
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tiếp nhận và điều phối giải quyết các phản ánh về điện lạnh, mạng LAN, thiết bị văn phòng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-8.5 text-xs gap-1.5">
            <Link href="/workplace/map">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Kiểm tra trên Bản đồ 2D</span>
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => toast.info("Mở form tạo phiếu sự cố nội bộ mới.")}
            className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tạo phiếu báo hỏng</span>
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Tổng số phiếu</span>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">14</div>
              <span className="text-[11px] text-muted-foreground">Trong tháng 10/2026</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Chờ tiếp nhận</span>
              <div className="text-2xl font-bold font-mono text-amber-600 mt-0.5">1</div>
              <span className="text-[11px] text-muted-foreground">Cần phân công kỹ thuật</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Đang xử lý</span>
              <div className="text-2xl font-bold font-mono text-primary mt-0.5">2</div>
              <span className="text-[11px] text-muted-foreground">Kỹ thuật viên đang kiểm tra</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 text-primary flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Đã khắc phục</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">11</div>
              <span className="text-[11px] text-muted-foreground">Tỷ lệ hoàn thành: 78%</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Danh sách Sự cố ──────────────────────────────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="py-3 px-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Tìm kiếm phiếu, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="OPEN">Chờ tiếp nhận</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="RESOLVED">Đã khắc phục</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">Tất cả mức ưu tiên</option>
              <option value="KHẨN_CẤP">Khẩn cấp</option>
              <option value="CAO">Ưu tiên cao</option>
              <option value="TRUNG_BÌNH">Bình thường</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Mã phiếu</th>
                  <th className="py-3 px-4">Nội dung phản ánh</th>
                  <th className="py-3 px-4">Vị trí</th>
                  <th className="py-3 px-4">Mức ưu tiên</th>
                  <th className="py-3 px-4">Người báo</th>
                  <th className="py-3 px-4">Kỹ thuật viên phụ trách</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {iss.code}
                    </td>
                    <td className="py-3 px-4 max-w-[260px]">
                      <strong className="text-foreground block truncate">{iss.title}</strong>
                      <span className="text-[10px] text-muted-foreground">{iss.createdAt}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-foreground font-medium block">{iss.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          iss.priority === "KHẨN_CẤP" && "bg-red-100 text-primary border-red-300 font-bold",
                          iss.priority === "CAO" && "bg-amber-50 text-amber-700 border-amber-300",
                          iss.priority === "TRUNG_BÌNH" && "bg-slate-100 text-slate-700"
                        )}
                      >
                        {iss.priority === "KHẨN_CẤP" && "Khẩn cấp"}
                        {iss.priority === "CAO" && "Ưu tiên cao"}
                        {iss.priority === "TRUNG_BÌNH" && "Bình thường"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {iss.reporterName}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {iss.assigneeName}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0.5 border font-semibold",
                          iss.status === "OPEN" && "bg-amber-50 text-amber-700 border-amber-300",
                          iss.status === "IN_PROGRESS" && "bg-red-50 text-primary border-red-300",
                          iss.status === "RESOLVED" && "bg-emerald-50 text-emerald-700 border-emerald-300"
                        )}
                      >
                        {iss.status === "OPEN" && "● Chờ tiếp nhận"}
                        {iss.status === "IN_PROGRESS" && "● Đang xử lý"}
                        {iss.status === "RESOLVED" && "● Đã khắc phục"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {iss.status !== "RESOLVED" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(iss.id, "RESOLVED")}
                          className="h-7 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                        >
                          Xong
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-mono">Đã đóng</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
