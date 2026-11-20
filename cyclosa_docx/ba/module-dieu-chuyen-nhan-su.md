# TÀI LIỆU ĐẶC TẢ NGHIỆP VỤ & KỸ THUẬT: MODULE ĐIỀU CHUYỂN NHÂN SỰ (TRANSFER)

---

## 1. TỔNG QUAN & MỐI QUAN HỆ LIÊN MODULE

Module **Điều chuyển nhân sự (Transfer)** quản lý toàn bộ vòng đời của các quyết định luân chuyển, biến động nhân sự nội bộ trong doanh nghiệp. Phân hệ chịu trách nhiệm chuẩn hóa quy trình từ khâu lập phiếu đề xuất, kiểm tra tính hợp lệ của đơn vị tiếp nhận, trình phê duyệt qua Workflow, đến khâu thực thi áp dụng thay đổi vào hồ sơ nhân sự, ghi nhận lịch sử công tác bất biến và phát tín hiệu đồng bộ đến các phân hệ vệ tinh.

### 1.1. Phạm vi nghiệp vụ
- **Phân loại hình thức điều chuyển (Transfer Types):**
  - Điều chuyển nội bộ phòng ban / bộ phận (`INTERNAL_DEPARTMENT`).
  - Điều chuyển chi nhánh / địa điểm làm việc (`BRANCH_TRANSFER`).
  - Điều chuyển giữa các công ty thành viên trong tập đoàn (`INTER_COMPANY`).
  - Bổ nhiệm / Điều chuyển thay đổi chức danh, cấp bậc chuyên môn (`ROLE_PROMOTION_DEMOTION`).
  - Điều chuyển tạm thời có thời hạn / Biệt phái công tác (`TEMPORARY_DISPATCH`).
- **Phạm vi triển khai đợt này:**
  - Cổng Quản trị & Nhân sự (Admin & HR/Manager Portal): Quản lý phiếu điều chuyển, phê duyệt, theo dõi tiến độ, áp dụng hồ sơ, quản trị điều chuyển tạm thời và tra cứu lịch sử biến động.
  - Cổng ESS: Chưa nằm trong phạm vi đợt này.

### 1.2. Mối quan hệ liên module (Inter-module Architecture)
- **Module Hồ sơ Nhân sự (Employee):**
  - Chụp snapshot công tác hiện tại (`fromDepartment`, `fromBranch`, `fromJobTitle`, `fromManager`) khi lập phiếu.
  - Khi hoàn tất điều chuyển, tự động tạo bản ghi mới trong `EmployeeWorkAssignment` và cập nhật thông tin công tác hiện hành.
- **Module Cơ cấu Tổ chức (Organization):** Kiểm tra tính hợp lệ của đơn vị tiếp nhận (Phòng ban đích, Chi nhánh đích, Chức danh đích), chống gán nhân sự vào phòng ban đã ngừng hoạt động.
- **Module Quy trình Phê duyệt (Workflow):** Tích hợp trình duyệt tự động theo loại yêu cầu `TRANSFER_REQUEST` qua các cấp thẩm quyền (Trưởng đơn vị đi $\to$ Trưởng đơn vị đến $\to$ Giám đốc Nhân sự).
- **Module Tiền lương (Payroll):** Tiếp nhận thông tin đề xuất thay đổi mức lương cơ bản và phụ cấp chức vụ đi kèm quyết định điều chuyển, ghi nhận hiệu lực cho kỳ tính lương tương ứng.
- **Module Chấm công (Attendance):** Khi nhân viên chuyển đổi chi nhánh làm việc, hệ thống kích hoạt đồng bộ địa điểm chấm công GPS và phân ca làm việc mới theo sơ đồ ca của chi nhánh tiếp nhận.
- **Module Mặt bằng & Chỗ ngồi (Workplace):** Giải phóng chỗ ngồi cũ và kích hoạt yêu cầu sắp xếp chỗ ngồi, tủ tài liệu tại văn phòng/chi nhánh mới.
- **Module Thông báo (Notification):** Phát thông báo chúc mừng/hướng dẫn nhận việc đến nhân sự và thông báo điều chuyển đến các phòng ban liên quan.

