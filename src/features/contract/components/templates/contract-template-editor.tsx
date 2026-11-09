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

const DEFAULT_SAMPLE_DATA = JSON.stringify(
  {
    company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
    company_address: "Tầng 12 & 14, Tòa nhà Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội",
    company_tax_code: "0108999888",
    representative_name: "Ông Lê Hoàng Nam",
    representative_title: "Tổng Giám Đốc",
    employee_name: "NGUYỄN VĂN AN",
    employee_code: "NV00125",
    dob: "15/08/1996",
    gender: "Nam",
    id_card_no: "001096001234",
    id_card_date: "10/05/2021",
    id_card_place: "Cục CSQLHC về TTXH",
    permanent_address: "Số 18, Ngõ 42 Phố Triều Khúc, Quận Thanh Xuân, TP. Hà Nội",
    current_address: "Phòng 1002, Tòa Roman Plaza, Tố Hữu, Nam Từ Liêm, Hà Nội",
    phone: "0901 234 567",
    email: "an.nguyen@cyclosa.vn",
    contract_number: "HĐLĐ-2026-00125",
    job_title: "Kỹ sư giải pháp đám mây cao cấp (Cloud Solution Architect)",
    department_name: "Trung tâm Nghiên cứu & Phát triển Sản phẩm (R&D)",
    start_date: "01/11/2026",
    end_date: "31/10/2028",
    sign_date: "25/10/2026",
    base_salary: "35,000,000 VNĐ",
    salary_in_words: "Ba mươi lăm triệu đồng chẵn",
    work_location: "Trụ sở chính CYCLOSA, Keangnam Landmark 72, Hà Nội",
    working_time_description: "Từ Thứ Hai đến Thứ Sáu (8h30 - 17h30), nghỉ Thứ Bảy và Chủ Nhật",
    probation_salary_rate: "85%",
  },
  null,
  2
);

