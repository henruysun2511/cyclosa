"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  FileText,
  CheckCircle2,
  Building,
  User,
  Coins,
  Calendar,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useCreateContractMutation,
  useUpdateContractMutation,
  useGetContractByIdQuery,
  useGetContractTemplatesQuery,
  useCheckContractComplianceQuery,
} from "../../api/contract-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import { useGetCompaniesQuery } from "@/features/organization/api";
import {
  CONTRACT_TYPE_LABELS,
  SIGNING_FORM_LABELS,
} from "../../constants/contract.constants";
import { ContractStatusBadge } from "../contract-status-badge";
import type {
  ContractType,
  SigningForm,
  SalaryPaymentMethod,
  ContractAllowance,
} from "../../types/contract.types";

const SALARY_PAYMENT_LABELS: Record<SalaryPaymentMethod, string> = {
  BANK_TRANSFER: "Chuyển khoản qua ngân hàng",
  CASH: "Tiền mặt trực tiếp",
  OTHER: "Hình thức khác theo thỏa thuận",
};

interface ContractFormProps {
  contractId?: string;
  initialCompanyId?: string;
  onSuccess?: (contractId?: string) => void;
  onCancel?: () => void;
}

export function ContractForm({
  contractId,
  initialCompanyId,
  onSuccess,
  onCancel,
}: ContractFormProps) {
  const router = useRouter();
  const isEdit = Boolean(contractId);

  // Queries & Mutations
  const { data: existingContract, isLoading: isLoadingContract } =
    useGetContractByIdQuery(contractId || "", {
      skip: !contractId,
    });

  const [createContract, { isLoading: isCreating }] = useCreateContractMutation();
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation();
  const isSubmitting = isCreating || isUpdating;

  // Companies & Employees
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  const [companyId, setCompanyId] = useState(initialCompanyId || "");

  // Form states
  const [employeeId, setEmployeeId] = useState("");
  const [templateVersionId, setTemplateVersionId] = useState<string | undefined>();
  const [contractNumber, setContractNumber] = useState("");
  const [contractType, setContractType] = useState<ContractType>("FIXED_TERM");
  const [signingForm, setSigningForm] = useState<SigningForm>("ELECTRONIC");
  const [signingDate, setSigningDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [baseSalary, setBaseSalary] = useState<number>(15000000);
  const [salaryPaymentMethod, setSalaryPaymentMethod] =
    useState<SalaryPaymentMethod>("BANK_TRANSFER");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [workingTimeNote, setWorkingTimeNote] = useState(
    "44 giờ/tuần (Thứ 2 đến sáng Thứ 7)"
  );
  const [otherBenefits, setOtherBenefits] = useState("");

  // Allowances
  const [allowances, setAllowances] = useState<ContractAllowance[]>([
    {
      allowanceType: "Phụ cấp ăn trưa",
      amount: 730000,
      isInsuranceInclusive: false,
      isTaxable: false,
    },
  ]);

  // Signer Party A
  const [signerAName, setSignerAName] = useState("Nguyễn Văn Giám Đốc");
  const [signerARole, setSignerARole] = useState(
    "Tổng Giám đốc (Đại diện pháp luật)"
  );

  // Initialize or update companyId when companies load
  useEffect(() => {
    if (!companyId && companies.length > 0) {
      if (existingContract?.companyId) {
        setCompanyId(existingContract.companyId);
      } else if (initialCompanyId) {
        setCompanyId(initialCompanyId);
      } else {
        setCompanyId(companies[0].id);
      }
    }
  }, [companies, companyId, existingContract, initialCompanyId]);

  // Fill form if editing
  useEffect(() => {
    if (existingContract) {
      setCompanyId(existingContract.companyId);
      setEmployeeId(existingContract.employeeId);
      setContractNumber(existingContract.contractNumber);
      setContractType(existingContract.contractType);
      setSigningForm(existingContract.signingForm);
      setSigningDate(
        existingContract.signingDate || new Date().toISOString().split("T")[0]
      );
      setStartDate(existingContract.startDate);
      setEndDate(existingContract.endDate || "");
      setBaseSalary(existingContract.baseSalary || 0);
      setSalaryPaymentMethod(
        existingContract.salaryPaymentMethod || "BANK_TRANSFER"
      );
      setBankAccount(existingContract.bankAccount || "");
      setBankName(existingContract.bankName || "");
      setWorkLocation(existingContract.workLocation || "");
      setWorkingTimeNote(existingContract.workingTimeNote || "");
      setOtherBenefits(existingContract.otherBenefits || "");
      setAllowances(
        existingContract.allowances && existingContract.allowances.length > 0
          ? existingContract.allowances
          : []
      );
      if (existingContract.templateVersionId) {
        setTemplateVersionId(existingContract.templateVersionId || undefined);
      }
      if (existingContract.signers && existingContract.signers.length > 0) {
        const partyA = existingContract.signers.find((s) => s.side === "PARTY_A");
        if (partyA) {
          setSignerAName(partyA.signerName);
          setSignerARole(partyA.signerRoleTitle || "");
        }
      }
    } else if (!isEdit && !contractNumber) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setContractNumber(`HDLD-${new Date().getFullYear()}-${randomNum}`);
    }
  }, [existingContract, isEdit, contractNumber]);

  // Queries for employees & templates
  const effectiveCompanyId = companyId || companies[0]?.id || "";

  const { data: employeesData } = useGetEmployeesQuery(
    { companyId: effectiveCompanyId || undefined, page: 1, size: 100 },
    { skip: !effectiveCompanyId }
  );
  const employees = employeesData?.items || [];

  const { data: templatesData } = useGetContractTemplatesQuery(
    { companyId: effectiveCompanyId || undefined, page: 1, size: 50, isActive: true },
    { skip: !effectiveCompanyId }
  );
  const templates = templatesData?.items || [];

  // Live BLLĐ 2019 Compliance Check
  const { data: complianceResult, isFetching: isCheckingCompliance } =
    useCheckContractComplianceQuery(
      {
        employeeId,
        contractType,
      },
      {
        skip: !employeeId,
      }
    );

  const selectedEmployee = employees.find((e) => e.id === employeeId);

  // Allowance handlers
  const handleAddAllowance = () => {
    setAllowances([
      ...allowances,
      {
        allowanceType: "",
        amount: 500000,
        isInsuranceInclusive: false,
        isTaxable: false,
      },
    ]);
  };

  const handleRemoveAllowance = (index: number) => {
    setAllowances(allowances.filter((_, i) => i !== index));
  };

  const handleUpdateAllowance = (
    index: number,
    field: keyof ContractAllowance,
    value: string | number | boolean
  ) => {
    const updated = [...allowances];
    updated[index] = { ...updated[index], [field]: value };
    setAllowances(updated);
  };

  const totalAllowances = allowances.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalIncome = (Number(baseSalary) || 0) + totalAllowances;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!effectiveCompanyId) {
      toast.error("Vui lòng chọn công ty quản lý!");
      return;
    }
    if (!employeeId) {
      toast.error("Vui lòng chọn nhân viên ký kết!");
      return;
    }
    if (!contractNumber.trim()) {
      toast.error("Vui lòng nhập số hợp đồng!");
      return;
    }
    if (!startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu hiệu lực!");
      return;
    }
    if (contractType !== "INDEFINITE" && !endDate) {
      toast.error("Hợp đồng có thời hạn bắt buộc phải có ngày kết thúc!");
      return;
    }

    if (!isEdit && complianceResult && !complianceResult.allowed) {
      toast.error(
        complianceResult.reason || "Hợp đồng không đáp ứng quy định BLLĐ 2019"
      );
      return;
    }

    try {
      if (isEdit && contractId) {
        await updateContract({
          id: contractId,
          body: {
            companyId: effectiveCompanyId,
            employeeId,
            contractNumber: contractNumber.trim(),
            contractType,
            signingForm,
            signingDate: signingDate || new Date().toISOString().split("T")[0],
            startDate,
            endDate: contractType === "INDEFINITE" ? undefined : endDate || undefined,
            baseSalary,
            salaryPaymentMethod,
            bankAccount: bankAccount.trim() || undefined,
            bankName: bankName.trim() || undefined,
            workLocation: workLocation.trim() || undefined,
            workingTimeNote: workingTimeNote.trim() || undefined,
            otherBenefits: otherBenefits.trim() || undefined,
            allowances: allowances.filter((a) => a.allowanceType.trim() && a.amount > 0),
          },
        }).unwrap();

        toast.success("Cập nhật điều khoản hợp đồng thành công!");
        if (onSuccess) {
          onSuccess(contractId);
        } else {
          router.push(`/contracts/${contractId}`);
        }
      } else {
        const created = await createContract({
          companyId: effectiveCompanyId,
          employeeId,
          templateVersionId,
          contractNumber: contractNumber.trim(),
          contractType,
          signingForm,
          signingDate,
          startDate,
          endDate: contractType === "INDEFINITE" ? undefined : endDate || undefined,
          baseSalary,
          salaryPaymentMethod,
          bankAccount: bankAccount.trim() || undefined,
          bankName: bankName.trim() || undefined,
          workLocation: workLocation.trim() || undefined,
          workingTimeNote: workingTimeNote.trim() || undefined,
          otherBenefits: otherBenefits.trim() || undefined,
          allowances: allowances.filter((a) => a.allowanceType.trim() && a.amount > 0),
          signers: [
            {
              side: "PARTY_A",
              signerName: signerAName,
              signerRoleTitle: signerARole,
              signingOrder: 1,
              signingMethod: signingForm === "ELECTRONIC" ? "OTP_EMAIL" : "OTP_SMS",
            },
            {
              side: "PARTY_B",
              signerEmployeeId: employeeId,
              signerName: selectedEmployee
                ? `${selectedEmployee.lastName} ${selectedEmployee.firstName}`
                : "Người lao động",
              signingOrder: 2,
              signingMethod: signingForm === "ELECTRONIC" ? "OTP_SMS" : "OTP_EMAIL",
            },
          ],
        }).unwrap();

        toast.success("Soạn thảo hợp đồng thành công (bản nháp)!");
        const newId = created?.id;
        if (onSuccess) {
          onSuccess(newId);
        } else if (newId) {
          router.push(`/contracts/${newId}`);
        } else {
          router.push("/contracts");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Lỗi lưu trữ hợp đồng");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (isEdit && contractId) {
      router.push(`/contracts/${contractId}`);
    } else {
      router.push("/contracts");
    }
  };

  if (isLoadingContract) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu hợp đồng...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── 1. Top Bar & Breadcrumb ────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link
              href="/contracts"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span>Hợp đồng lao động</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {isEdit ? "Chỉnh sửa hợp đồng" : "Soạn thảo hợp đồng mới"}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              onClick={handleCancel}
              title="Quay lại"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span>
                  {isEdit
                    ? `Chỉnh sửa Hợp đồng: ${existingContract?.contractNumber || contractNumber}`
                    : "Soạn thảo Hợp đồng Lao động"}
                </span>
              </h1>
              {isEdit && existingContract && (
                <ContractStatusBadge status={existingContract.status} />
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Thiết lập chủ thể, điều khoản tiền lương, phụ cấp và đối soát tự động theo quy định Bộ luật Lao động 2019.
          </p>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs"
          >
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="h-9 px-4 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEdit ? "Lưu thay đổi" : "Lưu bản nháp hợp đồng"}</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Nội dung Form (Grid 2 cột) ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI: Dữ liệu điều khoản chính (8 cột) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Chủ thể ký kết (Bên A & Bên B) */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                1. Chủ thể ký kết hợp đồng (Bên A & Bên B)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Công ty (Bên A) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Đơn vị sử dụng lao động (Bên A) <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={companyId}
                    onValueChange={(val) => setCompanyId(val || "")}
                    disabled={isEdit}
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn pháp nhân công ty">
                        {(val: string) =>
                          companies.find((c) => c.id === val)?.name ||
                          "Chọn pháp nhân công ty"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id} label={c.name} className="text-xs">
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Người lao động (Bên B) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Người lao động (Bên B) <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={employeeId}
                    onValueChange={(val) => setEmployeeId(val || "")}
                    disabled={isEdit}
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn người lao động">
                        {(val: string) => {
                          const emp = employees.find((e) => e.id === val);
                          return emp
                            ? `${emp.lastName} ${emp.firstName} (${emp.employeeCode})`
                            : "Chọn người lao động";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {employees.map((e) => (
                        <SelectItem
                          key={e.id}
                          value={e.id}
                          label={`${e.lastName} ${e.firstName} (${e.employeeCode})`}
                          className="text-xs"
                        >
                          <div className="flex flex-col text-left">
                            <span className="font-medium">
                              {e.lastName} {e.firstName}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              Mã: {e.employeeCode} • {e.personalEmail || "Chưa có email"}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Thông tin đại diện bên A */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Họ tên người đại diện pháp luật (Bên A)</Label>
                  <Input
                    className="h-9 text-xs"
                    value={signerAName}
                    onChange={(e) => setSignerAName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Giám Đốc"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Chức vụ người đại diện (Bên A)</Label>
                  <Input
                    className="h-9 text-xs"
                    value={signerARole}
                    onChange={(e) => setSignerARole(e.target.value)}
                    placeholder="VD: Tổng Giám đốc (Đại diện pháp luật)"
                  />
                </div>
              </div>

              {selectedEmployee && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      {selectedEmployee.firstName?.[0] || "U"}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        {selectedEmployee.lastName} {selectedEmployee.firstName}
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Mã NV: <span className="font-mono">{selectedEmployee.employeeCode}</span> • Trạng thái: {selectedEmployee.currentStatus}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[11px] border-primary/30 text-primary bg-background">
                    Đã chọn nhân sự
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Loại hợp đồng & Biểu mẫu */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                2. Loại hợp đồng & Thời hạn thực hiện
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Số hợp đồng */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Số hợp đồng <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    className="h-9 text-xs font-mono"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    placeholder="VD: HDLD-2026-0012"
                    required
                  />
                </div>

                {/* Loại hợp đồng */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Loại hợp đồng <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={contractType}
                    onValueChange={(val) => setContractType(val as ContractType)}
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn loại hợp đồng">
                        {(val: string) =>
                          CONTRACT_TYPE_LABELS[val as ContractType] ||
                          "Chọn loại hợp đồng"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONTRACT_TYPE_LABELS).map(([k, label]) => (
                        <SelectItem key={k} value={k} label={label} className="text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hình thức ký */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Hình thức ký</Label>
                  <Select
                    value={signingForm}
                    onValueChange={(val) => setSigningForm(val as SigningForm)}
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Hình thức ký kết">
                        {(val: string) =>
                          SIGNING_FORM_LABELS[val as SigningForm] ||
                          "Hình thức ký kết"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SIGNING_FORM_LABELS).map(([k, label]) => (
                        <SelectItem key={k} value={k} label={label} className="text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mẫu hợp đồng áp dụng */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Biểu mẫu hợp đồng áp dụng</Label>
                <Select
                  value={templateVersionId || "NONE"}
                  onValueChange={(val) =>
                    setTemplateVersionId(!val || val === "NONE" ? undefined : val)
                  }
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Mặc định hệ thống (Không dùng mẫu tùy chỉnh)">
                      {(val: string) => {
                        if (!val || val === "NONE") {
                          return "Mặc định hệ thống (Không dùng mẫu tùy chỉnh)";
                        }
                        const t = templates.find((item) => item.activeVersionId === val);
                        return t ? `${t.name} (${t.templateCode})` : "Mẫu đã chọn";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE" label="Mặc định hệ thống" className="text-xs">
                      Mặc định hệ thống (Không dùng mẫu tùy chỉnh)
                    </SelectItem>
                    {templates.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.activeVersionId || t.id}
                        label={`${t.name} (${t.templateCode})`}
                        className="text-xs"
                      >
                        {t.name} ({t.templateCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ngày ký, Ngày bắt đầu, Ngày kết thúc */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Ngày ký kết</Label>
                  <Input
                    type="date"
                    className="h-9 text-xs"
                    value={signingDate}
                    onChange={(e) => setSigningDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Ngày bắt đầu hiệu lực <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    className="h-9 text-xs"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center justify-between">
                    <span>Ngày kết thúc</span>
                    {contractType === "INDEFINITE" && (
                      <span className="text-[11px] text-muted-foreground font-normal">
                        (Không áp dụng)
                      </span>
                    )}
                  </Label>
                  <Input
                    type="date"
                    className="h-9 text-xs"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={contractType === "INDEFINITE"}
                    placeholder={contractType === "INDEFINITE" ? "Không xác định" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Lương & Phương thức thanh toán */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                3. Gói lương & Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mức lương cơ bản */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Mức lương chính (Gross/tháng) <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step={100000}
                      min={0}
                      className="h-9 text-xs pr-14 font-semibold font-mono"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(Number(e.target.value))}
                      required
                    />
                    <span className="absolute right-3 top-2 text-xs text-muted-foreground font-mono">
                      VNĐ
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    ≈ {baseSalary ? baseSalary.toLocaleString("vi-VN") : "0"} VNĐ / tháng
                  </p>
                </div>

                {/* Phương thức trả lương */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Phương thức trả lương</Label>
                  <Select
                    value={salaryPaymentMethod}
                    onValueChange={(val) =>
                      setSalaryPaymentMethod(val as SalaryPaymentMethod)
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn hình thức thanh toán">
                        {(val: string) =>
                          SALARY_PAYMENT_LABELS[val as SalaryPaymentMethod] ||
                          "Chọn hình thức thanh toán"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SALARY_PAYMENT_LABELS).map(([k, label]) => (
                        <SelectItem key={k} value={k} label={label} className="text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {salaryPaymentMethod === "BANK_TRANSFER" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Ngân hàng thụ hưởng</Label>
                    <Input
                      className="h-9 text-xs"
                      placeholder="VD: Vietcombank, Techcombank, MB Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Số tài khoản ngân hàng</Label>
                    <Input
                      className="h-9 text-xs font-mono"
                      placeholder="VD: 0123456789"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 4: Danh mục Phụ cấp hàng tháng */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Coins className="w-4 h-4 text-primary" />
                4. Danh mục Phụ cấp thỏa thuận hàng tháng
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAllowance}
                className="h-7 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm phụ cấp
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {allowances.map((al, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border"
                >
                  <div className="flex-1 space-y-1">
                    <Input
                      className="h-8 text-xs"
                      placeholder="Loại phụ cấp (VD: Ăn trưa, Xăng xe, Điện thoại...)"
                      value={al.allowanceType}
                      onChange={(e) =>
                        handleUpdateAllowance(index, "allowanceType", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full sm:w-40 space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        step={50000}
                        className="h-8 text-xs pr-10 font-mono font-medium"
                        value={al.amount}
                        onChange={(e) =>
                          handleUpdateAllowance(index, "amount", Number(e.target.value))
                        }
                      />
                      <span className="absolute right-2 top-1.5 text-[10px] text-muted-foreground">
                        đ
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                      <input
                        type="checkbox"
                        checked={al.isInsuranceInclusive}
                        onChange={(e) =>
                          handleUpdateAllowance(
                            index,
                            "isInsuranceInclusive",
                            e.target.checked
                          )
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>Đóng BHXH</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                      <input
                        type="checkbox"
                        checked={al.isTaxable}
                        onChange={(e) =>
                          handleUpdateAllowance(index, "isTaxable", e.target.checked)
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>Tính thuế TNCN</span>
                    </label>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAllowance(index)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {allowances.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  Chưa có khoản phụ cấp nào. Nhấn &quot;Thêm phụ cấp&quot; để bổ sung vào hợp đồng.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Section 5: Điều kiện làm việc & Phúc lợi khác */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                5. Điều kiện làm việc & Quyền lợi bổ sung
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Địa điểm làm việc</Label>
                  <Input
                    className="h-9 text-xs"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    placeholder="VD: Trụ sở chính công ty hoặc văn phòng chi nhánh"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Chế độ thời giờ làm việc</Label>
                  <Input
                    className="h-9 text-xs"
                    value={workingTimeNote}
                    onChange={(e) => setWorkingTimeNote(e.target.value)}
                    placeholder="VD: 44 giờ/tuần (Thứ 2 đến sáng Thứ 7)"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Quyền lợi, phúc lợi bổ sung khác</Label>
                <Textarea
                  className="text-xs min-h-[70px]"
                  value={otherBenefits}
                  onChange={(e) => setOtherBenefits(e.target.value)}
                  placeholder="VD: Gói khám sức khỏe định kỳ hàng năm, bảo hiểm sức khỏe tự nguyện, thưởng KPI dự án..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CỘT PHẢI: BLLĐ Compliance Check & Tóm tắt (4 cột) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Live BLLĐ 2019 Compliance Engine */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Kiểm định Tuân thủ BLLĐ 2019
              </CardTitle>
              {isCheckingCompliance ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              )}
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              {complianceResult ? (
                <div
                  className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                    complianceResult.allowed
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  {complianceResult.allowed ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">
                      {complianceResult.allowed
                        ? "Hợp lệ theo Bộ luật Lao động 2019"
                        : "Cảnh báo không đủ điều kiện ký"}
                    </span>
                    <p className="text-[11px] mt-0.5 opacity-90">
                      {complianceResult.reason ||
                        "Nhân viên đủ điều kiện ký hợp đồng theo quy định pháp luật."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted/40 rounded-lg text-muted-foreground text-center">
                  Vui lòng chọn nhân viên để hệ thống kích hoạt kiểm định tự động.
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Tiêu chí đối soát pháp lý:
                </span>
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> Mức lương không thấp hơn lương tối thiểu vùng I
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> Thời giờ làm việc không vượt quá 48h/tuần
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> Giới hạn tối đa 02 lần HĐ có thời hạn
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span> Thời gian thử việc phù hợp trình độ chuyên môn
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Tóm tắt thu nhập hợp đồng */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Coins className="w-4 h-4 text-primary" />
                Tổng hợp Gói Thu nhập Dự kiến
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Lương chính (Gross):</span>
                <span className="font-mono font-semibold text-foreground">
                  {baseSalary ? baseSalary.toLocaleString("vi-VN") : 0} VNĐ
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Tổng phụ cấp hàng tháng:</span>
                <span className="font-mono font-semibold text-foreground">
                  {totalAllowances.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
              <div className="flex items-center justify-between py-2 bg-primary/5 rounded-lg px-2.5">
                <span className="font-semibold text-foreground">Tổng thu nhập hàng tháng:</span>
                <span className="font-mono font-bold text-sm text-primary">
                  {totalIncome.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Quy trình ký kết điện tử */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Luồng Ký điện tử E-Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium block truncate">Đại diện Bên A</span>
                    <span className="text-[10px] text-muted-foreground">
                      {signerAName} ({signerARole})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="min-w-0">
                    <span className="font-medium block truncate">Người lao động (Bên B)</span>
                    <span className="text-[10px] text-muted-foreground">
                      {selectedEmployee
                        ? `${selectedEmployee.lastName} ${selectedEmployee.firstName}`
                        : "Chưa chọn người lao động"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Sau khi lưu bản nháp, bạn có thể chuyển trạng thái sang Trình duyệt hoặc Phát lệnh ký số OTP ngay lập tức.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