---

## 2. QUY TRÌNH NGHIỆP VỤ CỐT LÕI (CORE WORKFLOWS)

### 2.1. Lập phiếu điều chuyển nhân sự (Transfer Request Creation)
1. **Khởi tạo:** HR/Quản lý lựa chọn nhân viên cần điều chuyển.
2. **Chụp Snapshot tự động:** Hệ thống tự động truy xuất hồ sơ nhân sự và điền sẵn các thông tin nguồn:
   - Phòng ban hiện tại (`fromDepartment`)
   - Chi nhánh / Khu vực hiện tại (`fromBranch`)
   - Chức danh hiện tại (`fromJobTitle`)
   - Cấp bậc hiện tại (`fromJobLevel`)
   - Quản lý trực tiếp hiện tại (`fromManager`)
3. **Khai báo đơn vị tiếp nhận (Target Destination):**
   - Lựa chọn loại hình điều chuyển (`transferType`).
   - Chọn Phòng ban tiếp nhận (`toDepartment`), Chi nhánh tiếp nhận (`toBranch`).
   - Chọn Chức danh mới (`toJobTitle`), Cấp bậc mới (`toJobLevel`), Quản lý mới (`toManager`).
   - Xác định Ngày có hiệu lực (`effectiveDate`).
   - Nếu là điều chuyển tạm thời (`TEMPORARY_DISPATCH`), bắt buộc nhập Ngày kết thúc dự kiến (`endDate`).
   - Nhập Lý do điều chuyển (`reason`) và Căn cứ/Nội dung chi tiết (`reasonDetail`).
   - Khai báo đề xuất điều chỉnh lương/phụ cấp mới (nếu có thỏa thuận đãi ngộ mới).
4. **Trạng thái khởi tạo:** Phiếu được lưu ở trạng thái Dự thảo (`DRAFT`), cho phép chỉnh sửa trước khi gửi duyệt.

### 2.2. Kiểm tra điều kiện tiên quyết (Prerequisites & Validation)
Trước khi lưu hoặc trình duyệt, hệ thống áp dụng các quy tắc ràng buộc chặt chẽ:
1. **Ngày hiệu lực:** `effectiveDate` không được nằm trong quá khứ (phải lớn hơn hoặc bằng ngày hiện tại).
2. **Thời hạn điều chuyển tạm thời:** Nếu có `endDate`, bắt buộc `endDate > effectiveDate`.
3. **Chống trùng lặp đích:** Không cho phép tạo điều chuyển nếu tất cả các trường tiếp nhận (phòng ban, chi nhánh, chức danh, quản lý) đều trùng khớp 100% với đơn vị hiện tại (không có sự biến động).
4. **Chống xung đột yêu cầu:** Một nhân viên không thể có 2 phiếu điều chuyển đang cùng ở trạng thái `SUBMITTED`, `PENDING_APPROVAL`, hoặc `APPROVED` chưa áp dụng.
5. **Tính hợp lệ của đơn vị đích:** Phòng ban tiếp nhận phải đang ở trạng thái hoạt động (`ACTIVE`), thuộc cùng phạm vi công ty hoặc tập đoàn.

### 2.3. Quy trình phê duyệt đa cấp (Approval via Workflow)
1. Khi hoàn tất phiếu, HR nhấn **Trình phê duyệt**. Trạng thái phiếu chuyển sang `SUBMITTED` / `PENDING_APPROVAL`, nội dung bị khóa cứng chống chỉnh sửa.
2. Phiếu được liên kết với một `workflow_request_id` trong module Workflow.
3. Người có thẩm quyền (Quản lý hiện tại, Quản lý tiếp nhận, Giám đốc Nhân sự/Tổng giám đốc) xem xét thông tin so sánh Trước $\leftrightarrow$ Sau, mức đãi ngộ và lý do để đưa ra quyết định:
   - **Phê duyệt (`APPROVED`):** Chuyển sang hàng đợi sẵn sàng áp dụng.
   - **Từ chối (`REJECTED`):** Bắt buộc nhập lý do từ chối, phiếu chuyển sang trạng thái từ chối.
   - **Hủy bỏ (`CANCELLED`):** Người tạo có quyền hủy phiếu khi phiếu đang ở trạng thái `DRAFT` hoặc `PENDING_APPROVAL`.

