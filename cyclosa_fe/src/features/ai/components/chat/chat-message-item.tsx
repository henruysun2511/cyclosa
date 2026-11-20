"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  BookOpen,
  BarChart3,
  Bot,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SpiderIcon } from "@/components/shared/spider-icon";
import type { Citation, MessageDetail } from "../../types/ai.types";
import { useSubmitFeedbackMutation } from "../../api/ai-api";

interface ChatMessageItemProps {
  message: MessageDetail;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isAi = message.role === "ASSISTANT";
  const [copied, setCopied] = useState(false);
  const [showCitations, setShowCitations] = useState(false);
  const [feedback, setFeedback] = useState<"HELPFUL" | "NOT_HELPFUL" | null>(
    message.feedback || null
  );

  const [submitFeedbackApi] = useSubmitFeedbackMutation();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Đã sao chép nội dung tin nhắn");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = async (type: "HELPFUL" | "NOT_HELPFUL") => {
    if (feedback === type) return;
    setFeedback(type);
    try {
      await submitFeedbackApi({
        messageId: message.id,
        body: { feedback: type },
      }).unwrap();
      toast.success(
        type === "HELPFUL"
          ? "Cảm ơn bạn đã đánh giá câu trả lời hữu ích!"
          : "Cảm ơn ý kiến góp ý, hệ thống sẽ cải thiện câu trả lời."
      );
    } catch {
      toast.error("Không thể gửi đánh giá, vui lòng thử lại");
    }
  };

  // Parse citations nếu có
  let citations: Citation[] = [];
  if (message.sourceDocuments) {
    try {
      citations = JSON.parse(message.sourceDocuments);
    } catch {
      citations = [];
    }
  }

  // Parse chart config nếu có
  let chartData: {
    title?: string;
    items?: { label: string; value: number }[];
  } | null = null;
  if (message.chartConfig) {
    try {
      chartData = JSON.parse(message.chartConfig);
    } catch {
      chartData = null;
    }
  }

  return (
    <div
      className={cn(
        "flex gap-3 w-full my-3 group transition-all",
        isAi ? "items-start" : "items-start flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isAi ? (
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs select-none">
            <SpiderIcon className="h-5 w-5" />
          </div>
        ) : (
          <div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-2xs">
            <User className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Bubble Content */}
      <div
        className={cn(
          "flex flex-col max-w-[85%] md:max-w-[75%]",
          isAi ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs transition-all",
            isAi
              ? "bg-card border border-border text-foreground"
              : "bg-primary text-primary-foreground rounded-tr-xs"
          )}
        >
          {/* Nội dung tin nhắn */}
          <div className="whitespace-pre-wrap font-sans text-sm break-words">
            {message.content}
          </div>

          {/* Biểu đồ trực quan nếu có */}
          {chartData?.items && chartData.items.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-xl border border-border/60">
              {chartData.title && (
                <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground mb-3">
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                  <span>{chartData.title}</span>
                </div>
              )}
              <div className="space-y-2">
                {chartData.items.map((it, idx) => {
                  const maxVal = Math.max(
                    ...chartData!.items!.map((x) => x.value || 1)
                  );
                  const pct = Math.round((it.value / maxVal) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{it.label}</span>
                        <span className="font-semibold text-foreground">
                          {it.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Khối trích dẫn chính sách RAG (Accordion) */}
          {citations.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-border/40">
              <button
                type="button"
                onClick={() => setShowCitations(!showCitations)}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Trích dẫn căn cứ quy chế ({citations.length})</span>
                {showCitations ? (
                  <ChevronUp className="h-3 w-3 ml-0.5" />
                ) : (
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                )}
              </button>

              {showCitations && (
                <div className="mt-2 space-y-2">
                  {citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-950 dark:text-emerald-200"
                    >
                      <div className="font-semibold flex items-center justify-between">
                        <span>{c.document_title || c.documentTitle}</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-0"
                        >
                          {c.section}
                        </Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground leading-normal italic">
                        &ldquo;{c.content_snippet || c.contentSnippet}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thanh công cụ phụ (Copy, Feedback, Thời gian) */}
        <div
          className={cn(
            "flex items-center gap-1 mt-1 text-[11px] text-muted-foreground px-1",
            isAi ? "justify-start" : "justify-end"
          )}
        >
          {isAi && (
            <>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopy}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="Sao chép câu trả lời"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleFeedback("HELPFUL")}
                className={cn(
                  "h-6 w-6",
                  feedback === "HELPFUL"
                    ? "text-emerald-600 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Hữu ích"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleFeedback("NOT_HELPFUL")}
                className={cn(
                  "h-6 w-6",
                  feedback === "NOT_HELPFUL"
                    ? "text-rose-600 bg-rose-500/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Chưa hữu ích"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
              <span className="text-muted-foreground/40 px-1">•</span>
            </>
          )}
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
