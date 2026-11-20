"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskGroupBadge } from "../shared/task-group-badge";
import {
  ONBOARDING_TASK_GROUP_OPTIONS,
  ASSIGNEE_ROLE_OPTIONS,
  ONBOARDING_TASK_GROUP_DESCRIPTIONS,
} from "../../constants/onboarding.constants";
import type {
  CreateTemplateItemPayload,
  OnboardingTaskGroup,
} from "../../types/onboarding.types";
import { useGetItAccountTypesQuery } from "../../api/onboarding-api";

interface TemplateItemBuilderProps {
  items: CreateTemplateItemPayload[];
  onChange: (items: CreateTemplateItemPayload[]) => void;
}

export function TemplateItemBuilder({
  items,
  onChange,
}: TemplateItemBuilderProps) {
  const { data: itAccountTypes } = useGetItAccountTypesQuery();

  // State thêm nhanh một công việc
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTaskGroup, setNewTaskGroup] =
    useState<OnboardingTaskGroup>("DOCS");
  const [newTargetDay, setNewTargetDay] = useState(0);
  const [newIsMandatory, setNewIsMandatory] = useState(true);
  const [newAssigneeRole, setNewAssigneeRole] = useState("HR");
  const [newItAccountTypeId, setNewItAccountTypeId] = useState<string>("");
  const [newDocumentRequired, setNewDocumentRequired] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = () => {
    if (!newTitle.trim()) return;

    const newItem: CreateTemplateItemPayload = {
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      taskGroup: newTaskGroup,
      targetDayOffset: Number(newTargetDay) || 0,
      sequenceOrder: items.length + 1,
      isMandatory: newIsMandatory,
      defaultAssigneeRole: newAssigneeRole,
      itAccountTypeId:
        newTaskGroup === "ACCOUNTS" && newItAccountTypeId
          ? newItAccountTypeId
          : undefined,
      documentRequired: newDocumentRequired,
    };

    onChange([...items, newItem]);

    // Reset form
    setNewTitle("");
    setNewDescription("");
    setNewTargetDay(0);
    setNewIsMandatory(true);
    setNewItAccountTypeId("");
    setNewDocumentRequired(false);
    setShowAddForm(false);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const getTargetDayLabel = (offset: number) => {
    if (offset === 0) return "Ngày 1 (Nhận việc)";
    if (offset <= 6) return `Ngày ${offset + 1}`;
    if (offset === 7) return "Tuần 1 (7 ngày)";
    if (offset === 14) return "Tuần 2 (14 ngày)";
    if (offset === 30) return "Tháng 1 (30 ngày)";
    if (offset === 60) return "Cuối thử việc (60 ngày)";
    return `Ngày thứ ${offset}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Danh sách Công việc trong Mẫu ({items.length} đầu việc)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Các công việc này sẽ được tự động nhân bản vào tiến trình thực tế
            khi tiếp nhận nhân sự mới.
          </p>
        </div>

        {!showAddForm && (
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm công việc</span>
          </Button>
        )}
      </div>

      {/* Form thêm mới công việc */}
      {showAddForm && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-primary/20">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Thêm công việc mới vào mẫu checklist
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              Hủy
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs font-semibold">
                Tiêu đề công việc <span className="text-destructive">*</span>
              </Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="VD: Ký hợp đồng lao động điện tử & Cam kết bảo mật NDA"
                className="h-8 text-xs bg-card"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Nhóm công việc</Label>
              <Select
                value={newTaskGroup}
                onValueChange={(val) =>
                  setNewTaskGroup(val as OnboardingTaskGroup)
                }
              >
                <SelectTrigger className="h-8 text-xs bg-card">
                  <SelectValue placeholder="Chọn nhóm công việc" />
                </SelectTrigger>
                <SelectContent>
                  {ONBOARDING_TASK_GROUP_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                {ONBOARDING_TASK_GROUP_DESCRIPTIONS[newTaskGroup]}
              </p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Đơn vị phụ trách</Label>
              <Select
                value={newAssigneeRole}
                onValueChange={(val) => val && setNewAssigneeRole(val)}
              >
                <SelectTrigger className="h-8 text-xs bg-card">
                  <SelectValue placeholder="Chọn người phụ trách" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNEE_ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nếu là nhóm ACCOUNTS -> Cho phép chọn Loại tài khoản CNTT */}
            {newTaskGroup === "ACCOUNTS" && (
              <div className="space-y-1 md:col-span-2 p-3 bg-purple-50/60 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <Label className="text-xs font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-purple-600" />
                  Loại tài khoản CNTT liên kết (Tự động sinh yêu cầu tới IT)
                </Label>
                <Select
                  value={newItAccountTypeId}
                  onValueChange={(val) => setNewItAccountTypeId(val || "")}
                >
                  <SelectTrigger className="h-8 text-xs bg-card mt-1">
                    <SelectValue placeholder="Chọn loại hệ thống CNTT cần cấp..." />
                  </SelectTrigger>
                  <SelectContent>
                    {itAccountTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} ({type.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Hạn hoàn thành (Số ngày tính từ ngày nhận việc)
              </Label>
              <Input
                type="number"
                min={0}
                max={90}
                value={newTargetDay}
                onChange={(e) => setNewTargetDay(parseInt(e.target.value) || 0)}
                className="h-8 text-xs bg-card font-mono"
              />
              <span className="text-[10.5px] text-primary font-medium">
                → Mục tiêu: {getTargetDayLabel(newTargetDay)}
              </span>
            </div>

            <div className="flex items-center gap-6 pt-5">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newIsMandatory}
                  onCheckedChange={setNewIsMandatory}
                  id="switch-mandatory"
                />
                <Label
                  htmlFor="switch-mandatory"
                  className="text-xs cursor-pointer"
                >
                  Bắt buộc hoàn thành (Mandatory)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={newDocumentRequired}
                  onCheckedChange={setNewDocumentRequired}
                  id="switch-doc"
                />
                <Label
                  htmlFor="switch-doc"
                  className="text-xs cursor-pointer"
                >
                  Yêu cầu đính kèm file
                </Label>
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Hướng dẫn thực hiện chi tiết</Label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Mô tả các bước thực hiện, đường dẫn tài liệu hoặc đầu mối liên hệ..."
                rows={2}
                className="text-xs bg-card resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
              className="h-8 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAddItem}
              disabled={!newTitle.trim()}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Lưu công việc vào danh sách
            </Button>
          </div>
        </div>
      )}

      {/* Danh sách các công việc đã thêm */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground bg-muted/10 space-y-2">
          <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto" />
          <p className="font-medium text-foreground">Chưa có công việc nào trong mẫu checklist</p>
          <p className="text-[11px]">Bấm vào nút &quot;Thêm công việc&quot; phía trên để thiết lập danh sách đầu việc cho nhân viên mới.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-2xs hover:border-primary/40 transition-all text-xs"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                <span className="font-mono text-muted-foreground text-[11px] w-6 shrink-0 text-center font-bold">
                  #{idx + 1}
                </span>

                <TaskGroupBadge taskGroup={item.taskGroup} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground truncate">
                      {item.title}
                    </span>
                    {item.isMandatory ? (
                      <Badge
                        variant="outline"
                        className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-mono shrink-0"
                      >
                        Bắt buộc
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-muted-foreground font-mono shrink-0"
                      >
                        Tùy chọn
                      </Badge>
                    )}
                    {item.documentRequired && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 shrink-0"
                      >
                        File đính kèm
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {getTargetDayLabel(item.targetDayOffset)}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(idx)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Xóa công việc"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

