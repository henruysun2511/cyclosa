"use client";

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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import {
  useCreateContractMutation,
  useUpdateContractMutation,
  useGetContractTemplatesQuery,
  useCheckContractComplianceQuery,
} from "../../api/contract-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import { useGetCompaniesQuery } from "@/features/organization/api";
import {
  CONTRACT_TYPE_LABELS,
  SIGNING_FORM_LABELS,
} from "../../constants/contract.constants";
import type {
  ContractType,
  SigningForm,
  SalaryPaymentMethod,
  ContractAllowance,
  ContractDetail,
} from "../../types/contract.types";

interface ContractFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  contract: ContractDetail | null;
  defaultEmployeeId?: string;
  onSuccess?: () => void;
}

export function ContractFormDialog({
  open,
  onOpenChange,
  companyId,
  contract,
  defaultEmployeeId,
  onSuccess,
}: ContractFormDialogProps) {
  const isEdit = Boolean(contract);

  const [createContract, { isLoading: isCreating }] = useCreateContractMutation();
  const [updateContract, { isLoading: isUpdating }] = useUpdateContractMutation();
  const isSubmitting = isCreating || isUpdating;

  // Form states
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId || "");
  const [templateVersionId, setTemplateVersionId] = useState<string | undefined>();
  const [contractNumber, setContractNumber] = useState("");
  const [contractType, setContractType] = useState<ContractType>("FIXED_TERM");
  const [signingForm, setSigningForm] = useState<SigningForm>("ELECTRONIC");
  const [signingDate, setSigningDate] = useState(new Date().toISOString().split("T")[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
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
  const [signerARole, setSignerARole] = useState("Tổng Giám đốc (Đại diện pháp luật)");

  // Companies fallback
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 }, { skip: !open });
  const companies = companiesData?.items || [];
  const effectiveCompanyId = companyId || companies[0]?.id || "";

  // Queries
  const { data: employeesData } = useGetEmployeesQuery(
    { companyId: effectiveCompanyId || undefined, page: 1, size: 100 },
    { skip: !open }
  );
  const employees = employeesData?.items || [];

  const { data: templatesData } = useGetContractTemplatesQuery(
    { companyId: effectiveCompanyId || undefined, page: 1, size: 50, isActive: true },
    { skip: !open }
  );
  const templates = templatesData?.items || [];

  // Reset or fill form on open
  useEffect(() => {
    if (open) {
      if (contract) {
        setEmployeeId(contract.employeeId);
        setContractNumber(contract.contractNumber);
        setContractType(contract.contractType);
        setSigningForm(contract.signingForm);
        setSigningDate(contract.signingDate || new Date().toISOString().split("T")[0]);
        setStartDate(contract.startDate);
        setEndDate(contract.endDate || "");
        setBaseSalary(contract.baseSalary || 0);
        setSalaryPaymentMethod(contract.salaryPaymentMethod || "BANK_TRANSFER");
        setBankAccount(contract.bankAccount || "");
        setBankName(contract.bankName || "");
        setWorkLocation(contract.workLocation || "");
        setWorkingTimeNote(contract.workingTimeNote || "");
        setOtherBenefits(contract.otherBenefits || "");
        setAllowances(contract.allowances || []);
      } else {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setEmployeeId(defaultEmployeeId || "");
        setTemplateVersionId(undefined);
        setContractNumber(`HDLD-${new Date().getFullYear()}-${randomNum}`);
        setContractType("FIXED_TERM");
        setSigningForm("ELECTRONIC");
        setSigningDate(new Date().toISOString().split("T")[0]);
        setStartDate(new Date().toISOString().split("T")[0]);
        setEndDate("");
        setBaseSalary(15000000);
        setSalaryPaymentMethod("BANK_TRANSFER");
        setBankAccount("");
        setBankName("");
        setWorkLocation("");
        setWorkingTimeNote("44 giờ/tuần (Thứ 2 đến sáng Thứ 7)");
        setOtherBenefits("");
        setAllowances([
          {
            allowanceType: "Phụ cấp ăn trưa",
            amount: 730000,
            isInsuranceInclusive: false,
            isTaxable: false,
          },
        ]);
      }
    }
  }, [open, contract, defaultEmployeeId]);

  // AI Compliance Check
  const { data: complianceResult, isFetching: isCheckingCompliance } =
    useCheckContractComplianceQuery(
      {
        employeeId,
        contractType,
      },
      {
        skip: !open || !employeeId || isEdit,
      }
    );

  const selectedEmployee = employees.find((e) => e.id === employeeId);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.error(complianceResult.reason || "Hợp đồng không đáp ứng quy định BLLĐ 2019");
      return;
    }

    try {
      if (isEdit && contract) {
        await updateContract({
          id: contract.id,
          body: {
            companyId: contract.companyId,
            employeeId: contract.employeeId,
            contractNumber: contract.contractNumber,
            contractType: contract.contractType,
            signingForm: contract.signingForm,
            signingDate: contract.signingDate || new Date().toISOString().split("T")[0],
            startDate: contract.startDate,
            endDate: contract.endDate || undefined,
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
      } else {
        await createContract({
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
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Không thể lưu thông tin hợp đồng!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[94vw] sm:max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Chỉnh sửa điều khoản hợp đồng" : "Soạn thảo Hợp đồng Lao động mới"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? `Cập nhật thông tin và điều khoản cho hợp đồng ${contract?.contractNumber}.`
              : "Kiểm tra tính tuân thủ pháp lý theo Bộ luật Lao động 2019 và tạo bản nháp hợp đồng."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* BƯỚC 1: THÔNG TIN CỐT LÕI */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
              1. Thông tin chung & Pháp lý
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Nhân viên ký kết <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={employeeId}
                  onValueChange={(val) => val && setEmployeeId(val)}
                  disabled={isEdit}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Chọn nhân viên ký kết...">
                      {(val: string) => {
                        if (!val) return "Chọn nhân viên ký kết...";
                        const emp = employees.find((e) => e.id === val);
                        return emp ? `${emp.employeeCode} - ${emp.fullName}` : "Chọn nhân viên ký kết...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem
                        key={emp.id}
                        value={emp.id}
                        label={`${emp.employeeCode} - ${emp.fullName}`}
                      >
                        {emp.employeeCode} - {emp.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!isEdit && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Biểu mẫu hợp đồng áp dụng</Label>
                  <Select
                    value={templateVersionId || "default"}
                    onValueChange={(val) =>
                      setTemplateVersionId(val === "default" || !val ? undefined : val)
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Mẫu mặc định hệ thống">
                        {(val: string) => {
                          if (!val || val === "default") return "Mẫu mặc định hệ thống";
                          const tpl = templates.find((t) => t.activeVersionId === val || t.id === val);
                          return tpl ? `${tpl.templateCode} - ${tpl.name}` : "Mẫu mặc định hệ thống";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default" label="Mẫu mặc định hệ thống">
                        Mẫu mặc định hệ thống
                      </SelectItem>
                      {templates.map((tpl) => (
                        <SelectItem
                          key={tpl.id}
                          value={tpl.activeVersionId || tpl.id}
                          label={tpl.name}
                        >
                          {tpl.templateCode} - {tpl.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Số hợp đồng <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  disabled={isEdit}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Loại hợp đồng</Label>
                <Select
                  value={contractType}
                  onValueChange={(val) => val && setContractType(val as ContractType)}
                  disabled={isEdit}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Chọn loại hợp đồng">
                      {(val: string) => (val ? CONTRACT_TYPE_LABELS[val as ContractType] || val : "Chọn loại hợp đồng")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONTRACT_TYPE_LABELS).map(([k, label]) => (
                      <SelectItem key={k} value={k} label={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hình thức ký</Label>
                <Select
                  value={signingForm}
                  onValueChange={(val) => val && setSigningForm(val as SigningForm)}
                  disabled={isEdit}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Chọn hình thức ký">
                      {(val: string) => (val ? SIGNING_FORM_LABELS[val as SigningForm] || val : "Chọn hình thức ký")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SIGNING_FORM_LABELS).map(([k, label]) => (
                      <SelectItem key={k} value={k} label={label}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Ngày ký hợp đồng</Label>
                <Input
                  type="date"
                  value={signingDate}
                  onChange={(e) => setSigningDate(e.target.value)}
                  disabled={isEdit}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Ngày bắt đầu có hiệu lực <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isEdit}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Ngày kết thúc {contractType !== "INDEFINITE" && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isEdit || contractType === "INDEFINITE"}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* AI Compliance Alert */}
          {!isEdit && employeeId && startDate && (
            <Card
              className={`p-3 border text-xs ${
                complianceResult?.allowed
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300"
                  : "bg-rose-50/50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-300"
              }`}
            >
              <div className="flex items-start gap-2">
                {complianceResult?.allowed ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="font-semibold">
                    {isCheckingCompliance
                      ? "Đang đối soát Bộ luật Lao động 2019..."
                      : complianceResult?.allowed
                      ? "Hợp lệ theo Bộ luật Lao động 2019"
                      : "Cảnh báo vi phạm Bộ luật Lao động 2019"}
                  </p>
                  <p className="mt-0.5 text-[11px] opacity-90">
                    {complianceResult?.reason ||
                      "Hợp đồng đáp ứng đầy đủ quy định về thời hạn, tiền lương và số lần ký hợp đồng xác định thời hạn."}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* BƯỚC 2: TIỀN LƯƠNG & CHẾ ĐỘ PHỤ CẤP */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
              2. Tiền lương & Chế độ đãi ngộ
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Mức lương chính (VND/tháng) <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  min={0}
                  step={500000}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hình thức chi trả lương</Label>
                <Select
                  value={salaryPaymentMethod}
                  onValueChange={(val) =>
                    val && setSalaryPaymentMethod(val as SalaryPaymentMethod)
                  }
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Chọn hình thức chi trả">
                      {(val: string) =>
                        val === "BANK_TRANSFER"
                          ? "Chuyển khoản ngân hàng"
                          : val === "CASH"
                          ? "Tiền mặt trực tiếp"
                          : "Chọn hình thức chi trả"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER" label="Chuyển khoản ngân hàng">
                      Chuyển khoản ngân hàng
                    </SelectItem>
                    <SelectItem value="CASH" label="Tiền mặt trực tiếp">
                      Tiền mặt trực tiếp
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {salaryPaymentMethod === "BANK_TRANSFER" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Số tài khoản ngân hàng</Label>
                  <Input
                    placeholder="VD: 1903456789012"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tên ngân hàng & Chi nhánh</Label>
                  <Input
                    placeholder="VD: Techcombank - Chi nhánh Thăng Long"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Danh sách phụ cấp */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Các khoản phụ cấp & Trợ cấp</Label>
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
              </div>

              {allowances.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-muted/40 rounded-md border text-xs"
                >
                  <Input
                    placeholder="Tên loại phụ cấp (VD: Xăng xe)"
                    value={item.allowanceType}
                    onChange={(e) =>
                      handleUpdateAllowance(idx, "allowanceType", e.target.value)
                    }
                    className="h-8 text-xs flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Số tiền"
                    value={item.amount}
                    onChange={(e) =>
                      handleUpdateAllowance(idx, "amount", Number(e.target.value))
                    }
                    className="h-8 text-xs w-32"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleRemoveAllowance(idx)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Địa điểm làm việc</Label>
              <Input
                placeholder="VD: Tòa nhà CYCLOSA, 123 Phố Duy Tân, Cầu Giấy, Hà Nội"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Thời gian làm việc</Label>
              <Input
                value={workingTimeNote}
                onChange={(e) => setWorkingTimeNote(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Các quyền lợi & Chế độ khác</Label>
              <Textarea
                rows={2}
                placeholder="Ghi chú chế độ thưởng, đào tạo nâng cao, bảo hiểm sức khỏe cao cấp..."
                value={otherBenefits}
                onChange={(e) => setOtherBenefits(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : isEdit ? (
                "Lưu điều khoản"
              ) : (
                "Tạo bản nháp hợp đồng"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

