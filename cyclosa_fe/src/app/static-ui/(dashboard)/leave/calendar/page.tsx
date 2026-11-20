"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  CalendarDays,
  Info,
  X,
  FileText,
  UserCheck
} from "lucide-react";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

type LeaveType = "ANNUAL" | "SICK" | "MATERNITY" | "COMPENSATORY" | "UNPAID";

interface LeaveSpan {
  id: string;
  type: LeaveType;
  title: string;
  startDay: number;
  endDay: number;
  reason: string;
  approver: string;
  handoverTo: string;
}

interface TeamMemberLeave {
  id: string;
  name: string;
  code: string;
  avatar: string;
  department: string;
  role: string;
  leaves: LeaveSpan[];
}

const LEAVE_COLORS: Record<LeaveType, { label: string; bg: string; text: string; border: string }> = {
  ANNUAL: {
    label: "Phép năm",
    bg: "bg-emerald-500/20",
    text: "text-emerald-500",
    border: "border-emerald-500/40"
  },
  SICK: {
    label: "Nghỉ ốm / BHXH",
    bg: "bg-amber-500/20",
    text: "text-amber-500",
    border: "border-amber-500/40"
  },
  MATERNITY: {
    label: "Nghỉ thai sản",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/40"
  },
  COMPENSATORY: {
    label: "Nghỉ bù / Đi học",
    bg: "bg-blue-500/20",
    text: "text-blue-500",
    border: "border-blue-500/40"
  },
  UNPAID: {
    label: "Nghỉ không lương",
    bg: "bg-rose-500/20",
    text: "text-rose-500",
    border: "border-rose-500/40"
  }
};

