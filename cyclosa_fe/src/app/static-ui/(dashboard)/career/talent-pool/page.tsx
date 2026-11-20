"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  Filter,
  Download,
  Star,
  Award,
  Zap,
  ShieldCheck,
  TrendingUp,
  Tag,
  ChevronRight,
  MoreVertical,
  Briefcase,
  Target,
  GraduationCap,
  Sparkles,
  X,
  CheckCircle2,
  Trash2,
  LayoutGrid,
  List
} from "lucide-react";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

type TalentTag = "HiPo" | "Key Talent" | "Leadership Potential" | "Tech Expert";

interface InternalTalent {
  id: string;
  code: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  tags: { type: TalentTag; reason: string; assignedAt: string }[];
  readiness: "READY_NOW" | "READY_1_YEAR" | "READY_2_YEARS";
  targetRole: string;
  performanceScore: string; // e.g. "A+ (9.4/10)"
  potentialLevel: "HIGH" | "MEDIUM";
  topSkills: string[];
}

const TALENT_TAG_CONFIG: Record<TalentTag, { label: string; bg: string; text: string; border: string; icon: any }> = {
  "HiPo": {
    label: "HiPo (High Potential)",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    icon: Sparkles
  },
  "Key Talent": {
    label: "Key Talent (Trụ cột)",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/30",
    icon: Star
  },
  "Leadership Potential": {
    label: "Tiềm năng Lãnh đạo",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
    icon: ShieldCheck
  },
  "Tech Expert": {
    label: "Chuyên gia Công nghệ",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/30",
    icon: Zap
  }
};

