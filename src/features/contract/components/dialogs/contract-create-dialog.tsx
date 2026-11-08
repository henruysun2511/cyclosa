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
  useCreateContractMutation,
  useGetContractTemplatesQuery,
  useCheckContractComplianceQuery,
} from "../../api/contract-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import {
  CONTRACT_TYPE_LABELS,
  SIGNING_FORM_LABELS,
} from "../../constants/contract.constants";
import type {
  ContractType,
  SigningForm,
  SalaryPaymentMethod,
  ContractAllowance,
} from "../../types/contract.types";
import { toast } from "sonner";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  User,
} from "lucide-react";

interface ContractCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  defaultEmployeeId?: string;
  onSuccess?: () => void;
}

export function ContractCreateDialog({
  open,
  onOpenChange,
  companyId,
  defaultEmployeeId,
  onSuccess,
}: ContractCreateDialogProps) {
  const [employeeId, setEmployeeId] = useState(defaultEmployeeId || "");
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
  const [workingTimeNote, setWorkingTimeNote] = useState("44 giờ/tuần (Thứ 2 đến sáng Thứ 7)");
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

  // Signer Party A info
  const [signerAName, setSignerAName] = useState("Nguyễn Văn Giám Đốc");
  const [signerARole, setSignerARole] = useState("Tổng Giám đốc (Đại diện pháp luật)");

  // Queries
  const { data: employeesData } = useGetEmployeesQuery(
    { page: 0, size: 100 },
    { skip: !open }
  );
  const employees = employeesData?.items || [];

  const { data: templatesData } = useGetContractTemplatesQuery(
    { isActive: true, page: 0, size: 50 },
    { skip: !open }
  );
  const templates = templatesData?.items || [];

  // Legal Compliance Check API call
  const { data: complianceResult, isFetching: isCheckingCompliance } =
    useCheckContractComplianceQuery(
      { employeeId, contractType },
      { skip: !employeeId || !contractType || !open }
    );

  const [createContract, { isLoading: isCreating }] = useCreateContractMutation();

  useEffect(() => {
    if (open) {
      if (defaultEmployeeId) setEmployeeId(defaultEmployeeId);
      setContractNumber(`HDLD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`);
    }
  }, [open, defaultEmployeeId]);

  // Auto handle employee selection
  const selectedEmployee = employees.find((e) => e.id === employeeId);

  useEffect(() => {
    if (selectedEmployee) {
      if (selectedEmployee.currentBranchName) {
        setWorkLocation(selectedEmployee.currentBranchName);
      }
    }
  }, [selectedEmployee]);

  // Auto adjust for INDEFINITE contract
  useEffect(() => {
    if (contractType === "INDEFINITE") {
      setEndDate("");
    } else if (contractType === "FIXED_TERM" && !endDate) {
      const start = new Date(startDate);
      start.setFullYear(start.getFullYear() + 1);
      setEndDate(start.toISOString().split("T")[0]);
    }
  }, [contractType, startDate]);

  const handleAddAllowance = () => {
    setAllowances([
      ...allowances,
      {
        allowanceType: "",
        amount: 500000,
        isInsuranceInclusive: false,
        isTaxable: true,
      },
    ]);
  };

  const handleRemoveAllowance = (index: number) => {
    setAllowances(allowances.filter((_, i) => i !== index));
  };

  const handleAllowanceChange = (index: number, field: keyof ContractAllowance, value: any) => {
    const updated = [...allowances];
    updated[index] = { ...updated[index], [field]: value };
    setAllowances(updated);
  };

  const handleSubmit = async () => {
    if (!employeeId) {
      toast.error("Vui lòng chọn nhân viên ký hợp đồng");
      return;
    }
    if (!contractNumber.trim()) {
      toast.error("Vui lòng nhập số hợp đồng");
      return;
    }
    if (!baseSalary || baseSalary <= 0) {
      toast.error("Mức lương cơ bản phải lớn hơn 0");
      return;
    }

    if (complianceResult && !complianceResult.allowed) {
      toast.error(complianceResult.reason || "Hợp đồng không đáp ứng quy định BLLĐ 2019");
      return;
    }

    try {
      await createContract({
        companyId,
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
            signerName: selectedEmployee ? `${selectedEmployee.lastName} ${selectedEmployee.firstName}` : "Người lao động",
            signingOrder: 2,
            signingMethod: signingForm === "ELECTRONIC" ? "OTP_SMS" : "OTP_EMAIL",
          },
        ],
      }).unwrap();

      toast.success("Soạn thảo hợp đồng thành công (bản nháp)");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể khởi tạo hợp đồng");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Soạn thảo Hợp đồng Lao động mới
          </DialogTitle>
          <DialogDescription>
            Kiểm tra tính tuân thủ pháp lý theo Bộ luật Lao động 2019 và tạo bản nháp hợp đồng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Bước 1: Nhân sự & Loại hợp đồng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeSelect">
                Nhân viên ký kết <span className="text-destructive">*</span>
              </Label>
              <select
                id="employeeSelect"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeCode} - {emp.lastName} {emp.firstName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateSelect">Biểu mẫu áp dụng</Label>
              <select
                id="templateSelect"
                value={templateVersionId || ""}
                onChange={(e) => setTemplateVersionId(e.target.value || undefined)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">-- Mẫu mặc định hệ thống --</option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.activeVersionId || ""}>
                    {tpl.templateCode} - {tpl.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractNumber">
                Số hợp đồng <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contractNumber"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractType">Loại hợp đồng</Label>
              <select
                id="contractType"
                value={contractType}
                onChange={(e) => setContractType(e.target.value as ContractType)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {Object.entries(CONTRACT_TYPE_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signingForm">Hình thức ký</Label>
              <select
                id="signingForm"
                value={signingForm}
                onChange={(e) => setSigningForm(e.target.value as SigningForm)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {Object.entries(SIGNING_FORM_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cảnh báo Tuân thủ Pháp lý BLLĐ 2019 (Legal Compliance) */}
          {employeeId && complianceResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                complianceResult.allowed
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                  : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
              }`}
            >
              {complianceResult.allowed ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  {complianceResult.allowed
                    ? "Đạt chuẩn tuân thủ Bộ luật Lao động 2019"
                    : "Cảnh báo vi phạm Bộ luật Lao động 2019"}
                </p>
                <p>{complianceResult.reason}</p>
                <p className="text-[11px] opacity-80">
                  Số lần đã ký HĐ xác định thời hạn trước đó:{" "}
                  <strong>{complianceResult.previousFixedTermContractsCount} lần</strong>.
                  {complianceResult.requiresIndefinite &&
                    " -> Lần ký này bắt buộc chuyển sang HĐ KHÔNG XÁC ĐỊNH THỜI HẠN."}
                </p>
              </div>
            </div>
          )}

          {/* Thời hạn hợp đồng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signingDate">Ngày giao kết (ký)</Label>
              <Input
                id="signingDate"
                type="date"
                value={signingDate}
                onChange={(e) => setSigningDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Ngày bắt đầu hiệu lực <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                Ngày hết hạn {contractType !== "INDEFINITE" && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={contractType === "INDEFINITE"}
                placeholder={contractType === "INDEFINITE" ? "Không xác định thời hạn" : ""}
              />
            </div>
          </div>

          <Separator />

          {/* Lương & Thu nhập */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              Lương cơ bản & Các khoản Phụ cấp
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseSalary">
                  Lương cơ bản (VNĐ/tháng) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="baseSalary"
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryPaymentMethod">Hình thức trả lương</Label>
                <select
                  id="salaryPaymentMethod"
                  value={salaryPaymentMethod}
                  onChange={(e) => setSalaryPaymentMethod(e.target.value as SalaryPaymentMethod)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                  <option value="CASH">Tiền mặt</option>
                  <option value="OTHER">Hình thức khác</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workLocation">Địa điểm làm việc</Label>
                <Input
                  id="workLocation"
                  placeholder="Văn phòng trụ sở / Chi nhánh..."
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Bảng phụ cấp */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground uppercase">
                  Danh mục phụ cấp hàng tháng ({allowances.length})
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleAddAllowance}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm phụ cấp
                </Button>
              </div>

              <div className="space-y-2">
                {allowances.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center gap-2 bg-muted/30 p-2 rounded-lg border text-xs"
                  >
                    <Input
                      placeholder="Tên phụ cấp (Ăn trưa, Xăng xe...)"
                      value={item.allowanceType}
                      onChange={(e) =>
                        handleAllowanceChange(index, "allowanceType", e.target.value)
                      }
                      className="h-8 text-xs flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Số tiền (VNĐ)"
                      value={item.amount}
                      onChange={(e) =>
                        handleAllowanceChange(index, "amount", Number(e.target.value))
                      }
                      className="h-8 text-xs w-36"
                    />
                    <label className="flex items-center gap-1.5 shrink-0 px-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isInsuranceInclusive}
                        onChange={(e) =>
                          handleAllowanceChange(index, "isInsuranceInclusive", e.target.checked)
                        }
                      />
                      Đóng BH
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleRemoveAllowance(index)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Cấu hình người ký Bên A */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Đại diện Người sử dụng lao động (Bên A)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signerAName">Họ tên người đại diện ký</Label>
                <Input
                  id="signerAName"
                  value={signerAName}
                  onChange={(e) => setSignerAName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signerARole">Chức danh / Thẩm quyền ký</Label>
                <Input
                  id="signerARole"
                  value={signerARole}
                  onChange={(e) => setSignerARole(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || (complianceResult && !complianceResult.allowed)}
          >
            {isCreating ? "Đang lưu..." : "Lưu bản nháp hợp đồng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

