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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { usePlaceLegalHoldMutation } from '../api/digital-records-api';
import type { DocumentSummary, LegalHoldReason } from '../types/digital-records.types';

interface ModalProps {
  document: DocumentSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const REASON_LABELS: Record<LegalHoldReason, string> = {
  DISPUTE: 'Tranh chấp lao động (Tòa án / Trọng tài)',
  AUDIT: 'Kiểm toán nhà nước / Kiểm toán nội bộ',
  INSPECTION: 'Thanh tra chuyên ngành Bộ/Sở LĐTBXH',
  LEGAL_REQUEST: 'Yêu cầu từ Cơ quan điều tra / Pháp chế',
  OTHER: 'Lý do bảo vệ khẩn cấp khác',
};

export function PlaceHoldModal({ document, open, onOpenChange, onSuccess }: ModalProps) {
  const [reason, setReason] = useState<LegalHoldReason>('DISPUTE');
  const [note, setNote] = useState('');
  const [placeHoldMutation, { isLoading }] = usePlaceLegalHoldMutation();

  const handlePlaceHold = async () => {
    if (!document || !note.trim()) return;

    try {
      await placeHoldMutation({
        documentId: document.id,
        data: { reason, note: note.trim() },
      }).unwrap();

      toast.success("Ban hành lệnh tạm giữ pháp lý thành công!");
      onOpenChange(false);
      setNote('');
      if (onSuccess) onSuccess();
    } catch (err) {
      showApiErrorToast(err, "Không thể ban hành lệnh tạm giữ pháp lý. Vui lòng thử lại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-rose-600">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>Ban hành Lệnh Tạm giữ Pháp lý</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Khóa tối cao ngăn chặn mọi hành vi tiêu hủy hồ sơ
          </DialogDescription>
        </DialogHeader>

        {document && (
          <div className="space-y-4 py-2">
            <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-rose-900">{document.title}</div>
              <div className="text-rose-700 font-mono">Mã: {document.documentCode}</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-semibold">
                Lý do tạm giữ *
              </Label>
              <Select value={reason} onValueChange={(val) => setReason(val as LegalHoldReason)}>
                <SelectTrigger id="reason" className="h-9 text-xs">
                  <SelectValue placeholder="Chọn lý do tạm giữ">
                    {reason ? REASON_LABELS[reason] : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DISPUTE">Tranh chấp lao động (Tòa án / Trọng tài)</SelectItem>
                  <SelectItem value="AUDIT">Kiểm toán nhà nước / Kiểm toán nội bộ</SelectItem>
                  <SelectItem value="INSPECTION">Thanh tra chuyên ngành Bộ/Sở LĐTBXH</SelectItem>
                  <SelectItem value="LEGAL_REQUEST">Yêu cầu từ Cơ quan điều tra / Pháp chế</SelectItem>
                  <SelectItem value="OTHER">Lý do bảo vệ khẩn cấp khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-xs font-semibold">
                Ghi chú chi tiết vụ việc / Căn cứ văn bản *
              </Label>
              <Textarea
                id="note"
                rows={3}
                placeholder="Nhập số văn bản yêu cầu, số thụ lý vụ án hoặc nội dung cuộc kiểm toán..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Khi lệnh tạm giữ có hiệu lực, tài liệu sẽ bị loại bỏ hoàn toàn khỏi tất cả các đề xuất tiêu hủy, kể cả khi đã hết hạn lưu trữ theo chính sách.
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handlePlaceHold}
            disabled={!note.trim() || isLoading}
            className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
          >
            <ShieldAlert className="h-4 w-4" />
            {isLoading ? 'Đang thực hiện...' : 'Xác nhận Ban hành'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
