"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Send,
  Plus,
  Search,
  Eye,
  X,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge, ConfirmReasonDialog } from "@/components/shared";
import { toast } from "sonner";

interface SubmittedWorkflowItem {
  id: string;
  typeLabel: string;
  title: string;
  submittedAt: string;
  currentApprover: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "CANCELLED";
}

const INITIAL_SUBMITTED: SubmittedWorkflowItem[] = [
  { id: "sub_01", typeLabel: "Đơn nghỉ phép", title: "Đơn xin nghỉ phép năm 02 ngày (06/10 - 07/10)", submittedAt: "Hôm nay 09:15", currentApprover: "Nguyễn Văn An (CEO)", status: "PENDING_APPROVAL" },
  { id: "sub_02", typeLabel: "Tạm ứng lương", title: "Đề nghị tạm ứng công tác phí quý 4", submittedAt: "02/10/2026", currentApprover: "Hoàng Thảo Linh (CFO)", status: "APPROVED" },
  { id: "sub_03", typeLabel: "Bổ sung hồ sơ", title: "Cập nhật Giấy phép lái xe B2", submittedAt: "25/09/2026", currentApprover: "Trần Thị Mai (HRD)", status: "APPROVED" },
];

export default function WorkflowsSubmittedPage() {
  const [items, setItems] = useState<SubmittedWorkflowItem[]>(INITIAL_SUBMITTED);
  const [search, setSearch] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubmittedWorkflowItem | null>(null);

  const filteredItems = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.typeLabel.toLowerCase().includes(search.toLowerCase()) ||
      i.currentApprover.toLowerCase().includes(search.toLowerCase())
  );

  const handleCancelConfirm = (reason: string) => {
    if (!selectedItem) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, status: "CANCELLED" as const } : i
      )
    );
    toast.success(`Đã hủy yêu cầu: ${selectedItem.title}`);
    setCancelModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Yêu cầu Tôi đã Gửi
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/workflows/pending" className="hover:text-primary cursor-pointer transition-colors">
              Quy trình & Luồng duyệt
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Yêu cầu đã gửi (CMN-03)</span>
          </nav>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <h2 className="text-lg font-bold text-foreground">
            Danh sách yêu cầu đang theo dõi ({filteredItems.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, người duyệt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-border bg-white pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Loại yêu cầu</th>
                <th>Tiêu đề yêu cầu</th>
                <th>Thời điểm nộp</th>
                <th>Người duyệt hiện tại</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="text-xs font-semibold text-primary">
                    {item.typeLabel}
                  </td>
                  <td className="font-semibold text-foreground text-sm">
                    {item.title}
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {item.submittedAt}
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {item.currentApprover}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link href={`/workflows/${item.id}`} className="btn-icon-sm" title="Xem chi tiết luồng duyệt">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      {item.status === "PENDING_APPROVAL" && (
                        <button
                          type="button"
                          title="Hủy yêu cầu"
                          onClick={() => {
                            setSelectedItem(item);
                            setCancelModalOpen(true);
                          }}
                          className="btn-icon-sm text-destructive hover:bg-red-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>Hiển thị {filteredItems.length} trên tổng số {items.length} yêu cầu</div>
          <div className="flex items-center gap-1">
            <button type="button" disabled className="pagination-nav-btn"><ChevronLeft className="h-3.5 w-3.5" /><span>Trước</span></button>
            <button type="button" className="pagination-btn active">1</button>
            <button type="button" disabled className="pagination-nav-btn"><span>Sau</span><ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      <ConfirmReasonDialog
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        title={`Hủy yêu cầu: ${selectedItem?.title}`}
        description="Bạn có chắc chắn muốn rút lại yêu cầu này không? Các cấp quản lý sẽ nhận được thông báo hủy."
        reasonLabel="Lý do rút lại yêu cầu (Bắt buộc)"
        requiredReason={true}
        confirmText="Xác nhận hủy"
        variant="destructive"
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
}
