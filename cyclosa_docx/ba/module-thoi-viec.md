# TÀI LIỆU ĐẶC TẢ NGHIỆP VỤ & KỸ THUẬT: MODULE THÔI VIỆC & BÀN GIAO (OFFBOARDING)

---

## 1. TỔNG QUAN & MỐI QUAN HỆ LIÊN MODULE

Module **Thôi việc & Bàn giao (Offboarding)** là mắt xích cuối cùng trong vòng đời nhân sự (Employee Lifecycle), quản lý toàn bộ quy trình từ khi tiếp nhận yêu cầu thôi việc (tự nguyện) hoặc ban hành quyết định chấm dứt hợp đồng lao động (doanh nghiệp chủ động), kiểm soát 5 hạng mục bàn giao công việc/tài sản/hệ thống/tài chính/giấy tờ, khảo sát phỏng vấn nghỉ việc, đến bước kiểm tra điều kiện tiên quyết và chính thức hoàn tất thủ tục, cập nhật trạng thái nhân viên và vô hiệu hóa tài khoản người dùng.

### 1.1. Phạm vi triển khai
- **Cổng Quản trị & Nhân sự (Admin & HR/Manager Portal):**
  - Quản lý danh sách hồ sơ thôi việc và quyết định chấm dứt HĐLĐ.
  - Phê duyệt / Từ chối đơn xin thôi việc.
  - Ban hành quyết định chấm dứt hợp đồng lao động chủ động (sa thải kỷ luật, tái cơ cấu, hết hạn HĐ, không đạt thử việc...).
  - Theo dõi & Phê duyệt trạng thái 5 hạng mục bàn giao (Offboarding Clearance Items).
  - Thu hồi tài sản và kiểm tra đối soát tài sản chưa hoàn trả.
  - Ghi nhận & khảo sát phỏng vấn thôi việc (Exit Interview).
  - Tổng hợp hồ sơ & Kiểm tra điều kiện hoàn tất (Offboarding Summary & Prerequisites Check).
  - Thực thi hoàn tất thủ tục thôi việc: Chuyển trạng thái nhân sự (`RESIGNED` hoặc `TERMINATED`), khóa tài khoản `User` liên kết, đóng hồ sơ.
- **Lưu ý phạm vi:** Cổng Tự phục vụ Nhân viên (ESS) chưa nằm trong phạm vi đợt này.

### 1.2. Mối quan hệ liên module
- **Module Nhân sự (Employee):** Cập nhật `EmploymentStatus` của nhân viên sang `RESIGNED` (nếu tự nguyện thôi việc) hoặc `TERMINATED` (nếu doanh nghiệp sa thải/chấm dứt).
- **Module Quản trị tài khoản & Phân quyền (Auth/User):** Khóa tài khoản đăng nhập (`isActive = false`) khi hoàn tất thủ tục thôi việc.
- **Module Hợp đồng lao động (Contract):** Cập nhật ngày kết thúc hợp đồng, hủy bỏ hoặc đóng trạng thái hợp đồng hiện hành.
- **Module Kỷ luật (Discipline):** Liên kết quyết định chấm dứt với quyết định kỷ luật hình thức sa thải nếu có.
- **Module Tài sản (Asset):** Kiểm tra danh sách tài sản đang bàn giao/giao quản lý cho nhân viên để đảm bảo thu hồi đủ 100% trước khi hoàn tất.
- **Module Chấm công & Nghép (Leave/Attendance):** Kiểm tra số ngày phép năm còn tồn để tính toán quyết toán trợ cấp thôi việc.

---

## 2. QUY TRÌNH NGHIỆP VỤ CỐT LÕI (CORE WORKFLOWS)

### 2.1. Đơn xin thôi việc tự nguyện (Resignation)
1. HR/Quản lý ghi nhận hoặc tiếp nhận Đơn xin thôi việc.
2. Kiểm tra thời hạn báo trước theo loại HĐLĐ (HĐ không xác định thời hạn: $\ge 45$ ngày; HĐ xác định thời hạn: $\ge 30$ ngày; Thử việc: $\ge 3$ ngày).
3. Người có thẩm quyền phê duyệt (`APPROVED`) hoặc từ chối (`REJECTED`) đơn.
4. Khi đơn được phê duyệt, hệ thống tự động sinh 5 hạng mục bàn giao Offboarding Clearance ở trạng thái `PENDING`.

