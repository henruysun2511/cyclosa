"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Grid3X3,
  Users,
  Award,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface Employee9Box {
  id: string;
  name: string;
  code: string;
  jobTitle: string;
  initials: string;
  avatarBg: string;
  boxKey: string; // e.g. "high_high", "high_med", etc.
}

export default function Succession9BoxPage() {
  const [employees] = useState<Employee9Box[]>([
    { id: "e1", name: "Phạm Minh Tuấn", code: "EMP004", jobTitle: "Tech Lead Frontend", initials: "PT", avatarBg: "bg-purple-500 text-white", boxKey: "high_high" },
    { id: "e2", name: "Đặng Minh Tân", code: "EMP088", jobTitle: "Junior Backend", initials: "MT", avatarBg: "bg-teal-500 text-white", boxKey: "med_high" },
    { id: "e3", name: "Trần Quốc Bảo", code: "EMP008", jobTitle: "Backend Lead", initials: "QB", avatarBg: "bg-blue-500 text-white", boxKey: "high_med" },
    { id: "e4", name: "Hoàng Thảo Linh", code: "EMP005", jobTitle: "Kế Toán Trưởng", initials: "TL", avatarBg: "bg-amber-500 text-white", boxKey: "high_low" },
    { id: "e5", name: "Ngô Quang Huy", code: "EMP092", jobTitle: "Chuyên Viên Kế Toán", initials: "QH", avatarBg: "bg-indigo-500 text-white", boxKey: "med_med" },
  ]);

  const boxes = [
    // Row 1: High Potential
    { key: "low_high", title: "Enigma (Viên ngọc thô)", desc: "Hiệu suất thấp, Tiềm năng cao", color: "border-amber-300 bg-amber-50/30" },
    { key: "med_high", title: "Growth Potential (Tiềm năng tăng trưởng)", desc: "Hiệu suất TB, Tiềm năng cao", color: "border-blue-300 bg-blue-50/30" },
    { key: "high_high", title: "Star / Future Leader (Ngôi sao kế thừa)", desc: "Hiệu suất cao, Tiềm năng cao", color: "border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-300" },

    // Row 2: Medium Potential
    { key: "low_med", title: "Dilemma (Chưa ổn định)", desc: "Hiệu suất thấp, Tiềm năng TB", color: "border-slate-300 bg-slate-50/50" },
    { key: "med_med", title: "Core Player (Nhân sự cốt lõi)", desc: "Hiệu suất TB, Tiềm năng TB", color: "border-blue-200 bg-blue-50/20" },
    { key: "high_med", title: "High Performer (Chuyên gia xuất sắc)", desc: "Hiệu suất cao, Tiềm năng TB", color: "border-emerald-300 bg-emerald-50/20" },

    // Row 3: Low Potential
    { key: "low_low", title: "Underperformer (Rủi ro cao)", desc: "Hiệu suất thấp, Tiềm năng thấp", color: "border-red-300 bg-red-50/30" },
    { key: "med_low", title: "Effective (Làm việc tròn vai)", desc: "Hiệu suất TB, Tiềm năng thấp", color: "border-slate-300 bg-slate-50/40" },
    { key: "high_low", title: "Trusted Professional (Chuyên gia vững vàng)", desc: "Hiệu suất cao, Tiềm năng thấp", color: "border-slate-300 bg-slate-50/40" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quy hoạch Kế thừa & Ma trận 9-Box
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
            <Link
              href="/career/skills-matrix"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Phát triển sự nghiệp
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Ma trận 9-Box (CAR-05)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/career/skills-matrix" className="btn-outline">
            Xem ma trận kỹ năng
          </Link>
        </div>
      </div>

      {/* ── 9-Box Grid Card ─────────────────────────────────────────── */}
      <div className="table-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-primary" />
              Ma trận đánh giá Hiệu suất (Performance) x Tiềm năng (Potential)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phân loại nhân tài chiến lược để xây dựng lộ trình thăng tiến và đào tạo kế thừa thế hệ F1/F2.
            </p>
          </div>
        </div>

        {/* 3x3 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[500px]">
          {boxes.map((box) => {
            const boxEmployees = employees.filter((e) => e.boxKey === box.key);
            return (
              <div
                key={box.key}
                className={`rounded-xl border p-4 flex flex-col justify-between transition-shadow hover:shadow-xs ${box.color}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      {box.key === "high_high" && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />}
                      {box.title}
                    </h3>
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      ({boxEmployees.length})
                    </span>
                  </div>
                  <p className="text-2xs text-muted-foreground mt-0.5">{box.desc}</p>
                </div>

                {/* Candidate Pills */}
                <div className="my-3 space-y-2 flex-1">
                  {boxEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      onClick={() => toast.info(`Hồ sơ nhân tài: ${emp.name} (${emp.jobTitle})`)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs cursor-pointer hover:border-primary transition-all"
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${emp.avatarBg} font-bold text-[10px]`}
                      >
                        {emp.initials}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-xs text-foreground truncate">
                          {emp.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate font-mono">
                          {emp.jobTitle}
                        </p>
                      </div>
                    </div>
                  ))}
                  {boxEmployees.length === 0 && (
                    <div className="h-full flex items-center justify-center text-[11px] text-muted-foreground/60 italic py-6">
                      Chưa có nhân sự
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
