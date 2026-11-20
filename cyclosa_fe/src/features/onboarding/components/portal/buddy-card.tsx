"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BuddyCardProps {
  mentorName?: string;
  directManagerName?: string;
}

export function BuddyCard({ mentorName, directManagerName }: BuddyCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Mentor Card */}
      <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="py-3 px-5 border-b border-border bg-muted/20">
          <CardTitle className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Người Đồng hành Hướng dẫn (Buddy / Mentor)</span>
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
              Đồng hành 1-1
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-border">
              {mentorName ? mentorName.charAt(0) : "M"}
            </div>
            <div className="space-y-0.5">
              <strong className="text-sm font-semibold text-foreground block">
                {mentorName || "Chưa phân công"}
              </strong>
              <p className="text-[11px] text-muted-foreground">
                Hỗ trợ giải đáp thắc mắc văn hóa & môi trường làm việc
              </p>
            </div>
          </div>

          {mentorName && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5 shrink-0"
              onClick={() => alert(`Kết nối trao đổi với Mentor: ${mentorName}`)}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Trao đổi</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Direct Manager Card */}
      <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="py-3 px-5 border-b border-border bg-muted/20">
          <CardTitle className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Quản lý Trực tiếp (Direct Manager)</span>
            <Badge variant="outline" className="text-[10px]">
              Đánh giá thử việc
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted text-foreground font-bold text-sm flex items-center justify-center border border-border">
              {directManagerName ? directManagerName.charAt(0) : "Q"}
            </div>
            <div className="space-y-0.5">
              <strong className="text-sm font-semibold text-foreground block">
                {directManagerName || "Chưa phân công"}
              </strong>
              <p className="text-[11px] text-muted-foreground">
                Định hướng mục tiêu công việc & nghiệm thu thử việc
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

