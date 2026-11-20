"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Home,
  Kanban,
  Sparkles,
  Users,
  Search,
  Plus,
  Calendar,
  MessageSquare,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Briefcase,
  Filter,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  Clock,
  Layers,
  Award,
  ExternalLink,
  SlidersHorizontal,
  X,
  FileText,
  User,
  Star,
  Paperclip,
  Check,
  List,
  LayoutGrid,
  ChevronDown,
  Building2,
  Send,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type StageId =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW_1"
  | "INTERVIEW_2"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

export interface CandidateCardItem {
  id: string;
  code: string; // e.g. APP-101 (Jira key)
  name: string;
  email: string;
  phone: string;
  stage: StageId;
  aiMatchScore: number;
  experienceYears: number;
  expectedSalary: string;
  currentCompany?: string;
  skills: string[];
  appliedDate: string;
  source: string;
  notesCount: number;
  recruiter: {
    name: string;
    avatar: string;
    initials: string;
    color: string;
  };
  hasCv: boolean;
  interviewScheduled?: string;
}

const STAGES: {
  id: StageId;
  label: string;
  accentColor: string;
  badgeBg: string;
}[] = [
  {
    id: "APPLIED",
    label: "Mới ứng tuyển",
    accentColor: "bg-sky-500",
    badgeBg: "text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300",
  },
  {
    id: "SCREENING",
    label: "Sàng lọc CV",
    accentColor: "bg-blue-500",
    badgeBg: "text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    id: "INTERVIEW_1",
    label: "Phỏng vấn V1",
    accentColor: "bg-purple-500",
    badgeBg: "text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300",
  },
  {
    id: "INTERVIEW_2",
    label: "Phỏng vấn V2",
    accentColor: "bg-indigo-500",
    badgeBg: "text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
  {
    id: "OFFER",
    label: "Đề xuất Offer",
    accentColor: "bg-amber-500",
    badgeBg: "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    id: "HIRED",
    label: "Đã tuyển dụng",
    accentColor: "bg-emerald-500",
    badgeBg: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    id: "REJECTED",
    label: "Không phù hợp",
    accentColor: "bg-slate-400",
    badgeBg: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
  },
];

const INITIAL_OPENING_CANDIDATES: CandidateCardItem[] = [
  {
    id: "c1",
    code: "APP-101",
    name: "Nguyễn Hoàng Long",
    email: "long.nh@gmail.com",
    phone: "0912 888 777",
    stage: "APPLIED",
    aiMatchScore: 94,
    experienceYears: 5,
    expectedSalary: "35,000,000 ₫",
    currentCompany: "FPT Software",
    skills: ["React 19", "TypeScript", "Next.js", "Tailwind"],
    appliedDate: "Hôm nay, 09:15",
    source: "LinkedIn",
    notesCount: 2,
    recruiter: { name: "Trần Thị Mai", avatar: "TM", initials: "TM", color: "bg-red-500" },
    hasCv: true,
  },
  {
    id: "c2",
    code: "APP-102",
    name: "Vũ Hải Đăng",
    email: "dang.vh@gmail.com",
    phone: "0903 555 444",
    stage: "APPLIED",
    aiMatchScore: 88,
    experienceYears: 3,
    expectedSalary: "28,000,000 ₫",
    currentCompany: "VNG Games",
    skills: ["React", "Redux", "Webpack", "CSS Modules"],
    appliedDate: "Hôm qua",
    source: "TopCV",
    notesCount: 0,
    recruiter: { name: "Lê Hoàng Nam", avatar: "LN", initials: "LN", color: "bg-blue-600" },
    hasCv: true,
  },
  {
    id: "c3",
    code: "APP-103",
    name: "Đỗ Thu Trang",
    email: "trang.do@gmail.com",
    phone: "0988 222 111",
    stage: "SCREENING",
    aiMatchScore: 91,
    experienceYears: 6,
    expectedSalary: "38,000,000 ₫",
    currentCompany: "Shopee Vietnam",
    skills: ["React", "Vue 3", "Design Systems", "Web Performance"],
    appliedDate: "02/10/2026",
    source: "VietnamWorks",
    notesCount: 3,
    recruiter: { name: "Trần Thị Mai", avatar: "TM", initials: "TM", color: "bg-red-500" },
    hasCv: true,
  },
  {
    id: "c4",
    code: "APP-104",
    name: "Lê Anh Tuấn",
    email: "tuan.le@gmail.com",
    phone: "0977 333 444",
    stage: "INTERVIEW_1",
    aiMatchScore: 86,
    experienceYears: 4,
    expectedSalary: "32,000,000 ₫",
    currentCompany: "Viettel Solutions",
    skills: ["React", "Node.js", "GraphQL", "Jest"],
    appliedDate: "01/10/2026",
    source: "Nội bộ giới thiệu",
    notesCount: 2,
    recruiter: { name: "Lê Hoàng Nam", avatar: "LN", initials: "LN", color: "bg-blue-600" },
    hasCv: true,
    interviewScheduled: "10:00 - 08/10/2026 (Online Google Meet)",
  },
  {
    id: "c5",
    code: "APP-105",
    name: "Trần Bảo Nam",
    email: "nam.tb@gmail.com",
    phone: "0933 111 999",
    stage: "INTERVIEW_2",
    aiMatchScore: 95,
    experienceYears: 7,
    expectedSalary: "42,000,000 ₫",
    currentCompany: "KMS Technology",
    skills: ["React Native", "Next.js", "Architecture", "CI/CD"],
    appliedDate: "28/09/2026",
    source: "LinkedIn",
    notesCount: 5,
    recruiter: { name: "Trần Thị Mai", avatar: "TM", initials: "TM", color: "bg-red-500" },
    hasCv: true,
    interviewScheduled: "14:30 - 09/10/2026 (Phòng Meeting C)",
  },
  {
    id: "c6",
    code: "APP-106",
    name: "Phạm Khánh Ly",
    email: "ly.pk@gmail.com",
    phone: "0944 666 888",
    stage: "OFFER",
    aiMatchScore: 96,
    experienceYears: 6,
    expectedSalary: "40,000,000 ₫",
    currentCompany: "Tiki Tech",
    skills: ["React", "TypeScript", "Micro-frontends", "Design Systems"],
    appliedDate: "20/09/2026",
    source: "Headhunter",
    notesCount: 6,
    recruiter: { name: "Nguyễn Văn An", avatar: "NA", initials: "NA", color: "bg-emerald-600" },
    hasCv: true,
  },
  {
    id: "c7",
    code: "APP-107",
    name: "Hoàng Minh Quân",
    email: "quan.hm@gmail.com",
    phone: "0966 777 333",
    stage: "HIRED",
    aiMatchScore: 97,
    experienceYears: 8,
    expectedSalary: "45,000,000 ₫",
    currentCompany: "Grab Vietnam",
    skills: ["React", "Next.js", "Team Lead", "Cloud Native"],
    appliedDate: "10/09/2026",
    source: "LinkedIn",
    notesCount: 8,
    recruiter: { name: "Trần Thị Mai", avatar: "TM", initials: "TM", color: "bg-red-500" },
    hasCv: true,
  },
  {
    id: "c8",
    code: "APP-108",
    name: "Đinh Quang Huy",
    email: "huy.dq@gmail.com",
    phone: "0987 112 233",
    stage: "REJECTED",
    aiMatchScore: 68,
    experienceYears: 1,
    expectedSalary: "18,000,000 ₫",
    currentCompany: "Freelance",
    skills: ["HTML", "CSS", "Basic JavaScript"],
    appliedDate: "25/09/2026",
    source: "Website",
    notesCount: 1,
    recruiter: { name: "Trần Thị Mai", avatar: "TM", initials: "TM", color: "bg-red-500" },
    hasCv: true,
  },
];

const RECRUITERS = [
  { id: "ALL", name: "Tất cả Recruiter", initials: "ALL" },
  { id: "TM", name: "Trần Thị Mai", initials: "TM", color: "bg-red-500" },
  { id: "LN", name: "Lê Hoàng Nam", initials: "LN", color: "bg-blue-600" },
  { id: "NA", name: "Nguyễn Văn An", initials: "NA", color: "bg-emerald-600" },
];

export default function JobOpeningPipelinePage() {
  const params = useParams();
  const openingId = (params?.id as string) || "op_01";

  const [candidates, setCandidates] = useState<CandidateCardItem[]>(INITIAL_OPENING_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState("ALL");
  const [onlyHighAiScore, setOnlyHighAiScore] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Drag and Drop
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<StageId | null>(null);

  // Detail Modal / Drawer
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCardItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Add Candidate Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [targetAddStage, setTargetAddStage] = useState<StageId>("APPLIED");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSource, setNewSource] = useState("LinkedIn");

  // Filtering
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchRecruiter =
        selectedRecruiter === "ALL" || c.recruiter.initials === selectedRecruiter;
      const matchAi = !onlyHighAiScore || c.aiMatchScore >= 90;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRecruiter && matchAi && matchSearch;
    });
  }, [candidates, selectedRecruiter, onlyHighAiScore, searchQuery]);

  // Stage Move Handler
  const handleMoveStage = (candidateId: string, nextStage: StageId) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: nextStage } : c))
    );
    const targetStage = STAGES.find((s) => s.id === nextStage);
    toast.success(`Đã chuyển ứng viên sang: ${targetStage?.label}`);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, stageId: StageId) => {
    e.preventDefault();
    if (dragOverCol !== stageId) {
      setDragOverCol(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: StageId) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData("text/plain");
    if (candidateId) {
      handleMoveStage(candidateId, stageId);
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  // Add Candidate
  const handleAddCandidate = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast.error("Vui lòng nhập họ tên và email ứng viên");
      return;
    }
    const newCand: CandidateCardItem = {
      id: `c_${Date.now()}`,
      code: `APP-${Math.floor(110 + Math.random() * 890)}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || "Chưa cập nhật",
      stage: targetAddStage,
      aiMatchScore: Math.floor(Math.random() * 15) + 84,
      experienceYears: 4,
      expectedSalary: "Thương lượng",
      currentCompany: "Ứng viên tự do",
      skills: ["React", "JavaScript", "Frontend"],
      appliedDate: "Hôm nay",
      source: newSource,
      notesCount: 0,
      recruiter: { name: "Trần Thị Mai", avatar: "TM", initials: "TM", color: "bg-red-500" },
      hasCv: true,
    };
    setCandidates((prev) => [newCand, ...prev]);
    setAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    toast.success(`Đã thêm ứng viên ${newCand.name} (${newCand.code}) vào pipeline!`);
  };

  const isFiltered =
    selectedRecruiter !== "ALL" ||
    searchQuery !== "" ||
    onlyHighAiScore;

  const clearFilters = () => {
    setSelectedRecruiter("ALL");
    setSearchQuery("");
    setOnlyHighAiScore(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* ── 1. Jira-Style Breadcrumb & Opening Header ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3 w-3" />
              <span>CYCLOSA</span>
            </Link>
            <span>/</span>
            <Link
              href="/recruitment/openings"
              className="hover:text-primary transition-colors"
            >
              Vị trí tuyển dụng
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Senior Frontend Engineer</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-primary text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <Briefcase className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              ATS Pipeline: Senior Frontend Engineer
            </h1>
            <Badge variant="outline" className="font-mono text-[11px] h-5">
              REQ-2026-089
            </Badge>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] h-5">
              ĐANG TUYỂN (3 CHỈ TIÊU)
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center border border-border rounded-md p-0.5 bg-muted/30">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={cn(
                "p-1.5 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer",
                viewMode === "kanban"
                  ? "bg-background text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Xem dạng Kanban Board"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bảng</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer",
                viewMode === "list"
                  ? "bg-background text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Xem dạng danh sách"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Danh sách</span>
            </button>
          </div>

          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/recruitment/interviews">
              <Calendar className="h-3.5 w-3.5 mr-1 text-purple-600" />
              <span>Lịch phỏng vấn vị trí này</span>
            </Link>
          </Button>

          <Button
            size="sm"
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium"
            onClick={() => {
              setTargetAddStage("APPLIED");
              setAddModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Tiếp nhận ứng viên</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Jira-Style Control Bar (Search, Recruiter Avatars, AI Filter) ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Quick search input */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo tên, mã APP-xxx, kỹ năng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Jira-style Assignee / Recruiter Avatars Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">Recruiter:</span>
            <div className="flex items-center -space-x-1.5">
              {RECRUITERS.filter((r) => r.id !== "ALL").map((r) => {
                const isSelected = selectedRecruiter === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() =>
                      setSelectedRecruiter(isSelected ? "ALL" : r.id)
                    }
                    className={cn(
                      "h-7 w-7 rounded-full text-[10px] font-bold border-2 border-background text-white flex items-center justify-center transition-all cursor-pointer",
                      r.color,
                      isSelected
                        ? "ring-2 ring-primary scale-110 z-10"
                        : "opacity-80 hover:opacity-100 hover:scale-105"
                    )}
                    title={r.name}
                  >
                    {r.initials}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* AI Score >= 90% Chip */}
          <button
            type="button"
            onClick={() => setOnlyHighAiScore(!onlyHighAiScore)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 cursor-pointer",
              onlyHighAiScore
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            )}
          >
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>AI Match ≥ 90%</span>
            {onlyHighAiScore && <Check className="h-3 w-3 ml-0.5" />}
          </button>

          {/* Clear Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-primary hover:underline flex items-center gap-0.5 px-1 py-0.5 cursor-pointer"
            >
              <X className="h-3 w-3" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Counter Summary */}
        <div className="text-xs text-muted-foreground flex items-center gap-2 self-end md:self-auto shrink-0">
          <span>
            Hiển thị <strong className="text-foreground">{filteredCandidates.length}</strong> /{" "}
            {candidates.length} hồ sơ ứng tuyển
          </span>
        </div>
      </div>

      {/* ── 3. Jira-Style Kanban Board (Drag & Drop Columns) ─────────── */}
      {viewMode === "kanban" ? (
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex gap-3.5 min-w-[1450px]">
            {STAGES.map((col) => {
              const colCandidates = filteredCandidates.filter((c) => c.stage === col.id);
              const isDragTarget = dragOverCol === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={cn(
                    "w-[275px] shrink-0 bg-slate-100/80 dark:bg-slate-900/50 rounded-xl p-2.5 border transition-all flex flex-col max-h-[calc(100vh-250px)]",
                    isDragTarget
                      ? "border-primary ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10"
                      : "border-slate-200/80 dark:border-slate-800"
                  )}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 px-1 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2.5 w-2.5 rounded-full", col.accentColor)} />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                        {col.label}
                      </span>
                      <span className="rounded-full px-1.5 py-0.2 text-[11px] font-bold bg-slate-200/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {colCandidates.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTargetAddStage(col.id);
                        setAddModalOpen(true);
                      }}
                      className="h-6 w-6 rounded hover:bg-slate-200/80 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-foreground transition-colors cursor-pointer"
                      title={`Thêm hồ sơ vào "${col.label}"`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Candidate Cards Stream in Column */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                    {colCandidates.map((cand) => {
                      const isBeingDragged = draggedId === cand.id;

                      return (
                        <div
                          key={cand.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, cand.id)}
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setDetailModalOpen(true);
                          }}
                          className={cn(
                            "bg-card rounded-lg p-3 border border-border shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-grab active:cursor-grabbing select-none group relative space-y-2",
                            isBeingDragged && "opacity-40 scale-95 border-dashed border-primary"
                          )}
                        >
                          {/* Top Row: Jira-like Issue Code + AI Score */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] font-bold text-primary hover:underline">
                              {cand.code}
                            </span>

                            <div
                              className={cn(
                                "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border",
                                cand.aiMatchScore >= 90
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                  : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                              )}
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              <span>{cand.aiMatchScore}%</span>
                            </div>
                          </div>

                          {/* Candidate Name & Current Info */}
                          <div>
                            <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                              {cand.name}
                            </h4>
                            {cand.currentCompany && (
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {cand.experienceYears} năm KN • {cand.currentCompany}
                              </p>
                            )}
                          </div>

                          {/* Skills Chips */}
                          <div className="flex flex-wrap gap-1">
                            {cand.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.2 rounded text-[10px] bg-muted/60 text-muted-foreground border border-border/40 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {cand.skills.length > 3 && (
                              <span className="px-1 py-0.2 rounded text-[10px] text-muted-foreground font-mono">
                                +{cand.skills.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Interview banner if scheduled */}
                          {cand.interviewScheduled && (
                            <div className="p-1.5 rounded bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-[10px] text-purple-700 dark:text-purple-300 flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3 shrink-0" />
                              <span className="truncate">{cand.interviewScheduled}</span>
                            </div>
                          )}

                          {/* Footer: Date / Source + Recruiter Avatar */}
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/50">
                            <span className="truncate max-w-[120px]">
                              {cand.source} • {cand.appliedDate}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {cand.hasCv && (
                                <span title="Có đính kèm CV">
                                  <Paperclip className="h-3 w-3 text-slate-400" />
                                </span>
                              )}
                              <span className="flex items-center gap-0.5 font-mono">
                                <MessageSquare className="h-3 w-3 text-slate-400" />
                                {cand.notesCount}
                              </span>
                              <div
                                className={cn(
                                  "h-5 w-5 rounded-full text-white flex items-center justify-center font-bold text-[9px] border border-border",
                                  cand.recruiter.color
                                )}
                                title={`Phụ trách: ${cand.recruiter.name}`}
                              >
                                {cand.recruiter.initials}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {colCandidates.length === 0 && (
                      <div className="py-8 text-center text-xs text-muted-foreground/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                        Kéo thả hồ sơ vào đây
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── 3B. Jira-Style Table / List View ──────────────────────── */
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="py-2.5 px-4 font-semibold text-foreground">Mã</th>
                  <th className="py-2.5 px-4 font-semibold text-foreground">Ứng viên</th>
                  <th className="py-2.5 px-4 font-semibold text-foreground text-center">Giai đoạn</th>
                  <th className="py-2.5 px-4 font-semibold text-foreground text-center">AI Match</th>
                  <th className="py-2.5 px-4 font-semibold text-foreground">Kinh nghiệm</th>
                  <th className="py-2.5 px-4 font-semibold text-foreground">Lương kỳ vọng</th>
                  <th className="py-2.5 px-4 font-semibold text-foreground">Phụ trách</th>
                  <th className="py-2.5 px-4 font-semibold text-foreground text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCandidates.map((cand) => {
                  const stageObj = STAGES.find((s) => s.id === cand.stage);
                  return (
                    <tr
                      key={cand.id}
                      className="hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setDetailModalOpen(true);
                      }}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-primary text-xs">
                        {cand.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{cand.name}</div>
                        <div className="text-[11px] text-muted-foreground">{cand.email}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                            stageObj?.badgeBg
                          )}
                        >
                          {stageObj?.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold",
                            cand.aiMatchScore >= 90
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                          )}
                        >
                          <Sparkles className="h-3 w-3" />
                          {cand.aiMatchScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {cand.experienceYears} năm ({cand.currentCompany || "N/A"})
                      </td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        {cand.expectedSalary}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={cn(
                              "h-5 w-5 rounded-full text-white flex items-center justify-center font-bold text-[9px]",
                              cand.recruiter.color
                            )}
                          >
                            {cand.recruiter.initials}
                          </div>
                          <span>{cand.recruiter.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidate(cand);
                            setDetailModalOpen(true);
                          }}
                        >
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── 4. Jira-Style Candidate Detail Dialog / Drawer ───────────── */}
      {selectedCandidate && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-border pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                    {selectedCandidate.code}
                  </span>
                  <DialogTitle className="text-lg font-bold text-foreground">
                    {selectedCandidate.name}
                  </DialogTitle>
                </div>

                <Badge
                  className={cn(
                    "text-xs px-2 py-0.5 font-semibold",
                    STAGES.find((s) => s.id === selectedCandidate.stage)?.badgeBg
                  )}
                >
                  {STAGES.find((s) => s.id === selectedCandidate.stage)?.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground text-left mt-1">
                Vị trí: <strong>Senior Frontend Engineer</strong> • Mã tuyển dụng: REQ-2026-089
              </p>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Stage Transition Selector Bar */}
              <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-medium text-foreground">Chuyển giai đoạn tuyển dụng:</span>
                <select
                  value={selectedCandidate.stage}
                  onChange={(e) => {
                    handleMoveStage(selectedCandidate.id, e.target.value as StageId);
                    setSelectedCandidate({
                      ...selectedCandidate,
                      stage: e.target.value as StageId,
                    });
                  }}
                  className="h-8 px-2.5 text-xs font-medium rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      ➔ {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Two columns layout like Jira Issue Detail */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Left 7 cols: Content & AI Review */}
                <div className="sm:col-span-7 space-y-3">
                  {/* AI Assessment Card */}
                  <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                        <Sparkles className="h-4 w-4" />
                        <span>AI Match Score: {selectedCandidate.aiMatchScore}%</span>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-[10px]">Rất phù hợp</Badge>
                    </div>
                    <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                      Ứng viên sở hữu kinh nghiệm thực chiến vững chắc trong hệ sinh thái React, Next.js và kiến trúc Frontend hiện đại. Kỹ năng giao tiếp và khả năng lãnh đạo nhóm kỹ thuật được đánh giá tích cực.
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1.5">
                    <span className="font-medium text-foreground block">Kỹ năng chuyên môn:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map((s, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes & Activity Log */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Ghi chú & Đánh giá phỏng vấn:</span>
                      <span className="text-muted-foreground text-[11px]">{selectedCandidate.notesCount} ghi chú</span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Thêm nhận xét phỏng vấn hoặc ghi chú về ứng viên..."
                      className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => toast.success("Đã lưu ghi chú phỏng vấn!")}
                      >
                        Lưu ghi chú
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Metadata & Contact Details */}
                <div className="sm:col-span-5 space-y-3 bg-muted/20 p-3 rounded-lg border border-border">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-slate-500">
                    Thông tin liên hệ
                  </h4>

                  <div className="space-y-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block">Email:</span>
                      <a href={`mailto:${selectedCandidate.email}`} className="text-primary hover:underline font-medium">
                        {selectedCandidate.email}
                      </a>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Số điện thoại:</span>
                      <a href={`tel:${selectedCandidate.phone}`} className="text-foreground font-mono font-medium">
                        {selectedCandidate.phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Kinh nghiệm:</span>
                      <span className="text-foreground font-medium">
                        {selectedCandidate.experienceYears} năm ({selectedCandidate.currentCompany || "N/A"})
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Mức lương mong muốn:</span>
                      <span className="text-foreground font-semibold text-primary">
                        {selectedCandidate.expectedSalary}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Nguồn tiếp nhận:</span>
                      <span className="text-foreground">{selectedCandidate.source}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Recruiter phụ trách:</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div
                          className={cn(
                            "h-5 w-5 rounded-full text-white flex items-center justify-center font-bold text-[9px]",
                            selectedCandidate.recruiter.color
                          )}
                        >
                          {selectedCandidate.recruiter.initials}
                        </div>
                        <span className="text-foreground font-medium">
                          {selectedCandidate.recruiter.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between w-full border-t border-border pt-3">
              <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                <Link href="/recruitment/interviews">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-purple-600" />
                  <span>Lên lịch phỏng vấn</span>
                </Link>
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
                onClick={() => setDetailModalOpen(false)}
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ── 5. Quick Add Candidate Modal ─────────────────────────────── */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Tiếp nhận hồ sơ ứng viên mới
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground block">Họ và tên ứng viên *</label>
              <Input
                placeholder="VD: Trần Văn Bình"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-medium text-foreground block">Email *</label>
                <Input
                  type="email"
                  placeholder="binh.tv@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-foreground block">Số điện thoại</label>
                <Input
                  placeholder="0912 345 678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground block">Giai đoạn ban đầu</label>
              <select
                value={targetAddStage}
                onChange={(e) => setTargetAddStage(e.target.value as StageId)}
                className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground block">Nguồn tiếp nhận</label>
              <select
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="TopCV">TopCV</option>
                <option value="VietnamWorks">VietnamWorks</option>
                <option value="Nội bộ giới thiệu">Nội bộ giới thiệu</option>
                <option value="Headhunter">Headhunter</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setAddModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium"
              onClick={handleAddCandidate}
            >
              Tiếp nhận vào Pipeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
