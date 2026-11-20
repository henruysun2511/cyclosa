"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SpiderIcon } from "@/components/shared";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  sources?: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    sender: "ai",
    content:
      "Xin chào! Tôi là Trợ lý AI Copilot của hệ thống CYCLOSA. Tôi có thể hỗ trợ bạn tra cứu quy định pháp luật lao động, giải đáp chính sách nội bộ công ty, phân tích quỹ lương hoặc lập kịch bản nhân sự. Bạn cần hỗ trợ thông tin gì hôm nay?",
    timestamp: "09:00",
  },
  {
    id: "msg_2",
    sender: "user",
    content:
      "Theo Bộ luật Lao động 2019, thời gian thử việc tối đa cho vị trí Kỹ sư công nghệ thông tin là bao lâu và mức lương thử việc tối thiểu là bao nhiêu?",
    timestamp: "09:01",
  },
  {
    id: "msg_3",
    sender: "ai",
    content: `Theo quy định tại **Bộ luật Lao động 2019**:

1. **Thời gian thử việc tối đa (Điều 25):**
   - Đối với công việc có chức danh nghề nghiệp cần trình độ chuyên môn, kỹ thuật từ **cao đẳng trở lên** (bao gồm vị trí Kỹ sư CNTT / Software Engineer), thời gian thử việc **không quá 60 ngày**.

2. **Tiền lương trong thời gian thử việc (Điều 26):**
   - Tiền lương của người lao động trong thời gian thử việc do hai bên thỏa thuận nhưng **ít nhất phải bằng 85% mức lương của công việc đó**.

> **Khuyến nghị cho HR CYCLOSA:** Đảm bảo lập Hợp đồng thử việc riêng hoặc ghi rõ điều khoản thử việc trong hợp đồng lao động; đánh giá kết quả trước ngày thứ 57 để ban hành quyết định tiếp nhận chính thức đúng hạn.`,
    timestamp: "09:01",
    sources: [
      "Điều 25 & 26 Bộ luật Lao động số 45/2019/QH14",
      "Quy chế Tiền lương Tập đoàn CYCLOSA",
    ],
  },
];

// Logo CYCLOSA Avatar Component
function CyclosaLogoAvatar({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-bold shadow-xs shrink-0 select-none",
        className
      )}
      title="CYCLOSA AI Copilot"
    >
      <SpiderIcon className="h-4.5 w-4.5" />
    </div>
  );
}

