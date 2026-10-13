import { NextResponse } from "next/server";
import type { DashboardOverviewResponse } from "@/features/dashboard/types/dashboard.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") || "month") as "month" | "quarter" | "year";
  const role = (searchParams.get("role") || "HR").toUpperCase();

  const periodLabels = {
    month: "Tháng 10/2026",
    quarter: "Quý 4/2026",
    year: "Năm 2026",
  };

  const periodLabel = periodLabels[period] || "Kỳ hiện tại";
  const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  let responseData: DashboardOverviewResponse;

  if (role === "EMPLOYEE") {
    responseData = {
      role: "EMPLOYEE",
      period,
      periodLabel,
      lastUpdated: now,
      kpis: {
        totalEmployees: {
          value: 1,
          changeText: "Chính thức",
          isPositive: true,
          periodComparison: "Hợp đồng không thời hạn",
        },
        newEmployees: {
          value: 22,
          periodText: "Công chuẩn tháng 10",
        },
        activeRecruitments: {
          value: 0,
          openPositionsCount: 0,
        },
        onLeave: {
          value: 11.5,
          unit: "ngày",
          periodText: "Phép năm còn lại",
        },
        totalPayroll: {
          value: 28500000,
          formatted: "28.500.000 ₫",
          periodText: "Lương thực lĩnh kỳ gần nhất",
        },
      },
      headcountTrend: [
        { period: "T5", count: 22, joined: 22, left: 0 },
        { period: "T6", count: 21, joined: 21, left: 0 },
        { period: "T7", count: 22, joined: 22, left: 0 },
        { period: "T8", count: 23, joined: 23, left: 0 },
        { period: "T9", count: 22, joined: 22, left: 0 },
        { period: "T10", count: 22, joined: 22, left: 0 },
      ],
      departmentDistribution: [
        { id: "tech", name: "Ban Công Nghệ FSI", employeeCount: 120, percentage: 100 },
      ],
      recruitmentFunnel: [],
      pendingTasks: [
        {
          id: "task-emp-1",
          title: "Ký số phụ lục hợp đồng lao động năm 2026",
          category: "CONTRACT",
          categoryLabel: "Hợp đồng",
          targetObject: "PLHĐ-2026/089",
          submitterName: "Phòng Nhân Sự",
          submitterRole: "HR",
          timeAgo: "2 giờ trước",
          status: "PENDING_APPROVAL",
          actionUrl: "/me/contracts",
          actionLabel: "Ký văn bản",
        },
        {
          id: "task-emp-2",
          title: "Cập nhật thông tin giảm trừ gia cảnh người phụ thuộc",
          category: "WORKFLOW",
          categoryLabel: "Thuế TNCN",
          targetObject: "Hồ sơ cá nhân",
          submitterName: "Kế toán tiền lương",
          submitterRole: "Payroll",
          timeAgo: "1 ngày trước",
          status: "PENDING_APPROVAL",
          actionUrl: "/me/profile",
          actionLabel: "Cập nhật",
        },
      ],
      recentActivities: [
        {
          id: "act-emp-1",
          actorName: "Bạn",
          action: "Điểm danh vào ca thành công",
          targetObject: "Trụ sở chính (GPS hợp lệ)",
          timeAgo: "08:15 hôm nay",
          entityType: "ATTENDANCE",
        },
        {
          id: "act-emp-2",
          actorName: "Bạn",
          action: "Gửi đơn xin nghỉ phép 1 ngày",
          targetObject: "Nghỉ phép năm (15/10)",
          timeAgo: "Hôm qua",
          entityType: "LEAVE",
        },
      ],
    };
  } else if (role === "MANAGER") {
    responseData = {
      role: "MANAGER",
      period,
      periodLabel,
      lastUpdated: now,
      kpis: {
        totalEmployees: {
          value: 48,
          changeText: "+2",
          isPositive: true,
          periodComparison: "so với tháng trước",
        },
        newEmployees: {
          value: 3,
          periodText: "trong kỳ này",
        },
        activeRecruitments: {
          value: 4,
          openPositionsCount: 4,
        },
        onLeave: {
          value: 6,
          unit: "lượt",
          periodText: "trong tháng",
        },
        totalPayroll: {
          value: 1240000000,
          formatted: "1.240.000.000 ₫",
          periodText: "Quỹ lương phòng ban",
        },
      },
      headcountTrend: [
        { period: "T5", count: 42, joined: 2, left: 0 },
        { period: "T6", count: 43, joined: 1, left: 0 },
        { period: "T7", count: 45, joined: 3, left: 1 },
        { period: "T8", count: 46, joined: 2, left: 1 },
        { period: "T9", count: 46, joined: 1, left: 1 },
        { period: "T10", count: 48, joined: 3, left: 1 },
      ],
      departmentDistribution: [
        { id: "team-fe", name: "Frontend Team", employeeCount: 18, percentage: 37.5 },
        { id: "team-be", name: "Backend & Cloud", employeeCount: 20, percentage: 41.7 },
        { id: "team-qa", name: "QA & QC Testing", employeeCount: 10, percentage: 20.8 },
      ],
      recruitmentFunnel: [
        { stage: "APPLIED", stageName: "Ứng tuyển", count: 24 },
        { stage: "SCREENING", stageName: "Sơ loại", count: 12 },
        { stage: "INTERVIEW", stageName: "Phỏng vấn", count: 6 },
        { stage: "OFFER", stageName: "Đề nghị", count: 2 },
        { stage: "HIRED", stageName: "Tiếp nhận", count: 1 },
      ],
      pendingTasks: [
        {
          id: "task-mgr-1",
          title: "Đơn xin nghỉ phép năm (2 ngày)",
          category: "LEAVE",
          categoryLabel: "Nghỉ phép",
          targetObject: "Trần Thị Mai (Frontend Dev)",
          submitterName: "Trần Thị Mai",
          submitterRole: "Nhân viên",
          timeAgo: "30 phút trước",
          status: "PENDING_APPROVAL",
          actionUrl: "/workflows/pending",
          actionLabel: "Duyệt đơn",
        },
        {
          id: "task-mgr-2",
          title: "Đề xuất tuyển dụng vị trí Senior Golang Developer",
          category: "RECRUITMENT",
          categoryLabel: "Tuyển dụng",
          targetObject: "YCTD-2026/045",
          submitterName: "Phạm Minh Tuấn",
          submitterRole: "Tech Lead",
          timeAgo: "2 giờ trước",
          status: "PENDING_APPROVAL",
          actionUrl: "/workflows/pending",
          actionLabel: "Xem xét",
        },
      ],
      recentActivities: [
        {
          id: "act-mgr-1",
          actorName: "Nguyễn Văn An (Manager)",
          action: "Phê duyệt bảng chấm công kỳ 1",
          targetObject: "Phòng Công Nghệ FSI",
          timeAgo: "10:30 hôm nay",
          entityType: "TIMESHEET",
        },
        {
          id: "act-mgr-2",
          actorName: "Trần Thị Mai",
          action: "Nộp đánh giá mục tiêu quý 3",
          targetObject: "KPI Period Q3/2026",
          timeAgo: "Hôm qua",
          entityType: "PERFORMANCE",
        },
      ],
    };
  } else {
    // HR, EXECUTIVE, ADMIN (default enterprise wide view)
    responseData = {
      role: role === "EXECUTIVE" ? "EXECUTIVE" : role === "ADMIN" ? "ADMIN" : "HR",
      period,
      periodLabel,
      lastUpdated: now,
      kpis: {
        totalEmployees: {
          value: 450,
          changeText: "+4.2%",
          isPositive: true,
          periodComparison: "so với kỳ trước",
        },
        newEmployees: {
          value: 18,
          periodText: "trong kỳ này",
        },
        activeRecruitments: {
          value: 12,
          openPositionsCount: 12,
        },
        onLeave: {
          value: 28,
          unit: "lượt",
          periodText: "trong kỳ",
        },
        totalPayroll: {
          value: 8450000000,
          formatted: "8.450.000.000 ₫",
          periodText: "Tổng chi phí lương",
        },
      },
      headcountTrend: [
        { period: "T5", count: 418, joined: 12, left: 4 },
        { period: "T6", count: 425, joined: 15, left: 8 },
        { period: "T7", count: 432, joined: 14, left: 7 },
        { period: "T8", count: 438, joined: 11, left: 5 },
        { period: "T9", count: 442, joined: 9, left: 5 },
        { period: "T10", count: 450, joined: 18, left: 10 },
      ],
      departmentDistribution: [
        { id: "tech", name: "Ban Công Nghệ FSI", employeeCount: 160, percentage: 35.6 },
        { id: "business", name: "Khối Kinh Doanh & Dự Án", employeeCount: 125, percentage: 27.8 },
        { id: "ops", name: "Khối Vận Hành & Khách Hàng", employeeCount: 85, percentage: 18.9 },
        { id: "hr_admin", name: "Nhân Sự & Hành Chính", employeeCount: 45, percentage: 10.0 },
        { id: "finance", name: "Tài Chính & Kế Toán", employeeCount: 35, percentage: 7.7 },
      ],
      recruitmentFunnel: [
        { stage: "APPLIED", stageName: "Ứng tuyển", count: 124 },
        { stage: "SCREENING", stageName: "Sơ loại", count: 68 },
        { stage: "INTERVIEW", stageName: "Phỏng vấn", count: 32 },
        { stage: "OFFER", stageName: "Đề nghị", count: 14 },
        { stage: "HIRED", stageName: "Tiếp nhận", count: 9 },
      ],
      pendingTasks: [
        {
          id: "task-hr-1",
          title: "Đề xuất tuyển dụng Frontend Engineer (2 vị trí)",
          category: "RECRUITMENT",
          categoryLabel: "Tuyển dụng",
          targetObject: "YCTD-2026/042 • Ban Công Nghệ",
          submitterName: "Phạm Minh Tuấn",
          submitterRole: "Tech Lead",
          timeAgo: "25 phút trước",
          status: "PENDING_APPROVAL",
          actionUrl: "/workflows/pending",
          actionLabel: "Duyệt yêu cầu",
        },
        {
          id: "task-hr-2",
          title: "Đơn xin nghỉ phép thai sản (6 tháng)",
          category: "LEAVE",
          categoryLabel: "Nghỉ phép",
          targetObject: "Hoàng Thảo Linh (EMP012)",
          submitterName: "Hoàng Thảo Linh",
          submitterRole: "Kế toán",
          timeAgo: "1 giờ trước",
          status: "PENDING_APPROVAL",
          actionUrl: "/workflows/pending",
          actionLabel: "Phê duyệt",
        },
        {
          id: "task-hr-3",
          title: "Hợp đồng thử việc cần chuyển đổi chính thức (5 nhân sự)",
          category: "CONTRACT",
          categoryLabel: "Hợp đồng",
          targetObject: "Đợt đánh giá thử việc T10",
          submitterName: "Hệ thống tự động",
          submitterRole: "System",
          timeAgo: "Hôm nay",
          status: "EXPIRING_SOON",
          actionUrl: "/contracts",
          actionLabel: "Xử lý HĐ",
        },
        {
          id: "task-hr-4",
          title: "Cảnh báo quá hạn đánh giá KPI Quý 3",
          category: "COMPLIANCE",
          categoryLabel: "Cảnh báo",
          targetObject: "Phòng Dự Án Số 2 (3 nhân sự chưa chốt)",
          submitterName: "Hệ thống kiểm soát",
          submitterRole: "Compliance",
          timeAgo: "Hôm qua",
          status: "WARNING",
          actionUrl: "/performance",
          actionLabel: "Kiểm tra",
        },
      ],
      recentActivities: [
        {
          id: "act-hr-1",
          actorName: "Trần Thị Mai",
          actorRole: "HR Lead",
          action: "Tiếp nhận hồ sơ nhân viên mới",
          targetObject: "Đặng Minh Tân (EMP014) • Ban Công Nghệ",
          timeAgo: "10 phút trước",
          entityType: "EMPLOYEE",
        },
        {
          id: "act-hr-2",
          actorName: "Nguyễn Văn An",
          actorRole: "CEO",
          action: "Phê duyệt bảng tính lương",
          targetObject: "Kỳ lương tháng 10/2026 (450 nhân sự)",
          timeAgo: "1 giờ trước",
          entityType: "PAYROLL",
        },
        {
          id: "act-hr-3",
          actorName: "Lê Hoàng Nam",
          actorRole: "Recruiter",
          action: "Gửi thư mời nhận việc (Offer)",
          targetObject: "Ứng viên Nguyễn Thu Trang (UI/UX Designer)",
          timeAgo: "3 giờ trước",
          entityType: "RECRUITMENT",
        },
        {
          id: "act-hr-4",
          actorName: "Hệ thống CYCLOSA",
          actorRole: "Security",
          action: "Tự động khóa tài khoản thôi việc",
          targetObject: "Tài khoản dev.temp@cyclosa.vn",
          timeAgo: "Hôm qua",
          entityType: "SECURITY",
        },
      ],
    };
  }

  return NextResponse.json({
    success: true,
    data: responseData,
    message: "Lấy dữ liệu tổng quan Dashboard thành công",
  });
}
