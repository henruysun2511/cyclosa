"use client";

import React from "react";
import { Plus, Trash2, Layers, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INTERVIEW_ROUND_TYPE_LABELS,
  INTERVIEW_ROUND_TYPE_OPTIONS,
} from "../../constants/recruitment.constants";
import type { InterviewRoundDto, InterviewCriterionDto, InterviewRoundType } from "../../types/recruitment.types";

interface InterviewRoundConfigCardProps {
  rounds: InterviewRoundDto[];
  onChange: (rounds: InterviewRoundDto[]) => void;
}

export function InterviewRoundConfigCard({
  rounds,
  onChange,
}: InterviewRoundConfigCardProps) {
  const handleAddRound = () => {
    const nextNo = rounds.length + 1;
    const newRound: InterviewRoundDto = {
      roundNo: nextNo,
      name: `Vòng ${nextNo}: Phỏng vấn Chuyên môn`,
      roundType: nextNo === 1 ? "HR" : nextNo === 2 ? "TECHNICAL" : "FINAL",
      passScore: 70,
      criteria: [
        {
          name: "Kỹ năng chuyên môn cốt lõi",
          description: "Nắm vững chuyên môn theo yêu cầu JD",
          weight: 40,
          maxScore: 100,
        },
        {
          name: "Tư duy giải quyết vấn đề",
          description: "Xử lý tình huống thực tế linh hoạt",
          weight: 30,
          maxScore: 100,
        },
        {
          name: "Văn hóa & Kỹ năng mềm",
          description: "Phù hợp văn hóa FSI và giao tiếp nhóm",
          weight: 30,
          maxScore: 100,
        },
      ],
    };
    onChange([...rounds, newRound]);
  };

  const handleRemoveRound = (idx: number) => {
    const updated = rounds.filter((_, i) => i !== idx).map((r, i) => ({ ...r, roundNo: i + 1 }));
    onChange(updated);
  };

  const handleRoundChange = (idx: number, field: keyof InterviewRoundDto, val: unknown) => {
    const updated = [...rounds];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const handleAddCriterion = (roundIdx: number) => {
    const updated = [...rounds];
    const currentCriteria = updated[roundIdx].criteria || [];
    updated[roundIdx].criteria = [
      ...currentCriteria,
      {
        name: "Tiêu chí đánh giá mới",
        weight: 20,
        maxScore: 100,
      },
    ];
    onChange(updated);
  };

  const handleRemoveCriterion = (roundIdx: number, critIdx: number) => {
    const updated = [...rounds];
    const currentCriteria = updated[roundIdx].criteria || [];
    updated[roundIdx].criteria = currentCriteria.filter((_, i) => i !== critIdx);
    onChange(updated);
  };

  const handleCriterionChange = (
    roundIdx: number,
    critIdx: number,
    field: keyof InterviewCriterionDto,
    val: unknown
  ) => {
    const updated = [...rounds];
    const criteria = [...(updated[roundIdx].criteria || [])];
    criteria[critIdx] = { ...criteria[critIdx], [field]: val };
    updated[roundIdx].criteria = criteria;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Cấu hình các Vòng Phỏng vấn & Thang điểm Tiêu chí
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Định nghĩa tuần tự các vòng đánh giá, điểm sàn đạt tiêu chuẩn và các tiêu chí chấm điểm của hội đồng giám khảo.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRound}
          className="h-8 text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm vòng phỏng vấn</span>
        </Button>
      </div>

      {rounds.length === 0 ? (
        <div className="p-8 border border-dashed border-border rounded-xl text-center space-y-2">
          <Layers className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-xs text-muted-foreground">
            Chưa có vòng phỏng vấn nào được thiết lập. Hãy bấm nút Thêm vòng phỏng vấn ở trên.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rounds.map((round, rIdx) => (
            <div
              key={rIdx}
              className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold">
                    {round.roundNo}
                  </span>
                  <span className="font-semibold text-xs text-foreground">
                    Vòng {round.roundNo}: {round.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRound(rIdx)}
                    className="h-7 text-xs text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span>Xóa vòng</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Tên hiển thị vòng
                  </Label>
                  <Input
                    value={round.name}
                    onChange={(e) => handleRoundChange(rIdx, "name", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Phân loại vòng
                  </Label>
                  <Select
                    value={round.roundType}
                    onValueChange={(val) => {
                      if (val) handleRoundChange(rIdx, "roundType", val as InterviewRoundType);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Chọn loại vòng">
                        {INTERVIEW_ROUND_TYPE_LABELS[round.roundType] || round.roundType}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_ROUND_TYPE_OPTIONS.filter((o) => o.value !== "ALL").map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-muted-foreground">
                    Điểm sàn đạt chuẩn (Pass Score / 100)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={round.passScore ?? 70}
                    onChange={(e) => handleRoundChange(rIdx, "passScore", Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Danh sách tiêu chí chấm điểm */}
              <div className="space-y-2 bg-muted/20 p-3 rounded-lg border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-primary" />
                    Các tiêu chí chấm điểm của Giám khảo
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddCriterion(rIdx)}
                    className="h-6 text-[11px] text-primary hover:text-primary font-medium"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Thêm tiêu chí
                  </Button>
                </div>

                <div className="space-y-2">
                  {(round.criteria || []).map((crit, cIdx) => (
                    <div
                      key={cIdx}
                      className="grid grid-cols-12 gap-2 items-center bg-card p-2 rounded border border-border"
                    >
                      <div className="col-span-6">
                        <Input
                          placeholder="Tên tiêu chí (VD: Kiến thức thuật toán)"
                          value={crit.name}
                          onChange={(e) =>
                            handleCriterionChange(rIdx, cIdx, "name", e.target.value)
                          }
                          className="h-7 text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="Trọng số %"
                            value={crit.weight}
                            onChange={(e) =>
                              handleCriterionChange(rIdx, cIdx, "weight", Number(e.target.value))
                            }
                            className="h-7 text-xs font-mono"
                          />
                          <span className="text-[10px] text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Max: {crit.maxScore || 100}đ
                        </span>
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveCriterion(rIdx, cIdx)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 ml-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
