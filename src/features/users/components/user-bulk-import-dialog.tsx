"use client";

import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useBulkCreateUsersMutation } from "../api/user-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface PreviewRow {
  id: string;
  username: string;
  email: string;
  error?: string | null;
}

export interface UserBulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,50}$/;

export function UserBulkImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: UserBulkImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const [bulkCreateUsers, { isLoading }] = useBulkCreateUsersMutation();

  useEffect(() => {
    if (open) {
      setRows([]);
      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  // Thẩm định danh sách dòng
  const validateRows = (currentRows: PreviewRow[]): PreviewRow[] => {
    const emailCount: Record<string, number> = {};

    currentRows.forEach((row) => {
      const cleanEmail = row.email.trim().toLowerCase();
      if (cleanEmail) {
        emailCount[cleanEmail] = (emailCount[cleanEmail] || 0) + 1;
      }
    });

    return currentRows.map((row) => {
      const email = row.email.trim();
      const username = row.username.trim();

      if (!email) {
        return { ...row, error: "Email không được để trống" };
      }

      if (!EMAIL_REGEX.test(email)) {
        return { ...row, error: "Định dạng email không hợp lệ" };
      }

      if (emailCount[email.toLowerCase()] > 1) {
        return { ...row, error: "Email bị trùng lặp" };
      }

      if (username && !USERNAME_REGEX.test(username)) {
        return { ...row, error: "Tên đăng nhập từ 3-50 ký tự (chữ, số, _.-)" };
      }

      return { ...row, error: null };
    });
  };

  // Đọc file Excel / CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

        if (!rawJson || rawJson.length === 0) {
          toast.error("Tệp rỗng", {
            description: "Không tìm thấy dữ liệu trong tệp bảng tính vừa chọn.",
          });
          return;
        }

        const parsedRows: PreviewRow[] = rawJson.map((row, index) => {
          let emailVal = "";
          let usernameVal = "";

          for (const key of Object.keys(row)) {
            const lowerKey = key.toLowerCase();
            const val = String(row[key] || "").trim();

            if (lowerKey.includes("email") || lowerKey.includes("hòm thư") || lowerKey.includes("thư điện tử")) {
              emailVal = val;
            } else if (lowerKey.includes("user") || lowerKey.includes("tên đăng nhập") || lowerKey.includes("tài khoản")) {
              usernameVal = val;
            }
          }

          if (!emailVal && !usernameVal) {
            const values = Object.values(row).map((v) => String(v || "").trim());
            usernameVal = values[0] || "";
            emailVal = values[1] || "";
          }

          return {
            id: `row-${Date.now()}-${index}`,
            username: usernameVal,
            email: emailVal,
            error: null,
          };
        });

        const validated = validateRows(parsedRows);
        setRows(validated);

        const invalidCount = validated.filter((r) => !!r.error).length;
        if (invalidCount > 0) {
          toast.warning(`Đã đọc ${validated.length} dòng. Có ${invalidCount} dòng cần chỉnh sửa.`);
        } else {
          toast.success(`Đã đọc thành công ${validated.length} dòng dữ liệu.`);
        }
      } catch {
        toast.error("Không thể đọc tệp. Vui lòng kiểm tra định dạng tệp Excel/CSV.");
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleCellChange = (id: string, field: "username" | "email", value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleBlurRow = () => {
    setRows((prev) => validateRows(prev));
  };

  const handleDeleteRow = (id: string) => {
    setRows((prev) => {
      const updated = prev.filter((row) => row.id !== id);
      return validateRows(updated);
    });
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random()}`,
        username: "",
        email: "",
        error: "Email không được để trống",
      },
    ]);
  };

  const handleDownloadTemplate = () => {
    const sampleData = [
      { "Tên đăng nhập (username)": "an.nguyen", "Email nhân viên (email)": "an.nguyen@cyclosa.vn" },
      { "Tên đăng nhập (username)": "binh.tran", "Email nhân viên (email)": "binh.tran@cyclosa.vn" },
      { "Tên đăng nhập (username)": "cuong.le", "Email nhân viên (email)": "cuong.le@cyclosa.vn" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    worksheet["!cols"] = [{ wch: 30 }, { wch: 35 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TaiKhoanMau");
    XLSX.writeFile(workbook, "CYCLOSA_Mau_Import_Tai_Khoan.xlsx");
    toast.info("Đã tải xuống tệp mẫu Excel");
  };

  const validRows = rows.filter((r) => !r.error);
  const invalidRows = rows.filter((r) => !!r.error);

  const executeSave = async (itemsToSave: PreviewRow[]) => {
    try {
      const payload = {
        users: itemsToSave.map((r) => ({
          username: r.username.trim() || undefined,
          email: r.email.trim(),
        })),
      };

      const res = await bulkCreateUsers(payload).unwrap();
      const { totalCreated, totalSkipped, errors } = res.data;

      if (totalSkipped > 0 && errors && errors.length > 0) {
        toast.warning(
          `Đã tạo ${totalCreated} tài khoản. Bỏ qua ${totalSkipped} dòng (đã tồn tại trong CSDL).`
        );
      } else {
        toast.success(`Đã tạo mới ${totalCreated} tài khoản thành công.`);
      }

      onOpenChange(false);
      onSuccess?.();
      setRows([]);
      setFileName(null);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error(errorObj?.data?.message || "Không thể lưu dữ liệu hàng loạt. Vui lòng thử lại.");
    }
  };

  const handlePreSave = () => {
    const currentValidated = validateRows(rows);
    setRows(currentValidated);

    const valid = currentValidated.filter((r) => !r.error);
    const invalid = currentValidated.filter((r) => !!r.error);

    if (currentValidated.length === 0) {
      toast.error("Vui lòng chọn tệp Excel hoặc thêm dòng tài khoản.");
      return;
    }

    if (valid.length === 0) {
      toast.error("Không có dòng hợp lệ để lưu. Vui lòng sửa lại các dòng lỗi.");
      return;
    }

    // Nếu còn dòng lỗi, bật confirm theo yêu cầu
    if (invalid.length > 0) {
      const confirmed = window.confirm(
        `Danh sách có ${invalid.length} dòng dữ liệu bị lỗi hoặc thiếu email.\n\nSẽ không lưu những dòng bị lỗi. Bạn có chắc chắn muốn tiếp tục lưu ${valid.length} tài khoản hợp lệ còn lại không?`
      );
      if (!confirmed) return;
    }

    executeSave(valid);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-6 gap-0 rounded-2xl border-border bg-card shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                Nhập tài khoản hàng loạt
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Tải lên tệp Excel/CSV để tạo tài khoản và gửi liên kết kích hoạt 48 giờ
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4 pb-1">
          {/* Tải tệp Excel / CSV */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="excel-file" className="text-xs font-semibold text-foreground">
                Chọn tệp bảng tính <span className="text-destructive">*</span>
              </Label>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" />
                Tải file mẫu Excel
              </button>
            </div>
            <Input
              id="excel-file"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={isLoading}
              className="h-9 text-xs rounded-lg border-input bg-background cursor-pointer file:text-xs file:font-medium file:text-foreground file:bg-muted file:border-0 file:rounded file:px-2 file:py-0.5 file:mr-2"
            />
            {fileName && (
              <p className="text-[11px] text-muted-foreground">
                Tệp đã chọn: <strong className="text-foreground">{fileName}</strong>
              </p>
            )}
          </div>

          {/* Danh sách tài khoản xem trước */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-semibold text-foreground">
                  Danh sách tài khoản ({rows.length})
                </Label>
                {invalidRows.length > 0 && (
                  <span className="text-[11px] text-destructive font-medium">
                    ({invalidRows.length} dòng lỗi)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Thêm dòng
              </button>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-2 max-h-56 overflow-y-auto">
              {rows.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Chưa có dữ liệu. Vui lòng chọn tệp Excel hoặc bấm "Thêm dòng".
                </p>
              ) : (
                rows.map((row, idx) => (
                  <div
                    key={row.id}
                    className={`p-2 rounded-lg border bg-background space-y-1.5 ${
                      row.error ? "border-destructive/60" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground w-5 text-center shrink-0">
                        #{idx + 1}
                      </span>
                      <Input
                        value={row.username}
                        onChange={(e) => handleCellChange(row.id, "username", e.target.value)}
                        onBlur={handleBlurRow}
                        placeholder="Username (tự sinh từ email)"
                        className="h-8 text-xs font-mono rounded-lg border-input bg-background flex-1"
                      />
                      <Input
                        value={row.email}
                        onChange={(e) => handleCellChange(row.id, "email", e.target.value)}
                        onBlur={handleBlurRow}
                        placeholder="Email *"
                        className={`h-8 text-xs rounded-lg bg-background flex-1 ${
                          row.error ? "border-destructive text-destructive font-medium" : "border-input"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded cursor-pointer shrink-0"
                        title="Xóa dòng"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {row.error && (
                      <p className="text-[11px] text-destructive font-medium pl-7 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {row.error}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Có thể chỉnh sửa trực tiếp tên đăng nhập và email trước khi lưu vào hệ thống.
            </p>
          </div>

          <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-xs font-medium cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isLoading || rows.length === 0}
              onClick={handlePreSave}
              className="h-9 px-4 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              <span>
                Lưu tài khoản ({validRows.length}/{rows.length})
              </span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
