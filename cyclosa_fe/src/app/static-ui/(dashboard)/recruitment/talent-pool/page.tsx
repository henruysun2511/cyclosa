"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Star,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Bookmark,
  Share2,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  LayoutGrid,
  List,
  GraduationCap
} from "lucide-react";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

interface TalentCandidate {
  id: string;
  code: string;
  name: string;
  avatar: string;
  currentRole: string;
  previousCompany: string;
  experienceYears: number;
  expectedSalary: string;
  matchScore: number;
  skills: string[];
  source: "LinkedIn" | "TopCV" | "Nội bộ giới thiệu" | "Headhunter" | "Hội thảo";
  status: "AVAILABLE" | "CONTACTED" | "INTERESTED" | "NOT_READY";
  notes: string;
  email: string;
  phone: string;
}

export default function REC17TalentPoolPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [selectedCandidateForNote, setSelectedCandidateForNote] = useState<TalentCandidate | null>(null);
  const [candidateNoteInput, setCandidateNoteInput] = useState("");

  const [candidates, setCandidates] = useState<TalentCandidate[]>([
    {
      id: "CAN-01",
      code: "TP-2026-104",
      name: "Trần Đình Khang",
      avatar: "TK",
      currentRole: "Lead Golang & Microservices Architect",
      previousCompany: "Tập đoàn VNG",
      experienceYears: 7,
      expectedSalary: "$3,200 - $3,800",
      matchScore: 96,
      skills: ["Golang", "Kubernetes", "Kafka", "gRPC", "Distributed Systems"],
      source: "LinkedIn",
      status: "INTERESTED",
      notes: "Ấn tượng tốt đợt phỏng vấn Q2, chưa vào việc do đang chờ thưởng năm. Có thể liên hệ lại cho đợt mở rộng Q4.",
      email: "khang.tran@gmail.com",
      phone: "0912.884.xxx"
    },
    {
      id: "CAN-02",
      code: "TP-2026-118",
      name: "Nguyễn Hải Yến",
      avatar: "HY",
      currentRole: "Senior Product Designer (Design System)",
      previousCompany: "MoMo (M-Service)",
      experienceYears: 5,
      expectedSalary: "$2,200 - $2,600",
      matchScore: 92,
      skills: ["Figma", "Design System", "UX Research", "Mobile App", "Accessibility"],
      source: "Nội bộ giới thiệu",
      status: "AVAILABLE",
      notes: "Được bạn Nguyễn Thị Thảo (Tech) giới thiệu. Tư duy hệ thống và thẩm mỹ sản phẩm fintech rất vững.",
      email: "haiyen.design@outlook.com",
      phone: "0988.332.xxx"
    },
    {
      id: "CAN-03",
      code: "TP-2026-095",
      name: "Lê Minh Tuấn",
      avatar: "MT",
      currentRole: "Principal DevOps & Platform Engineer",
      previousCompany: "Shopee Vietnam",
      experienceYears: 8,
      expectedSalary: "$3,500 - $4,200",
      matchScore: 98,
      skills: ["AWS", "Terraform", "CI/CD", "Prometheus", "FinOps", "Docker"],
      source: "Headhunter",
      status: "CONTACTED",
      notes: "Đang mở cửa cơ hội cho vị trí Head of Infrastructure. Đã gửi job description và xếp lịch cafe trao đổi.",
      email: "tuan.leminh@devops.vn",
      phone: "0903.441.xxx"
    },
    {
      id: "CAN-04",
      code: "TP-2026-142",
      name: "Đỗ Phương Anh",
      avatar: "PA",
      currentRole: "Senior Data Scientist & LLM Specialist",
      previousCompany: "VinAI Research",
      experienceYears: 4,
      expectedSalary: "$2,800 - $3,500",
      matchScore: 94,
      skills: ["Python", "PyTorch", "NLP", "LLM Fine-tuning", "Vector DB"],
      source: "Hội thảo",
      status: "AVAILABLE",
      notes: "Gặp tại Hội thảo Trí tuệ Nhân tạo Quốc gia. Mong muốn gia nhập startup hoặc công ty có hạ tầng GPU riêng.",
      email: "phuonganh.ai@gmail.com",
      phone: "0977.124.xxx"
    },
    {
      id: "CAN-05",
      code: "TP-2026-088",
      name: "Vũ Gia Bảo",
      avatar: "GB",
      currentRole: "Senior Fullstack Engineer",
      previousCompany: "One Mount Group",
      experienceYears: 6,
      expectedSalary: "$2,400 - $2,900",
      matchScore: 88,
      skills: ["React", "Next.js", "Node.js", "PostgreSQL", "TailwindCSS"],
      source: "TopCV",
      status: "NOT_READY",
      notes: "Vừa nhận lời mời onsite ngắn hạn tại Singapore. Hẹn liên lạc lại sau tháng 12/2026.",
      email: "giabao.vu@gmail.com",
      phone: "0915.667.xxx"
    }
  ]);

  const allSkills = ["ALL", "Golang", "Kubernetes", "React", "Python", "AWS", "Figma", "Design System"];

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.previousCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSkill =
      selectedSkill === "ALL" || c.skills.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  const handleSaveNote = () => {
    if (!selectedCandidateForNote) return;
    setCandidates(prev =>
      prev.map(c =>
        c.id === selectedCandidateForNote.id ? { ...c, notes: candidateNoteInput } : c
      )
    );
    setSelectedCandidateForNote(null);
  };

  const getStatusPill = (status: TalentCandidate["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-900 text-white border border-slate-900">Sẵn sàng nhận offer</span>;
      case "INTERESTED":
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">Quan tâm cơ hội</span>;
      case "CONTACTED":
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-300">Đang trao đổi</span>;
      case "NOT_READY":
        return <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-500 border border-slate-200">Chưa sẵn sàng</span>;
    }
  };

  const kpis = [
    {
      title: "Tổng ứng viên trong kho",
      value: "328 hồ sơ",
      change: "+24 tháng này",
      isPositive: true,
      subtext: "Đã qua thẩm định CV và phân loại AI"
    },
    {
      title: "Ứng viên sẵn sàng nhận việc",
      value: "42 nhân sự",
      change: "Sẵn sàng",
      isPositive: true,
      subtext: "Thời gian tuyển dụng rút ngắn 65%"
    },
    {
      title: "Điểm phù hợp Stack kỹ thuật TB",
      value: "91.4%",
      change: "+3.2%",
      isPositive: true,
      subtext: "Khớp yêu cầu vị trí Senior & Lead"
    },
    {
      title: "Tỷ lệ phản hồi tích cực",
      value: "78.5%",
      change: "Cao",
      isPositive: true,
      subtext: "Khi Recruiter gửi lời mời ứng tuyển"
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
            <span className="hover:text-foreground transition-colors">Tuyển dụng & Ứng viên</span>
            <span>/</span>
            <span className="text-foreground font-medium">Ngân hàng hồ sơ (Talent Pool)</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Ngân hàng hồ sơ ứng viên
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kho lưu trữ ứng viên chất lượng cao đã qua chọn lọc. Tìm kiếm thần tốc theo kỹ năng, độ tương thích và mức lương kỳ vọng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Lưới thẻ ứng viên"
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

          <Link href="/recruitment/candidates/new" className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Thêm ứng viên vào kho</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards metrics={kpis} />

      {/* Search and Skill Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, kỹ năng, công ty cũ, vị trí..."
            className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Skill Pills Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-muted-foreground font-medium mr-1">Kỹ năng:</span>
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                selectedSkill === skill
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {skill === "ALL" ? "Tất cả" : skill}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Grid Cards View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Header: Avatar, Name, Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {candidate.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        {candidate.name}
                      </h3>
                      <p className="text-xs text-primary font-medium">{candidate.currentRole}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Cựu: {candidate.previousCompany}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-900 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-white" /> {candidate.matchScore}% Match
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {candidate.code}
                    </span>
                  </div>
                </div>

                {/* Status & Salary Row */}
                <div className="mt-3 p-2.5 rounded-lg bg-muted/30 border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Lương kỳ vọng:</span>
                    <span className="font-mono font-bold text-foreground flex items-center gap-1 text-[11px]">
                      <DollarSign className="h-3 w-3 text-slate-600" />
                      {candidate.expectedSalary}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground text-[10px] block">Trạng thái:</span>
                    {getStatusPill(candidate.status)}
                  </div>
                </div>

                {/* Skill Badges */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] text-muted-foreground font-medium">Kỹ năng nổi bật:</span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          selectedSkill === skill
                            ? "bg-primary text-primary-foreground font-bold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recruiter Notes */}
                <div className="mt-3 p-2.5 rounded-lg bg-muted/20 border border-border/70 text-[11px] text-muted-foreground relative group/note">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground text-[10px]">Ghi chú tuyển dụng:</span>
                    <button
                      onClick={() => {
                        setSelectedCandidateForNote(candidate);
                        setCandidateNoteInput(candidate.notes);
                      }}
                      className="p-0.5 text-muted-foreground hover:text-primary"
                      title="Sửa ghi chú"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="line-clamp-2 italic">&ldquo;{candidate.notes}&rdquo;</p>
                </div>
              </div>

              {/* Card Footer: Source & Actions */}
              <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">
                  Nguồn: {candidate.source}
                </span>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`mailto:${candidate.email}`}
                    className="btn-outline p-1.5 text-xs text-muted-foreground hover:text-foreground"
                    title={`Gửi email: ${candidate.email}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => alert(`Đã đưa ứng viên ${candidate.name} vào Chiến dịch tuyển dụng Q4!`)}
                    className="btn-primary text-xs flex items-center gap-1 py-1 px-2.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Mời ứng tuyển</span>
                  </button>
                </div>
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
                  <th>Ứng viên & Chức vụ</th>
                  <th>Công ty trước đây</th>
                  <th>Kinh nghiệm</th>
                  <th>Độ phù hợp</th>
                  <th>Lương kỳ vọng</th>
                  <th>Nguồn</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/50">
                    <td className="font-mono text-xs text-muted-foreground font-medium">{c.code}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {c.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-xs">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground">{c.currentRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-foreground font-medium">{c.previousCompany}</td>
                    <td className="text-xs text-muted-foreground">{c.experienceYears} năm</td>
                    <td>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {c.matchScore}%
                      </span>
                    </td>
                    <td className="font-mono text-xs font-semibold">{c.expectedSalary}</td>
                    <td className="text-xs text-muted-foreground">{c.source}</td>
                    <td>{getStatusPill(c.status)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => alert(`Mời ứng tuyển: ${c.name}`)}
                        className="btn-primary text-xs py-1 px-2.5"
                      >
                        Mời ứng tuyển
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {selectedCandidateForNote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-foreground text-sm">Ghi chú tuyển dụng</h3>
              </div>
              <button
                onClick={() => setSelectedCandidateForNote(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-muted-foreground">
                Cập nhật đánh giá, điểm mạnh và lịch sử tiếp xúc với ứng viên <strong>{selectedCandidateForNote.name}</strong>:
              </p>
              <textarea
                rows={4}
                value={candidateNoteInput}
                onChange={(e) => setCandidateNoteInput(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nhập ghi chú chi tiết..."
              />
            </div>

            <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
              <button
                onClick={() => setSelectedCandidateForNote(null)}
                className="btn-outline text-xs px-3 py-1.5"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNote}
                className="btn-primary text-xs px-4 py-1.5"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
