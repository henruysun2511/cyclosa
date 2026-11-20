"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  User,
  Camera,
  CalendarCheck,
  CalendarDays,
  Banknote,
  FileSignature,
  Target,
  Building2,
  Laptop,
  Trophy,
  CheckSquare,
  LogOut,
  Shield,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SpiderIcon } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import { useLogoutMutation } from "@/features/auth/api/auth-api";
import { toast } from "sonner";

export interface EmployeeNavHubProps {
  remainingLeaveDays?: number;
  totalWorkCredits?: string | number;
  assignedSeatCode?: string;
  todayCheckInTime?: string;
  isCheckedInToday?: boolean;
  onSelectTab?: (tab: "hub" | "metrics") => void;
  activeTab?: "hub" | "metrics";
}

interface NavTileItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isTabTrigger?: boolean;
}

export function EmployeeNavHub({ onSelectTab }: EmployeeNavHubProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignored
    } finally {
      dispatch(logout());
      toast.success("Đã đăng xuất thành công");
      router.replace("/login");
    }
  };

  const displayName = authUser?.name || authUser?.email || "Cán bộ nhân viên";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(-2)
    .join("")
    .toUpperCase() || "NV";

  const normalizedRoles = (authUser?.roles || []).map((r) =>
    r.replace(/^ROLE_/, "").toUpperCase()
  );
  const canAccessAdminPortal = normalizedRoles.some((r) =>
    [
      "SUPER_ADMIN",
      "HR_ADMIN",
      "HR_SPECIALIST",
      "RECRUITER",
      "PAYROLL_ACCOUNTANT",
      "EXECUTIVE",
      "MANAGER",
      "OFFICE_ADMIN",
      "AUDITOR",
      "ADMIN",
    ].includes(r)
  );

  // Đầy đủ 12 phân hệ tự phục vụ nhân viên CYCLOSA ESS (2 hàng x 6 cột)
  const tiles: NavTileItem[] = [
    // Hàng 1
    {
      id: "overview",
      title: "Dashboard tổng quan",
      icon: FileText,
      href: "/me?tab=metrics",
    },
    {
      id: "profile",
      title: "Thông tin cá nhân",
      icon: User,
      href: "/me/profile",
    },
    {
      id: "attendance-checkin",
      title: "Điểm danh Face AI",
      icon: Camera,
      href: "/me/attendance/check-in",
    },
    {
      id: "attendance-records",
      title: "Bảng chấm công",
      icon: CalendarCheck,
      href: "/me/attendance",
    },
    {
      id: "leave-management",
      title: "Quản lý nghỉ phép",
      icon: CalendarDays,
      href: "/me/leave",
    },
    {
      id: "payroll-payslips",
      title: "Phiếu lương & Thu nhập",
      icon: Banknote,
      href: "/me/payslips",
    },
    // Hàng 2
    {
      id: "contract-esign",
      title: "Hợp đồng & Ký số",
      icon: FileSignature,
      href: "/me/contracts",
    },
    {
      id: "performance-kpi",
      title: "Đánh giá hiệu suất",
      icon: Target,
      href: "/me/performance",
    },
    {
      id: "workplace-space",
      title: "Không gian làm việc",
      icon: Building2,
      href: "/me/workplace/map",
    },
    {
      id: "asset-devices",
      title: "Tài sản & Thiết bị",
      icon: Laptop,
      href: "/me/assets",
    },
    {
      id: "reward-discipline",
      title: "Khen thưởng & Góp ý",
      icon: Trophy,
      href: "/me/rewards",
    },
    {
      id: "approval-center",
      title: "Phê duyệt đơn",
      icon: CheckSquare,
      href: "/me/approvals",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#A31D1D] text-white flex flex-col p-6 sm:p-8 select-none relative overflow-x-hidden">
      {/* 1. Header: Avatar ở góc trên cùng bên phải */}
      <div className="w-full flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-white/80 overflow-hidden shadow-lg hover:scale-105 transition-transform bg-white/20 flex items-center justify-center cursor-pointer focus:outline-none"
            >
              <span className="font-bold text-white text-base sm:text-lg">
                {userInitials}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 text-xs">
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-foreground leading-none">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground leading-none">
                  {authUser?.email || "employee@cyclosa.vn"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/me/profile" className="cursor-pointer">
                <UserCheck className="mr-2 h-4 w-4 text-primary" />
                <span>Thông tin cá nhân</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/me/approvals" className="cursor-pointer">
                <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                <span>Phê duyệt đơn</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/me/rewards" className="cursor-pointer">
                <Trophy className="mr-2 h-4 w-4 text-primary" />
                <span>Khen thưởng & Góp ý</span>
              </Link>
            </DropdownMenuItem>
            {canAccessAdminPortal && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/overview" className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4 text-primary" />
                  <span>Cổng quản trị Admin</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Khối nội dung trung tâm: Tiêu đề và Menu Items gắn kết chặt chẽ */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto my-auto py-2">
        {/* 2. Tiêu đề trung tâm: CYCLOSA ESS - Cổng tự phục vụ nhân viên (100% chữ trắng) */}
        <div className="relative text-center mb-6 sm:mb-8 flex flex-col items-center">
          {/* Ánh sáng mờ tạo chiều sâu nền */}
          <div className="absolute -top-6 w-80 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          {/* Tiêu đề chính CYCLOSA ESS (100% màu trắng) */}
          <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
            CYCLOSA ESS
          </h1>

          {/* Phụ đề Cổng tự phục vụ nhân viên (100% màu trắng) */}
          <p className="relative z-10 text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide mt-2 drop-shadow-xs max-w-lg mx-auto">
            Cổng tự phục vụ nhân viên
          </p>
        </div>

        {/* 3. Lưới 12 ô bo tròn xếp liền mạch ngay dưới tiêu đề */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6 sm:gap-y-8 gap-x-3 sm:gap-x-6 md:gap-x-8 justify-items-center">
            {tiles.map((tile) => {
              const Icon = tile.icon;

              const card = (
                <div className="flex flex-col items-center group cursor-pointer w-full max-w-[150px]">
                  {/* Khối ô vuông bo tròn màu trắng */}
                  <div className="aspect-square w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 lg:w-32 lg:h-32 rounded-[26px] sm:rounded-[32px] bg-white shadow-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-2xl active:scale-95">
                    <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-[#A31D1D] stroke-[2.2] transition-transform duration-200 group-hover:scale-110" />
                  </div>

                  {/* Chữ mô tả màu trắng nằm bên dưới ô bo tròn */}
                  <span className="text-white font-semibold text-xs sm:text-sm text-center mt-2.5 leading-snug drop-shadow-xs max-w-[125px] sm:max-w-[140px]">
                    {tile.title}
                  </span>
                </div>
              );

              if (tile.isTabTrigger && onSelectTab) {
                return (
                  <div
                    key={tile.id}
                    onClick={() => onSelectTab("metrics")}
                    className="focus:outline-none"
                  >
                    {card}
                  </div>
                );
              }

              return (
                <Link key={tile.id} href={tile.href} className="focus:outline-none">
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
