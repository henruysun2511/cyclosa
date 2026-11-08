import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateContractTemplateMutation,
  useUpdateContractTemplateMutation,
  useCreateTemplateVersionMutation,
  usePublishTemplateVersionMutation,
  useRenderTemplatePreviewMutation,
  useGetTemplateVersionsQuery,
} from "../../api/contract-api";
import { TEMPLATE_KIND_LABELS } from "../../constants/contract.constants";
import type {
  ContractTemplate,
  TemplateKind,
  TemplateFormat,
} from "../../types/contract.types";
import { toast } from "sonner";
import {
  FileCode,
  Eye,
  CheckCircle2,
  Send,
  PlusCircle,
  Copy,
  History,
} from "lucide-react";

interface ContractTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: ContractTemplate | null;
  companyId: string;
  onSuccess?: () => void;
}

const DEFAULT_SAMPLE_DATA = JSON.stringify(
  {
    company_name: "TẬP ĐOÀN CÔNG NGHỆ CYCLOSA",
    employee_name: "NGUYỄN VĂN AN",
    employee_code: "EMP001",
    contract_number: "HDLD-2026-001",
    start_date: "01/01/2026",
    base_salary: "20,000,000 VND",
    job_title: "Kỹ sư phần mềm cao cấp",
    work_location: "Tòa nhà CYCLOSA Tower, Quận 1, TP.HCM",
  },
  null,
  2
);

const DEFAULT_TEMPLATE_HTML = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 25px;">
    <h3 style="margin: 0; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
    <p style="margin: 4px 0; font-weight: bold;">Độc lập - Tự do - Hạnh phúc</p>
    <p style="margin: 0;">---------------</p>
    <h2 style="margin-top: 20px; text-transform: uppercase; color: #1e3a8a;">HỢP ĐỒNG LAO ĐỘNG</h2>
    <p style="font-style: italic;">Số: {{contract_number}}</p>
  </div>

  <p>Hôm nay, ngày ký kết hợp đồng, chúng tôi gồm có:</p>

  <h4 style="margin-bottom: 5px; color: #1e3a8a;">BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</h4>
  <p style="margin: 3px 0;"><strong>Tên doanh nghiệp:</strong> {{company_name}}</p>
  <p style="margin: 3px 0;"><strong>Địa chỉ:</strong> {{work_location}}</p>

  <h4 style="margin-bottom: 5px; margin-top: 15px; color: #1e3a8a;">BÊN B: NGƯỜI LAO ĐỘNG</h4>
  <p style="margin: 3px 0;"><strong>Họ và tên:</strong> {{employee_name}}</p>
  <p style="margin: 3px 0;"><strong>Mã nhân viên:</strong> {{employee_code}}</p>
  <p style="margin: 3px 0;"><strong>Chức danh công việc:</strong> {{job_title}}</p>

  <h4 style="margin-bottom: 5px; margin-top: 15px; color: #1e3a8a;">ĐIỀU KHOẢN HỢP ĐỒNG</h4>
  <p><strong>1. Thời hạn và công việc:</strong> Bắt đầu từ ngày {{start_date}}.</p>
  <p><strong>2. Tiền lương và chế độ:</strong> Mức lương cơ bản thỏa thuận là <strong>{{base_salary}}</strong>.</p>
  <p>Hợp đồng được lập thành 02 bản điện tử có giá trị pháp lý như nhau theo Luật Giao dịch điện tử.</p>

  <div style="margin-top: 40px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 45%;">
      <strong>ĐẠI DIỆN BÊN A</strong><br/>
      <span style="font-style: italic; font-size: 12px;">(Ký điện tử / Ký tên, đóng dấu)</span>
    </div>
    <div style="text-align: center; width: 45%;">
      <strong>ĐẠI DIỆN BÊN B</strong><br/>
      <span style="font-style: italic; font-size: 12px;">(Ký điện tử / Ký, ghi rõ họ tên)</span>
    </div>
  </div>
