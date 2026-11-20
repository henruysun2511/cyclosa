"use client";

import React from "react";
import Link from "next/link";
import { Bot } from "lucide-react";
import { ChatWindow } from "@/features/ai";

export default function AiChatPage() {
  return (
    <div className="space-y-4 pb-6">
      {/* 1. Top Header & Breadcrumbs (Golden Standard Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Bot className="w-6 h-6 text-primary shrink-0" />
            <span>Trợ lý AI Copilot</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-muted-foreground">Trợ lý AI & Kho tri thức</span>
            <span>/</span>
            <span className="text-foreground font-medium">Trợ lý AI Copilot</span>
          </nav>
        </div>
      </div>

      {/* 2. Chat Window Container */}
      <ChatWindow />
    </div>
  );
}
