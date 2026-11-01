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
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,50}$/;

export function UserBulkImportDialog({
  open,
  onOpenChange,
}: UserBulkImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [bulkCreateUsers, { isLoading }] = useBulkCreateUsersMutation();

  // Hàm thẩm định (validate) toàn bộ danh sách dòng
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
        return { ...row, error: "Email bị trùng lặp trong file" };
      }

      if (username && !USERNAME_REGEX.test(username)) {
        return { ...row, error: "Tên đăng nhập từ 3-50 ký tự (chữ, số, _.-)" };
      }

      return { ...row, error: null };
    });
  };

  // Đọc file Excel / CSV khi người dùng chọn
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
            description: "Không tìm thấy dữ liệu trong tệp bảng tính.",
          });
          return;
        }

        const parsedRows: PreviewRow[] = rawJson.map((row, index) => {
          let emailVal = "";
          let usernameVal = "";

          // Tìm cột tương ứng (không phân biệt hoa thường)
          for (const key of Object.keys(row)) {
            const lowerKey = key.toLowerCase();
            const val = String(row[key] || "").trim();

            if (lowerKey.includes("email") || lowerKey.includes("hòm thư") || lowerKey.includes("thư điện tử")) {
              emailVal = val;
            } else if (lowerKey.includes("user") || lowerKey.includes("tên đăng nhập") || lowerKey.includes("tài khoản")) {
              usernameVal = val;
            }
          }

          // Fallback nếu người dùng đặt tên cột là Cột 1, Cột 2
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
      } catch (err) {
        toast.error("Không thể đọc tệp", {
          description: "Vui lòng kiểm tra định dạng tệp Excel/CSV và thử lại.",
        });
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  // Cập nhật giá trị ô input trực tiếp trên bảng
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
    // Chỉnh độ rộng cột
    worksheet["!cols"] = [{ wch: 30 }, { wch: 35 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TaiKhoanMau");
    XLSX.writeFile(workbook, "CYCLOSA_Mau_Import_Tai_Khoan.xlsx");
    toast.info("Đã tải xuống tệp mẫu Excel");
  };

  const validRows = rows.filter((r) => !r.error);
  const invalidRows = rows.filter((r) => !!r.error);

  // Tiến hành gửi API lưu tài khoản
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
          description: `Đã tạo thành công ${totalCreated} tài khoản. Bỏ qua ${totalSkipped} dòng (đã tồn tại trong CSDL).`,
        });
      } else {
        toast.success("Nhập hàng loạt thành công", {
          description: `Đã tạo mới ${totalCreated} tài khoản và gửi mã kích hoạt 48h qua email.`,
        });
      }

      onOpenChange(false);
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

    // Nếu còn dòng lỗi, bật Confirm cảnh báo
    if (invalidRows.length > 0) {
      setConfirmOpen(true);
    } else {
      executeSave(validRows);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4 pr-6">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <DialogTitle className="text-base font-bold">
                  Nhập tài khoản hàng loạt từ tệp Excel
                </DialogTitle>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="h-8 text-xs gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Tải file mẫu Excel</span>
              </Button>
            </div>
            <DialogDescription className="text-xs">
              Tải lên tệp .xlsx, .xls hoặc .csv. Bạn có thể xem trước, trực tiếp điền bổ sung hoặc chỉnh sửa các dòng trước khi lưu.
            </DialogDescription>
          </DialogHeader>

          {/* Khu vực Upload Kéo thả File */}
          {rows.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="my-4 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer text-center"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Nhấp để tải lên hoặc kéo thả tệp Excel vào đây
                </p>
                <p className="text-xs text-muted-foreground mt-1">
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
            <div className="flex-1 flex flex-col min-h-0 my-3 space-y-3">
              {/* Thống kê dòng & nút thao tác phụ */}
              <div className="flex items-center justify-between text-xs bg-muted/30 p-2.5 rounded-lg border border-border/60">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    {fileName || "Tệp đã nạp"}:
                  </span>
                  <Badge variant="outline" className="text-[11px] bg-background">
                    Tổng: {rows.length} dòng
                  </Badge>
                  <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    Hợp lệ: {validRows.length}
                  </Badge>
                  {invalidRows.length > 0 && (
                    <Badge variant="destructive" className="text-[11px]">
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
                    className="h-7 text-xs gap-1 cursor-pointer"
                  >
                    <UploadCloud className="h-3 w-3" />
                    <span>Nạp tệp khác</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddRow}
                    className="h-7 text-xs gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Thêm dòng</span>
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Bảng Preview Editable Table có thanh cuộn */}
              <div className="flex-1 overflow-auto border border-border rounded-lg max-h-[380px]">
                <Table className="text-xs">
                  <TableHeader className="bg-muted/60 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-12 text-center">STT</TableHead>
                      <TableHead className="w-48">Tên đăng nhập (Username)</TableHead>
                      <TableHead className="min-w-[220px]">
                        Địa chỉ Email <span className="text-destructive">*</span>
                      </TableHead>
                      <TableHead className="min-w-[200px]">Trạng thái thẩm định</TableHead>
                      <TableHead className="w-12 text-center">Xóa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <TableRow
                        key={row.id}
                        className={row.error ? "bg-destructive/5 hover:bg-destructive/10" : undefined}
                      >
                        <TableCell className="text-center text-muted-foreground font-mono">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.username}
                            onChange={(e) => handleCellChange(row.id, "username", e.target.value)}
                            placeholder="Tự sinh nếu trống"
                            className="h-7 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.email}
                            onChange={(e) => handleCellChange(row.id, "email", e.target.value)}
                            placeholder="nhanvien@cyclosa.vn"
                            className={`h-7 text-xs ${row.error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                          />
                        </TableCell>
                        <TableCell>
                          {row.error ? (
                            <span className="flex items-center gap-1.5 text-destructive font-medium text-[11px]">
                              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                              <span>{row.error}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px]">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                              <span>Hợp lệ</span>
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors cursor-pointer"
                            title="Xóa dòng này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8 cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isLoading || rows.length === 0}
              onClick={handlePreSave}
              className="text-xs h-8 gap-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang xử lý tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>
                    Lưu danh sách ({validRows.length}/{rows.length} tài khoản)
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog xác nhận khi còn dòng bị lỗi */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle className="text-base font-bold">
                Xác nhận lưu tài khoản
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-muted-foreground space-y-2 pt-2">
              <p>
                Hiện tại có <strong className="text-destructive font-semibold">{invalidRows.length}</strong> dòng bị lỗi hoặc thiếu thông tin email.
              </p>
              <p className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-medium">
                ⚠️ Hệ thống <strong>sẽ không lưu những dòng bị lỗi</strong> này và chỉ tiến hành tạo <strong>{validRows.length}</strong> tài khoản hợp lệ còn lại.
              </p>
              <p>Bạn có chắc chắn muốn tiếp tục lưu không?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-xs h-8 cursor-pointer">
              Quay lại chỉnh sửa
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                executeSave(validRows);
              }}
              className="text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Đồng ý, chỉ lưu dòng hợp lệ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
