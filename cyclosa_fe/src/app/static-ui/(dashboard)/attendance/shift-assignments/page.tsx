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
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRightLeft,
  SlidersHorizontal,
  Sun,
  Sunset,
  Moon,
  Coffee
} from "lucide-react";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT" | "OFF";

interface ShiftDef {
  id: ShiftType;
  label: string;
  time: string;
  color: string;
  bg: string;
  border: string;
  icon: any;
}

const SHIFT_TYPES: Record<ShiftType, ShiftDef> = {
  MORNING: {
    id: "MORNING",
    label: "Ca Sáng",
    time: "08:00 - 17:00",
    color: "text-amber-500",
    bg: "bg-amber-500/10 hover:bg-amber-500/20",
    border: "border-amber-500/30",
    icon: Sun
  },
  AFTERNOON: {
    id: "AFTERNOON",
    label: "Ca Chiều",
    time: "13:00 - 21:00",
    color: "text-blue-500",
    bg: "bg-blue-500/10 hover:bg-blue-500/20",
    border: "border-blue-500/30",
    icon: Sunset
  },
  NIGHT: {
    id: "NIGHT",
    label: "Ca Đêm",
    time: "21:00 - 06:00",
    color: "text-purple-400",
    bg: "bg-purple-500/10 hover:bg-purple-500/20",
    border: "border-purple-500/30",
    icon: Moon
  },
  OFF: {
    id: "OFF",
    label: "Nghỉ ca",
    time: "OFF",
    color: "text-muted-foreground",
    bg: "bg-muted/40 hover:bg-muted/70",
    border: "border-border",
    icon: Coffee
  }
};

interface EmployeeShiftRow {
  id: string;
  code: string;
  name: string;
  avatar: string;
  department: string;
  role: string;
  shifts: Record<string, ShiftType>; // dateKey -> ShiftType
}