### 2.4. Thực thi & Áp dụng điều chuyển (Execution & Completion)
1. Khi phiếu đã được duyệt (`APPROVED`) và đến Ngày hiệu lực (`effectiveDate <= TODAY`):
   - HR hoặc hệ thống lập lịch tự động (Scheduled Job) nhấn **Hoàn tất & Áp dụng**.
2. **Hành động hệ thống:**
   - Đóng `effectiveTo` của phân công công tác cũ (`EmployeeWorkAssignment`).
   - Tạo phân công công tác mới với các thông tin tiếp nhận (`toDepartment`, `toBranch`, `toJobTitle`, `toJobLevel`, `toManager`), ghi nhận `effectiveFrom = effectiveDate`.
   - Ghi nhận vào lịch sử trạng thái/biến động công tác của nhân sự.
   - Chuyển trạng thái phiếu điều chuyển sang `COMPLETED`, lưu `completedAt` và `completedBy`.
   - Phát sự kiện liên module `TransferCompletedEvent`.
3. **Đồng bộ tự động:**
   - **Payroll:** Tiếp nhận thông tin mức lương/phụ cấp mới để đưa vào kỳ tính lương kế tiếp.
   - **Attendance:** Tự động điều chỉnh địa điểm chấm công cho phép (GPS Office Radius) và phân ca làm việc chi nhánh mới.
   - **Workplace:** Kích hoạt bàn giao chỗ ngồi mới.

### 2.5. Quản trị Điều chuyển tạm thời (Temporary Dispatch Management)
1. **Theo dõi thời hạn:** Hệ thống duy trì bộ đếm thời hạn cho các phiếu `TEMPORARY_DISPATCH`.
2. **Cảnh báo hết hạn:** Trước ngày kết thúc (`endDate`) 15 ngày và 30 ngày, hệ thống tự động gửi thông báo đến HR và Quản lý tiếp nhận.
3. **Các kịch bản kết thúc điều chuyển tạm thời:**
   - **Gia hạn thời hạn:** Tạo phụ lục gia hạn ngày kết thúc mới.
   - **Chuyển đổi thành chính thức:** Ban hành phiếu điều chuyển chính thức tại đơn vị tiếp nhận.
   - **Điều chuyển trở lại (Return Transfer):** Tự động sinh phiếu điều chuyển quay trở lại đơn vị nguồn (`fromDepartment`, `fromBranch`, `fromJobTitle`, `fromManager`) để tiếp tục công tác.

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

