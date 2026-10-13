"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  UserCheck,
  CheckCircle2,
  Circle,
  BookOpen,
  Laptop,
  Users,
  Building2,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OnboardingTask {
  id: string;
  title: string;
  category: "HR" | "IT" | "TEAM";
  done: boolean;
  dueDate: string;
}

const INITIAL_TASKS: OnboardingTask[] = [
  { id: "t1", title: "Nộp bổ sung bản sao công chứng CCCD và Bằng đại học", category: "HR", done: true, dueDate: "Ngày 1" },
  { id: "t2", title: "Ký hợp đồng thử việc điện tử và cam kết bảo mật NDA", category: "HR", done: true, dueDate: "Ngày 1" },
  { id: "t3", title: "Nhận máy tính xách tay MacBook & tài khoản email công ty từ IT", category: "IT", done: true, dueDate: "Ngày 1" },
  { id: "t4", title: "Đăng ký khuôn mặt Face ID để chấm công di động", category: "HR", done: false, dueDate: "Ngày 2" },
  { id: "t5", title: "Gặp gỡ 1-on-1 với Mentor người hướng dẫn và Leader nhóm", category: "TEAM", done: false, dueDate: "Tuần 1" },
  { id: "t6", title: "Đọc và xác nhận hoàn thành Sổ tay Văn hóa Doanh nghiệp FSI", category: "HR", done: false, dueDate: "Tuần 1" },
  { id: "t7", title: "Cài đặt môi trường phát triển & xin cấp quyền truy cập Git/Jira", category: "IT", done: false, dueDate: "Tuần 1" },
];

export default function MyOnboardingWelcomePage() {
  const [tasks, setTasks] = useState<OnboardingTask[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1">
          Lộ trình Hội nhập 60 Ngày Thử việc
        </Badge>
        <Badge variant="outline" className="font-mono text-xs">ONB-07</Badge>
      </div>

      {/* ── Welcome Banner ─────────────────────────────────────────── */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-xs text-indigo-300 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Chào mừng bạn gia nhập Tập đoàn FSI!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span>Chúc mừng bạn, Đặng Minh Tân</span>
            <Sparkles className="h-6 w-6 text-amber-300 inline-block" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Chúng tôi rất vui mừng được chào đón bạn vào <strong>Phòng Phát Triển Backend</strong>. Hãy hoàn thành các nhiệm vụ khởi đầu dưới đây để hòa nhập nhanh chóng vào guồng quay công việc!
          </p>
        </div>
      </div>

      {/* ── Progress & Mentor Card Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card (2 cols) */}
        <Card className="md:col-span-2 shadow-2xs border-border">
          <CardHeader className="py-4 px-6 border-b border-border flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-bold">Nhiệm vụ Ngày đầu tiên & Tuần đầu</CardTitle>
              <p className="text-xs text-muted-foreground">
                Đã hoàn thành {completedCount}/{tasks.length} nhiệm vụ
              </p>
            </div>
            <span className="text-xl font-extrabold font-mono text-primary">{progressPercent}%</span>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Tasks list */}
            <div className="space-y-2.5 pt-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    task.done
                      ? "bg-slate-50/80 border-slate-200 text-slate-500 line-through"
                      : "bg-white border-border hover:border-slate-300 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {task.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-medium">{task.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-2xs font-normal">
                      {task.category}
                    </Badge>
                    <span className="text-2xs font-mono text-muted-foreground">{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mentor & Quick Help Right (1 col) */}
        <div className="space-y-6">
          {/* Mentor Profile */}
          <Card className="shadow-2xs border-border">
            <CardHeader className="py-4 px-5 border-b border-border">
              <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                Người Đồng Hành (Buddy / Mentor)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mx-auto">
                QB
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Trần Quốc Bảo</h4>
                <p className="text-xs text-muted-foreground font-mono">Senior Backend Lead</p>
              </div>
              <p className="text-2xs text-slate-600">
                &quot;Chào Tân! Mình là người đồng hành hướng dẫn kỹ thuật và quy trình cho bạn trong 2 tháng thử việc.&quot;
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" className="text-xs h-8">
                  <Mail className="h-3.5 w-3.5 mr-1" />
                  Gửi email
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-8">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  Gọi điện
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Handbooks */}
          <Card className="shadow-2xs border-border">
            <CardHeader className="py-4 px-5 border-b border-border">
              <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                Cẩm nang & Tài liệu nội bộ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <Link href="#" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-slate-700">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Sổ tay văn hóa doanh nghiệp
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link href="#" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-slate-700">
                <span className="flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-indigo-600" /> Hướng dẫn bảo mật IT & VPN
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
              <Link href="#" className="flex items-center justify-between p-2 rounded hover:bg-slate-50 text-slate-700">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" /> Bản đồ tiện ích tòa nhà FSI
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
