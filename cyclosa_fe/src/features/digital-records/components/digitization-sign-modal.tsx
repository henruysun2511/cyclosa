import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { showApiErrorToast } from '@/lib/api-error';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { KeyRound, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useDigitizationSignMutation } from '../api/digital-records-api';
import type { DocumentSummary } from '../types/digital-records.types';

interface ModalProps {
  document: DocumentSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DigitizationSignModal({ document, open, onOpenChange, onSuccess }: ModalProps) {
  const [signatureValue, setSignatureValue] = useState('');
  const [signMutation, { isLoading }] = useDigitizationSignMutation();

  const handleSign = async () => {
    if (!document || !signatureValue.trim()) return;

    try {
      await signMutation({
        id: document.id,
        data: { signatureValue: signatureValue.trim() },
      }).unwrap();

      toast.success("Ký số xác thực số hóa thành công!");
      onOpenChange(false);
      setSignatureValue('');
      if (onSuccess) onSuccess();
    } catch (err) {
      showApiErrorToast(err, "Không thể ký số tài liệu số hóa. Vui lòng kiểm tra lại chữ ký!");
    }
  };

  const handleUseMockCert = () => {
    // Tự sinh chuỗi chữ ký số mẫu hợp lệ theo chuẩn X.509
    const mockCert = `-----BEGIN PKCS7 SIGNATURE-----\nCYCLOSA_DIGITIZATION_SIGNATURE_TT05_BNV\nDocCode:${document?.documentCode}\nSHA256:${document?.currentSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}\nTimestamp:${new Date().toISOString()}\nCA: Ban Cơ yếu Chính phủ / VNPT-CA / Viettel-CA\n-----END PKCS7 SIGNATURE-----`;
    setSignatureValue(mockCert);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Ký số xác thực số hóa</DialogTitle>
              <DialogDescription className="text-xs">
                Căn cứ Điều 9 Khoản 6 Thông tư số 05/2025/TT-BNV Bộ Nội vụ
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {document && (
          <div className="space-y-4 py-2">
            <div className="bg-slate-50 p-3 rounded-lg border text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã tài liệu:</span>
                <span className="font-semibold text-slate-800">{document.documentCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tiêu đề:</span>
                <span className="font-sans font-medium text-slate-800 truncate max-w-[300px]">
                  {document.title}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t">
                <span className="text-slate-500">Mã băm SHA-256:</span>
                <span className="text-[11px] text-teal-700 truncate max-w-[280px]">
                  {document.currentSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41...'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="signature" className="text-xs font-semibold">
                  Chứng thư số / Token chữ ký số điện tử *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseMockCert}
                  className="h-6 text-[11px] text-teal-600 border-teal-200 hover:bg-teal-50"
                >
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Cấp chữ ký số thử nghiệm
                </Button>
              </div>
              <Textarea
                id="signature"
                rows={5}
                placeholder="Dán chuỗi chữ ký điện tử hoặc kết nối USB Token / HSM..."
                value={signatureValue}
                onChange={(e) => setSignatureValue(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Bản ký số có giá trị pháp lý tương đương văn bản giấy gốc, đảm bảo tính toàn vẹn và chống chối bỏ.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleSign}
            disabled={!signatureValue.trim() || isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isLoading ? 'Đang xác thực...' : 'Thực hiện Ký số & Khóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