### 3.1. Bảng `transfer_requests`
```sql
CREATE TABLE IF NOT EXISTS transfer_requests (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    transfer_type VARCHAR(40) NOT NULL, -- INTERNAL_DEPARTMENT, BRANCH_TRANSFER, INTER_COMPANY, ROLE_PROMOTION_DEMOTION, TEMPORARY_DISPATCH
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, PENDING_APPROVAL, APPROVED, REJECTED, COMPLETED, CANCELLED
    
    -- Dữ liệu nguồn Snapshot (Trước điều chuyển)
    from_department_id VARCHAR(36) NOT NULL,
    from_branch_id VARCHAR(36),
    from_job_title_id VARCHAR(36) NOT NULL,
    from_job_level_id VARCHAR(36),
    from_manager_id VARCHAR(36),
    from_base_salary NUMERIC(15, 2),
    
    -- Dữ liệu đích tiếp nhận (Sau điều chuyển)
    to_department_id VARCHAR(36) NOT NULL,
    to_branch_id VARCHAR(36),
    to_job_title_id VARCHAR(36) NOT NULL,
    to_job_level_id VARCHAR(36),
    to_manager_id VARCHAR(36),
    to_base_salary NUMERIC(15, 2),
    
    -- Thời hạn & Căn cứ
    effective_date DATE NOT NULL,
    end_date DATE, -- Bắt buộc nếu là TEMPORARY_DISPATCH
    reason VARCHAR(100) NOT NULL, -- BUSINESS_NEED, PROMOTION, CAREER_DEVELOPMENT, PERFORMANCE, RESTRUCTURING, EMPLOYEE_REQUEST, TEMPORARY_PROJECT, OTHER
    reason_detail TEXT,
    notes TEXT,
    
    -- Đãi ngộ & Phụ cấp mới
    has_salary_adjustment BOOLEAN NOT NULL DEFAULT FALSE,
    salary_notes TEXT,
    
    -- Tích hợp Workflow & Phê duyệt
    workflow_request_id VARCHAR(36),
    approved_by VARCHAR(36),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Thực thi hoàn tất
    completed_by VARCHAR(36),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_returned BOOLEAN NOT NULL DEFAULT FALSE, -- Dành cho phiếu tạm thời đã hoàn thành hồi hương
    
    -- Base Entity Fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_transfer_employee FOREIGN KEY (employee_id) REFERENCES employees(id),
    CONSTRAINT fk_transfer_from_dept FOREIGN KEY (from_department_id) REFERENCES departments(id),
    CONSTRAINT fk_transfer_to_dept FOREIGN KEY (to_department_id) REFERENCES departments(id),
    CONSTRAINT fk_transfer_from_mgr FOREIGN KEY (from_manager_id) REFERENCES employees(id),
    CONSTRAINT fk_transfer_to_mgr FOREIGN KEY (to_manager_id) REFERENCES employees(id)
);

CREATE INDEX IF NOT EXISTS idx_transfer_employee ON transfer_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_transfer_status ON transfer_requests(status);
CREATE INDEX IF NOT EXISTS idx_transfer_type ON transfer_requests(transfer_type);
CREATE INDEX IF NOT EXISTS idx_transfer_effective_date ON transfer_requests(effective_date);
CREATE INDEX IF NOT EXISTS idx_transfer_end_date ON transfer_requests(end_date);
```

### 3.2. Bảng `transfer_allowances` (Phụ cấp điều chuyển đi kèm)
```sql
CREATE TABLE IF NOT EXISTS transfer_allowances (
    id VARCHAR(36) PRIMARY KEY,
    transfer_request_id VARCHAR(36) NOT NULL,
    allowance_name VARCHAR(150) NOT NULL, -- Phụ cấp biệt phái, Phụ cấp trách nhiệm, Phụ cấp nhà ở / di chuyển...
    amount NUMERIC(15, 2) NOT NULL,
    notes VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_allowance_transfer FOREIGN KEY (transfer_request_id) REFERENCES transfer_requests(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_allowance_transfer_id ON transfer_allowances(transfer_request_id);
```

---

## 4. DANH MỤC API RESTFUL (BACKEND ENDPOINTS)

