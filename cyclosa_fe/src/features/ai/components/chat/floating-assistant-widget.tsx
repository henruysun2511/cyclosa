"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Maximize2, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SpiderIcon } from "@/components/shared/spider-icon";
import { useChatMutation } from "../../api/ai-api";
import { toast } from "sonner";

export function FloatingAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);

  const [chatMutation, { isLoading }] = useChatMutation();

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = query.trim();
    if (!text || isLoading) return;

    setQuery("");
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const res = await chatMutation({ query: text }).unwrap();
      if (res.data) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: res.data.response },
        ]);
      }
    } catch {
      toast.error("Không thể kết nối đến Trợ lý AI");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-13 w-13 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          title="Mở Trợ lý AI CYCLOSA"
        >
          <SpiderIcon className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          <span className="sr-only">Trợ lý AI</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[480px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
                <SpiderIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xs">CYCLOSA AI Copilot</span>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/ai/chat" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  title="Mở toàn màn hình"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                title="Đóng"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs bg-muted/10">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground space-y-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="font-semibold text-foreground text-xs">
                  Xin chào! Tôi có thể giúp gì cho bạn?
                </p>
                <p className="text-[11px]">
                  Hỏi về ngày phép, phiếu lương, hoặc quy chế làm việc công ty.
                </p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "p-2.5 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-wrap break-words",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground shadow-2xs"
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Đang tra cứu dữ liệu...</span>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSend}
            className="p-2 border-t border-border flex items-center gap-1.5 bg-card"
          >
            <Input
              placeholder="Nhập câu hỏi nhanh..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 text-xs rounded-lg"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon-xs"
              className="h-8 w-8 rounded-lg shrink-0"
              disabled={!query.trim() || isLoading}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