export default function CAR05TalentPoolPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [activeTagFilter, setActiveTagFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTalentForTag, setSelectedTalentForTag] = useState<InternalTalent | null>(null);
  const [newTagInput, setNewTagInput] = useState<{ tag: TalentTag; reason: string }>({
    tag: "HiPo",
    reason: ""
  });

  const [talents, setTalents] = useState<InternalTalent[]>([
    {
      id: "TL-001",
      code: "FSI-102",
      name: "Nguyễn Tuấn Dũng",
      avatar: "TD",
      role: "Lead Cloud Architect",
      department: "Khối Công nghệ & Sản phẩm",
      tags: [
        { type: "HiPo", reason: "Hoàn thành xuất sắc dự án hạ tầng đa vùng", assignedAt: "15/09/2026" },
        { type: "Tech Expert", reason: "Chuyên gia hàng đầu về Kubernetes & bảo mật", assignedAt: "01/08/2026" }
      ],
      readiness: "READY_NOW",
      targetRole: "Giám đốc Kỹ thuật (CTO)",
      performanceScore: "Xuất sắc (9.6/10)",
      potentialLevel: "HIGH",
      topSkills: ["Cloud Architecture", "Kubernetes", "FinOps", "Team Leadership"]
    },
    {
      id: "TL-002",
      code: "FSI-184",
      name: "Hoàng Thảo Linh",
      avatar: "TL",
      role: "Senior Product Manager",
      department: "Khối Phát triển Giải pháp",
      tags: [
        { type: "Leadership Potential", reason: "Dẫn dắt thành công sản phẩm cốt lõi tăng trưởng 140%", assignedAt: "10/08/2026" },
        { type: "Key Talent", reason: "Nắm giữ chiến lược sản phẩm trọng điểm", assignedAt: "05/06/2026" }
      ],
      readiness: "READY_NOW",
      targetRole: "Trưởng phòng Quản lý Sản phẩm (CPO)",
      performanceScore: "A+ (9.2/10)",
      potentialLevel: "HIGH",
      topSkills: ["Product Strategy", "Data Analytics", "Agile/Scrum", "Customer Discovery"]
    },
    {
      id: "TL-003",
      code: "FSI-205",
      name: "Vũ Đình Cường",
      avatar: "DC",
      role: "Principal AI/ML Engineer",
      department: "Trung tâm R&D Trí tuệ Nhân tạo",
      tags: [
        { type: "Tech Expert", reason: "Tác giả của kiến trúc LLM phục vụ nội bộ", assignedAt: "20/07/2026" },
        { type: "Key Talent", reason: "Cốt lõi sở hữu trí tuệ công nghệ", assignedAt: "15/05/2026" }
      ],
      readiness: "READY_1_YEAR",
      targetRole: "Giám đốc Nghiên cứu AI (Head of AI)",
      performanceScore: "Xuất sắc (9.8/10)",
      potentialLevel: "HIGH",
      topSkills: ["LLM Fine-tuning", "PyTorch", "MLOps", "Patent Portfolio"]
    },
    {
      id: "TL-004",
      code: "FSI-312",
      name: "Phạm Thúy Hằng",
      avatar: "TH",
      role: "Trưởng nhóm Tuyển dụng Chiến lược",
      department: "Ban Nhân sự & Phát triển Tổ chức",
      tags: [
        { type: "Leadership Potential", reason: "Tối ưu hóa thời gian tuyển dụng giảm 35%", assignedAt: "12/09/2026" }
      ],
      readiness: "READY_1_YEAR",
      targetRole: "Phó Ban Nhân sự (HR Deputy Director)",
      performanceScore: "A (8.9/10)",
      potentialLevel: "HIGH",
      topSkills: ["Talent Acquisition", "Employer Branding", "HR Analytics", "Mentoring"]
    },
    {
      id: "TL-005",
      code: "FSI-220",
      name: "Lê Văn Nhật",
      avatar: "LN",
      role: "Senior Security Specialist",
      department: "Trung tâm An toàn An ninh Mạng",
      tags: [
        { type: "Tech Expert", reason: "Đạt chứng chỉ quốc tế CISSP & ngăn chặn 100% rủi ro xâm nhập", assignedAt: "01/09/2026" },
        { type: "HiPo", reason: "Tốc độ thăng tiến vượt trội trong 18 tháng", assignedAt: "10/08/2026" }
      ],
      readiness: "READY_2_YEARS",
      targetRole: "Trưởng ban An toàn Thông tin (CISO)",
      performanceScore: "A+ (9.1/10)",
      potentialLevel: "HIGH",
      topSkills: ["Zero Trust", "DevSecOps", "Penetration Testing", "ISO 27001"]
    }
  ]);

  const filteredTalents = talents.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      activeTagFilter === "ALL" ||
      t.tags.some(tg => tg.type === activeTagFilter);

    return matchesSearch && matchesTag;
  });

  const handleAddTag = () => {
    if (!selectedTalentForTag || !newTagInput.reason) return;
    setTalents(prev =>
      prev.map(t => {
        if (t.id === selectedTalentForTag.id) {
          return {
            ...t,
            tags: [
              ...t.tags.filter(existing => existing.type !== newTagInput.tag),
              {
                type: newTagInput.tag,
                reason: newTagInput.reason,
                assignedAt: "05/10/2026"
              }
            ]
          };
        }
        return t;
      })
    );
    setSelectedTalentForTag(null);
    setNewTagInput({ tag: "HiPo", reason: "" });
  };

  const handleRemoveTag = (talentId: string, tagType: TalentTag) => {
    setTalents(prev =>
      prev.map(t => {
        if (t.id === talentId) {
          return {
            ...t,
            tags: t.tags.filter(tag => tag.type !== tagType)
          };
        }
        return t;
      })
    );
  };

  const kpis = [
    {
      title: "Tổng nhân tài quy hoạch",
      value: "48 nhân sự",
      change: "+5 người",
      isPositive: true,
      subtext: "Chiếm 6.2% tổng biên chế tập đoàn"
    },
    {
      title: "Tỷ lệ Sẵn sàng thay thế (Ready Now)",
      value: "64.5%",
      change: "+8.3%",
      isPositive: true,
      subtext: "Cho 100% vị trí lãnh đạo chủ chốt"
    },
    {
      title: "Nhân tài diện HiPo & Lãnh đạo",
      value: "28 hồ sơ",
      change: "Đang kèm cặp",
      isPositive: true,
      subtext: "Có kế hoạch phát triển IDP riêng"
    },
    {
      title: "Tỷ lệ giữ chân nhân tài",
      value: "98.1%",
      change: "Ổn định",
      isPositive: true,
      subtext: "0 trường hợp nghỉ việc trong 12 tháng"
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
            <span className="hover:text-foreground transition-colors">Phát triển nghề nghiệp</span>
            <span>/</span>
            <span className="text-foreground font-medium">Kho nhân tài nội bộ</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Kho nhân tài nội bộ
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản trị & nhận diện nhân sự chủ chốt thông qua hệ thống thẻ năng lực (HiPo, Trụ cột, Chuyên gia kỹ thuật, Tiềm năng lãnh đạo).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Lưới thẻ nhân tài"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Bảng dữ liệu"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button className="btn-outline flex items-center gap-1.5 text-xs">
            <Download className="h-4 w-4" />
            <span>Xuất danh sách</span>
          </button>
          <button className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Đề cử nhân tài</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards metrics={kpis} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, mã, chức danh, kỹ năng..."
            className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Dynamic Talent Tag Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTagFilter("ALL")}
            className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
              activeTagFilter === "ALL"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Tất cả ({talents.length})
          </button>
          {(Object.keys(TALENT_TAG_CONFIG) as TalentTag[]).map((tagKey) => {
            const conf = TALENT_TAG_CONFIG[tagKey];
            const Icon = conf.icon;
            const count = talents.filter(t => t.tags.some(tg => tg.type === tagKey)).length;
            const isSelected = activeTagFilter === tagKey;

            return (
              <button
                key={tagKey}
                onClick={() => setActiveTagFilter(tagKey)}
                className={`text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 border transition-all ${
                  isSelected
                    ? `${conf.bg} ${conf.border} ${conf.text} font-bold ring-1 ring-primary/40`
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{conf.label.split(" ")[0]}</span>
                <span className="text-[10px] px-1 rounded-full bg-background/80 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Talent Profile Cards Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTalents.map((talent) => (
            <div
              key={talent.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header row: Avatar, Info, Action */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shadow-xs">
                      {talent.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        {talent.name}
                        <span className="text-[10px] font-mono text-muted-foreground font-normal">
                          {talent.code}
                        </span>
                      </h3>
                      <p className="text-xs text-primary font-medium">{talent.role}</p>
                      <p className="text-[11px] text-muted-foreground">{talent.department}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTalentForTag(talent)}
                    className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    title="Gắn thẻ tài năng"
                  >
                    <Tag className="h-4 w-4" />
                  </button>
                </div>

                {/* Talent Tags Pill Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {talent.tags.map((t, idx) => {
                    const conf = TALENT_TAG_CONFIG[t.type];
                    const Icon = conf.icon;
                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${conf.bg} ${conf.text} ${conf.border}`}
                        title={t.reason}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{conf.label}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(talent.id, t.type);
                          }}
                          className="hover:opacity-100 opacity-60 ml-0.5"
                          title="Gỡ thẻ"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Target Role & Readiness Box */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-2 mb-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Target className="h-3.5 w-3.5 text-primary" /> Vị trí kế thừa:
                    </span>
                    <span className="font-semibold text-foreground truncate max-w-[170px]">
                      {talent.targetRole}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Độ sẵn sàng:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      talent.readiness === "READY_NOW"
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                    }`}>
                      {talent.readiness === "READY_NOW" ? "Sẵn sàng ngay" : "Trong 6-12 tháng"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Đánh giá hiệu suất:</span>
                    <span className="font-medium text-foreground text-[11px]">{talent.performanceScore}</span>
                  </div>
                </div>

                {/* Skill Chips */}
                <div className="space-y-1 mb-4">
                  <span className="text-[11px] text-muted-foreground font-medium">Kỹ năng cốt lõi:</span>
                  <div className="flex flex-wrap gap-1">
                    {talent.topSkills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <Link
                  href={`/employees/${talent.code}`}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <span>Hồ sơ chi tiết</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <button className="btn-outline py-1 px-2.5 text-xs flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span>Kế hoạch IDP</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Data Table View */
        <div className="table-card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Nhân sự & Chức danh</th>
                  <th>Phòng ban</th>
                  <th>Thẻ nhân tài (Tags)</th>
                  <th>Vị trí kế thừa mục tiêu</th>
                  <th>Mức độ sẵn sàng</th>
                  <th>Đánh giá</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTalents.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/50">
                    <td className="font-mono text-xs text-muted-foreground font-medium">{t.code}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {t.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-xs">{t.name}</div>
                          <div className="text-[11px] text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">{t.department}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {t.tags.map((tg, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${TALENT_TAG_CONFIG[tg.type].bg} ${TALENT_TAG_CONFIG[tg.type].text}`}
                          >
                            {tg.type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-xs font-medium text-foreground">{t.targetRole}</td>
                    <td>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.readiness === "READY_NOW"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-amber-500/15 text-amber-500"
                      }`}>
                        {t.readiness === "READY_NOW" ? "Sẵn sàng ngay" : "Trong 6-12 tháng"}
                      </span>
                    </td>
                    <td className="text-xs font-mono">{t.performanceScore}</td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedTalentForTag(t)}
                        className="btn-icon-sm"
                        title="Gắn thẻ"
                      >
                        <Tag className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {selectedTalentForTag && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground text-sm">Gắn thẻ nhân tài nội bộ</h3>
                  <p className="text-xs text-muted-foreground">{selectedTalentForTag.name} ({selectedTalentForTag.code})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTalentForTag(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Chọn danh hiệu thẻ</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TALENT_TAG_CONFIG) as TalentTag[]).map((tagKey) => {
                    const conf = TALENT_TAG_CONFIG[tagKey];
                    const Icon = conf.icon;
                    const isSelected = newTagInput.tag === tagKey;

                    return (
                      <button
                        key={tagKey}
                        onClick={() => setNewTagInput(prev => ({ ...prev, tag: tagKey }))}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? `${conf.bg} ${conf.border} ring-2 ring-primary`
                            : "border-border hover:bg-muted/40"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${conf.text}`} />
                        <span className={`font-semibold ${conf.text}`}>{conf.label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Lý do & Tiêu chí đề cử (Bắt buộc)</label>
                <textarea
                  rows={3}
                  value={newTagInput.reason}
                  onChange={(e) => setNewTagInput(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ví dụ: Đạt thành tích đặc biệt trong dự án Q3, có năng lực dẫn dắt nhóm 10 kỹ sư..."
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="p-3 bg-muted/30 rounded-lg text-muted-foreground text-[11px] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Thẻ nhân tài sẽ hiển thị trên hồ sơ nhân viên và báo cáo quy hoạch kế nhiệm của HĐQT.</span>
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
              <button
                onClick={() => setSelectedTalentForTag(null)}
                className="btn-outline text-xs px-3 py-1.5"
              >
                Hủy
              </button>
              <button
                onClick={handleAddTag}
                disabled={!newTagInput.reason}
                className="btn-primary text-xs px-4 py-1.5 disabled:opacity-50"
              >
                Xác nhận gắn thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