| Method | Endpoint | Quyền hạn | Mô tả chức năng |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/transfers` | `transfer.view` | Tìm kiếm & phân trang danh sách phiếu điều chuyển |
| `GET` | `/api/v1/transfers/statistics` | `transfer.view` | Thống kê KPI: Tổng phiếu, Chờ duyệt, Sắp hiệu lực, Tạm thời |
| `GET` | `/api/v1/transfers/{id}` | `transfer.view` | Chi tiết phiếu điều chuyển so sánh Trước $\leftrightarrow$ Sau |
| `GET` | `/api/v1/transfers/employee/{employeeId}/current-snapshot` | `transfer.create` | Lấy dữ liệu công tác hiện tại của nhân sự để tạo phiếu |
| `POST` | `/api/v1/transfers` | `transfer.create` | Tạo mới phiếu điều chuyển nhân sự (DRAFT) |
| `PUT` | `/api/v1/transfers/{id}` | `transfer.create` | Chỉnh sửa phiếu điều chuyển khi còn ở trạng thái DRAFT |
| `DELETE` | `/api/v1/transfers/{id}` | `transfer.create` | Xóa phiếu điều chuyển (DRAFT hoặc REJECTED) |
| `POST` | `/api/v1/transfers/{id}/submit` | `transfer.create` | Trình phiếu điều chuyển sang Workflow xét duyệt |
| `PUT` | `/api/v1/transfers/{id}/approve` | `transfer.approve` | Trực tiếp phê duyệt phiếu điều chuyển |
| `PUT` | `/api/v1/transfers/{id}/reject` | `transfer.approve` | Từ chối phiếu điều chuyển kèm lý do |
| `POST` | `/api/v1/transfers/{id}/cancel` | `transfer.create` | Hủy phiếu điều chuyển khi chưa hoàn tất |
| `POST` | `/api/v1/transfers/{id}/apply` | `transfer.manage` | Thực thi áp dụng điều chuyển vào hồ sơ & phát sự kiện |
| `GET` | `/api/v1/transfers/temporary/expiring` | `transfer.view` | Danh sách điều chuyển tạm thời sắp đến hạn kết thúc |
| `POST` | `/api/v1/transfers/{id}/temporary/extend` | `transfer.manage` | Gia hạn ngày kết thúc của điều chuyển tạm thời |
| `POST` | `/api/v1/transfers/{id}/temporary/return` | `transfer.manage` | Lập lệnh điều chuyển trở lại đơn vị cũ sau khi hết hạn biệt phái |

---

## 5. ĐẶC TẢ GIAO DIỆN ADMIN (FRONTEND UI)

Tuân thủ nghiêm ngặt bộ tiêu chuẩn **CYCLOSA Frontend Rules**:

### 5.1. Header & Điều hướng (Rule 02)
- Header sạch, không bọc icon box và không subtitle:
  `<h1 className="text-2xl font-bold tracking-tight">Điều chuyển nhân sự</h1>`
- Cụm nút thao tác bên phải:
  - Nút **Làm mới** (RefreshCw).
  - Nút **Tạo phiếu điều chuyển** (`Plus` icon, màu primary).

### 5.2. Thẻ Thống kê KPI (Rule 03 - Chuẩn CYCLOSA Stats Cards)
Khối thẻ 4 cột với đồ thị Sparkline SVG mượt mà và tương tác click lọc trực tiếp:
1. **Tổng số phiếu điều chuyển (`ALL`):**
   - Icon: `Users`, Nền: `bg-primary text-white`, Sparkline: `#DC2626`.
2. **Chờ phê duyệt (`PENDING_APPROVAL`):**
   - Icon: `Clock`, Nền: `bg-amber-500 text-white`, Sparkline: `#F59E0B`.
3. **Đã duyệt chờ hiệu lực (`APPROVED`):**
   - Icon: `Calendar`, Nền: `bg-blue-600 text-white`, Sparkline: `#2563EB`.
4. **Điều chuyển tạm thời (`TEMPORARY_DISPATCH`):**
   - Icon: `Shuffle`, Nền: `bg-purple-600 text-white`, Sparkline: `#9333EA`.

### 5.3. Thanh Bộ lọc 2 Hàng (Rule 03 - Filter Bar)
- **Hàng 1:** Ô tìm kiếm toàn màn hình (`w-full`), placeholder: *"Tìm kiếm theo tên nhân viên, mã nhân viên, lý do..."*.
- **Hàng 2:**
  - Dropdown **Loại điều chuyển** (`Select` với các tùy chọn: Tất cả, Nội bộ phòng ban, Khác chi nhánh, Công ty thành viên, Thay đổi chức vụ, Tạm thời).
  - Dropdown **Trạng thái** (`Select`: Tất cả, Dự thảo, Chờ duyệt, Đã duyệt, Đã hoàn tất, Đã từ chối).
  - Dropdown **Phòng ban tiếp nhận** (`Select` danh sách phòng ban).
  - Nút **Làm mới bộ lọc** (`RotateCcw`).

