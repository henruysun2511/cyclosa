"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Calendar,
  Clock,
  Plus,
  Search,
  Video,
  Users,
  Eye,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface InterviewSession {
  id: string;
  candidateName: string;
  candidateEmail: string;
  initials: string;
  avatarBg: string;
  jobTitle: string;
  roundName: string;
  dateTime: string;
  interviewers: string[];
  meetingLink: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

const INITIAL_INTERVIEWS: InterviewSession[] = [
  {
    id: "int_01",
    candidateName: "Lê Minh Tuấn",
    candidateEmail: "tuan.leminh@gmail.com",
    initials: "MT",
    avatarBg: "bg-blue-500 text-white",
    jobTitle: "Senior Frontend Engineer",
    roundName: "Vòng 2: Phỏng vấn Kỹ thuật Chuyên sâu",
    dateTime: "Hôm nay, 14:00 - 15:00",
    interviewers: ["Phạm Minh Tuấn (Tech Lead)", "Lê Hoàng Nam (CTO)"],
    meetingLink: "https://meet.google.com/fsi-tech-interview",
    status: "SCHEDULED",
  },
  {
    id: "int_02",
    candidateName: "Hoàng Văn Thái",
    candidateEmail: "thai.hoang@gmail.com",
    initials: "VT",
    avatarBg: "bg-emerald-500 text-white",
    jobTitle: "AI Research Scientist",
    roundName: "Vòng 1: Phỏng vấn Văn hóa & HR",
    dateTime: "Ngày mai, 10:00 - 10:45",
    interviewers: ["Trần Thị Mai (HRD)"],
    meetingLink: "https://meet.google.com/fsi-hr-interview",
    status: "SCHEDULED",
  },
  {
    id: "int_03",
    candidateName: "Nguyễn Thị Phương",
    candidateEmail: "phuong.nguyen@gmail.com",
    initials: "TP",
    avatarBg: "bg-purple-500 text-white",
    jobTitle: "Chuyên Viên Quan Hệ Khách Hàng",
    roundName: "Vòng 2: Phỏng vấn Giám Đốc Khối",
    dateTime: "Hôm qua, 15:30 - 16:30",
    interviewers: ["Vũ Đức Long (CCO)"],
    meetingLink: "https://meet.google.com/fsi-biz-interview",
    status: "COMPLETED",
  },
];

export default function InterviewCalendarPage() {
  const [interviews] = useState<InterviewSession[]>(INITIAL_INTERVIEWS);
  const [search, setSearch] = useState("");

  const filteredInterviews = interviews.filter(
    (i) =>
      i.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      i.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      i.roundName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Lịch Phỏng vấn & Hội đồng Đánh giá
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
              href="/recruitment/openings"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Tuyển dụng
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Lịch phỏng vấn (REC-19)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Lên lịch phỏng vấn mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Lên lịch phỏng vấn</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Danh sách ca phỏng vấn ({filteredInterviews.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo ứng viên, vị trí, vòng..."
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
                <th>Ứng viên</th>
                <th>Vị trí ứng tuyển & Vòng phỏng vấn</th>
                <th>Thời gian phỏng vấn</th>
                <th>Hội đồng phỏng vấn</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Phiếu chấm điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInterviews.map((item) => (
                <tr key={item.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {item.candidateName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {item.candidateEmail}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-medium text-foreground text-xs">
                      {item.jobTitle}
                    </p>
                    <span className="text-xs text-primary font-semibold">
                      {item.roundName}
                    </span>
                  </td>
                  <td className="text-xs font-medium text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{item.dateTime}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {item.interviewers.map((inv) => (
                        <span
                          key={inv}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-800"
                        >
                          {inv}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon-sm text-primary hover:bg-red-50"
                        title="Vào phòng Google Meet"
                      >
                        <Video className="h-3.5 w-3.5" />
                      </a>
                      <Link
                        href={`/interviews/${item.id}/scorecard`}
                        className="btn-outline h-7 text-xs inline-flex items-center gap-1.5"
                      >
                        <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                        <span>Phiếu chấm (Blind)</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredInterviews.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{interviews.length}</span> ca phỏng vấn
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