### 2.2. Quyết định chấm dứt hợp đồng lao động (Termination)
1. Doanh nghiệp chủ động ban hành quyết định chấm dứt HĐLĐ.
2. Các lý do hợp pháp: Không đạt yêu cầu công việc (`PERFORMANCE`), Sa thải kỷ luật (`DISCIPLINARY_DISMISSAL`), Thay đổi cơ cấu / Thu hẹp kinh doanh (`RESTRUCTURING_DOWNSIZING`), Hết hạn HĐ không tái ký (`CONTRACT_EXPIRED_NOT_RENEWED`), Thỏa thuận chấm dứt (`MUTUAL_AGREEMENT`), Không đạt thử việc (`PROBATION_FAILED`), Khác (`OTHER`).
3. Quyết định ở trạng thái `APPROVED` ngay khi ban hành, đồng thời tự động kích hoạt 5 hạng mục bàn giao.

### 2.3. Quy trình 5 Hạng mục bàn giao (Clearance Checklist)
Mỗi hồ sơ thôi việc bắt buộc phải được xác nhận hoàn tất đầy đủ 5 hạng mục:
1. `JOB_HANDOVER` (Bàn giao công việc & tài liệu): Bàn giao dự án, tài liệu, công việc dở dang cho nhân sự tiếp nhận.
2. `ASSET` (Thu hồi tài sản): Kiểm tra và xác nhận bàn giao đầy đủ máy tính xách tay, màn hình, thẻ ra vào, chìa khóa văn phòng...
3. `IT_ACCOUNT` (Thu hồi hệ thống & tài khoản): Khóa email nội bộ, VPN, Git, Jira, AWS, Slack/Teams, hệ thống ERP.
4. `FINANCE` (Quyết toán tài chính): Quyết toán công nợ nội bộ, hoàn ứng tạm ứng, tính toán trợ cấp thôi việc/tháng lương cuối.
5. `DOCUMENT` (Bàn giao hồ sơ & giấy tờ): Chốt sổ BHXH, bàn giao hồ sơ năng lực/giấy chứng nhận thôi việc, trả văn bằng gốc (nếu giữ).

### 2.4. Phỏng vấn thôi việc (Exit Interview)
- HR tổ chức phỏng vấn trực tiếp hoặc tiếp nhận bảng câu hỏi từ nhân sự.
- Thu thập lý do thực sự, đánh giá môi trường văn hóa, quản lý trực tiếp, phúc lợi và câu hỏi giới thiệu công ty (`willingToRecommend`).
- Đây là bước khảo sát chuyên sâu (tùy chọn hoặc khuyến nghị), không chặn cứng bước hoàn tất nếu nhân sự từ chối phỏng vấn.

### 2.5. Điều kiện tiên quyết & Hoàn tất thôi việc (Completion Prerequisites)
Hồ sơ chỉ có thể bấm **Hoàn tất thủ tục** khi thỏa mãn đồng thời:
1. Trạng thái hồ sơ thôi việc / quyết định chấm dứt đang là `APPROVED` hoặc `PROCESSING`.
2. Toàn bộ 5 hạng mục bàn giao đều có trạng thái `CLEARED`.
3. Số lượng tài sản công ty chưa thu hồi bằng 0 (`unreturnedAssetsCount == 0`).

**Hành động hệ thống khi Hoàn tất:**
- Cập nhật hồ sơ thôi việc sang `COMPLETED`, ghi nhận `completedAt`.
- Cập nhật trạng thái nhân sự:
  - Nếu là `RESIGNATION` $\to$ `RESIGNED`.
  - Nếu là `TERMINATION` $\to$ `TERMINATED`.
- Cập nhật tài khoản `User` của nhân sự sang `isActive = false`, vô hiệu hóa token đăng nhập.

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