export default function ATT02ShiftAssignmentsPage() {
  const [selectedDept, setSelectedDept] = useState("all");
  const [activeCell, setActiveCell] = useState<{ empId: string; empName: string; dateKey: string; currentShift: ShiftType } | null>(null);
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false);

  // Week days
  const weekDays = [
    { key: "2026-10-05", dayName: "Thứ 2", dateStr: "05/10" },
    { key: "2026-10-06", dayName: "Thứ 3", dateStr: "06/10" },
    { key: "2026-10-07", dayName: "Thứ 4", dateStr: "07/10" },
    { key: "2026-10-08", dayName: "Thứ 5", dateStr: "08/10", isToday: true },
    { key: "2026-10-09", dayName: "Thứ 6", dateStr: "09/10" },
    { key: "2026-10-10", dayName: "Thứ 7", dateStr: "10/10", isWeekend: true },
    { key: "2026-10-11", dayName: "Chủ Nhật", dateStr: "11/10", isWeekend: true },
  ];

  const [employees, setEmployees] = useState<EmployeeShiftRow[]>([
    {
      id: "EMP-001",
      code: "FSI-102",
      name: "Nguyễn Văn An",
      avatar: "NA",
      department: "Vận hành & Hỗ trợ (NOC)",
      role: "Trưởng nhóm Vận hành",
      shifts: {
        "2026-10-05": "MORNING",
        "2026-10-06": "MORNING",
        "2026-10-07": "MORNING",
        "2026-10-08": "AFTERNOON",
        "2026-10-09": "AFTERNOON",
        "2026-10-10": "OFF",
        "2026-10-11": "OFF",
      }
    },
    {
      id: "EMP-002",
      code: "FSI-105",
      name: "Trần Thị Bích Ngọc",
      avatar: "TN",
      department: "Vận hành & Hỗ trợ (NOC)",
      role: "Kỹ sư Giám sát 24/7",
      shifts: {
        "2026-10-05": "NIGHT",
        "2026-10-06": "NIGHT",
        "2026-10-07": "OFF",
        "2026-10-08": "MORNING",
        "2026-10-09": "MORNING",
        "2026-10-10": "MORNING",
        "2026-10-11": "OFF",
      }
    },
    {
      id: "EMP-003",
      code: "FSI-112",
      name: "Lê Hoàng Long",
      avatar: "LL",
      department: "Vận hành & Hỗ trợ (NOC)",
      role: "Chuyên viên Hỗ trợ KH",
      shifts: {
        "2026-10-05": "AFTERNOON",
        "2026-10-06": "AFTERNOON",
        "2026-10-07": "AFTERNOON",
        "2026-10-08": "NIGHT",
        "2026-10-09": "NIGHT",
        "2026-10-10": "OFF",
        "2026-10-11": "OFF",
      }
    },
    {
      id: "EMP-004",
      code: "FSI-201",
      name: "Phạm Hải Đăng",
      avatar: "PD",
      department: "Khối Công nghệ & Phần mềm",
      role: "Senior DevOps Engineer",
      shifts: {
        "2026-10-05": "MORNING",
        "2026-10-06": "MORNING",
        "2026-10-07": "MORNING",
        "2026-10-08": "MORNING",
        "2026-10-09": "MORNING",
        "2026-10-10": "OFF",
        "2026-10-11": "OFF",
      }
    },
    {
      id: "EMP-005",
      code: "FSI-208",
      name: "Đỗ Mai Phương",
      avatar: "DP",
      department: "Khối Công nghệ & Phần mềm",
      role: "Backend Lead Developer",
      shifts: {
        "2026-10-05": "MORNING",
        "2026-10-06": "MORNING",
        "2026-10-07": "AFTERNOON",
        "2026-10-08": "MORNING",
        "2026-10-09": "MORNING",
        "2026-10-10": "OFF",
        "2026-10-11": "OFF",
      }
    },
    {
      id: "EMP-006",
      code: "FSI-304",
      name: "Vũ Quốc Hưng",
      avatar: "VH",
      department: "Bộ phận An ninh & Cơ sở",
      role: "Nhân viên An ninh ca trưởng",
      shifts: {
        "2026-10-05": "NIGHT",
        "2026-10-06": "OFF",
        "2026-10-07": "NIGHT",
        "2026-10-08": "OFF",
        "2026-10-09": "NIGHT",
        "2026-10-10": "NIGHT",
        "2026-10-11": "OFF",
      }
    }
  ]);

  const filteredEmployees = selectedDept === "all"
    ? employees
    : employees.filter(e => e.department === selectedDept);

  const handleUpdateShift = (newShift: ShiftType) => {
    if (!activeCell) return;
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === activeCell.empId) {
          return {
            ...emp,
            shifts: {
              ...emp.shifts,
              [activeCell.dateKey]: newShift
            }
          };
        }
        return emp;
      })
    );
    setActiveCell(null);
  };

  // KPI Metrics
  const kpiData = [
    {
      title: "Tổng nhân sự phân ca",
      value: "142",
      change: "+6 nhân sự",
      isPositive: true,
      subtext: "Toàn bộ 3 khối vận hành & trực"
    },
    {
      title: "Độ phủ ca trực 24/7",
      value: "98.4%",
      change: "+2.1%",
      isPositive: true,
      subtext: "Đạt chuẩn SLA hệ thống cấp 1"
    },
    {
      title: "Xung đột / Trùng ca",
      value: "0",
      change: "An toàn",
      isPositive: true,
      subtext: "Không có nhân sự trực quá 12h"
    },
    {
      title: "Yêu cầu đổi ca chờ duyệt",
      value: "3",
      change: "Cần xử lý",
      isPositive: false,
      subtext: "2 ca đêm, 1 ca chủ nhật"
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
            <span className="hover:text-foreground transition-colors">Chấm công & Điểm danh</span>
            <span>/</span>
            <span className="text-foreground font-medium">Lưới phân ca</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Phân ca làm việc tuần
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lưới điều phối ma trận Nhân viên × Ca trực tuần. Hỗ trợ gán ca linh hoạt, phát hiện vi phạm giờ nghỉ ngơi và phân ca thông minh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAutoScheduleModal(true)}
            className="btn-outline flex items-center gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/5"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Xếp ca tự động (AI)</span>
          </button>
          <button className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Phân ca hàng loạt</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards metrics={kpiData} />

      {/* Main Shift Matrix Card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3 bg-muted/20">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-accent border border-border text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-card border border-border rounded-md">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Tuần 41: 05/10/2026 - 11/10/2026</span>
            </div>
            <button className="p-1.5 rounded-md hover:bg-accent border border-border text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button className="text-xs text-primary hover:underline font-medium px-2 py-1">
              Tuần hiện tại
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Shift legend badges */}
            <div className="hidden lg:flex items-center gap-2 mr-2 py-1 px-2.5 bg-background rounded-md border border-border text-[11px]">
              <span className="text-muted-foreground font-medium">Quy ước ca:</span>
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <Sun className="h-3 w-3" /> Sáng (8h)
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1 text-blue-500 font-medium">
                <Sunset className="h-3 w-3" /> Chiều (8h)
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1 text-purple-400 font-medium">
                <Moon className="h-3 w-3" /> Đêm (8h)
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Coffee className="h-3 w-3" /> Nghỉ ca
              </span>
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-background border border-border rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Tất cả phòng ban ({employees.length})</option>
              <option value="Vận hành & Hỗ trợ (NOC)">Vận hành & Hỗ trợ (NOC)</option>
              <option value="Khối Công nghệ & Phần mềm">Khối Công nghệ & Phần mềm</option>
              <option value="Bộ phận An ninh & Cơ sở">Bộ phận An ninh & Cơ sở</option>
            </select>

            <button className="btn-outline text-xs flex items-center gap-1 px-2.5 py-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                <th className="p-3 text-left w-64 min-w-[240px] sticky left-0 bg-muted/95 backdrop-blur z-10 border-r border-border">
                  Nhân viên & Vị trí
                </th>
                {weekDays.map((d) => (
                  <th
                    key={d.key}
                    className={`p-2.5 text-center min-w-[125px] border-r border-border last:border-r-0 ${
                      d.isToday ? "bg-primary/10 text-primary font-bold" : ""
                    } ${d.isWeekend ? "bg-muted/60" : ""}`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-semibold text-foreground">{d.dayName}</span>
                      <span className="text-[11px] text-muted-foreground">{d.dateStr}</span>
                      {d.isToday && (
                        <span className="mt-0.5 text-[9px] px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full font-bold">
                          Hôm nay
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-3 text-center w-24 bg-muted/40">Tổng giờ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((emp) => {
                // Calculate hours
                const shiftsCount = Object.values(emp.shifts).filter(s => s !== "OFF").length;
                const totalHours = shiftsCount * 8;

                return (
                  <tr key={emp.id} className="hover:bg-muted/20 transition-colors">
                    {/* Employee Info Column */}
                    <td className="p-3 sticky left-0 bg-card z-10 border-r border-border">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {emp.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate flex items-center gap-1.5">
                            {emp.name}
                            <span className="text-[10px] text-muted-foreground font-mono">({emp.code})</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">{emp.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Day Cells */}
                    {weekDays.map((d) => {
                      const shift = emp.shifts[d.key] || "OFF";
                      const shiftDef = SHIFT_TYPES[shift];
                      const Icon = shiftDef.icon;

                      return (
                        <td
                          key={d.key}
                          className={`p-1.5 text-center border-r border-border last:border-r-0 align-middle ${
                            d.isToday ? "bg-primary/[0.02]" : ""
                          }`}
                        >
                          <button
                            onClick={() =>
                              setActiveCell({
                                empId: emp.id,
                                empName: emp.name,
                                dateKey: d.key,
                                currentShift: shift
                              })
                            }
                            className={`w-full py-2 px-1.5 rounded-lg border text-left transition-all group flex flex-col items-center justify-center gap-0.5 ${shiftDef.bg} ${shiftDef.border}`}
                          >
                            <div className="flex items-center gap-1">
                              <Icon className={`h-3.5 w-3.5 ${shiftDef.color}`} />
                              <span className={`font-semibold text-[11px] ${shiftDef.color}`}>
                                {shiftDef.label}
                              </span>
                            </div>
                            <span className="text-[9.5px] text-muted-foreground group-hover:text-foreground">
                              {shiftDef.time}
                            </span>
                          </button>
                        </td>
                      );
                    })}

                    {/* Total Hours */}
                    <td className="p-3 text-center align-middle">
                      <span className={`font-mono font-bold text-xs ${
                        totalHours > 44 ? "text-amber-500" : "text-foreground"
                      }`}>
                        {totalHours}h
                      </span>
                      <div className="text-[10px] text-muted-foreground">{shiftsCount} ca</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Statistics */}
        <div className="p-3 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-3">
            <span>Hiển thị {filteredEmployees.length} nhân viên theo bộ lọc</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5" /> Tất cả các ca đã đủ định biên tối thiểu
            </span>
          </div>
          <div className="text-[11px]">
            Nhấn vào bất kỳ ô ca làm việc nào để đổi ca hoặc hoán đổi trực
          </div>
        </div>
      </div>

      {/* Quick Shift Change Modal / Popover */}
      {activeCell && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-primary" />
                  Điều chỉnh ca trực
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeCell.empName} • Ngày {activeCell.dateKey}
                </p>
              </div>
              <button
                onClick={() => setActiveCell(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground font-medium">Chọn ca làm việc muốn gán:</p>
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(SHIFT_TYPES) as ShiftType[]).map((key) => {
                  const s = SHIFT_TYPES[key];
                  const Icon = s.icon;
                  const isSelected = activeCell.currentShift === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleUpdateShift(key)}
                      className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${s.bg} ${
                        isSelected ? "ring-2 ring-primary border-primary" : s.border
                      }`}
                    >
                      <Icon className={`h-4 w-4 mt-0.5 ${s.color}`} />
                      <div>
                        <div className={`font-semibold text-xs ${s.color}`}>{s.label}</div>
                        <div className="text-[11px] text-muted-foreground">{s.time}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Tự động cập nhật vào bảng công chấm
                </span>
                <button
                  onClick={() => setActiveCell(null)}
                  className="btn-outline text-xs px-3 py-1.5"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto Schedule AI Modal */}
      {showAutoScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground text-sm">Trợ lý Tự Động Phân Ca Thông Minh</h3>
                  <p className="text-xs text-muted-foreground">Tự động phân bổ ca trực theo định biên và ưu tiên nhân sự</p>
                </div>
              </div>
              <button
                onClick={() => setShowAutoScheduleModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-medium text-foreground">Phạm vi áp dụng</label>
                <select className="w-full bg-background border border-border rounded-md px-3 py-2">
                  <option>Toàn bộ Tuần 41 (05/10 - 11/10/2026)</option>
                  <option>Riêng ca trực đêm & cuối tuần</option>
                  <option>Chỉ khối NOC & Giám sát hệ thống</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-foreground">Ràng buộc nghiệp vụ cần tuân thủ</label>
                <div className="space-y-1.5 text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Không xếp ca đêm liên tục quá 2 ngày cho cùng 1 nhân sự</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Đảm bảo tối thiểu 16 tiếng nghỉ giữa 2 ca làm việc liên tiếp</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Mỗi ca trực đêm phải có ít nhất 1 kỹ sư bậc Senior</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Ưu tiên nguyện vọng nghỉ phép đã được duyệt trước</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg flex items-center gap-2.5 text-foreground">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Hệ thống sẽ chạy thuật toán cân bằng tải trên 142 nhân viên và tạo bản nháp trong 3 giây.</span>
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
              <button
                onClick={() => setShowAutoScheduleModal(false)}
                className="btn-outline text-xs px-3 py-1.5"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setShowAutoScheduleModal(false);
                  alert("Đã phân ca tối ưu tự động cho Tuần 41 thành công!");
                }}
                className="btn-primary text-xs flex items-center gap-1.5 px-4 py-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>Bắt đầu tạo lịch trực</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
