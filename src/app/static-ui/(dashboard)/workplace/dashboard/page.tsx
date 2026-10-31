"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Monitor,
  Users,
  AlertTriangle,
  Calendar,
  Layers,
  Building,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DoorOpen,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

interface MeetingRoomItem {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  devices: string[];
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
}

const INITIAL_ROOMS: MeetingRoomItem[] = [
  { id: "mr_01", name: "Phòng Hội Nghị Thăng Long", floor: "Tầng 10", capacity: 30, devices: ["Màn hình 85-inch", "Polycom Conference", "Bảng thông minh"], status: "OCCUPIED" },
  { id: "mr_02", name: "Phòng Họp Sáng Tạo FSI", floor: "Tầng 9", capacity: 12, devices: ["Màn hình 65-inch", "Micro đa hướng"], status: "AVAILABLE" },
  { id: "mr_03", name: "Phòng Họp Ban Điều Hành", floor: "Tầng 12", capacity: 16, devices: ["Hệ thống Cisco Webex", "Camera AI"], status: "AVAILABLE" },
  { id: "mr_04", name: "Phòng Họp Dự Án Agile", floor: "Tầng 8", capacity: 8, devices: ["Màn hình TV", "Bảng kính"], status: "AVAILABLE" },
];

export default function WorkplaceDashboardPage() {
  const [rooms] = useState<MeetingRoomItem[]>(INITIAL_ROOMS);
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Không gian Làm việc Thông minh
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Nơi làm việc & Tài sản
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Bảng điều khiển nơi làm việc</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/me/workplace" className="btn-primary">
            <Monitor className="h-4 w-4" />
            <span>Sơ đồ đặt bàn 2D (Hot-desking)</span>
          </Link>

          <button
            type="button"
            onClick={() => setKpiCollapsed(!kpiCollapsed)}
            title={kpiCollapsed ? "Mở rộng thống kê" : "Thu gọn thống kê"}
            className="btn-icon"
          >
            {kpiCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────── */}
      {!kpiCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-primary">
                <Monitor className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tỷ lệ lấp đầy bàn hôm nay</p>
                <h3 className="kpi-value">78.5%</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,35 Q25,38 50,22 T100,8" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-accent">
                <DoorOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Phòng họp đang trống</p>
                <h3 className="kpi-value">
                  {rooms.filter((r) => r.status === "AVAILABLE").length} / {rooms.length} phòng
                </h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,38 Q30,42 60,18 T100,5" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-[#38BDF8]">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tổng số tầng hoạt động</p>
                <h3 className="kpi-value text-xl">4 tầng lầu</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,30 Q35,12 70,25 T100,10" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-amber-500">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Yêu cầu bảo trì / Sự cố</p>
                <h3 className="kpi-value text-xl">2 sự cố</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,25 L35,18 L65,30 L100,12" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Hiện trạng phòng họp & phòng hội nghị thông minh
            </h2>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tên phòng họp</th>
                <th>Vị trí tầng</th>
                <th className="text-center">Sức chứa tối đa</th>
                <th>Trang thiết bị tích hợp</th>
                <th className="text-center">Trạng thái hiện tại</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rooms.map((r) => (
                <tr key={r.id} className="table-row">
                  <td className="font-semibold text-foreground text-sm">
                    {r.name}
                  </td>
                  <td className="text-xs text-muted-foreground font-mono">
                    {r.floor}
                  </td>
                  <td className="text-center font-bold text-xs text-foreground">
                    {r.capacity} người
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {r.devices.map((d) => (
                        <span
                          key={d}
                          className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-center">
                    {r.status === "AVAILABLE" ? (
                      <span className="badge badge-active">Đang trống</span>
                    ) : (
                      <span className="badge badge-inactive">Đang có họp</span>
                    )}
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      disabled={r.status !== "AVAILABLE"}
                      onClick={() => toast.success(`Đã đặt phòng: ${r.name}`)}
                      className="btn-outline h-7 text-xs disabled:opacity-40"
                    >
                      Đặt phòng ngay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {rooms.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{rooms.length}</span> phòng họp
          </div>
          <div className="flex items-center gap-1">
            <button type="button" disabled className="pagination-nav-btn">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </button>
            <button type="button" className="pagination-btn active">
              1
            </button>
            <button type="button" disabled className="pagination-nav-btn">
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
