"use client";

import React, { useState, Suspense } from "react";
import { toast } from "sonner";
import {
  RouteGuard,
  PermissionGuard,
} from "@/features/authorization";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetUsersQuery,
  useResendActivationMutation,
  useLockUserMutation,
  useUnlockUserMutation,
  useUserFilters,
  UserTable,
  UserFormDialog,
  UserRoleAssignmentDialog,
  UserBulkImportDialog,
  USER_STATUS,
  type UserResponse,
} from "@/features/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Search, UserPlus, Users, Filter, FileSpreadsheet } from "lucide-react";

function UsersPageContent() {
  const {
    keyword,
    debouncedKeyword,
    status,
    statusParam,
    page,
    size,
    setKeyword,
    setStatus,
    setPage,
  } = useUserFilters();

  // Load danh sách người dùng từ API (page gửi lên backend là 0-based)
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery({
    keyword: debouncedKeyword.trim() || undefined,
    status,
    page: page - 1,
    size,
    sortBy: "createdAt",
    direction: "desc",
  });

  const users = usersData?.data?.items || [];
  const totalPages = usersData?.data?.pagination?.pages || 1;
  const totalItems = usersData?.data?.pagination?.total || 0;

  // Mutations
  const [resendActivation, { isLoading: isResending }] = useResendActivationMutation();
  const [lockUser, { isLoading: isLocking }] = useLockUserMutation();
  const [unlockUser, { isLoading: isUnlocking }] = useUnlockUserMutation();

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [selectedUserForRoles, setSelectedUserForRoles] = useState<UserResponse | null>(null);
  const [userToLock, setUserToLock] = useState<UserResponse | null>(null);
  const [userToUnlock, setUserToUnlock] = useState<UserResponse | null>(null);

  // Xử lý gửi lại mã kích hoạt
  const handleResendActivation = async (user: UserResponse) => {
    try {
      const res = await resendActivation(user.id).unwrap();
      if (res.success) {
        toast.success(`Đã gửi lại email kích hoạt cho tài khoản "${user.email}".`);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể gửi lại mã kích hoạt. Vui lòng thử lại.");
    }
  };

  // Xác nhận khóa tài khoản
  const handleConfirmLock = async () => {
    if (!userToLock) return;
    try {
      const res = await lockUser(userToLock.id).unwrap();
      if (res.success) {
        toast.success(`Đã khóa tài khoản "${userToLock.email}" thành công.`);
        setUserToLock(null);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể khóa tài khoản. Vui lòng thử lại.");
    }
  };

  // Xác nhận mở khóa tài khoản
  const handleConfirmUnlock = async () => {
    if (!userToUnlock) return;
    try {
      const res = await unlockUser(userToUnlock.id).unwrap();
      if (res.success) {
        toast.success(`Đã mở khóa tài khoản "${userToUnlock.email}" thành công.`);
        setUserToUnlock(null);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể mở khóa tài khoản. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Users className="h-6 w-6 text-primary" />
            <span>Quản lý Tài khoản Người dùng</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Quản lý tài khoản đăng nhập, trạng thái truy cập và phân bổ vai trò cho nhân sự trong toàn hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PermissionGuard permission={PERMISSIONS.USER.CREATE} fallback={null}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkImportOpen(true)}
              className="h-9 px-3 text-xs gap-1.5 cursor-pointer"
              title="Nhập danh sách tài khoản từ Excel/CSV"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Nhập hàng loạt</span>
            </Button>
          </PermissionGuard>

          <PermissionGuard permission={PERMISSIONS.USER.CREATE} fallback={null}>
            <Button
              size="sm"
              onClick={() => setIsFormOpen(true)}
              className="h-9 px-3.5 text-xs font-medium gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Tạo tài khoản mới</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* ── 2. Filter & Search Toolbar ─────────────────────────────── */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo username, email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-9 pl-8.5 text-xs rounded-lg border-input bg-background"
            />
          </div>

          {/* Bộ lọc trạng thái (Chuẩn Quy tắc 11.8) */}
          <div className="w-full sm:w-56">
            <Select
              value={statusParam}
              onValueChange={(val) => setStatus(val || "ALL")}
            >
              <SelectTrigger className="w-full h-9 text-xs rounded-lg border-input bg-background">
                <div className="flex items-center gap-1.5 truncate">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Lọc theo trạng thái...">
                    {(val: string) => {
                      if (val === "ACTIVE") return "Đang hoạt động";
                      if (val === "PENDING_ACTIVATION") return "Chờ kích hoạt";
                      if (val === "LOCKED") return "Đã bị khóa";
                      return "Tất cả trạng thái";
                    }}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="ALL" label="Tất cả trạng thái" className="text-xs cursor-pointer">
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem value={USER_STATUS.ACTIVE} label="Đang hoạt động" className="text-xs cursor-pointer">
                  Đang hoạt động
                </SelectItem>
                <SelectItem value={USER_STATUS.PENDING_ACTIVATION} label="Chờ kích hoạt" className="text-xs cursor-pointer">
                  Chờ kích hoạt
                </SelectItem>
                <SelectItem value={USER_STATUS.LOCKED} label="Đã bị khóa" className="text-xs cursor-pointer">
                  Đã bị khóa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── 3. Danh sách bảng người dùng ────────────────────────────── */}
      <UserTable
        users={users}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onManageRoles={(user) => setSelectedUserForRoles(user)}
        onResendActivation={handleResendActivation}
        onLockUser={(user) => setUserToLock(user)}
        onUnlockUser={(user) => setUserToUnlock(user)}
      />

      {/* ── 4. Dialog Tạo tài khoản ─────────────────────────────────── */}
      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => refetch()}
      />

      {/* ── 5. Dialog Phân quyền vai trò ────────────────────────────── */}
      <UserRoleAssignmentDialog
        user={selectedUserForRoles}
        open={Boolean(selectedUserForRoles)}
        onOpenChange={(open) => !open && setSelectedUserForRoles(null)}
      />

      {/* ── 6. Alert Dialog Xác nhận Khóa tài khoản ─────────────────── */}
      <AlertDialog open={Boolean(userToLock)} onOpenChange={(open) => !open && setUserToLock(null)}>
        <AlertDialogContent className="sm:max-w-[420px] rounded-2xl border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-destructive">
              Xác nhận khóa tài khoản
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Bạn có chắc chắn muốn khóa tài khoản{" "}
              <strong className="text-foreground">{userToLock?.email}</strong>? Người dùng này sẽ bị
              hủy phiên làm việc và không thể đăng nhập vào hệ thống cho đến khi được mở khóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-8.5 text-xs cursor-pointer">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLock}
              disabled={isLocking}
              className="h-8.5 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-xs cursor-pointer"
            >
              {isLocking ? "Đang khóa..." : "Xác nhận khóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── 7. Alert Dialog Xác nhận Mở khóa tài khoản ───────────────── */}
      <AlertDialog
        open={Boolean(userToUnlock)}
        onOpenChange={(open) => !open && setUserToUnlock(null)}
      >
        <AlertDialogContent className="sm:max-w-[420px] rounded-2xl border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Xác nhận mở khóa tài khoản
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Bạn có muốn mở lại quyền truy cập cho tài khoản{" "}
              <strong className="text-foreground">{userToUnlock?.email}</strong>? Sau khi mở khóa,
              người dùng có thể đăng nhập bình thường.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-8.5 text-xs cursor-pointer">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUnlock}
              disabled={isUnlocking}
              className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
            >
              {isUnlocking ? "Đang mở khóa..." : "Mở khóa tài khoản"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── 5. Dialog nhập tài khoản hàng loạt từ Excel ───────────── */}
      <UserBulkImportDialog
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <RouteGuard permission={PERMISSIONS.USER.VIEW}>
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
            Đang tải dữ liệu tài khoản người dùng...
          </div>
        }
      >
        <UsersPageContent />
      </Suspense>
    </RouteGuard>
  );
}

