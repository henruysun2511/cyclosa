"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  PlusCircle,
  FileCode,
  Copy,
  History,
  Layers,
  Sparkles,
  Columns2,
  Maximize2,
  CheckCircle2,
  RefreshCw,
  Sliders,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateVariablePicker } from "./template-variable-picker";
import { useGetCompaniesQuery } from "@/features/organization/api";
import {
  useCreateContractTemplateMutation,
  useUpdateContractTemplateMutation,
  useCreateTemplateVersionMutation,
  usePublishTemplateVersionMutation,
  useRenderTemplatePreviewMutation,
  useGetTemplateVersionsQuery,
} from "../../api/contract-api";
import {
  TEMPLATE_KIND_LABELS,
  CONTRACT_TYPE_LABELS,
} from "../../constants/contract.constants";
import { TEMPLATE_PRESETS } from "../../constants/contract-template-presets";
import type {
  ContractTemplate,
  TemplateKind,
  ContractType,
  TemplateFormat,
} from "../../types/contract.types";
import { toast } from "sonner";

interface ContractTemplateEditorProps {
  initialData?: ContractTemplate | null;
  defaultCompanyId?: string;
  isEdit?: boolean;
  onSaveSuccess?: (templateId: string) => void;
}

const DEFAULT_SAMPLE_DATA = JSON.stringify(TEMPLATE_PRESETS.LABOR_CONTRACT.sampleData, null, 2);
const DEFAULT_TEMPLATE_HTML = TEMPLATE_PRESETS.LABOR_CONTRACT.html;