export default function LEA08LeaveCalendarPage() {
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState<{ member: TeamMemberLeave; leave: LeaveSpan } | null>(null);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Sample Team Leave Data
  const teamLeaves: TeamMemberLeave[] = [
    {
      id: "EMP-01",
      name: "Trần Bảo Long",
      code: "FSI-101",
      avatar: "BL",
      department: "Khối Công nghệ & Sản phẩm",
      role: "Lead Solution Architect",
      leaves: [
        {
          id: "L-01",
          type: "ANNUAL",
          title: "Nghỉ phép thường niên cùng gia đình",
          startDay: 5,
          endDay: 9,
          reason: "Kỳ nghỉ gia đình định kỳ",
          approver: "Đỗ Anh Tuấn (CTO)",
          handoverTo: "Vũ Hải Đăng (Senior Dev)"
        }
      ]
    },
    {
      id: "EMP-02",
      name: "Nguyễn Thị Thảo",
      code: "FSI-108",
      avatar: "NT",
      department: "Khối Công nghệ & Sản phẩm",
      role: "Senior Frontend Engineer",
      leaves: [
        {
          id: "L-02",
          type: "SICK",
          title: "Khám sức khỏe định kỳ & điều trị",
          startDay: 8,
          endDay: 9,
          reason: "Khám định kỳ tại Vinmec",
          approver: "Trần Bảo Long",
          handoverTo: "Lê Văn Hoàng"
        },
        {
          id: "L-03",
          type: "COMPENSATORY",
          title: "Nghỉ bù trực release thứ 7 tuần trước",
          startDay: 23,
          endDay: 23,
          reason: "Nghỉ bù sự kiện Go-Live",
          approver: "Trần Bảo Long",
          handoverTo: "Lê Văn Hoàng"
        }
      ]
    },
    {
      id: "EMP-03",
      name: "Phạm Thu Hương",
      code: "FSI-204",
      avatar: "TH",
      department: "Ban Nhân sự & Văn hóa",
      role: "HR Generalist",
      leaves: [
        {
          id: "L-04",
          type: "MATERNITY",
          title: "Chế độ thai sản",
          startDay: 15,
          endDay: 31,
          reason: "Nghỉ thai sản theo quy định luật LĐ",
          approver: "Lê Minh Trang (HRD)",
          handoverTo: "Hoàng Yến Nhi (HR)"
        }
      ]
    },
    {
      id: "EMP-04",
      name: "Đặng Quang Huy",
      code: "FSI-302",
      avatar: "QH",
      department: "Ban Vận hành & Hạ tầng",
      role: "DevOps Engineer",
      leaves: [
        {
          id: "L-05",
          type: "ANNUAL",
          title: "Phép năm cá nhân",
          startDay: 8,
          endDay: 11,
          reason: "Việc gia đình ở quê",
          approver: "Vũ Đình Cường",
          handoverTo: "Nguyễn Văn Tuấn"
        }
      ]
    },
    {
      id: "EMP-05",
      name: "Lê Mai Khanh",
      code: "FSI-115",
      avatar: "MK",
      department: "Khối Công nghệ & Sản phẩm",
      role: "Product Owner",
      leaves: [
        {
          id: "L-06",
          type: "COMPENSATORY",
          title: "Nghỉ bù On-site khách hàng",
          startDay: 26,
          endDay: 28,
          reason: "Nghỉ bù sau chuỗi ngày công tác",
          approver: "Đỗ Anh Tuấn (CTO)",
          handoverTo: "Trần Bảo Long"
        }
      ]
    }
  ];

  const filteredTeam = selectedDept === "all"
    ? teamLeaves
    : teamLeaves.filter(m => m.department === selectedDept);

  const kpis = [
    {
      title: "Đang nghỉ hôm nay",
      value: "8 nhân sự",
      change: "+2 người",
      isPositive: true,
      subtext: "5 Phép năm, 2 Nghỉ ốm, 1 Thai sản"
    },
    {
      title: "Lượt nghỉ sắp tới (7 ngày tới)",
      value: "14 lượt",
      change: "Đã phê duyệt",
      isPositive: true,
      subtext: "100% đã có nhân sự bàn giao việc"
    },
    {
      title: "Cảnh báo thiếu hụt nhân sự",
      value: "1 phòng ban",
      change: "Cần chú ý",
      isPositive: false,
      subtext: "Khối Công nghệ ngày 08-09/10 vắng 25%"
    },
    {
      title: "Tỷ lệ khả dụng nhân sự",
      value: "95.2%",
      change: "+1.2%",
      isPositive: true,
      subtext: "Đạt mục tiêu duy trì vận hành ổn định"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="hover:text-foreground transition-colors">Nghỉ phép & Nghỉ lễ</span>
            <span>/</span>
            <span className="text-foreground font-medium">Lịch nghỉ đội nhóm</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Lịch nghỉ toàn công ty & Đội ngũ
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dòng thời gian trực quan ai nghỉ ngày nào theo phòng ban. Giúp quản lý cân đối nguồn lực và tránh xung đột kế hoạch dự án.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "timeline" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Dòng thời gian (Gantt)</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Lưới tháng</span>
            </button>
          </div>

          <button className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Tạo đơn nghỉ hộ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards metrics={kpis} />

      {/* Main Gantt Timeline View */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-accent border border-border text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-card border border-border rounded-md">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Tháng 10, 2026</span>
            </div>
            <button className="p-1.5 rounded-md hover:bg-accent border border-border text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground ml-2">Hôm nay: Ngày 08</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Legend */}
            <div className="hidden xl:flex items-center gap-2 mr-2 py-1 px-2.5 bg-background rounded-md border border-border text-[11px]">
              {(Object.keys(LEAVE_COLORS) as LeaveType[]).map((type) => {
                const c = LEAVE_COLORS[type];
                return (
                  <span key={type} className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.bg} ${c.border} border`} />
                    <span className="text-muted-foreground">{c.label}</span>
                  </span>
                );
              })}
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-background border border-border rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Tất cả phòng ban ({teamLeaves.length})</option>
              <option value="Khối Công nghệ & Sản phẩm">Khối Công nghệ & Sản phẩm</option>
              <option value="Ban Nhân sự & Văn hóa">Ban Nhân sự & Văn hóa</option>
              <option value="Ban Vận hành & Hạ tầng">Ban Vận hành & Hạ tầng</option>
            </select>
          </div>
        </div>

        {/* Timeline Gantt Grid */}
        {viewMode === "timeline" ? (
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              {/* Timeline Header Days */}
              <div className="flex border-b border-border bg-muted/40 text-[11px] text-muted-foreground font-semibold">
                <div className="w-64 min-w-[250px] p-3 border-r border-border shrink-0 sticky left-0 bg-muted/95 backdrop-blur z-20">
                  Nhân viên
                </div>
                <div className="flex-1 grid grid-cols-31 text-center divide-x divide-border">
                  {daysInMonth.map((d) => {
                    const isToday = d === 8;
                    const isWeekend = [3, 4, 10, 11, 17, 18, 24, 25, 31].includes(d);
                    return (
                      <div
                        key={d}
                        className={`py-2 text-[11px] ${
                          isToday ? "bg-primary/15 text-primary font-bold" : ""
                        } ${isWeekend ? "bg-muted/60" : ""}`}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Rows */}
              <div className="divide-y divide-border">
                {filteredTeam.map((member) => (
                  <div key={member.id} className="flex hover:bg-muted/20 transition-colors relative group">
                    {/* Member Info */}
                    <div className="w-64 min-w-[250px] p-3 border-r border-border shrink-0 sticky left-0 bg-card group-hover:bg-card/90 backdrop-blur z-10 flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {member.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate flex items-center gap-1.5">
                          {member.name}
                          <span className="text-[10px] text-muted-foreground font-mono">({member.code})</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">{member.role}</div>
                      </div>
                    </div>

                    {/* Timeline 31-Day Background Grid */}
                    <div className="flex-1 grid grid-cols-31 divide-x divide-border relative">
                      {daysInMonth.map((d) => {
                        const isToday = d === 8;
                        const isWeekend = [3, 4, 10, 11, 17, 18, 24, 25, 31].includes(d);
                        return (
                          <div
                            key={d}
                            className={`min-h-[56px] ${isToday ? "bg-primary/[0.04]" : ""} ${
                              isWeekend ? "bg-muted/30" : ""
                            }`}
                          />
                        );
                      })}

                      {/* Floating Leave Gantt Bars */}
                      {member.leaves.map((leave) => {
                        const styleConfig = LEAVE_COLORS[leave.type];
                        const leftPercent = ((leave.startDay - 1) / 31) * 100;
                        const widthPercent = ((leave.endDay - leave.startDay + 1) / 31) * 100;

                        return (
                          <button
                            key={leave.id}
                            onClick={() => setSelectedLeave({ member, leave })}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`
                            }}
                            className={`absolute top-2 bottom-2 mx-1 px-2.5 rounded-md border flex items-center justify-between text-left transition-transform hover:scale-[1.02] shadow-xs cursor-pointer z-10 ${styleConfig.bg} ${styleConfig.border}`}
                          >
                            <span className={`text-[11px] font-semibold truncate ${styleConfig.text}`}>
                              {styleConfig.label}: {leave.title}
                            </span>
                            <span className={`text-[10px] font-mono shrink-0 ml-1 ${styleConfig.text}`}>
                              {leave.startDay === leave.endDay ? `N${leave.startDay}` : `${leave.startDay}-${leave.endDay}/10`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Staffing Shortage Heatmap / Capacity Row */}
              <div className="border-t border-border bg-muted/40 flex text-xs">
                <div className="w-64 min-w-[250px] p-3 border-r border-border shrink-0 sticky left-0 bg-muted/95 backdrop-blur z-20 font-semibold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Mức độ tập trung vắng mặt
                </div>
                <div className="flex-1 grid grid-cols-31 divide-x divide-border text-center py-2">
                  {daysInMonth.map((d) => {
                    // Count how many people on leave on day d
                    const count = filteredTeam.filter(m =>
                      m.leaves.some(l => d >= l.startDay && d <= l.endDay)
                    ).length;

                    const isHigh = count >= 3;
                    const isMed = count === 2;

                    return (
                      <div key={d} className="flex flex-col items-center justify-center">
                        {count > 0 ? (
                          <span
                            className={`text-[10px] font-bold px-1 rounded ${
                              isHigh ? "bg-rose-500/20 text-rose-500" : isMed ? "bg-amber-500/20 text-amber-500" : "text-muted-foreground"
                            }`}
                          >
                            {count}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/30">-</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Monthly Grid View */
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"].map((day) => (
                <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground bg-muted/30 rounded-lg">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
                const dayLeaves = filteredTeam.flatMap(m =>
                  m.leaves.filter(l => date >= l.startDay && date <= l.endDay).map(l => ({ member: m, leave: l }))
                );

                return (
                  <div
                    key={date}
                    className={`min-h-[90px] p-2 border border-border rounded-lg flex flex-col justify-between transition-colors ${
                      date === 8 ? "bg-primary/5 border-primary/40 font-bold" : "bg-card hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={date === 8 ? "text-primary font-bold" : "text-muted-foreground"}>{date}</span>
                      {date === 8 && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full">
                          Hôm nay
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayLeaves.slice(0, 2).map((item, idx) => {
                        const c = LEAVE_COLORS[item.leave.type];
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedLeave(item)}
                            className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer ${c.bg} ${c.text}`}
                          >
                            {item.member.name.split(" ").slice(-1)[0]}: {c.label}
                          </div>
                        );
                      })}
                      {dayLeaves.length > 2 && (
                        <span className="text-[9px] text-muted-foreground block text-center">
                          +{dayLeaves.length - 2} người nữa
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Leave Detail Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground text-sm">Chi tiết đơn nghỉ phép</h3>
                  <p className="text-xs text-muted-foreground">{selectedLeave.leave.id} • Đã được duyệt</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeave(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {selectedLeave.member.avatar}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">{selectedLeave.member.name}</div>
                  <div className="text-muted-foreground">{selectedLeave.member.role} • {selectedLeave.member.department}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-card border border-border rounded-lg">
                  <span className="text-muted-foreground block text-[11px] mb-1">Loại hình nghỉ:</span>
                  <span className={`font-semibold ${LEAVE_COLORS[selectedLeave.leave.type].text}`}>
                    {LEAVE_COLORS[selectedLeave.leave.type].label}
                  </span>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg">
                  <span className="text-muted-foreground block text-[11px] mb-1">Thời gian:</span>
                  <span className="font-semibold text-foreground">
                    {selectedLeave.leave.startDay}/10 - {selectedLeave.leave.endDay}/10/2026
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-muted-foreground font-medium">Lý do nghỉ phép:</span>
                <p className="p-3 bg-muted/20 border border-border rounded-lg text-foreground italic">
                  &ldquo;{selectedLeave.leave.reason}&rdquo;
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-emerald-500" /> Người phê duyệt:
                  </span>
                  <span className="font-medium text-foreground">{selectedLeave.leave.approver}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" /> Bàn giao công việc cho:
                  </span>
                  <span className="font-medium text-foreground">{selectedLeave.leave.handoverTo}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
              <button
                onClick={() => setSelectedLeave(null)}
                className="btn-primary text-xs px-4 py-1.5"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