### 5.4. Bảng Dữ liệu & Empty State (Rule 04)
- **Cột dữ liệu:**
  1. **Nhân viên:** Avatar, Họ tên, Mã nhân viên.
  2. **Hình thức:** Badge loại điều chuyển (Việt hóa 100%).
  3. **Đơn vị hiện tại (Trước):** Phòng ban, Chức danh, Quản lý cũ.
  4. **Đơn vị tiếp nhận (Sau):** Phòng ban, Chức danh, Quản lý mới (Highlight mũi tên $\to$).
  5. **Ngày hiệu lực / Hạn:** Ngày bắt đầu hiệu lực (kèm ngày kết thúc nếu là tạm thời).
  6. **Trạng thái:** Badge trạng thái chuẩn CYCLOSA (`DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `COMPLETED`, `REJECTED`, `CANCELLED`).
  7. **Thao tác:** Dropdown Menu (Xem chi tiết, Trình duyệt, Phê duyệt, Từ chối, Áp dụng, Hủy/Xóa).
- **Embedded Empty State:** Nhúng trực tiếp trong `TableBody` (`TableRow` $\to$ `TableCell colSpan={7}`) khi danh sách trống.

### 5.5. Trang Chi tiết Phiếu Điều chuyển (`/transfers/[id]`)
- **Card So sánh Đối chiếu Trước $\leftrightarrow$ Sau (Side-by-side Comparison):**
  - Cột 1: Thông tin công tác hiện tại (Snapshot nguồn).
  - Cột 2: Mũi tên chuyển giao & Ngày hiệu lực.
  - Cột 3: Thông tin công tác tiếp nhận (Đích đến mới).
- **Card Đãi ngộ & Lương thưởng:** Hiển thị mức lương cũ $\leftrightarrow$ mới, các khoản phụ cấp điều chuyển đi kèm.
- **Card Quy trình Phê duyệt:** Tiến trình các bước duyệt trong Workflow, người duyệt, thời gian và ý kiến.
- **Nút hành động:** Phê duyệt / Từ chối (nếu có quyền), Nút **Áp dụng vào hồ sơ** (nếu đã duyệt và đến ngày hiệu lực).

### 5.6. Dialog Form Tạo & Chỉnh sửa (Rule 05)
- Sử dụng React Hook Form + Zod tiếng Việt (`transferFormSchema`).
- Tự động nạp dữ liệu Snapshot khi chọn nhân viên.
- Ràng buộc động: Khi chọn loại `TEMPORARY_DISPATCH`, hiển thị trường Ngày kết thúc bắt buộc.

---

## 6. QUY TẮC NGHIỆP VỤ & TỰ ĐỘNG HÓA NÂNG CAO

1. **Lập lịch áp dụng tự động (Scheduled Job Daily):**
   - Vào 00:00 mỗi ngày, hệ thống quét các phiếu `APPROVED` có `effectiveDate <= TODAY`.
   - Tự động gọi Service áp dụng vào `EmployeeWorkAssignment` mà không cần HR thao tác thủ công bằng tay.
2. **Cảnh báo điều chuyển tạm thời:**
   - Thông báo định kỳ trước 30 ngày và 15 ngày khi sắp hết hạn biệt phái.
   - Khi hết hạn, tự động đưa ra 3 phương án: Hồi hương đơn vị cũ / Gia hạn / Chuyển chính thức.
3. **Đồng bộ phân ca & chấm công:**
   - Ngay khi phiếu chuyển `COMPLETED`, tự động cập nhật `branchId` mới cho nhân sự để hợp lệ hóa việc điểm danh GPS tại văn phòng mới.
