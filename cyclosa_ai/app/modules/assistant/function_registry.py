from typing import Dict, Any, Tuple, Optional
from app.modules.assistant.schemas import UserContext


class FunctionRegistry:
    """
    Sổ đăng ký các hàm nghiệp vụ HRM cho AI Assistant.
    Thực thi kiểm tra phân quyền RBAC và giới hạn phạm vi dữ liệu (DataScope) nghiêm ngặt:
    - ROLE_EMPLOYEE: Chỉ được tra cứu dữ liệu cá nhân của chính mình.
    - ROLE_DEPARTMENT_HEAD: Được tra cứu thêm dữ liệu của nhân sự trong phòng ban mình phụ trách.
    - ROLE_HR_MANAGER / ROLE_ADMIN: Được tra cứu toàn diện công ty.
    """

    ROLE_ADMIN = "ROLE_ADMIN"
    ROLE_HR = "ROLE_HR_MANAGER"
    ROLE_MANAGER = "ROLE_DEPARTMENT_HEAD"
    ROLE_EMPLOYEE = "ROLE_EMPLOYEE"

    @classmethod
    def execute(cls, function_name: str, user_context: UserContext, query: str) -> Tuple[bool, str, Optional[Dict[str, Any]]]:
        """
        Thực thi hàm nghiệp vụ với kiểm tra RBAC.
        Trả về: (thành_công, văn_bản_phản_hồi, dữ_liệu_cấu_trúc)
        """
        roles = set(user_context.roles or ["ROLE_EMPLOYEE"])
        is_admin_or_hr = bool(roles & {cls.ROLE_ADMIN, cls.ROLE_HR, "ADMIN", "HR_MANAGER"})
        is_manager = is_admin_or_hr or bool(roles & {cls.ROLE_MANAGER, "DEPARTMENT_HEAD", "MANAGER"})

        if function_name == "get_my_leave_balance":
            return cls._get_my_leave_balance(user_context)
        elif function_name == "get_my_attendance_summary":
            return cls._get_my_attendance_summary(user_context)
        elif function_name == "get_my_payslip_overview":
            return cls._get_my_payslip_overview(user_context)
        elif function_name == "get_team_leave_status":
            if not is_manager:
                return False, (
                    "⛔ Phân quyền DataScope: Bạn hiện không có quyền xem danh sách nghỉ phép của các đồng nghiệp khác. "
                    "Chức năng này chỉ dành cho Cấp quản lý phòng ban hoặc chuyên viên Nhân sự."
                ), None
            return cls._get_team_leave_status(user_context)
        elif function_name == "get_headcount_by_department":
            if not is_manager:
                return False, (
                    "⛔ Phân quyền DataScope: Bạn không có quyền truy cập số liệu định biên và nhân sự phòng ban. "
                    "Vui lòng liên hệ Trưởng phòng hoặc Ban Nhân sự nếu cần thông tin này."
                ), None
            return cls._get_headcount_by_department(user_context)
        elif function_name == "get_recruitment_pipeline_status":
            if not is_admin_or_hr:
                return False, (
                    "⛔ Phân quyền DataScope: Báo cáo phễu tuyển dụng chỉ được mở cho Ban Nhân sự và Ban Giám đốc."
                ), None
            return cls._get_recruitment_pipeline_status(user_context)
        elif function_name == "get_company_holidays":
            return cls._get_company_holidays(user_context)
        elif function_name == "get_pending_approvals_count":
            return cls._get_pending_approvals_count(user_context, is_manager)
        else:
            return False, f"Không tìm thấy hàm nghiệp vụ: {function_name}", None

    # ==========================================
    # CÁC HÀM NGHIỆP VỤ HRM THỰC THI
    # ==========================================

    @classmethod
    def _get_my_leave_balance(cls, user: UserContext) -> Tuple[bool, str, Dict[str, Any]]:
        # Dữ liệu mô phỏng từ EmployeeLeaveProfile
        data = {
            "employee_name": user.full_name,
            "entitled_annual_days": 12.0,
            "seniority_days": 1.0,
            "transferred_days": 2.0,
            "used_days": 4.5,
            "remaining_days": 10.5
        }
        text = (
            f"Chào {user.full_name}, theo dữ liệu trên hệ thống CYCLOSA:\n"
            f"- Tổng quỹ phép năm 2026 của bạn: **15 ngày** (12 ngày chuẩn + 1 ngày thâm niên + 2 ngày năm trước chuyển sang).\n"
            f"- Số ngày phép đã sử dụng: **4.5 ngày**.\n"
            f"- **Số ngày phép còn lại: 10.5 ngày**.\n\n"
            f"Lưu ý: Phép năm trước chuyển sang sẽ có hạn sử dụng đến hết ngày 31/03/2026."
        )
        return True, text, data

    @classmethod
    def _get_my_attendance_summary(cls, user: UserContext) -> Tuple[bool, str, Dict[str, Any]]:
        data = {
            "month": 11,
            "year": 2026,
            "standard_work_days": 22,
            "actual_work_days": 14,
            "late_arrivals_count": 1,
            "early_departures_count": 0,
            "total_overtime_hours": 3.5
        }
        text = (
            f"Báo cáo chấm công Tháng 11/2026 của {user.full_name}:\n"
            f"- Số ngày công chuẩn trong tháng: **22 ngày**.\n"
            f"- Số ngày đã ghi nhận công tính đến hôm nay: **14 ngày**.\n"
            f"- Số lần đi muộn: **1 lần** (ngày 05/11, trễ 12 phút).\n"
            f"- Số lần về sớm: **0 lần**.\n"
            f"- Tổng số giờ làm thêm (OT) đã duyệt: **3.5 giờ**.\n"
            f"Tỷ lệ tuân thủ giờ giấc của bạn đạt **98.2%**."
        )
        return True, text, data

    @classmethod
    def _get_my_payslip_overview(cls, user: UserContext) -> Tuple[bool, str, Dict[str, Any]]:
        data = {
            "month": 10,
            "year": 2026,
            "gross_salary": 28000000,
            "allowances": 2500000,
            "social_insurance_deduction": 2940000,
            "pit_deduction": 1250000,
            "net_salary": 26310000
        }
        text = (
            f"Tổng quan phiếu lương Kỳ tháng 10/2026 của {user.full_name}:\n"
            f"- Lương cơ bản / Gross: **28,000,000 VNĐ**.\n"
            f"- Phụ cấp (ăn trưa, điện thoại, xăng xe): **2,500,000 VNĐ**.\n"
            f"- Trừ trích nộp BHXH, BHYT, BHTN (10.5%): **2,940,000 VNĐ**.\n"
            f"- Thuế thu nhập cá nhân (TNCN) tạm khấu trừ: **1,250,000 VNĐ**.\n"
            f"👉 **Thực lĩnh (Net): 26,310,000 VNĐ** (Đã chuyển khoản ngày 05/11/2026).\n\n"
            f"Bạn có thể vào mục *Phiếu lương cá nhân* để tải bản kê chi tiết định dạng PDF có chữ ký số."
        )
        return True, text, data

    @classmethod
    def _get_team_leave_status(cls, user: UserContext) -> Tuple[bool, str, Dict[str, Any]]:
        dept = user.department_name or "Phòng ban của bạn"
        data = {
            "department": dept,
            "on_leave_today": [
                {"name": "Trần Thị Mai", "type": "Nghỉ phép năm (Cả ngày)", "phone": "0912***456"},
                {"name": "Lê Hoàng Long", "type": "Nghỉ ốm hưởng BHXH (Buổi chiều)", "phone": "0988***789"}
            ]
        }
        text = (
            f"Tình hình nhân sự nghỉ phép hôm nay tại **{dept}**:\n"
            f"- Hiện có **2 nhân sự** vắng mặt có lý do hợp lệ:\n"
            f"  1. **Trần Thị Mai** - Nghỉ phép năm (Cả ngày).\n"
            f"  2. **Lê Hoàng Long** - Nghỉ ốm (Nửa ngày chiều).\n"
            f"- Các nhân sự còn lại đều đã check-in chấm công đầy đủ lúc 8:30 sáng."
        )
        return True, text, data

    @classmethod
    def _get_headcount_by_department(cls, user: UserContext) -> Tuple[bool, str, Dict[str, Any]]:
        dept = user.department_name or "Khối Kỹ thuật"
        data = {
            "department": dept,
            "headcount_actual": 18,
            "headcount_plan": 20,
            "probation_count": 2,
            "official_count": 16
        }
        text = (
            f"Thống kê định biên nhân sự tại **{dept}**:\n"
            f"- Định biên mục tiêu: **20 nhân sự**.\n"
            f"- Quân số thực tế hiện tại: **18 nhân sự** (Tỷ lệ lấp đầy: 90%).\n"
            f"  + Nhân viên chính thức: 16 người.\n"
            f"  + Nhân sự đang thử việc: 2 người.\n"
            f"- Số vị trí đang tuyển bổ sung: **2 chỉ tiêu** (1 Frontend Dev, 1 QA Lead)."
        )
        return True, text, data

    @classmethod
    def _get_recruitment_pipeline_status(cls, user: UserContext) -> Tuple[bool, str, Dict[str, Any]]:
        data = {
            "open_positions": 5,
            "total_candidates": 42,
            "interview_stage": 8,
            "offer_stage": 2
        }
        text = (
            f"Báo cáo tiến độ Tuyển dụng toàn công ty:\n"
            f"- Số chiến dịch đang mở tuyển: **5 vị trí**.\n"
            f"- Tổng hồ sơ CV tiếp nhận trong tháng: **42 hồ sơ**.\n"
            f"- Đang trong vòng phỏng vấn chuyên môn: **8 ứng viên**.\n"
            f"- Đã gửi Offer chờ ứng viên phản hồi: **2 ứng viên** (Senior Backend & Product Owner)."
        )
        return True, text, data

    @classmethod
    def _get_company_holidays(cls, user: UserContext) -> Tuple[bool, str, Dict[str, Any]]:
        data = {
            "year": 2026,
            "upcoming_holidays": [
                {"name": "Tết Dương lịch 2027", "date": "01/01/2027", "days": 1},
                {"name": "Tết Nguyên đán Bính Ngọ", "date": "16/02/2026 - 22/02/2026", "days": 7}
            ]
        }
        text = (
            f"Lịch nghỉ lễ tiếp theo của công ty trong năm:\n"
            f"- **Tết Dương lịch**: Nghỉ ngày 01/01 (1 ngày hưởng nguyên lương).\n"
            f"- **Tết Nguyên đán**: Dự kiến nghỉ 7 ngày theo thông báo của Bộ Lao động - Thương binh & Xã hội.\n"
            f"- **Giỗ Tổ Hùng Vương (10/3 ÂL)**: Nghỉ 1 ngày.\n"
            f"- **30/4 & 01/05**: Nghỉ 2 ngày.\n"
            f"- **Quốc khánh 02/09**: Nghỉ 2 ngày."
        )
        return True, text, data

    @classmethod
    def _get_pending_approvals_count(cls, user: UserContext, is_manager: bool) -> Tuple[bool, str, Dict[str, Any]]:
        if is_manager:
            text = (
                f"Chào Quản lý {user.full_name}, bạn hiện có **3 đơn từ chờ phê duyệt**:\n"
                f"- 2 đơn xin nghỉ phép năm của thành viên trong phòng ban.\n"
                f"- 1 đơn đề xuất làm thêm giờ (OT).\n"
                f"Vui lòng vào màn hình *Xét duyệt đơn từ* để xử lý."
            )
            return True, text, {"pending_approvals": 3, "type": "MANAGER"}
        else:
            text = (
                f"Chào {user.full_name}, hiện tại bạn có **1 đơn xin nghỉ phép** gửi ngày 16/11 "
                f"đang ở trạng thái *Chờ Trưởng phòng phê duyệt*."
            )
            return True, text, {"pending_approvals": 1, "type": "EMPLOYEE"}
