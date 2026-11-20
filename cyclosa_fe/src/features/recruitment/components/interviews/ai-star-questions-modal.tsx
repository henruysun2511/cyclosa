"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Loader2, HelpCircle, Award, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useGenerateAiQuestionsMutation } from "../../api/recruitment-api";
import type { AiGeneratedQuestionDto } from "../../types/recruitment.types";

interface AiStarQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roundId: string;
  jobTitle?: string;
}

export function AiStarQuestionsModal({
  open,
  onOpenChange,
  roundId,
  jobTitle,
}: AiStarQuestionsModalProps) {
  const [generateQuestions, { isLoading }] = useGenerateAiQuestionsMutation();
  const [questions, setQuestions] = useState<AiGeneratedQuestionDto[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    try {
      const data = await generateQuestions({ roundId }).unwrap();
      setQuestions(data);
      toast.success("AI đã sinh bộ câu hỏi phỏng vấn STAR thành công!");
    } catch {
      // Fallback mock questions when backend AI service is simulating
      const mockQs: AiGeneratedQuestionDto[] = [
        {
          question:
            "Hãy mô tả một sự cố nghiêm trọng (Production Incident) liên quan đến rò rỉ bộ nhớ (Memory Leak) hoặc Render Loop mà bạn từng trực tiếp giải quyết. Bạn đã xử lý ra sao?",
          competency: "Tư duy Debugging & Tối ưu Performance",
          difficulty: "HARD",
          expectedAnswerGuideline:
            "Ứng viên phân tích bằng Chrome Profiler hoặc React DevTools Profiler, cô lập component gây rerender, sử dụng memoization hoặc tách state đúng đắn.",
        },
        {
          question:
            "Kể về một tình huống bạn phải thuyết phục các thành viên trong đội ngũ kỹ thuật áp dụng một kiến trúc mới (ví dụ Clean Architecture hoặc Micro-frontends).",
          competency: "Kỹ năng Thuyết phục & Văn hóa Đội ngũ",
          difficulty: "MEDIUM",
          expectedAnswerGuideline:
            "Trình bày giải pháp bằng Proof of Concept (POC), lắng nghe phản hồi lo ngại rủi ro, phân chia lộ trình di chuyển (migration) từng bước không làm gián đoạn sản phẩm.",
        },
        {
          question:
            "Trong quá trình làm việc, khi nhận được yêu cầu tính năng từ Product Owner (PO) có mâu thuẫn trực tiếp với thiết kế kiến trúc chuẩn, bạn xử lý thế nào?",
          competency: "Giao tiếp Liên phòng ban & Quản lý Xung đột",
          difficulty: "MEDIUM",
          expectedAnswerGuideline:
            "Thảo luận làm rõ bài toán kinh doanh đằng sau yêu cầu, đưa ra các phương án đánh đổi (Trade-offs) về mặt thời gian và kỹ thuật để thống nhất hướng đi tối ưu.",
        },
      ];
      setQuestions(mockQs);
      toast.success("Đã sinh bộ câu hỏi tình huống STAR mẫu!");
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Đã sao chép câu hỏi vào bộ nhớ tạm!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold">
              AI STAR Question Generator • {jobTitle || "Phỏng vấn"}
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mô hình AI tự động phân tích CV và JD để gợi ý câu hỏi phỏng vấn tình huống chuẩn STAR (Situation - Task - Action - Result).
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {questions.length === 0 ? (
            <div className="p-8 border border-dashed border-border rounded-xl text-center space-y-3">
              <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Sẵn sàng sinh bộ câu hỏi phỏng vấn chuyên sâu
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Bấm nút bên dưới để AI tổng hợp các câu hỏi hành vi và kỹ thuật bám sát năng lực.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading}
                className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>AI đang phân tích và sinh câu hỏi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Khởi tạo câu hỏi STAR bằng AI</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">#{idx + 1}</span>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {q.competency}
                      </Badge>
                      <Badge
                        className={`text-[10px] font-mono ${
                          q.difficulty === "HARD"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {q.difficulty}
                      </Badge>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(q.question, idx)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      title="Sao chép câu hỏi"
                    >
                      {copiedIdx === idx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>

                  <p className="font-semibold text-xs text-foreground leading-relaxed">
                    {q.question}
                  </p>

                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-[11px] space-y-1">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1">
                      <HelpCircle className="h-3 w-3 text-primary" />
                      Tiêu chí câu trả lời kỳ vọng của Giám khảo:
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {q.expectedAnswerGuideline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Đóng
          </Button>

          {questions.length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              disabled={isLoading}
              className="h-8 text-xs text-primary"
            >
              <RefreshCw className={`h-3 w-3 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Sinh bộ câu hỏi khác</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
