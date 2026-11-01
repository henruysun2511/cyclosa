"use client";

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Save,
  FileText,
} from "lucide-react";

import { useBulkCreateUsersMutation } from "../api/user-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [bulkCreateUsers, { isLoading }] = useBulkCreateUsersMutation();

  // Reset dữ liệu khi mở lại dialog
  React.useEffect(() => {
    if (open) {
      setRows([]);
      setFileName(null);
      setConfirmOpen(false);
    }
  }, [open]);

  // Thẩm định (validate) danh sách
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
        return { ...row, error: "Email bị trùng lặp trong danh sách" };
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
          toast.warning("Đã tải dữ liệu", {
            description: `Đọc được ${validated.length} dòng. Có ${invalidCount} dòng cần chỉnh sửa.`,
          });
        } else {
          toast.success("Tải dữ liệu thành công", {
            description: `Đã đọc toàn bộ ${validated.length} dòng dữ liệu hợp lệ.`,
          });
        }
      } catch {
        toast.error("Không thể đọc tệp", {
          description: "Vui lòng kiểm tra định dạng tệp Excel/CSV và thử lại.",
        });
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  // Cập nhật ô input trực tiếp trên bảng
  const handleCellChange = (id: string, field: "username" | "email", value: string) => {
    setRows((prev) => {
      const updated = prev.map((row) => (row.id === id ? { ...row, [field]: value } : row));
      return validateRows(updated);
    });
  };

  // Xóa một dòng
  const handleDeleteRow = (id: string) => {
    setRows((prev) => {
      const updated = prev.filter((row) => row.id !== id);
      return validateRows(updated);
    });
  };

  // Thêm dòng mới thủ công
  const handleAddRow = () => {
    setRows((prev) => {
      const newRow: PreviewRow = {
        id: `row-${Date.now()}-${Math.random()}`,
        username: "",
        email: "",
        error: "Email không được để trống",
      };
      return [...prev, newRow];
    });
  };

  // Tải file mẫu Excel
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

  // Tiến hành lưu tài khoản qua API
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
        toast.warning("Hoàn tất nhập tài khoản", {
          description: `Đã tạo ${totalCreated} tài khoản. Bỏ qua ${totalSkipped} dòng (đã tồn tại trong CSDL).`,
        });
      } else {
        toast.success("Nhập hàng loạt thành công", {
          description: `Đã tạo mới ${totalCreated} tài khoản và gửi mã kích hoạt 48h qua email.`,
        });
      }

      onOpenChange(false);
      onSuccess?.();
      setRows([]);
      setFileName(null);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error("Lỗi khi lưu tài khoản", {
        description: errorObj?.data?.message || "Không thể lưu dữ liệu hàng loạt. Vui lòng thử lại.",
      });
    }
  };

  const handlePreSave = () => {
    if (rows.length === 0) {
      toast.error("Chưa có dữ liệu", {
        description: "Vui lòng tải lên tệp Excel/CSV hoặc thêm dòng tài khoản.",
      });
      return;
    }

    if (validRows.length === 0) {
      toast.error("Không có dòng hợp lệ", {
        description: "Toàn bộ các dòng hiện tại đều đang có lỗi. Vui lòng kiểm tra và sửa lại.",
      });
      return;
    }

    // Nếu còn dòng lỗi, bật Confirm cảnh báo theo đúng yêu cầu
    if (invalidRows.length > 0) {
      setConfirmOpen(true);
    } else {
      executeSave(validRows);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[850px] p-6 gap-0 rounded-2xl border-border bg-card shadow-2xl flex flex-col max-h-[85vh]">
          {/* Header chuẩn design system codebase */}
          <DialogHeader className="space-y-3 pb-4 border-b border-border/60">
            <div className="flex items-center justify-between gap-4 pr-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shrink-0">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                    Nhập tài khoản hàng loạt
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Tải lên file Excel (.xlsx, .xls, .csv), xem trước và điều chỉnh danh sách trước khi tạo
                  </DialogDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="h-8.5 px-3 rounded-lg border-input text-xs font-medium hover:bg-muted/80 gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5 text-primary" />
                <span>Tải file mẫu Excel</span>
              </Button>
            </div>
          </DialogHeader>

          {/* Vùng nội dung Body */}
          <div className="flex-1 flex flex-col min-h-0 py-4">
            {rows.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="my-auto border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/15 hover:bg-muted/30 transition-all cursor-pointer text-center group"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Nhấp để tải lên hoặc kéo thả tệp Excel vào đây
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Định dạng hỗ trợ: Microsoft Excel (.xlsx, .xls) hoặc CSV (.csv)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                {/* Thanh trạng thái dữ liệu & nút phụ */}
                <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/60">
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate max-w-[200px]">{fileName || "Dữ liệu bảng tính"}</span>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-medium rounded-md px-2 py-0.5">
                      Tổng: {rows.length} dòng
                    </Badge>
                    <Badge variant="outline" className="text-[11px] font-medium rounded-md px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      Hợp lệ: {validRows.length}
                    </Badge>
                    {invalidRows.length > 0 && (
                      <Badge variant="destructive" className="text-[11px] font-medium rounded-md px-2 py-0.5">
                        Lỗi/Thiếu: {invalidRows.length}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-2.5 rounded-lg border-input text-xs font-medium hover:bg-muted/80 gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>Nạp tệp khác</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddRow}
                      className="h-8 px-2.5 rounded-lg text-xs font-medium gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Thêm dòng</span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Bảng Editable Table có scrollbar */}
                <div className="flex-1 overflow-auto rounded-xl border border-border bg-card shadow-xs min-h-[220px] max-h-[360px]">
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/40 sticky top-0 z-10">
                      <TableRow className="hover:bg-transparent border-b border-border">
                        <TableHead className="w-12 text-center text-xs font-semibold text-muted-foreground">
                          STT
                        </TableHead>
                        <TableHead className="w-56 text-xs font-semibold text-muted-foreground">
                          Tên đăng nhập (Username)
                        </TableHead>
                        <TableHead className="min-w-[240px] text-xs font-semibold text-muted-foreground">
                          Địa chỉ Email <span className="text-destructive">*</span>
                        </TableHead>
                        <TableHead className="min-w-[200px] text-xs font-semibold text-muted-foreground">
                          Trạng thái thẩm định
                        </TableHead>
                        <TableHead className="w-12 text-center text-xs font-semibold text-muted-foreground">
                          Xóa
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, idx) => (
                        <TableRow
                          key={row.id}
                          className={row.error ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/30"}
                        >
                          <TableCell className="text-center text-muted-foreground font-mono text-[11px]">
                            {idx + 1}
                          </TableCell>
                          <TableCell>
                            <Input
                              value={row.username}
                              onChange={(e) => handleCellChange(row.id, "username", e.target.value)}
                              placeholder="Tự sinh nếu trống"
                              className="h-8 text-xs font-mono rounded-lg border-input bg-background focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={row.email}
                              onChange={(e) => handleCellChange(row.id, "email", e.target.value)}
                              placeholder="nhanvien@cyclosa.vn"
                              className={`h-8 text-xs rounded-lg bg-background focus-visible:ring-1 ${
                                row.error
                                  ? "border-destructive focus-visible:ring-destructive text-destructive font-medium"
                                  : "border-input"
                              }`}
                            />
                          </TableCell>
                          <TableCell>
                            {row.error ? (
                              <span className="inline-flex items-center gap-1.5 text-destructive font-medium text-[11px]">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                <span>{row.error}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-medium text-[11px]">
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                <span>Hợp lệ</span>
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRow(row.id)}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                              title="Xóa dòng này"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {/* Footer chuẩn codebase */}
          <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-9 px-4 rounded-lg border-input text-xs font-medium hover:bg-muted/80 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isLoading || rows.length === 0}
              onClick={handlePreSave}
              className="h-9 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang xử lý tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>
                    Lưu danh sách ({validRows.length}/{rows.length} tài khoản)
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog xác nhận khi còn dòng bị lỗi chuẩn design system */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-[440px] rounded-2xl border-border bg-card p-6 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 pb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <AlertDialogTitle className="text-base font-semibold text-foreground">
                  Xác nhận bỏ qua dòng lỗi
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Hệ thống phát hiện dữ liệu chưa hoàn thiện
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div className="text-xs text-muted-foreground space-y-2.5 py-3">
            <p>
              Danh sách hiện có <strong className="text-destructive font-semibold">{invalidRows.length}</strong> dòng bị lỗi hoặc thiếu email.
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
              ⚠️ <strong>Sẽ không lưu những dòng bị lỗi</strong>. Hệ thống chỉ tiến hành tạo <strong>{validRows.length}</strong> tài khoản hợp lệ.
            </div>
          </div>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-8.5 text-xs rounded-lg cursor-pointer">
              Quay lại chỉnh sửa
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                executeSave(validRows);
              }}
              className="h-8.5 text-xs rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
            >
              Đồng ý, chỉ lưu {validRows.length} tài khoản
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