### 3.1. Bảng `offboarding_requests`
```sql
CREATE TABLE IF NOT EXISTS offboarding_requests (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    type VARCHAR(30) NOT NULL, -- RESIGNATION, TERMINATION
    status VARCHAR(30) NOT NULL, -- PENDING, APPROVED, REJECTED, PROCESSING, COMPLETED, CANCELLED
    
    -- Trường dành cho Đơn xin thôi việc
    resignation_reason VARCHAR(50), -- BETTER_OPPORTUNITY, PERSONAL_FAMILY, HEALTH, RELOCATION, CAREER_CHANGE, WORK_ENVIRONMENT, COMPENSATION, OTHER
    notice_date DATE,
    desired_last_working_date DATE,
    
    -- Trường dành cho Quyết định chấm dứt
    termination_reason VARCHAR(50), -- PERFORMANCE, DISCIPLINARY_DISMISSAL, RESTRUCTURING_DOWNSIZING, CONTRACT_EXPIRED_NOT_RENEWED, MUTUAL_AGREEMENT, PROBATION_FAILED, OTHER
    discipline_id VARCHAR(36),
    decision_number VARCHAR(100),
    decision_date DATE,
    
    -- Thông tin chung & Bàn giao
    actual_last_working_date DATE NOT NULL,
    successor_id VARCHAR(36),
    reason_detail TEXT,
    notes TEXT,
    
    -- Phê duyệt & Hoàn tất
    approved_by VARCHAR(36),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_offboarding_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_offboarding_successor FOREIGN KEY (successor_id) REFERENCES employees(id),
    CONSTRAINT fk_offboarding_approver FOREIGN KEY (approved_by) REFERENCES employees(id)
);
```

### 3.2. Bảng `offboarding_clearance_items`
```sql
CREATE TABLE IF NOT EXISTS offboarding_clearance_items (
    id VARCHAR(36) PRIMARY KEY,
    offboarding_request_id VARCHAR(36) NOT NULL,
    clearance_type VARCHAR(30) NOT NULL, -- JOB_HANDOVER, ASSET, IT_ACCOUNT, FINANCE, DOCUMENT
    status VARCHAR(30) NOT NULL, -- PENDING, CLEARED, REJECTED
    cleared_by VARCHAR(36),
    cleared_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_clearance_offboarding FOREIGN KEY (offboarding_request_id) REFERENCES offboarding_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_clearance_cleared_by FOREIGN KEY (cleared_by) REFERENCES employees(id)
);
```

### 3.3. Bảng `exit_interviews`
```sql
CREATE TABLE IF NOT EXISTS exit_interviews (
    id VARCHAR(36) PRIMARY KEY,
    offboarding_request_id VARCHAR(36) NOT NULL UNIQUE,
    interviewer_id VARCHAR(36) NOT NULL,
    interview_date DATE NOT NULL,
    primary_reason VARCHAR(100),
    working_environment_feedback TEXT,
    management_feedback TEXT,
    compensation_feedback TEXT,
    improvement_suggestions TEXT,
    willing_to_recommend BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_exit_interview_offboarding FOREIGN KEY (offboarding_request_id) REFERENCES offboarding_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_exit_interview_interviewer FOREIGN KEY (interviewer_id) REFERENCES employees(id)
);
```

---

## 4. DANH MỤC API RESTFUL (BACKEND ENDPOINTS)