function renderTemplateLocally(template: string, data: Record<string, unknown>): string {
  if (!template) return "";
  let result = template;

  // 1. Conditionals: {{#if key}}...{{else}}...{{/if}} or {{#if key}}...{{/if}}
  result = result.replace(
    /\{\{#if\s+([a-zA-Z0-9_.-]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g,
    (_, key, trueBranch, falseBranch = "") => {
      const val = data[key];
      const isTruthy = Boolean(val) && val !== "0" && val !== "false";
      return isTruthy ? trueBranch : falseBranch;
    }
  );

  // 2. {{#unless key}}...{{/unless}}
  result = result.replace(
    /\{\{#unless\s+([a-zA-Z0-9_.-]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g,
    (_, key, body) => {
      const val = data[key];
      const isTruthy = Boolean(val) && val !== "0" && val !== "false";
      return !isTruthy ? body : "";
    }
  );

  // 3. Variables: {{{key}}} and {{key}}
  result = result.replace(/\{\{\{?\s*([a-zA-Z0-9_.-]+)\s*\}\}\}?/g, (_, key) => {
    const val = data[key];
    return val !== undefined && val !== null ? String(val) : "";
  });

  return result;
}

export function ContractTemplateEditor({
  initialData,
  defaultCompanyId,
  isEdit = false,
  onSaveSuccess,
}: ContractTemplateEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form states
  const [companyId, setCompanyId] = useState<string>(defaultCompanyId || "");
  const [templateCode, setTemplateCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [kind, setKind] = useState<TemplateKind>("LABOR_CONTRACT");
  const [contractType, setContractType] = useState<ContractType | "ALL">("ALL");
  const [description, setDescription] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [format, setFormat] = useState<TemplateFormat>("HTML");
  const [contentRaw, setContentRaw] = useState<string>(DEFAULT_TEMPLATE_HTML);
  const [sampleDataJson, setSampleDataJson] = useState<string>(DEFAULT_SAMPLE_DATA);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // UI layout mode
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Companies data
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  // Versions query
  const { data: versions = [], refetch: refetchVersions } = useGetTemplateVersionsQuery(
    initialData?.id || "",
    { skip: !isEdit || !initialData?.id }
  );

  // Mutations
  const [createTemplate, { isLoading: isCreating }] = useCreateContractTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateContractTemplateMutation();
  const [createVersion, { isLoading: isCreatingVersion }] = useCreateTemplateVersionMutation();
  const [publishVersion, { isLoading: isPublishing }] = usePublishTemplateVersionMutation();
  const [renderPreview, { isLoading: isRendering }] = useRenderTemplatePreviewMutation();

  // Populate initial data when editing
  useEffect(() => {
    if (initialData) {
      setCompanyId(initialData.companyId);
      setTemplateCode(initialData.templateCode || "");
      setName(initialData.name);
      setKind(initialData.kind);
      setDescription(initialData.description || "");
      setIsActive(initialData.isActive);
      if (initialData.activeVersion?.contentRaw) {
        setContentRaw(initialData.activeVersion.contentRaw);
      }
      if (initialData.activeVersion?.sampleDataJson) {
        setSampleDataJson(initialData.activeVersion.sampleDataJson);
      }
    } else {
      const preset = TEMPLATE_PRESETS[kind] || TEMPLATE_PRESETS.LABOR_CONTRACT;
      if (!name) setName(preset.defaultTitle);
      if (!templateCode) {
        setTemplateCode(`${preset.defaultCodePrefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      }
      if (!companyId && companies.length > 0) {
        setCompanyId(companies[0].id);
      }
      if (!contentRaw || contentRaw === DEFAULT_TEMPLATE_HTML) {
        setContentRaw(preset.html);
      }
      if (!sampleDataJson || sampleDataJson === DEFAULT_SAMPLE_DATA) {
        setSampleDataJson(JSON.stringify(preset.sampleData, null, 2));
      }
    }
  }, [initialData, companies]);

  // Handle template kind change with preset auto-switch
  const handleKindChange = (val: string) => {
    const newKind = val as TemplateKind;
    setKind(newKind);
    const preset = TEMPLATE_PRESETS[newKind];
    if (preset && !isEdit) {
      setName(preset.defaultTitle);
      setTemplateCode(`${preset.defaultCodePrefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setContentRaw(preset.html);
      setSampleDataJson(JSON.stringify(preset.sampleData, null, 2));
      setPreviewHtml(null);
      toast.info(`Đã nạp bộ mẫu chuẩn: ${preset.defaultTitle}`);
    }
  };

  // Re-apply standard preset for current kind
  const handleApplyPreset = () => {
    const preset = TEMPLATE_PRESETS[kind];
    if (!preset) return;
    setContentRaw(preset.html);
    setSampleDataJson(JSON.stringify(preset.sampleData, null, 2));
    setPreviewHtml(null);
    toast.success(`Đã nạp lại mẫu chuẩn: ${preset.defaultTitle}`);
  };

  // Insert token into textarea at cursor position
  const handleInsertToken = (token: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContentRaw((prev) => prev + " " + token);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = contentRaw;
    const updated = current.substring(0, start) + token + current.substring(end);
    setContentRaw(updated);

    // Reposition cursor right after inserted token
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    }, 0);
  };

  // Render preview handler
  const handlePreview = async () => {
    let dataObj: Record<string, unknown> = {};
    try {
      dataObj = JSON.parse(sampleDataJson);
    } catch {
      toast.error("Dữ liệu giả lập mẫu (JSON) không đúng định dạng");
      return;
    }

    try {
      const res = await renderPreview({
        contentRaw,
        data: dataObj,
      }).unwrap();

      setPreviewHtml(res);
      if (!isSplitMode) {
        setActiveTab("preview");
      }
      toast.success("Render xem trước thành công");
    } catch {
      // Local fallback compiler
      const fallbackHtml = renderTemplateLocally(contentRaw, dataObj);
      setPreviewHtml(fallbackHtml);
      if (!isSplitMode) {
        setActiveTab("preview");
      }
      toast.success("Đã biên dịch xem trước nội dung");
    }
  };

  // Tab change with auto render
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    if (val === "preview" && !previewHtml) {
      handlePreview();
    }
  };

  // Prettify sample data JSON
  const handlePrettifyJson = () => {
    try {
      const parsed = JSON.parse(sampleDataJson);
      setSampleDataJson(JSON.stringify(parsed, null, 2));
      toast.success("Đã chuẩn hóa định dạng JSON");
    } catch {
      toast.error("JSON hiện tại không hợp lệ, không thể chuẩn hóa");
    }
  };

  // Save template (Create or Update)
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên biểu mẫu");
      return;
    }
    if (!companyId) {
      toast.error("Vui lòng chọn công ty áp dụng");
      return;
    }
    if (!templateCode.trim()) {
      toast.error("Vui lòng nhập mã biểu mẫu");
      return;
    }

    try {
      if (isEdit && initialData?.id) {
        await updateTemplate({
          id: initialData.id,
          body: {
            name: name.trim(),
            kind,
            description: description.trim() || undefined,
          },
        }).unwrap();
        toast.success("Cập nhật thông tin biểu mẫu thành công");
        onSaveSuccess?.(initialData.id);
      } else {
        const res = await createTemplate({
          companyId,
          templateCode: templateCode.trim(),
          name: name.trim(),
          kind,
          description: description.trim() || undefined,
          format,
          contentRaw,
          sampleDataJson,
        }).unwrap();
        toast.success("Tạo mới biểu mẫu hợp đồng thành công");
        onSaveSuccess?.(res.id);
        router.push("/contracts/templates");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu biểu mẫu");
    }
  };

  // Create new version
  const handleCreateNewVersion = async () => {
    if (!initialData?.id) return;
    try {
      await createVersion({
        templateId: initialData.id,
        body: {
          format,
          contentRaw,
          sampleDataJson,
        },
      }).unwrap();
      toast.success("Đã tạo phiên bản mẫu mới thành công");
      refetchVersions();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tạo phiên bản mới");
    }
  };

  // Publish version
  const handlePublishVersion = async (versionId: string) => {
    if (!initialData?.id) return;
    try {
      await publishVersion({
        templateId: initialData.id,
        versionId,
      }).unwrap();
      toast.success("Đã kích hoạt phiên bản mẫu thành công");
      refetchVersions();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể kích hoạt phiên bản");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Top Header & Actions Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/contracts/templates">
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-1 text-slate-500">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileCode className="w-6 h-6 text-primary" />
                {isEdit ? name || "Chỉnh sửa biểu mẫu" : "Tạo Biểu mẫu Hợp đồng mới"}
              </h1>
              {isEdit && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={
                    isActive
                      ? "bg-emerald-600 hover:bg-emerald-600 text-xs"
                      : "text-xs"
                  }
                >
                  {isActive ? "Đang áp dụng" : "Ngừng áp dụng"}
                </Badge>
              )}
            </div>
          </div>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 ml-10">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              href="/contracts"
              className="hover:text-primary transition-colors"
            >
              Hợp đồng lao động
            </Link>
            <span>/</span>
            <Link
              href="/contracts/templates"
              className="hover:text-primary transition-colors"
            >
              Biểu mẫu hợp đồng
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {isEdit ? "Chỉnh sửa biểu mẫu" : "Tạo biểu mẫu mới"}
            </span>
          </nav>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSplitMode(!isSplitMode)}
            className="gap-1.5 text-xs hidden lg:flex"
            title="Bật/Tắt chế độ xem song song mã và bản in"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>{isSplitMode ? "Xem dạng Tab" : "Xem song song"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={isRendering}
            className="gap-1.5 text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isRendering ? "Đang render..." : "Render thử nghiệm"}</span>
          </Button>

          {isEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCreateNewVersion}
              disabled={isCreatingVersion}
              className="gap-1.5 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Lưu thành Phiên bản mới</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="gap-1.5 text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isCreating || isUpdating ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo biểu mẫu"}</span>
          </Button>
        </div>
      </div>

      {/* ── Main Workspace 2-Columns Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Metadata Sidebar) */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                Thông số cấu hình mẫu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Công ty áp dụng */}
              <div className="space-y-1.5">
                <Label htmlFor="companyId" className="text-xs font-medium">
                  Pháp nhân Công ty áp dụng <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={companyId}
                  onValueChange={(val) => setCompanyId(val || "")}
                  disabled={isEdit}
                >
                  <SelectTrigger id="companyId" className="h-9 text-xs">
                    <SelectValue placeholder="Chọn công ty...">
                      {(val: string) => {
                        if (!val) return "Chọn công ty...";
                        const c = companies.find((i) => i.id === val);
                        return c ? (c.code ? `${c.name} (${c.code})` : c.name) : "Chọn công ty...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        label={c.code ? `${c.name} (${c.code})` : c.name}
                        className="text-xs"
                      >
                        {c.name} {c.code ? `(${c.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tên biểu mẫu */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium">
                  Tên biểu mẫu <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ví dụ: Hợp đồng lao động chính thức 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Mã biểu mẫu */}
              <div className="space-y-1.5">
                <Label htmlFor="templateCode" className="text-xs font-medium">
                  Mã tham chiếu biểu mẫu <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="templateCode"
                  placeholder="HDLD-TPL-2026"
                  value={templateCode}
                  onChange={(e) => setTemplateCode(e.target.value)}
                  disabled={isEdit}
                  className="h-9 text-xs font-mono"
                />
              </div>

              {/* Loại biểu mẫu */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="kind" className="text-xs font-medium">
                    Phân loại mẫu biểu <span className="text-rose-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={handleApplyPreset}
                    className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1"
                    title="Nạp lại mã HTML và dữ liệu JSON chuẩn theo loại biểu mẫu đang chọn"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Nạp mẫu chuẩn</span>
                  </button>
                </div>
                <Select
                  value={kind}
                  onValueChange={(val) => {
                    if (val) handleKindChange(val as TemplateKind);
                  }}
                >
                  <SelectTrigger id="kind" className="h-9 text-xs">
                    <SelectValue placeholder="Chọn loại mẫu biểu...">
                      {(val: string) =>
                        val ? TEMPLATE_KIND_LABELS[val as TemplateKind] || val : "Chọn loại mẫu biểu..."
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEMPLATE_KIND_LABELS).map(([key, label]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        label={label}
                        className="text-xs"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Loại hợp đồng liên kết */}
              <div className="space-y-1.5">
                <Label htmlFor="contractType" className="text-xs font-medium">
                  Loại hợp đồng tương thích
                </Label>
                <Select
                  value={contractType}
                  onValueChange={(val) => setContractType(val as ContractType | "ALL")}
                >
                  <SelectTrigger id="contractType" className="h-9 text-xs">
                    <SelectValue placeholder="Chọn loại hợp đồng...">
                      {(val: string) => {
                        if (!val || val === "ALL") return "Áp dụng chung cho tất cả loại HĐ";
                        return CONTRACT_TYPE_LABELS[val as ContractType] || val;
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="ALL"
                      label="Áp dụng chung cho tất cả loại HĐ"
                      className="text-xs"
                    >
                      Áp dụng chung cho tất cả loại HĐ
                    </SelectItem>
                    {Object.entries(CONTRACT_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        label={label}
                        className="text-xs"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Định dạng văn bản */}
              <div className="space-y-1.5">
                <Label htmlFor="format" className="text-xs font-medium">
                  Định dạng tệp biên soạn
                </Label>
                <Select
                  value={format}
                  onValueChange={(val) => setFormat(val as TemplateFormat)}
                >
                  <SelectTrigger id="format" className="h-9 text-xs">
                    <SelectValue placeholder="Chọn định dạng...">
                      {(val: string) => {
                        if (val === "HTML") return "HTML / Handlebars động (Khuyến nghị)";
                        if (val === "DOCX") return "Microsoft Word (.docx)";
                        return val || "Chọn định dạng...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="HTML"
                      label="HTML / Handlebars động (Khuyến nghị)"
                      className="text-xs"
                    >
                      HTML / Handlebars động (Khuyến nghị)
                    </SelectItem>
                    <SelectItem
                      value="DOCX"
                      label="Microsoft Word (.docx)"
                      className="text-xs"
                    >
                      Microsoft Word (.docx)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mô tả */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium">
                  Mô tả / Ghi chú áp dụng
                </Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả phạm vi áp dụng cho khối văn phòng, cán bộ quản lý..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="text-xs resize-none"
                />
              </div>

              {/* Tips & Instructions */}
              <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs space-y-1.5 text-blue-900 dark:text-blue-300">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Hướng dẫn biến giữ chỗ</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Sử dụng thẻ <code>{"{{variable_name}}"}</code> để gán giá trị tự động khi nhân viên ký. Dùng nút bấm phía trên khung soạn thảo để chèn nhanh.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Editor & Preview Workspace) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Quick-insert variable tokens toolbar */}
          <TemplateVariablePicker onInsert={handleInsertToken} />

          {/* If Split-screen Mode is ACTIVE */}
          {isSplitMode ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Left Pane: HTML Editor */}
              <Card className="border-border shadow-xs">
                <CardHeader className="py-2.5 px-4 border-b flex flex-row items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-primary" />
                    Khung soạn thảo HTML / Handlebars
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {contentRaw.length} ký tự
                  </span>
                </CardHeader>
                <CardContent className="p-3">
                  <Textarea
                    ref={textareaRef}
                    value={contentRaw}
                    onChange={(e) => setContentRaw(e.target.value)}
                    rows={28}
                    className="font-mono text-xs leading-relaxed resize-y w-full bg-slate-950 text-slate-100 dark:bg-slate-900"
                    placeholder="Nhập nội dung HTML với các biến {{key}}..."
                  />
                </CardContent>
              </Card>

              {/* Right Pane: Live Preview */}
              <Card className="border-border shadow-xs">
                <CardHeader className="py-2.5 px-4 border-b flex flex-row items-center justify-between">
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-primary" />
                    Bản in xem trước A4
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handlePreview}
                    disabled={isRendering}
                  >
                    <RefreshCw className={`w-3 h-3 ${isRendering ? "animate-spin" : ""}`} />
                    <span>Làm mới</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-3 bg-muted/30 max-h-[700px] overflow-y-auto">
                  {previewHtml ? (
                    <div className="bg-white text-slate-900 p-6 rounded shadow-md border max-w-full">
                      <div
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                        className="prose max-w-none text-slate-900 text-xs"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-20 text-muted-foreground text-xs space-y-2">
                      <FileText className="w-8 h-8 mx-auto text-muted-foreground/60" />
                      <p>Bấm nút <strong>&quot;Render thử nghiệm&quot;</strong> để xem trước bản in A4</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Regular Tabs Mode */
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <TabsList>
                  <TabsTrigger value="editor" className="gap-1.5 text-xs">
                    <FileCode className="w-3.5 h-3.5" />
                    Nội dung Mẫu (HTML)
                  </TabsTrigger>
                  <TabsTrigger value="sampleData" className="gap-1.5 text-xs">
                    <Copy className="w-3.5 h-3.5" />
                    Dữ liệu mẫu biến (JSON)
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-1.5 text-xs">
                    <Eye className="w-3.5 h-3.5" />
                    Xem trước Render A4
                  </TabsTrigger>
                  {isEdit && (
                    <TabsTrigger value="history" className="gap-1.5 text-xs">
                      <History className="w-3.5 h-3.5" />
                      Lịch sử Phiên bản ({versions.length})
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {/* Tab 1: Editor */}
              <TabsContent value="editor" className="space-y-2 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    Khung mã HTML và thẻ biến động Handlebars
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Hỗ trợ <code>{"{{variable}}"}</code>, <code>{"{{#if key}}...{{/if}}"}</code>
                  </span>
                </div>
                <Textarea
                  ref={textareaRef}
                  id="contentRaw"
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  rows={22}
                  className="font-mono text-xs leading-relaxed resize-y bg-slate-950 text-slate-100 dark:bg-slate-900 border-border"
                />
              </TabsContent>

              {/* Tab 2: Sample Data */}
              <TabsContent value="sampleData" className="space-y-3 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    Dữ liệu biến JSON giả lập để thử nghiệm gán giá trị
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={handlePrettifyJson}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Chuẩn hóa JSON</span>
                  </Button>
                </div>
                <Textarea
                  id="sampleDataJson"
                  value={sampleDataJson}
                  onChange={(e) => setSampleDataJson(e.target.value)}
                  rows={18}
                  className="font-mono text-xs bg-slate-950 text-emerald-400 dark:bg-slate-900 border-border"
                />
              </TabsContent>

              {/* Tab 3: Preview */}
              <TabsContent value="preview" className="pt-3">
                {previewHtml ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-muted/60 p-2 rounded-lg border text-xs">
                      <span className="text-muted-foreground">
                        Bản mô phỏng in khổ giấy A4 theo Luật Lao động số 45/2019/QH14
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setZoomScale(Math.max(70, zoomScale - 10))}
                        >
                          -
                        </Button>
                        <span className="font-mono text-xs px-1">{zoomScale}%</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setZoomScale(Math.min(130, zoomScale + 10))}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-xs gap-1 ml-2"
                          onClick={handlePreview}
                          disabled={isRendering}
                        >
                          <RefreshCw className={`w-3 h-3 ${isRendering ? "animate-spin" : ""}`} />
                          <span>Biên dịch lại</span>
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-200/70 dark:bg-slate-900/80 p-8 rounded-xl border overflow-x-auto flex justify-center">
                      <div
                        style={{
                          transform: `scale(${zoomScale / 100})`,
                          transformOrigin: "top center",
                          width: "794px",
                          minHeight: "1123px",
                        }}
                        className="bg-white text-slate-900 p-12 shadow-2xl rounded-sm border border-slate-300 transition-transform duration-200"
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                          className="prose max-w-none text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 border border-dashed rounded-xl bg-card text-muted-foreground text-sm space-y-3">
                    <FileText className="w-10 h-10 mx-auto text-muted-foreground/60" />
                    <div>
                      <p className="font-medium text-foreground">Chưa có bản xem trước</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Bấm nút <strong>&quot;Render thử nghiệm&quot;</strong> để hệ thống biên dịch mã HTML cùng các trường biến số.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreview}
                      disabled={isRendering}
                      className="gap-1.5 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Render thử nghiệm ngay</span>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Tab 4: Version History */}
              {isEdit && (
                <TabsContent value="history" className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-foreground">
                        Danh sách các phiên bản đã lưu
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Mỗi lần cập nhật nội dung quan trọng, bạn có thể lưu thành phiên bản mới để dễ dàng hoàn tác hoặc đối soát.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateNewVersion}
                      disabled={isCreatingVersion}
                      className="gap-1.5 text-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Tạo phiên bản v{versions.length + 1}</span>
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {versions.map((v) => (
                      <Card key={v.id} className="border-border/70 shadow-2xs">
                        <CardContent className="p-3.5 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs">
                                Phiên bản v{v.versionNumber}
                              </span>
                              {v.isActive && (
                                <Badge className="bg-emerald-600 hover:bg-emerald-600 text-[10px]">
                                  Đang áp dụng
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[10px]">
                                {v.format}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Tạo ngày: {new Date(v.createdAt).toLocaleString("vi-VN")}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {!v.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handlePublishVersion(v.id)}
                                disabled={isPublishing}
                              >
                                Kích hoạt áp dụng
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {versions.length === 0 && (
                      <div className="text-center py-12 border border-dashed rounded-lg text-xs text-muted-foreground">
                        Chưa có lịch sử phiên bản nào được ghi nhận.
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

