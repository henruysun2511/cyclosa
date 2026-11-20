"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Plus,
  Trash2,
  Sparkles,
  Bot,
  MessageSquare,
  Search,
  BookOpen,
  CalendarCheck,
  ReceiptText,
  Clock,
  Users,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SpiderIcon } from "@/components/shared/spider-icon";
import { ChatMessageItem } from "./chat-message-item";
import { PROMPT_SUGGESTIONS } from "../../constants/ai.constants";
import {
  useChatMutation,
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useDeleteConversationMutation,
} from "../../api/ai-api";
import type { MessageDetail } from "../../types/ai.types";

export function ChatWindow() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [inputQuery, setInputQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // RTK Query API hooks
  const { data: convsData, isLoading: loadingConvs } =
    useGetConversationsQuery();
  const { data: convDetailData, isLoading: loadingDetail } =
    useGetConversationByIdQuery(selectedConversationId || "", {
      skip: !selectedConversationId,
    });
  const [chatMutation, { isLoading: isSending }] = useChatMutation();
  const [deleteConversationApi] = useDeleteConversationMutation();

  // Local optimistic messages for real-time responsiveness
  const [localMessages, setLocalMessages] = useState<MessageDetail[]>([]);

  useEffect(() => {
    if (convDetailData?.data?.messages) {
      setLocalMessages(convDetailData.data.messages);
    }
  }, [convDetailData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isSending]);

  const handleNewChat = () => {
    setSelectedConversationId(null);
    setLocalMessages([]);
    setInputQuery("");
  };

  const handleSendMessage = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isSending) return;

    setInputQuery("");

    // Optimistic user message
    const tempUserMsg: MessageDetail = {
      id: "temp_user_" + Date.now(),
      role: "USER",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await chatMutation({
        query: text,
        conversationId: selectedConversationId || undefined,
      }).unwrap();

      if (res.data) {
        if (!selectedConversationId) {
          setSelectedConversationId(res.data.conversationId);
        }

        const assistantMsg: MessageDetail = {
          id: res.data.messageId,
          role: "ASSISTANT",
          content: res.data.response,
          responseType: res.data.intent as any,
          functionCalls: res.data.functionCalled,
          sourceDocuments: res.data.citations
            ? JSON.stringify(res.data.citations)
            : undefined,
          chartConfig: res.data.chartConfig,
          createdAt: new Date().toISOString(),
        };
        setLocalMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      toast.error(
        "Không thể gửi câu hỏi đến Trợ lý AI. Vui lòng kiểm tra lại kết nối."
      );
      // Remove temporary message on error
      setLocalMessages((prev) =>
        prev.filter((m) => m.id !== tempUserMsg.id)
      );
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteConversationApi(id).unwrap();
      toast.success("Đã xóa cuộc trò chuyện");
      if (selectedConversationId === id) {
        handleNewChat();
      }
    } catch {
      toast.error("Không thể xóa cuộc trò chuyện");
    }
  };

  const conversations = convsData?.data?.items || [];
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8.5rem)] rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      {/* ── SIDEBAR LỊCH SỬ HỘI THOẠI ── */}
      <div className="w-72 md:w-80 border-r border-border flex flex-col bg-muted/20 shrink-0">
        <div className="p-3 border-b border-border space-y-2">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2 shadow-xs"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            <span>Cuộc trò chuyện mới</span>
          </Button>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm lịch sử..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              className="pl-8 h-8 text-xs bg-background"
            />
          </div>
        </div>

        {/* Danh sách hội thoại */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingConvs ? (
            <div className="flex items-center justify-center p-6 text-xs text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Đang tải lịch sử...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Chưa có cuộc hội thoại nào
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedConversationId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all group",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "hover:bg-muted text-foreground/80 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 text-muted-foreground hover:text-destructive transition-opacity"
                    title="Xóa"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-card/60 backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <SpiderIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-foreground">CYCLOSA AI Copilot</span>
            </div>
          </div>
        </div>

        {/* Khung tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 md:px-8 space-y-4">
          {localMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  Trợ lý Nhân sự CYCLOSA có thể hỗ trợ gì cho bạn?
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-md">
                  Đặt câu hỏi bằng ngôn ngữ tự nhiên để tra cứu quỹ phép, tóm tắt bảng lương, quy chế khen thưởng - kỷ luật hoặc sổ tay nhân viên.
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                {PROMPT_SUGGESTIONS.slice(0, 4).map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(s.query)}
                    className="p-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-xs flex flex-col gap-1 text-left shadow-2xs group cursor-pointer"
                  >
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {s.label}
                    </span>
                    <span className="text-muted-foreground text-[11px] line-clamp-2">
                      &ldquo;{s.query}&rdquo;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {localMessages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}
              {isSending && (
                <div className="flex gap-3 items-center text-xs text-muted-foreground p-3">
                  <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <SpiderIcon className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded-xl">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span>Trợ lý AI đang tra cứu và tổng hợp dữ liệu...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-border bg-card/60 backdrop-blur-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 max-w-4xl mx-auto"
          >
            <div className="relative flex-1">
              <Input
                placeholder="Hỏi bất kỳ điều gì về chính sách, ngày phép, phiếu lương... (nhấn Enter để gửi)"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isSending}
                className="pr-16 text-xs h-11 rounded-xl shadow-2xs"
                maxLength={2000}
              />
              <span className="absolute right-3 top-3.5 text-[10px] text-muted-foreground/60 select-none">
                {inputQuery.length}/2000
              </span>
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!inputQuery.trim() || isSending}
              className="h-11 w-11 rounded-xl shadow-xs shrink-0"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <div className="text-[10px] text-center text-muted-foreground/60 mt-1.5">
            Lưu ý: CYCLOSA AI là trợ lý hỗ trợ tra cứu thông tin. Các quyết định chính thức thuộc thẩm quyền của phòng Nhân sự.
          </div>
        </div>
      </div>
    </div>
  );
}