| Method | Endpoint | Quyền hạn | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/offboarding/requests` | `offboarding.view` | Tìm kiếm & phân trang danh sách hồ sơ thôi việc / quyết định chấm dứt |
| `GET` | `/api/v1/offboarding/requests/statistics` | `offboarding.view` | Thống kê số lượng theo trạng thái, loại hồ sơ, tiến độ bàn giao |
| `GET` | `/api/v1/offboarding/requests/{id}` | `offboarding.view` | Chi tiết hồ sơ thôi việc kèm danh sách bàn giao và phỏng vấn |
| `POST` | `/api/v1/offboarding/requests/resignations` | `offboarding.create` | Tiếp nhận / Tạo đơn xin thôi việc mới |
| `POST` | `/api/v1/offboarding/requests/terminations` | `offboarding.create` | Ban hành quyết định chấm dứt HĐLĐ (doanh nghiệp chủ động) |
| `PUT` | `/api/v1/offboarding/requests/{id}/approve` | `offboarding.approve` | Phê duyệt đơn xin thôi việc (kích hoạt quy trình 5 hạng mục bàn giao) |
| `PUT` | `/api/v1/offboarding/requests/{id}/reject` | `offboarding.approve` | Từ chối đơn xin thôi việc kèm lý do |
| `GET` | `/api/v1/offboarding/requests/{id}/clearance` | `offboarding.view` | Lấy danh sách 5 hạng mục bàn giao của hồ sơ |
| `PUT` | `/api/v1/offboarding/requests/{id}/clearance/{itemId}` | `offboarding.clearance` | Xác nhận bàn giao hoặc từ chối hạng mục bàn giao |
| `GET` | `/api/v1/offboarding/requests/{id}/exit-interview` | `offboarding.view` | Lấy thông tin phỏng vấn thôi việc |
| `POST` | `/api/v1/offboarding/requests/{id}/exit-interview` | `offboarding.interview` | Tạo mới hoặc cập nhật khảo sát phỏng vấn thôi việc |
| `GET` | `/api/v1/offboarding/requests/{id}/summary` | `offboarding.view` | Kiểm tra điều kiện hoàn tất, số tài sản chưa trả, trạng thái checklist |
| `PUT` | `/api/v1/offboarding/requests/{id}/complete` | `offboarding.complete` | Thực thi hoàn tất thủ tục thôi việc, khóa tài khoản & đổi trạng thái nhân sự |
| `DELETE` | `/api/v1/offboarding/requests/{id}` | `offboarding.delete` | Xóa mềm hồ sơ thôi việc (chỉ cho phép khi ở trạng thái PENDING/REJECTED) |

---

## 5. ĐẶC TẢ GIAO DIỆN ADMIN (FRONTEND UI)

Tuân thủ nghiêm ngặt bộ quy chuẩn **CYCLOSA Frontend Rules**:
1. **Header (Rule 02):** Header hiển thị tiêu đề trang và cụm nút thao tác (Tạo quyết định chấm dứt, Tiếp nhận đơn thôi việc), không bọc icon box, không subtitle.
2. **KPI Stats Cards (Rule 03):** 4 thẻ chỉ số `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`:
   - Tổng hồ sơ thôi việc
   - Chờ phê duyệt (Pending Approval)
   - Đang bàn giao (Processing Clearance)
   - Đã hoàn tất thủ tục (Completed)
3. **Filter Bar (Rule 03):** Cấu trúc 2 hàng rõ ràng:
   - Hàng 1: Ô tìm kiếm từ khóa nhân viên / mã nhân viên / chức vụ (`w-full`).
   - Hàng 2: Bộ lọc linh hoạt (Loại hồ sơ: Thôi việc/Chấm dứt, Trạng thái: Chờ duyệt, Đang bàn giao, Hoàn tất, Từ chối) và nút Làm mới.
4. **Table & Empty State (Rule 04):** Bảng hiển thị thông tin nhân viên (Avatar, Họ tên, Mã NV, Chức vụ, Phòng ban), Loại hồ sơ, Ngày làm việc cuối, Tiến độ bàn giao (Badge / Progress), Trạng thái (Badge màu chuẩn CYCLOSA), và Cột thao tác (Nút Xem chi tiết, Phê duyệt nhanh). Khi không có dữ liệu, hiển thị empty state nhúng trực tiếp trong thẻ `TableBody`.
5. **Chi tiết hồ sơ (`/offboarding/[id]`):**
   - Header: Thông tin nhân viên, trạng thái hiện tại, nút hành động (Phê duyệt/Từ chối nếu chờ duyệt; Nút Hoàn tất thủ tục nếu đủ điều kiện).
   - Tab 1: Thông tin chung & Lý do nghỉ việc / Quyết định chấm dứt.
   - Tab 2: Danh sách 5 hạng mục bàn giao với Dialog xác nhận từng hạng mục kèm ghi chú.
   - Tab 3: Khảo sát phỏng vấn thôi việc (Exit Interview Form).
   - Tab 4: Đối soát điều kiện hoàn tất (Tổng hợp tài sản thu hồi, phép tồn).
6. **Unified Form Dialogs (Rule 05):** Dialog tạo quyết định chấm dứt HĐLĐ, Dialog duyệt/từ chối đơn, Dialog cập nhật hạng mục bàn giao, Dialog phỏng vấn thôi việc sử dụng React Hook Form + Zod tiếng Việt chuẩn.