// User Avatar Component (dùng ảnh người dùng đã cung cấp)
function UserPhotoAvatar({ className = "h-8 w-8" }: { className?: string }) {
  const [src, setSrc] = useState("/avatars/emp_1.jpg");
  const fallback =
    "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-6/480996638_1342553063760417_7964550011938015903_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeHEdkhTLRcncB85kXMY8ULwV4wR2A7xZgNXjBHYDvFmA7DmzxeFA_9SFqIyAst5rA_kMfjCzdqdN3zygxs-7Ug6&_nc_ohc=btWu47l5ifQQ7kNvwGHLDDz&_nc_oc=AdoacFtolA0BJKtRcG4CMN7PY2uiQ_z7uTYWsEwkCegYYG1Q8WlLP9P4-wCIO36yAsy9zc08dQKaBfYHMBR6IlMi&_nc_zt=23&_nc_ht=scontent.fhan14-4.fna&_nc_gid=NJZg0FH9bTnN7ydx3BfDDw&_nc_ss=782a8&oh=00_AQPrW22IiV3X4l0_IwTttt75tTH4W8Ch5OA5Z3eUVgjIPw&oe=6AD423DD";

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden ring-1 ring-border shadow-2xs bg-slate-100 flex items-center justify-center shrink-0",
        className
      )}
      title="Người dùng"
    >
      <img
        src={src}
        alt="User Avatar"
        onError={() => {
          if (src !== fallback) setSrc(fallback);
        }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function AIChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsTyping(true);

    // Giả lập câu trả lời AI thông minh
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        content: `Dựa trên dữ liệu hệ thống **CYCLOSA HRM** và quy định hiện hành:

• Yêu cầu của bạn đã được đối soát thành công với cơ sở dữ liệu nhân sự & quy chế công ty.
• Dữ liệu cập nhật theo kỳ vận hành mới nhất của tập đoàn.
• Bạn có thể xuất báo cáo phân tích hoặc tạo quy trình phê duyệt liên quan tại các phân hệ tương ứng.`,
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sources: [
          "Cơ sở dữ liệu CYCLOSA HRM Enterprise",
          "Quy chế quản trị nội bộ tập đoàn",
        ],
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1100);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Đã sao chép nội dung câu trả lời!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    "So sánh chi phí quỹ lương tháng 09 so với tháng 08",
    "Quy định hưởng chế độ thai sản đối với lao động nam",
    "Danh sách các hợp đồng sắp hết hạn trong 30 ngày tới",
    "Tỷ lệ đi làm đúng giờ của các phòng ban tuần này",
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* ── Top Bar với Logo CYCLOSA ─────────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0 bg-white p-3.5 rounded-xl border border-border shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Logo CYCLOSA cho trợ lý AI */}
          <CyclosaLogoAvatar className="h-10 w-10 rounded-xl" />
          <div>
            <h1 className="text-base font-bold text-foreground flex items-center gap-2">
              CYCLOSA AI Copilot
              <Badge className="bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20 text-2xs font-mono font-semibold">
                v2.5
              </Badge>
            </h1>
            <p className="text-2xs text-muted-foreground">
              Trợ lý trí tuệ nhân tạo chuyên sâu về Nhân sự, Pháp chế & Dữ liệu CYCLOSA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([INITIAL_MESSAGES[0]]);
              toast.info("Đã làm mới phiên hội thoại");
            }}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đoạn chat mới</span>
          </Button>
          <Badge variant="outline" className="font-mono text-xs">
            AI-01
          </Badge>
        </div>
      </div>

      {/* ── Khung Chat ───────────────────────────────────────────────── */}
      <Card className="shadow-2xs border-border flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar: AI dùng Logo CYCLOSA, User dùng Ảnh người dùng */}
              {msg.sender === "user" ? (
                <UserPhotoAvatar className="h-8 w-8" />
              ) : (
                <CyclosaLogoAvatar className="h-8 w-8 rounded-lg" />
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-2xs group relative ${
                  msg.sender === "user"
                    ? "bg-[#DC2626] text-white rounded-tr-xs"
                    : "bg-white text-slate-800 border border-border rounded-tl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Sources list nếu có */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
                    <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Nguồn tham chiếu:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-2xs text-slate-600 font-mono"
                        >
                          <BookOpen className="h-3 w-3 text-slate-400" />
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer bubble: timestamp & nút copy */}
                <div className="flex items-center justify-between pt-1">
                  {msg.sender === "ai" ? (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-2xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                      title="Sao chép câu trả lời"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div />
                  )}

                  <div
                    className={`text-3xs ${
                      msg.sender === "user" ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground italic pl-11">
              <div className="h-4 w-4 rounded bg-[#DC2626] text-white flex items-center justify-center shrink-0">
                <SpiderIcon className="h-2.5 w-2.5 animate-pulse" />
              </div>
              <span>CYCLOSA AI đang phân tích dữ liệu và soạn thảo câu trả lời...</span>
            </div>
          )}
        </div>

        {/* Gợi ý câu hỏi nhanh */}
        <div className="p-2.5 border-t border-border bg-white flex items-center gap-2 overflow-x-auto text-xs shrink-0 scrollbar-none">
          <span className="text-2xs text-muted-foreground whitespace-nowrap font-medium pl-1">
            Gợi ý nhanh:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-[#DC2626]/5 hover:border-[#DC2626]/40 text-slate-700 hover:text-[#DC2626] whitespace-nowrap transition-colors text-2xs cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Khung nhập liệu */}
        <div className="p-3 border-t border-border bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Hỏi CYCLOSA AI về luật lao động, chính sách nhân sự hoặc yêu cầu phân tích số liệu..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="h-10 text-xs flex-1"
            />
            <Button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              className="h-10 px-4 bg-[#DC2626] hover:bg-[#b91c1c] text-white cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
