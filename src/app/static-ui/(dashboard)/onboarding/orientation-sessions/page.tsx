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
  CheckCircle2,
  Clock
} from "lucide-react";

export default function ONB06Page() {
  const [currentMonth, setCurrentMonth] = useState("Tháng 10, 2026");

  const holidays = [
    { date: "01/01/2026", title: "Tết Dương Lịch", type: "Nghỉ lễ toàn quốc" },
    { date: "15/02/2026", title: "Tết Nguyên Đán Bính Ngọ", type: "Nghỉ lễ truyền thống" },
    { date: "30/04/2026", title: "Ngày Giải phóng miền Nam", type: "Nghỉ lễ toàn quốc" },
    { date: "01/05/2026", title: "Ngày Quốc tế Lao động", type: "Nghỉ lễ toàn quốc" },
    { date: "02/09/2026", title: "Ngày Quốc khánh", type: "Nghỉ lễ toàn quốc" }
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
            <span className="hover:text-foreground transition-colors">Hội nhập & Đào tạo</span>
            <span>/</span>
            <span className="text-foreground font-medium">Buổi đào tạo định hướng</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Buổi đào tạo định hướng
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tạo/sửa buổi; **Hoàn thành**, **Hủy**; **điểm danh** nhiều nhân viên (tự hoàn thành task ORIENTATION tương ứng)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Thêm sự kiện / ngày lễ</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">{currentMonth}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-outline py-1 px-2 text-xs flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Tháng trước</span>
            </button>
            <button className="btn-outline py-1 px-2.5 text-xs">Hiện tại</button>
            <button className="btn-outline py-1 px-2 text-xs flex items-center gap-1">
              <span>Tháng sau</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Representation */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="py-2 font-semibold text-muted-foreground bg-muted/30 rounded">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <div
              key={date}
              className={`min-h-[70px] p-2 border border-border rounded-lg text-left flex flex-col justify-between transition-colors ${
                date === 4 ? "bg-primary/5 border-primary font-bold text-primary" : "bg-card hover:bg-muted/30"
              }`}
            >
              <span className="text-xs">{date}</span>
              {date === 4 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-normal">
                  Hôm nay
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Holidays / Events Table */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Danh mục ngày nghỉ & Lịch sự kiện định kỳ</h3>
        <div className="divide-y divide-border text-xs">
          {holidays.map((h, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{h.title}</p>
                <p className="text-[11px] text-muted-foreground">{h.type}</p>
              </div>
              <span className="font-mono px-2.5 py-1 rounded bg-muted text-foreground font-medium">
                {h.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
