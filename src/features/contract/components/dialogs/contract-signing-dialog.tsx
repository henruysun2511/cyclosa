import React, { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useGetContractSignersQuery,
  useResendSignerOtpMutation,
  useVerifySignerAuditMutation,
  useSignMyContractMutation,
  useRequestMyContractOtpMutation,
} from "../../api/contract-api";
import { SignerStatusBadge } from "../contract-status-badge";
import { toast } from "sonner";
import {
  FileSignature,
  ShieldCheck,
  Send,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";

interface ContractSigningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  contractNumber: string;
  isSelfSigning?: boolean;
  onSuccess?: () => void;
}

export function ContractSigningDialog({
  open,
  onOpenChange,
  contractId,
  contractNumber,
  isSelfSigning = false,
  onSuccess,
}: ContractSigningDialogProps) {
  const [otpCode, setOtpCode] = useState("");
  const [auditResult, setAuditResult] = useState<any>(null);

  const { data: signers = [], refetch } = useGetContractSignersQuery(contractId, {
    skip: !open,
  });

  const [resendOtp, { isLoading: isResending }] = useResendSignerOtpMutation();
  const [verifyAudit, { isLoading: isVerifying }] = useVerifySignerAuditMutation();
  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestMyContractOtpMutation();
  const [signContract, { isLoading: isSigning }] = useSignMyContractMutation();

  const handleResendOtp = async (signerId: string) => {
    try {
      const res = await resendOtp(signerId).unwrap();
      toast.success(res.message || "Đã gửi lại mã OTP ký số thành công");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể gửi mã OTP");
    }
  };

  const handleVerifyAudit = async (signerId: string) => {
    try {
      const res = await verifyAudit(signerId).unwrap();
      setAuditResult(res);
      if (res.valid) {
        toast.success("Xác thực tính toàn vẹn chữ ký số thành công!");
      } else {
        toast.warning(res.message || "Phát hiện bất thường về chữ ký");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Kiểm toán chữ ký thất bại");
    }
  };

  const handleRequestMyOtp = async () => {
    try {
      const res = await requestOtp(contractId).unwrap();
      toast.success(res.message || "Mã OTP ký số đã được gửi qua Email / SMS");
    } catch (err: any) {
      toast.error(err?.data?.message || "Yêu cầu mã OTP thất bại");
    }
  };

  const handleSelfSign = async () => {
    if (!otpCode || otpCode.length < 4) {
      toast.error("Vui lòng nhập mã OTP xác thực hợp lệ");
      return;
    }

    try {
      await signContract({
        contractId,
        body: { otpCode: otpCode.trim() },
      }).unwrap();

      toast.success("Ký điện tử hợp đồng thành công!");
      setOtpCode("");
      refetch();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Xác thực chữ ký số thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-primary" />
            Tiến độ Ký số Điện tử & Kiểm toán (E-Contract)
          </DialogTitle>
          <DialogDescription>
            Hợp đồng số: <strong>{contractNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Danh sách người ký */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Danh sách các bên tham gia ký kết ({signers.length})
            </h4>

            <div className="space-y-2.5">
              {signers.map((signer) => (
                <Card key={signer.id} className="border-border/60">
                  <CardContent className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{signer.signerName}</span>
                        <Badge variant="outline" className="text-xs">
                          {signer.side === "PARTY_A" ? "Bên A (Công ty)" : "Bên B (Người lao động)"}
                        </Badge>
                        <SignerStatusBadge status={signer.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {signer.signerRoleTitle || "Đại diện ký kết"} • {signer.signingMethod}
                        {signer.signerEmail && ` • ${signer.signerEmail}`}
                      </p>
                      {signer.signedAt && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã ký lúc: {new Date(signer.signedAt).toLocaleString("vi-VN")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {signer.status !== "SIGNED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => handleResendOtp(signer.id)}
                          disabled={isResending}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Gửi lại OTP
                        </Button>
                      )}
                      {signer.status === "SIGNED" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => handleVerifyAudit(signer.id)}
                          disabled={isVerifying}
                        >
                          <Fingerprint className="w-3.5 h-3.5" />
                          Kiểm toán băm
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {signers.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  Chưa có thông tin danh sách người ký cho hợp đồng này.
                </p>
              )}
            </div>
          </div>

          {/* Kết quả kiểm toán SHA-256 */}
          {auditResult && (
            <Card className="border-border/60 bg-muted/40">
              <CardContent className="p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-primary" />
                    Kết quả kiểm toán toàn vẹn chữ ký số
                  </span>
                  <Badge variant={auditResult.valid ? "default" : "destructive"}>
                    {auditResult.valid ? "Toàn vẹn (Valid)" : "Bị thay đổi (Tampered)"}
                  </Badge>
                </div>
                {auditResult.fileHashSha256 && (
                  <div>
                    <span className="text-muted-foreground">Mã băm SHA-256 lưu trữ:</span>
                    <p className="font-mono text-[11px] break-all bg-background p-1.5 rounded border mt-0.5">
                      {auditResult.fileHashSha256}
                    </p>
                  </div>
                )}
                {auditResult.message && (
                  <p className="text-muted-foreground">{auditResult.message}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Phần ký số trực tiếp (Self-signing hoặc Test Ký) */}
          {isSelfSigning && (
            <>
              <Separator />
              <div className="space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/20">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <KeyRound className="w-4 h-4" />
                  Xác nhận Ký số Điện tử
                </h4>
                <p className="text-xs text-muted-foreground">
                  Bằng việc nhập mã OTP và xác nhận, bạn cam kết đã đọc, hiểu rõ và đồng ý
                  với mọi điều khoản được nêu trong hợp đồng lao động này.
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestMyOtp}
                    disabled={isRequestingOtp}
                  >
                    {isRequestingOtp ? "Đang gửi..." : "1. Lấy mã OTP"}
                  </Button>
                  <div className="flex-1">
                    <Input
                      placeholder="Nhập mã OTP 6 số"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={8}
                      className="font-mono tracking-widest text-center"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSelfSign}
                    disabled={isSigning || !otpCode}
                  >
                    {isSigning ? "Đang ký..." : "2. Xác nhận Ký"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