</div>
`.trim();

export function ContractTemplateDialog({
  open,
  onOpenChange,
  template,
  companyId,
  onSuccess,
}: ContractTemplateDialogProps) {
  const isEdit = Boolean(template?.id);

  const [activeTab, setActiveTab] = useState("editor");
  const [templateCode, setTemplateCode] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<TemplateKind>("LABOR_CONTRACT");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<TemplateFormat>("HTML");
  const [contentRaw, setContentRaw] = useState(DEFAULT_TEMPLATE_HTML);
  const [sampleDataJson, setSampleDataJson] = useState(DEFAULT_SAMPLE_DATA);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const { data: versions = [], refetch: refetchVersions } = useGetTemplateVersionsQuery(
    template?.id || "",
    { skip: !isEdit || !open }
  );

  const [createTemplate, { isLoading: isCreating }] = useCreateContractTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateContractTemplateMutation();
  const [createVersion, { isLoading: isCreatingVersion }] = useCreateTemplateVersionMutation();
  const [publishVersion, { isLoading: isPublishing }] = usePublishTemplateVersionMutation();
  const [renderPreview, { isLoading: isRendering }] = useRenderTemplatePreviewMutation();

  useEffect(() => {
    if (template) {
      setTemplateCode(template.templateCode);
      setName(template.name);
      setKind(template.kind);
      setDescription(template.description || "");
      if (template.activeVersion?.contentRaw) {
        setContentRaw(template.activeVersion.contentRaw);
      }
      if (template.activeVersion?.sampleDataJson) {
        setSampleDataJson(template.activeVersion.sampleDataJson);
      }
    } else {
      setTemplateCode(`TPL-${Date.now().toString().slice(-5)}`);
      setName("");
      setKind("LABOR_CONTRACT");
      setDescription("");
      setContentRaw(DEFAULT_TEMPLATE_HTML);
      setSampleDataJson(DEFAULT_SAMPLE_DATA);
      setPreviewHtml(null);
    }
  }, [template, open]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên biểu mẫu");
      return;
    }
    if (!templateCode.trim()) {
      toast.error("Vui lòng nhập mã biểu mẫu");
      return;
    }

    try {
      if (isEdit && template?.id) {
        await updateTemplate({
          id: template.id,
          body: {
            name: name.trim(),
            kind,
            description: description.trim() || undefined,
          },
        }).unwrap();
        toast.success("Cập nhật thông tin biểu mẫu thành công");
      } else {
        await createTemplate({
          companyId,
          templateCode: templateCode.trim(),
          name: name.trim(),
          kind,
          description: description.trim() || undefined,
          format,
          contentRaw,
          sampleDataJson,
        }).unwrap();
        toast.success("Tạo mới biểu mẫu hợp đồng thành công (phiên bản v1 đã kích hoạt)");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu biểu mẫu");
    }
  };

  const handleCreateNewVersion = async () => {
    if (!template?.id) return;
    try {
      await createVersion({
        templateId: template.id,
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

  const handlePublishVersion = async (versionId: string) => {
    if (!template?.id) return;
    try {
      await publishVersion({
        templateId: template.id,
        versionId,
      }).unwrap();
      toast.success("Đã kích hoạt phiên bản mẫu thành công");
      refetchVersions();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phát hành phiên bản");
    }
  };

  const handlePreview = async () => {
    try {
      let dataObj = {};
      try {
        dataObj = JSON.parse(sampleDataJson);
      } catch (e) {
        toast.error("Dữ liệu giả lập mẫu (JSON) không đúng định dạng");
        return;
      }

      const res = await renderPreview({
        contentRaw,
        data: dataObj as Record<string, unknown>,
      }).unwrap();

      setPreviewHtml(res);
      setActiveTab("preview");
      toast.success("Render xem trước thành công");
    } catch (err: any) {
      toast.error(err?.data?.message || "Render xem trước thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-primary" />
            {isEdit ? "Chỉnh sửa Biểu mẫu Hợp đồng" : "Tạo Biểu mẫu Hợp đồng mới"}
          </DialogTitle>
          <DialogDescription>
            Cấu hình biểu mẫu hợp đồng động với thẻ giữ chỗ Handlebars:{" "}
            <code>{"{{employee_name}}"}</code>, <code>{"{{base_salary}}"}</code>, v.v.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateCode">
                Mã biểu mẫu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="templateCode"
                value={templateCode}
                onChange={(e) => setTemplateCode(e.target.value)}
                disabled={isEdit}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">
                Tên biểu mẫu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Hợp đồng lao động xác định thời hạn chuẩn 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kind">Phân loại mẫu</Label>
              <select
                id="kind"
                value={kind}
                onChange={(e) => setKind(e.target.value as TemplateKind)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {Object.entries(TEMPLATE_KIND_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả mục đích áp dụng</Label>
              <Input
                id="description"
                placeholder="Áp dụng cho nhân viên khối văn phòng..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs Soạn thảo & Xem trước & Lịch sử phiên bản */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-2">
            <div className="flex items-center justify-between border-b pb-2">
              <TabsList>
                <TabsTrigger value="editor" className="gap-1.5">
                  <FileCode className="w-4 h-4" />
                  Nội dung Mẫu (HTML)
                </TabsTrigger>
                <TabsTrigger value="sampleData" className="gap-1.5">
                  <Copy className="w-4 h-4" />
                  Dữ liệu mẫu (JSON)
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5">
                  <Eye className="w-4 h-4" />
                  Xem trước Render
                </TabsTrigger>
                {isEdit && (
                  <TabsTrigger value="history" className="gap-1.5">
                    <History className="w-4 h-4" />
                    Lịch sử Phiên bản ({versions.length})
                  </TabsTrigger>
                )}
              </TabsList>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={handlePreview}
                disabled={isRendering}
              >
                <Eye className="w-3.5 h-3.5" />
                {isRendering ? "Đang render..." : "Render thử nghiệm"}
              </Button>
            </div>

            <TabsContent value="editor" className="space-y-2 pt-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="contentRaw">Nội dung khung mẫu HTML / Handlebars</Label>
                <span className="text-xs text-muted-foreground">
                  Hỗ trợ đầy đủ biến động Handlebars
                </span>
              </div>
              <Textarea
                id="contentRaw"
                value={contentRaw}
                onChange={(e) => setContentRaw(e.target.value)}
                rows={12}
                className="font-mono text-xs leading-relaxed"
              />
              {isEdit && (
                <div className="pt-2 flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={handleCreateNewVersion}
                    disabled={isCreatingVersion}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Lưu thành Phiên bản mới
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sampleData" className="space-y-2 pt-3">
              <Label htmlFor="sampleDataJson">
                Dữ liệu JSON giả lập để thử nghiệm gán biến
              </Label>
              <Textarea
                id="sampleDataJson"
                value={sampleDataJson}
                onChange={(e) => setSampleDataJson(e.target.value)}
                rows={10}
                className="font-mono text-xs"
              />
            </TabsContent>

            <TabsContent value="preview" className="pt-3">
              {previewHtml ? (
                <Card className="border-border">
                  <CardContent className="p-4 bg-white dark:bg-slate-950 rounded-lg overflow-x-auto">
                    <div
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                      className="prose dark:prose-invert max-w-none text-slate-900 dark:text-slate-100"
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg text-muted-foreground text-sm">
                  Bấm nút <strong>&quot;Render thử nghiệm&quot;</strong> để xem nội dung hợp đồng được biên dịch
                </div>
              )}
            </TabsContent>

            {isEdit && (
              <TabsContent value="history" className="space-y-3 pt-3">
                <div className="space-y-2">
                  {versions.map((v) => (
                    <Card key={v.id} className="border-border/60">
                      <CardContent className="p-3.5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              Phiên bản v{v.versionNumber}
                            </span>
                            {v.isActive && (
                              <Badge className="bg-emerald-600 text-xs">
                                Đang áp dụng
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {v.format}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Tạo ngày: {new Date(v.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>

                        {!v.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs text-emerald-600"
                            onClick={() => handlePublishVersion(v.id)}
                            disabled={isPublishing}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Kích hoạt bản này
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handleSave} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? "Đang lưu..." : isEdit ? "Lưu thông tin" : "Tạo biểu mẫu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

