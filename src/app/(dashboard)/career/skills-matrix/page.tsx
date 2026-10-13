"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Compass,
  Search,
  Plus,
  BookOpen,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface SkillItem {
  id: string;
  category: string;
  name: string;
  requiredL1: number; // 1-5
  requiredL2: number;
  requiredL3: number;
  requiredL4: number;
  orgProficiency: number;
}

const INITIAL_SKILLS: SkillItem[] = [
  { id: "sk_01", category: "Kỹ thuật Công nghệ", name: "React 19 & Next.js Architecture", requiredL1: 2, requiredL2: 3, requiredL3: 4, requiredL4: 5, orgProficiency: 4.2 },
  { id: "sk_02", category: "Kỹ thuật Công nghệ", name: "Java Spring Boot & Microservices", requiredL1: 2, requiredL2: 3, requiredL3: 4, requiredL4: 5, orgProficiency: 3.9 },
  { id: "sk_03", category: "Kỹ thuật Công nghệ", name: "AI/LLM Engineering & Vector DB", requiredL1: 1, requiredL2: 2, requiredL3: 4, requiredL4: 5, orgProficiency: 3.2 },
  { id: "sk_04", category: "Năng lực Lãnh đạo", name: "Quản trị Mục tiêu OKR & Agile", requiredL1: 1, requiredL2: 2, requiredL3: 4, requiredL4: 5, orgProficiency: 4.1 },
  { id: "sk_05", category: "Năng lực Chung", name: "Giao tiếp & Đàm phán Thấu cảm", requiredL1: 2, requiredL2: 3, requiredL3: 4, requiredL4: 5, orgProficiency: 4.0 },
];

export default function SkillsMatrixPage() {
  const [skills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [search, setSearch] = useState("");

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Ma trận Kỹ năng & Khung Năng lực
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
              Phát triển sự nghiệp
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Ma trận kỹ năng (CAR-02)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/career/succession/9-box" className="btn-outline">
            <Layers className="h-4 w-4 text-primary" />
            <span>Mô hình 9-Box kế thừa</span>
          </Link>

          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Định nghĩa kỹ năng mới vào từ điển năng lực")}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm kỹ năng mới</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Từ điển năng lực cốt lõi theo cấp bậc
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên kỹ năng, nhóm..."
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
                <th>Nhóm năng lực</th>
                <th>Tên kỹ năng</th>
                <th className="text-center">Junior (L7-8)</th>
                <th className="text-center">Mid (L6)</th>
                <th className="text-center">Senior (L5)</th>
                <th className="text-center">Lead/Manager (L3-4)</th>
                <th className="text-center">Điểm TB toàn công ty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSkills.map((s) => (
                <tr key={s.id} className="table-row">
                  <td className="text-xs font-semibold text-primary">
                    {s.category}
                  </td>
                  <td className="font-semibold text-foreground text-sm">
                    {s.name}
                  </td>
                  <td className="text-center font-mono text-xs text-muted-foreground">
                    Level {s.requiredL1}/5
                  </td>
                  <td className="text-center font-mono text-xs text-muted-foreground">
                    Level {s.requiredL2}/5
                  </td>
                  <td className="text-center font-mono text-xs font-semibold text-foreground">
                    Level {s.requiredL3}/5
                  </td>
                  <td className="text-center font-mono text-xs font-bold text-foreground">
                    Level {s.requiredL4}/5
                  </td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {s.orgProficiency} / 5.0
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredSkills.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{skills.length}</span> kỹ năng
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