const DEFAULT_TEMPLATE_HTML = `
<div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6; color: #111; max-width: 780px; margin: 0 auto; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h4 style="margin: 0; font-size: 14px; text-transform: uppercase; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
    <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0; font-size: 12px;">-----------------------</p>
    <p style="margin: 8px 0 0 0; font-size: 12px; font-style: italic;">Số: {{contract_number}} / CYCLOSA-HR</p>
    <h2 style="margin-top: 24px; margin-bottom: 4px; text-transform: uppercase; font-size: 20px; font-weight: bold; color: #1e3a8a;">HỢP ĐỒNG LAO ĐỘNG</h2>
    <p style="margin: 0; font-size: 12px; font-style: italic;">(Ban hành theo Bộ luật Lao động số 45/2019/QH14)</p>
  </div>

  <p style="font-size: 13px;">Hôm nay, ngày {{sign_date}}, tại trụ sở Công ty, chúng tôi gồm các bên:</p>

  <div style="background-color: #f8fafc; border-left: 3px solid #1e3a8a; padding: 12px; margin-bottom: 16px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #1e3a8a; font-weight: bold;">BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</h4>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Tên doanh nghiệp:</strong> {{company_name}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Địa chỉ trụ sở:</strong> {{company_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Mã số doanh nghiệp / MST:</strong> {{company_tax_code}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Đại diện bởi:</strong> {{representative_name}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Chức vụ:</strong> {{representative_title}}</p>
  </div>

  <div style="background-color: #f8fafc; border-left: 3px solid #1e3a8a; padding: 12px; margin-bottom: 20px;">
    <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #1e3a8a; font-weight: bold;">BÊN B: NGƯỜI LAO ĐỘNG</h4>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Họ và tên:</strong> {{employee_name}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Mã nhân viên:</strong> {{employee_code}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Ngày sinh:</strong> {{dob}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Giới tính:</strong> {{gender}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Số CCCD:</strong> {{id_card_no}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Cấp ngày:</strong> {{id_card_date}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Nơi cấp:</strong> {{id_card_place}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Địa chỉ thường trú:</strong> {{permanent_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Nơi ở hiện tại:</strong> {{current_address}}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Điện thoại:</strong> {{phone}} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Email cá nhân:</strong> {{email}}</p>
  </div>

  <h4 style="font-size: 14px; color: #1e3a8a; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 1: THỜI HẠN VÀ CÔNG VIỆC HỢP ĐỒNG</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Loại hợp đồng lao động: Theo thỏa thuận quy định.</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Thời hạn hợp đồng: Từ ngày <strong>{{start_date}}</strong> đến ngày <strong>{{end_date}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">3. Bộ phận làm việc: {{department_name}}.</p>
  <p style="font-size: 13px; margin: 4px 0;">4. Chức danh chuyên môn: <strong>{{job_title}}</strong>.</p>
  <p style="font-size: 13px; margin: 4px 0;">5. Địa điểm làm việc: {{work_location}}.</p>

  <h4 style="font-size: 14px; color: #1e3a8a; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 2: CHẾ ĐỘ LƯƠNG VÀ ĐÃI NGỘ</h4>
  <p style="font-size: 13px; margin: 4px 0;">1. Mức lương cơ bản thỏa thuận: <strong>{{base_salary}}</strong> / tháng (Bằng chữ: <em>{{salary_in_words}}</em>).</p>
  <p style="font-size: 13px; margin: 4px 0;">2. Thời giờ làm việc: {{working_time_description}}.</p>
  <p style="font-size: 13px; margin: 4px 0;">3. Hình thức trả lương: Chuyển khoản qua tài khoản ngân hàng định kỳ vào ngày 05 hàng tháng.</p>

  <h4 style="font-size: 14px; color: #1e3a8a; margin-top: 16px; margin-bottom: 6px; font-weight: bold;">ĐIỀU 3: HIỆU LỰC THI HÀNH & KÝ KẾT</h4>
  <p style="font-size: 13px; margin: 4px 0;">Hợp đồng được lập dưới dạng chứng từ điện tử có giá trị pháp lý tương đương bản giấy theo Luật Giao dịch Điện tử số 20/2023/QH15.</p>

  <div style="margin-top: 45px; display: flex; justify-content: space-between; page-break-inside: avoid;">
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN NGƯỜI LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Ký tên)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{employee_name}}</p>
    </div>
    <div style="text-align: center; width: 45%;">
      <p style="margin: 0; font-size: 13px; font-weight: bold;">ĐẠI DIỆN BÊN SỬ DỤNG LAO ĐỘNG</p>
      <p style="margin: 4px 0 60px 0; font-size: 12px; font-style: italic;">(Ký điện tử / Đóng dấu)</p>
      <p style="margin: 0; font-size: 13px; font-weight: bold;">{{representative_name}}</p>
      <p style="margin: 2px 0 0 0; font-size: 12px; font-style: italic;">{{representative_title}}</p>
    </div>
  </div>
</div>
`.trim();

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
    } else if (!companyId && companies.length > 0) {
      setCompanyId(companies[0].id);
      // Auto generate code if empty
      setTemplateCode(`HDLD-TPL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [initialData, companies, companyId]);

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
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link
              href="/contracts"
              className="hover:text-foreground transition-colors"
            >
              Hợp đồng
            </Link>
            <span>/</span>
            <Link
              href="/contracts/templates"
              className="hover:text-foreground transition-colors"
            >
              Biểu mẫu hợp đồng
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {isEdit ? "Chỉnh sửa biểu mẫu" : "Tạo biểu mẫu mới"}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contracts/templates">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
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
              <p className="text-xs text-muted-foreground mt-0.5">
                Thiết kế mẫu văn bản pháp lý với các biến giữ chỗ Handlebars và kiểm tra dữ liệu thực tế trước khi ban hành.
              </p>
            </div>
          </div>
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
                  onValueChange={setCompanyId}
                  disabled={isEdit}
                >
                  <SelectTrigger id="companyId" className="h-9 text-xs">
                    <SelectValue placeholder="Chọn công ty..." />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name} ({c.code})
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
                <Label htmlFor="kind" className="text-xs font-medium">
                  Phân loại mẫu biểu <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={kind}
                  onValueChange={(val) => setKind(val as TemplateKind)}
                >
                  <SelectTrigger id="kind" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TEMPLATE_KIND_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-xs">
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">
                      Áp dụng chung cho tất cả loại HĐ
                    </SelectItem>
                    {Object.entries(CONTRACT_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-xs">
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HTML" className="text-xs">
                      HTML / Handlebars động (Khuyến nghị)
                    </SelectItem>
                    <SelectItem value="DOCX" className="text-xs">
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

