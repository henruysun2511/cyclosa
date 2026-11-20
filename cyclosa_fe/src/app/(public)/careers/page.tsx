"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetPublicJobOpeningsQuery } from "@/features/recruitment";

export default function PublicCareersPage() {
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: pagedData, isLoading } = useGetPublicJobOpeningsQuery({
    keyword: keyword || undefined,
    page: 1,
    size: 20,
  });

  const jobs = pagedData?.items || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput.trim());
  };

  const formatCurrency = (val?: number) => {
    if (!val) return "Thỏa thuận";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven Hiring • Cơ hội bứt phá sự nghiệp</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Khám phá cơ hội nghề nghiệp tại{" "}
            <span className="text-primary underline decoration-primary/40 underline-offset-8">
              CYCLOSA
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chúng tôi xây dựng nền tảng quản trị nhân sự thế hệ mới ứng dụng Trí tuệ nhân tạo. 
            Tìm kiếm công việc lý tưởng và bắt đầu hành trình kiến tạo tương lai cùng chúng tôi ngay hôm nay!
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto pt-2"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm vị trí tuyển dụng, kỹ năng, chuyên môn..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 h-11 bg-card text-xs sm:text-sm shadow-xs border-border"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-sm"
            >
              Tìm việc làm
            </Button>
          </form>
        </div>
      </section>

      {/* Job Openings Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Vị trí đang mở tuyển ({jobs.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Tất cả các cơ hội việc làm toàn thời gian và bán thời gian đang sẵn sàng tiếp nhận hồ sơ.
            </p>
          </div>
          {keyword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setKeyword("");
                setSearchInput("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground h-8"
            >
              Xóa bộ lọc tìm kiếm
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl border border-border bg-card/50 p-6 animate-pulse"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/30">
            <Briefcase className="h-10 w-10 text-muted-foreground mx-auto stroke-1" />
            <h3 className="text-sm font-bold text-foreground">
              Hiện chưa có vị trí phù hợp với từ khóa tìm kiếm
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Vui lòng thử lại với từ khóa khác hoặc quay lại sau để cập nhật những đợt tuyển dụng mới nhất từ CYCLOSA.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-2xs hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-1">
                        {job.departmentName || "Khối Công nghệ & Vận hành"}
                      </span>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 shrink-0">
                      Đang mở tuyển
                    </span>
                  </div>

                  {/* Job Specs Tags */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {job.workLocation || "Hà Nội"}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      {job.employmentType === "FULL_TIME" ? "Toàn thời gian" : "Linh hoạt"}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-mono font-medium text-foreground">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                      {job.isSalaryNegotiable
                        ? "Thỏa thuận"
                        : `${formatCurrency(job.salaryBandMin)} - ${formatCurrency(job.salaryBandMax)}`}
                    </span>
                  </div>

                  {job.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Hạn nộp:{" "}
                    {job.deadlineDate
                      ? new Date(job.deadlineDate).toLocaleDateString("vi-VN")
                      : "Ưu tiên nộp sớm"}
                  </span>

                  <Button
                    asChild
                    size="sm"
                    className="h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-2xs"
                  >
                    <Link href={`/careers/${job.landingSlug}`}>
                      <span>Chi tiết & Ứng tuyển</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
