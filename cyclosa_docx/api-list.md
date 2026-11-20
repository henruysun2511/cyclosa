# DANH SÁCH API — HỆ THỐNG QUẢN TRỊ NGUỒN NHÂN LỰC (HRM) FSI

> Nguồn: `QLDA.docx` (21 module) — khớp với thiết kế CSDL trong `DATABASE_DESIGN.md`.  
> Tổng cộng **726 endpoint** REST, nhóm theo 21 module nghiệp vụ và nhóm dùng chung (Workflow, Tài sản, Tệp, Cấu hình).

## Mục lục

1. [Quy ước chung](#1-quy-ước-chung)
2. [Tổng hợp theo module](#2-tổng-hợp-theo-module)
3. [Danh sách API chi tiết](#3-danh-sách-api-chi-tiết)
   - [0. XÁC THỰC (Authentication)](#0-xác-thực-authentication) (14)
   - [DÙNG CHUNG (Files, Cấu hình, Ngày lễ, Kỹ năng, Workflow, Tài sản)](#dùng-chung-files-cấu-hình-ngày-lễ-kỹ-năng-workflow-tài-sản) (39)
   - [1. QUẢN LÝ TỔ CHỨC (Organization)](#1-quản-lý-tổ-chức-organization) (37)
   - [2. MÔ PHỎNG TÁI CƠ CẤU TỔ CHỨC (What-if)](#2-mô-phỏng-tái-cơ-cấu-tổ-chức-what-if) (20)
   - [3. PHÂN QUYỀN (Role & Permission)](#3-phân-quyền-role-permission) (12)
   - [4. TUYỂN DỤNG (Recruitment)](#4-tuyển-dụng-recruitment) (95)
   - [5. HỒ SƠ NHÂN SỰ (Employee Profile & Lifecycle)](#5-hồ-sơ-nhân-sự-employee-profile-lifecycle) (37)
   - [6. HỘI NHẬP NHÂN SỰ (Onboarding)](#6-hội-nhập-nhân-sự-onboarding) (30)
   - [7. SỐ HÓA & LƯU KHO HỒ SƠ (Digital Records)](#7-số-hóa-lưu-kho-hồ-sơ-digital-records) (43)
   - [8. HỢP ĐỒNG & HỢP ĐỒNG ĐIỆN TỬ (Contract)](#8-hợp-đồng-hợp-đồng-điện-tử-contract) (42)
   - [9. CHẤM CÔNG & CA LÀM VIỆC (Attendance)](#9-chấm-công-ca-làm-việc-attendance) (39)
   - [10. BẢNG LƯƠNG & TÍNH LƯƠNG TỰ ĐỘNG (Payroll)](#10-bảng-lương-tính-lương-tự-động-payroll) (45)
   - [11. HIỆU SUẤT & KPI (Performance)](#11-hiệu-suất-kpi-performance) (26)
   - [12. KHEN THƯỞNG, KỶ LUẬT & KHIẾU NẠI](#12-khen-thưởng-kỷ-luật-khiếu-nại) (26)
   - [13. PHÁT TRIỂN NHÂN SỰ & QUY HOẠCH KẾ NHIỆM (Career & Succession)](#13-phát-triển-nhân-sự-quy-hoạch-kế-nhiệm-career-succession) (26)
   - [14. QUẢN LÝ NGHỈ PHÉP (Leave)](#14-quản-lý-nghỉ-phép-leave) (20)
   - [15. ĐIỀU CHUYỂN NHÂN SỰ (Transfer)](#15-điều-chuyển-nhân-sự-transfer) (10)
   - [16. THÔI VIỆC & CHẤM DỨT HỢP ĐỒNG (Offboarding)](#16-thôi-việc-chấm-dứt-hợp-đồng-offboarding) (26)
   - [17. PHÁP LUẬT & TUÂN THỦ (Legal & Compliance)](#17-pháp-luật-tuân-thủ-legal-compliance) (39)
   - [18. TRỢ LÝ AI 1-1 (AI Assistant)](#18-trợ-lý-ai-1-1-ai-assistant) (16)
   - [19. SƠ ĐỒ GHẾ NGỒI & KHÔNG GIAN LÀM VIỆC (Smart Workplace)](#19-sơ-đồ-ghế-ngồi-không-gian-làm-việc-smart-workplace) (70)
   - [20. THÔNG BÁO NỘI BỘ (Notification)](#20-thông-báo-nội-bộ-notification) (7)
   - [21. NHẬT KÝ KIỂM TOÁN (Audit Log)](#21-nhật-ký-kiểm-toán-audit-log) (5)
   - [NHÓM TIỆN ÍCH CHUNG](#nhóm-tiện-ích-chung) (2)
4. [Phụ lục A — Luồng phê duyệt (Workflow)](#phụ-lục-a--luồng-phê-duyệt-workflow)
5. [Phụ lục B — API xử lý bất đồng bộ](#phụ-lục-b--api-xử-lý-bất-đồng-bộ)
6. [Phụ lục C — Danh mục mã quyền](#phụ-lục-c--danh-mục-mã-quyền)
7. [Phụ lục D — Giả định khi thiết kế API](#phụ-lục-d--giả-định-khi-thiết-kế-api)

---

## 1. Quy ước chung

### 1.1. Giao thức

| Hạng mục | Quy ước |
| --- | --- |
| Base URL | `/api/v1` — mọi đường dẫn trong tài liệu đều **tính từ** tiền tố này (vd `/auth/login` = `POST /api/v1/auth/login`) |
| Định dạng | JSON (`application/json`, UTF-8); tải tệp dùng `multipart/form-data` |
| Xác thực | `Authorization: Bearer <accessToken>` (JWT). Access Token đã đăng xuất bị chặn bởi Redis Blacklist |
| Đa công ty | Công ty hiện hành lấy từ `user_role_assignments`; endpoint có `companyId` ở query dùng khi người dùng có vai trò ở nhiều công ty |
| Thời gian | `TIMESTAMP` theo ISO-8601 UTC (`2026-10-03T08:30:00Z`); `DATE` dạng `YYYY-MM-DD` |
| Tiền tệ | Số thập phân dạng chuỗi/`number`, đơn vị VND |
| Enum | Chuỗi đúng tên giá trị trong `DATABASE_DESIGN.md` (vd `PENDING_APPROVAL`); danh sách tại `GET /lookups/{enumName}` |
| Định danh | `id` kiểu số nguyên (BIGINT) trong đường dẫn |

### 1.2. Cột "Quyền" trong các bảng

| Giá trị | Ý nghĩa |
| --- | --- |
| `Public` | Không cần đăng nhập |
| `Auth` | Chỉ cần đăng nhập; hệ thống tự giới hạn ở **dữ liệu của chính người gọi** (phạm vi `OWN`) hoặc đối tượng người gọi là bên liên quan (người duyệt, giám khảo, thành viên hội đồng...) |
| `resource.action` | Mã quyền chức năng trong bảng `permissions` (vd `employee.view`). Phạm vi dữ liệu (`OWN/TEAM/DEPARTMENT/COMPANY/ALL`) do `role_permissions.data_scope` của vai trò quyết định, **không** nằm trong mã quyền |
| `Service` | Chỉ gọi nội bộ giữa các module/dịch vụ (token dịch vụ), không mở cho người dùng cuối |

### 1.3. Phân trang, lọc, sắp xếp

| Tham số | Ý nghĩa |
| --- | --- |
| `page`, `size` | Trang (bắt đầu 0) và kích thước (mặc định 20, tối đa 100) cho mọi `GET` trả danh sách |
| `sort` | `field,asc` hoặc `field,desc`; nhiều trường phân tách bằng dấu `;` |
| `keyword` | Tìm kiếm văn bản tự do trên các trường chính của tài nguyên |
| `from`, `to` | Khoảng ngày/giờ (bao gồm hai đầu) |
| `asOf` / `date` | Xem dữ liệu tại một thời điểm (dữ liệu hiệu lực theo thời gian) |

### 1.4. Cấu trúc phản hồi

```json
// Thành công
{ "success": true, "data": { }, "meta": { "page": 0, "size": 20, "totalElements": 135, "totalPages": 7 } }

// Lỗi
{ "success": false, "error": { "code": "CONTRACT_NOT_FOUND", "message": "Không tìm thấy hợp đồng", "details": [ { "field": "endDate", "reason": "must_be_after_start_date" } ] }, "traceId": "..." }
```

| HTTP | Dùng khi |
| --- | --- |
| 200 / 201 / 204 | Thành công / tạo mới / thành công không có nội dung |
| 202 | Đã nhận, xử lý bất đồng bộ (Phụ lục B) |
| 400 | Dữ liệu không hợp lệ (validation) |
| 401 | Chưa xác thực / token hết hạn / nằm trong Blacklist |
| 403 | Không đủ quyền hoặc ngoài phạm vi dữ liệu (vd `FORBIDDEN_SIMULATION_ACCESS`) |
| 404 | Không tìm thấy (hoặc ngoài phạm vi nên bị ẩn) |
| 409 | Xung đột trạng thái/ràng buộc nghiệp vụ (xóa dữ liệu đang được tham chiếu, sai vòng đời, trùng lịch, vi phạm unique) |
| 422 | Vi phạm quy tắc nghiệp vụ/tuân thủ pháp lý (hết thời hiệu, thiếu điều kiện hoàn tất...) |

### 1.5. Quy ước hành vi

- **Route tĩnh ưu tiên route có tham số:** vd `GET /contracts/expiring`, `GET /employees/export`, `GET /documents/expiring`, `GET /org-scenarios/compare` được khớp trước `GET /…/{id}`.
- **`DELETE` trên dữ liệu danh mục** chỉ thành công khi chưa được tham chiếu; ngược lại trả `409`. Đơn vị tổ chức và cơ sở dùng xóa logic (`dissolved_date`, `deleted_at`).
- **Dữ liệu đã chốt bất biến:** bảng lương đã khóa, quyết định kỷ luật, phiếu đánh giá `FINALIZED`, quy tắc `PUBLISHED`, hợp đồng đã ký — chỉ có thao tác tạo bản/phiên bản mới, không có `PUT` ghi đè.
- **Chuyển trạng thái** thực hiện bằng `POST /{resource}/{id}/{hành-động}` (vd `/submit`, `/cancel`, `/complete`); `PATCH` chỉ dùng cho thay đổi một thuộc tính đơn.
- **Giá trị tính toán không lưu** (tổng lương, số dư phép, trạng thái chấm công ngày, tiến độ hội nhập...) được trả trong response của các `GET` tương ứng, không có endpoint ghi.
- **Ghi Audit tự động:** mọi `POST/PUT/PATCH/DELETE` thành công và các `GET` nhạy cảm (tài liệu nhạy cảm, lương, tải phiếu lương) được ghi vào `audit_logs`.
- **Phê duyệt:** gửi duyệt ở endpoint `.../submit` của module; **duyệt/từ chối** ở nhóm `/workflow-requests` (Phụ lục A).

---

## 2. Tổng hợp theo module

| # | Module | Số API | Số nhóm |
| --- | --- | ---: | ---: |
| 1 | 0. XÁC THỰC (Authentication) | 14 | 2 |
| 2 | DÙNG CHUNG (Files, Cấu hình, Ngày lễ, Kỹ năng, Workflow, Tài sản) | 39 | 7 |
| 3 | 1. QUẢN LÝ TỔ CHỨC (Organization) | 37 | 6 |
| 4 | 2. MÔ PHỎNG TÁI CƠ CẤU TỔ CHỨC (What-if) | 20 | 3 |
| 5 | 3. PHÂN QUYỀN (Role & Permission) | 12 | 3 |
| 6 | 4. TUYỂN DỤNG (Recruitment) | 95 | 13 |
| 7 | 5. HỒ SƠ NHÂN SỰ (Employee Profile & Lifecycle) | 37 | 6 |
| 8 | 6. HỘI NHẬP NHÂN SỰ (Onboarding) | 30 | 6 |
| 9 | 7. SỐ HÓA & LƯU KHO HỒ SƠ (Digital Records) | 43 | 7 |
| 10 | 8. HỢP ĐỒNG & HỢP ĐỒNG ĐIỆN TỬ (Contract) | 42 | 5 |
| 11 | 9. CHẤM CÔNG & CA LÀM VIỆC (Attendance) | 39 | 6 |
| 12 | 10. BẢNG LƯƠNG & TÍNH LƯƠNG TỰ ĐỘNG (Payroll) | 45 | 7 |
| 13 | 11. HIỆU SUẤT & KPI (Performance) | 26 | 3 |
| 14 | 12. KHEN THƯỞNG, KỶ LUẬT & KHIẾU NẠI | 26 | 3 |
| 15 | 13. PHÁT TRIỂN NHÂN SỰ & QUY HOẠCH KẾ NHIỆM (Career & Succession) | 26 | 4 |
| 16 | 14. QUẢN LÝ NGHỈ PHÉP (Leave) | 20 | 3 |
| 17 | 15. ĐIỀU CHUYỂN NHÂN SỰ (Transfer) | 10 | 1 |
| 18 | 16. THÔI VIỆC & CHẤM DỨT HỢP ĐỒNG (Offboarding) | 26 | 4 |
| 19 | 17. PHÁP LUẬT & TUÂN THỦ (Legal & Compliance) | 39 | 6 |
| 20 | 18. TRỢ LÝ AI 1-1 (AI Assistant) | 16 | 3 |
| 21 | 19. SƠ ĐỒ GHẾ NGỒI & KHÔNG GIAN LÀM VIỆC (Smart Workplace) | 70 | 9 |
| 22 | 20. THÔNG BÁO NỘI BỘ (Notification) | 7 | 2 |
| 23 | 21. NHẬT KÝ KIỂM TOÁN (Audit Log) | 5 | 1 |
| 24 | NHÓM TIỆN ÍCH CHUNG | 2 | 1 |
| | **Tổng** | **726** | 111 |

| Phương thức | Số API |
| --- | ---: |
| GET | 301 |
| POST | 262 |
| PUT | 105 |
| PATCH | 2 |
| DELETE | 56 |

---

## 3. Danh sách API chi tiết

### 0. XÁC THỰC (Authentication)

> Stateless JWT; Refresh Token và Blacklist lưu Redis. Tài khoản do quản trị viên tạo, nhân viên không tự đăng ký. Không có API "quên mật khẩu/đổi mật khẩu" vì tài liệu nghiệp vụ không mô tả.

#### Đăng nhập, phiên làm việc

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | Đăng nhập email + mật khẩu; trả Access Token, Refresh Token, thông tin người dùng và roles. Body: email, password | `Public` |
| `POST` | `/auth/activate` | Kích hoạt tài khoản bằng token email 48 giờ, đặt mật khẩu lần đầu, tự động đăng nhập. Body: token, password | `Public` |
| `POST` | `/auth/refresh` | Cấp Access Token mới từ Refresh Token hợp lệ (đối chiếu Redis). Body: refreshToken | `Public` |
| `POST` | `/auth/logout` | Đưa Access Token vào Redis Blacklist (TTL còn lại) và xóa Refresh Token | `Auth` |
| `GET` | `/auth/google` | Khởi tạo luồng Google OAuth2 (redirect tới Google) | `Public` |
| `GET` | `/auth/oauth2/callback/google` | Callback OAuth2: tìm/tạo `oauth_accounts`, liên kết User theo email, gán vai trò mặc định, cấp token | `Public` |
| `GET` | `/auth/me` | Thông tin tài khoản đang đăng nhập, danh sách roles và nhân viên liên kết | `Auth` |
| `GET` | `/auth/me/permissions` | Tập quyền hiệu lực (permission + data scope rộng nhất) theo từng công ty | `Auth` |

#### Quản lý tài khoản (quản trị viên)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/users` | Tạo tài khoản nhân viên (`PENDING_ACTIVATION`), sinh token 48 giờ, gửi email kích hoạt. Body: email, employeeId?, roleIds | `user.create` |
| `GET` | `/users` | Danh sách tài khoản. Query: keyword, status, roleId, page, size | `user.view` |
| `GET` | `/users/{userId}` | Chi tiết tài khoản, trạng thái, lần đăng nhập gần nhất, roles | `user.view` |
| `POST` | `/users/{userId}/resend-activation` | Gửi lại liên kết kích hoạt (chỉ khi `PENDING_ACTIVATION`) | `user.update` |
| `POST` | `/users/{userId}/lock` | Khóa tài khoản (`LOCKED`) và hủy phiên đăng nhập hiện tại | `user.lock` |
| `POST` | `/users/{userId}/unlock` | Mở khóa tài khoản | `user.lock` |

---

### DÙNG CHUNG (Files, Cấu hình, Ngày lễ, Kỹ năng, Workflow, Tài sản)

> Các module nghiệp vụ gửi yêu cầu phê duyệt qua endpoint `.../submit` của chính module đó; việc **duyệt/từ chối** thực hiện thống nhất ở nhóm `/workflow-requests` bên dưới.

#### Tệp tin

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/files` | Tải tệp lên object storage (multipart); trả `fileId`, `sha256Hash` | `Auth` |
| `GET` | `/files/{fileId}` | Siêu dữ liệu tệp | `Auth` |
| `GET` | `/files/{fileId}/download` | Tải/xem tệp qua URL ký có thời hạn (kiểm tra quyền theo đối tượng sở hữu) | `Auth` |

#### Cấu hình hệ thống

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/system-configurations` | Danh sách khóa cấu hình. Query: companyId, prefix | `system.view` |
| `GET` | `/system-configurations/{configKey}` | Giá trị một khóa (ưu tiên cấu hình theo công ty, fallback toàn hệ thống). Query: companyId | `system.view` |
| `PUT` | `/system-configurations/{configKey}` | Cập nhật giá trị. Body: companyId?, value | `system.update` |

#### Ngày nghỉ lễ

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/holidays` | Danh sách ngày lễ. Query: companyId, year | `Auth` |
| `POST` | `/holidays` | Thêm ngày lễ | `holiday.manage` |
| `PUT` | `/holidays/{holidayId}` | Sửa ngày lễ | `holiday.manage` |
| `DELETE` | `/holidays/{holidayId}` | Xóa ngày lễ | `holiday.manage` |

#### Danh mục kỹ năng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/skills` | Danh sách kỹ năng. Query: companyId, keyword | `Auth` |
| `POST` | `/skills` | Tạo kỹ năng | `skill.manage` |
| `PUT` | `/skills/{skillId}` | Sửa kỹ năng | `skill.manage` |
| `DELETE` | `/skills/{skillId}` | Xóa kỹ năng (chưa được tham chiếu) | `skill.manage` |

#### Định nghĩa quy trình phê duyệt (Workflow)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workflow-definitions` | Danh sách quy trình. Query: companyId, requestType, active | `workflow.manage` |
| `POST` | `/workflow-definitions` | Tạo quy trình (kèm các bước). Body: requestType, name, steps[] | `workflow.manage` |
| `GET` | `/workflow-definitions/{definitionId}` | Chi tiết quy trình và các bước | `workflow.manage` |
| `PUT` | `/workflow-definitions/{definitionId}` | Sửa tên, bước (chỉ ảnh hưởng yêu cầu tạo sau đó) | `workflow.manage` |
| `POST` | `/workflow-definitions/{definitionId}/activate` | Kích hoạt (tự vô hiệu quy trình đang hoạt động cùng `requestType`) | `workflow.manage` |
| `POST` | `/workflow-definitions/{definitionId}/deactivate` | Ngừng áp dụng | `workflow.manage` |

#### Yêu cầu phê duyệt (Workflow)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workflow-requests/inbox` | Hộp thư việc cần tôi duyệt (bước đang chờ). Query: requestType, page, size | `Auth` |
| `GET` | `/workflow-requests/my-submitted` | Yêu cầu tôi đã gửi và trạng thái (suy ra từ các bước) | `Auth` |
| `GET` | `/workflow-requests` | Tra cứu yêu cầu. Query: requestType, referenceId, status | `workflow.view` |
| `GET` | `/workflow-requests/{requestId}` | Chi tiết yêu cầu và từng bước (người duyệt, quyết định, nhận xét) | `Auth` |
| `POST` | `/workflow-requests/{requestId}/steps/{stepId}/approve` | Phê duyệt bước (người được giao). Body: comment? | `Auth` |
| `POST` | `/workflow-requests/{requestId}/steps/{stepId}/reject` | Từ chối bước. Body: comment (bắt buộc) | `Auth` |
| `POST` | `/workflow-requests/{requestId}/cancel` | Người gửi hủy yêu cầu đang chờ | `Auth` |

#### Danh mục & cấp phát tài sản

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/asset-categories` | Danh sách loại tài sản | `asset.view` |
| `POST` | `/asset-categories` | Tạo loại tài sản | `asset.manage` |
| `PUT` | `/asset-categories/{categoryId}` | Sửa loại tài sản | `asset.manage` |
| `DELETE` | `/asset-categories/{categoryId}` | Xóa loại (chưa có tài sản) | `asset.manage` |
| `GET` | `/assets` | Danh sách tài sản. Query: categoryId, keyword, assigned (đang cấp/chưa cấp) | `asset.view` |
| `POST` | `/assets` | Tạo tài sản | `asset.manage` |
| `GET` | `/assets/{assetId}` | Chi tiết tài sản và người đang giữ | `asset.view` |
| `PUT` | `/assets/{assetId}` | Sửa tài sản | `asset.manage` |
| `POST` | `/assets/{assetId}/assign` | Cấp phát cho nhân viên. Body: employeeId | `asset.assign` |
| `POST` | `/asset-assignments/{assignmentId}/return` | Ghi nhận hoàn trả | `asset.assign` |
| `GET` | `/employees/{employeeId}/assets` | Tài sản nhân viên đang giữ và lịch sử cấp/trả | `asset.view` |
| `GET` | `/me/assets` | Tài sản tôi đang giữ | `Auth` |

---

### 1. QUẢN LÝ TỔ CHỨC (Organization)

#### Công ty

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/companies` | Danh sách công ty | `organization.view` |
| `POST` | `/companies` | Tạo công ty (mã, tên, MST, địa chỉ, liên hệ) | `organization.manage` |
| `GET` | `/companies/{companyId}` | Chi tiết công ty | `organization.view` |
| `PUT` | `/companies/{companyId}` | Cập nhật thông tin công ty | `organization.manage` |

#### Vùng miền

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/companies/{companyId}/regions` | Danh sách vùng của công ty | `organization.view` |
| `POST` | `/companies/{companyId}/regions` | Tạo vùng | `organization.manage` |
| `PUT` | `/regions/{regionId}` | Sửa vùng | `organization.manage` |
| `DELETE` | `/regions/{regionId}` | Xóa vùng (chưa có chi nhánh) | `organization.manage` |

#### Chi nhánh

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/branches` | Danh sách chi nhánh. Query: companyId, regionId, keyword | `organization.view` |
| `POST` | `/regions/{regionId}/branches` | Tạo chi nhánh (kèm tọa độ GPS, bán kính chấm công) | `organization.manage` |
| `GET` | `/branches/{branchId}` | Chi tiết chi nhánh | `organization.view` |
| `PUT` | `/branches/{branchId}` | Sửa chi nhánh | `organization.manage` |
| `DELETE` | `/branches/{branchId}` | Xóa chi nhánh (chưa có nhân viên/cơ sở tham chiếu) | `organization.manage` |

#### Trung tâm chi phí

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/cost-centers` | Danh sách trung tâm chi phí. Query: companyId | `organization.view` |
| `POST` | `/cost-centers` | Tạo trung tâm chi phí | `organization.manage` |
| `PUT` | `/cost-centers/{costCenterId}` | Sửa | `organization.manage` |
| `DELETE` | `/cost-centers/{costCenterId}` | Xóa (chưa được phòng ban tham chiếu) | `organization.manage` |

#### Chức danh & cấp bậc

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/job-titles` | Danh sách chức danh. Query: companyId, keyword | `organization.view` |
| `POST` | `/job-titles` | Tạo chức danh | `organization.manage` |
| `GET` | `/job-titles/{jobTitleId}` | Chi tiết chức danh | `organization.view` |
| `PUT` | `/job-titles/{jobTitleId}` | Sửa chức danh | `organization.manage` |
| `DELETE` | `/job-titles/{jobTitleId}` | Xóa (chưa được tham chiếu) | `organization.manage` |
| `GET` | `/job-levels` | Danh sách cấp bậc (theo `rank_order`). Query: companyId | `organization.view` |
| `POST` | `/job-levels` | Tạo cấp bậc | `organization.manage` |
| `PUT` | `/job-levels/{jobLevelId}` | Sửa cấp bậc | `organization.manage` |
| `DELETE` | `/job-levels/{jobLevelId}` | Xóa (chưa được tham chiếu) | `organization.manage` |

#### Phòng ban / đơn vị tổ chức

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/departments` | Danh sách đơn vị (phiên bản hiệu lực). Query: companyId, keyword, includeDissolved, asOf | `organization.view` |
| `GET` | `/departments/tree` | Sơ đồ tổ chức dạng cây. Query: companyId, asOf (xem cơ cấu tại thời điểm quá khứ) | `organization.view` |
| `POST` | `/departments` | Tạo đơn vị (khối/ban/phòng/tổ). Body: companyId, code, name, parentDepartmentId?, costCenterId?, managerEmployeeId? | `organization.manage` |
| `GET` | `/departments/{departmentId}` | Chi tiết đơn vị tại thời điểm `asOf` | `organization.view` |
| `PUT` | `/departments/{departmentId}` | Sửa tên/trung tâm chi phí (tạo `department_versions` mới). Body: effectiveFrom, ... | `organization.manage` |
| `PUT` | `/departments/{departmentId}/manager` | Chỉ định người quản lý đơn vị | `organization.manage` |
| `GET` | `/departments/{departmentId}/move-impact` | Xem trước tác động điều chuyển: số nhân viên và đơn vị trực thuộc bị ảnh hưởng. Query: newParentId | `organization.manage` |
| `POST` | `/departments/{departmentId}/move` | Chuyển đơn vị (kèm đơn vị con) sang cấp trên mới; chặn vòng lặp. Body: newParentId, effectiveFrom | `organization.manage` |
| `DELETE` | `/departments/{departmentId}` | Giải thể (đặt `dissolved_date`) — chỉ khi không còn nhân viên/đơn vị con | `organization.manage` |
| `GET` | `/departments/{departmentId}/versions` | Lịch sử thay đổi cơ cấu của đơn vị | `organization.view` |
| `GET` | `/departments/{departmentId}/employees` | Nhân viên hiện đang thuộc đơn vị. Query: includeChildren, asOf | `organization.view` |

---

### 2. MÔ PHỎNG TÁI CƠ CẤU TỔ CHỨC (What-if)

> Kịch bản là sandbox tách biệt; chỉ khi `apply` mới ghi vào `department_versions` và `employee_work_assignments`.

#### Kịch bản

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/org-scenarios` | Tạo kịch bản (sao chép cây đơn vị hiện tại vào sandbox). Body: companyId, name, plannedEffectiveDate | `org_scenario.manage` |
| `GET` | `/org-scenarios` | Danh sách kịch bản. Query: companyId, status | `org_scenario.view` |
| `GET` | `/org-scenarios/{scenarioId}` | Chi tiết kịch bản | `org_scenario.view` |
| `PUT` | `/org-scenarios/{scenarioId}` | Sửa tên, mô tả, ngày hiệu lực dự kiến (khi `DRAFT`) | `org_scenario.manage` |
| `DELETE` | `/org-scenarios/{scenarioId}` | Xóa kịch bản `DRAFT` | `org_scenario.manage` |

#### Chỉnh sửa cơ cấu trong sandbox

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/org-scenarios/{scenarioId}/departments/tree` | Cây đơn vị trong kịch bản | `org_scenario.view` |
| `POST` | `/org-scenarios/{scenarioId}/departments` | Thêm đơn vị mới | `org_scenario.manage` |
| `PUT` | `/org-scenarios/{scenarioId}/departments/{scenarioDepartmentId}` | Đổi tên, quản lý, trung tâm chi phí | `org_scenario.manage` |
| `POST` | `/org-scenarios/{scenarioId}/departments/{scenarioDepartmentId}/move` | Chuyển đơn vị sang cấp trên khác trong sandbox | `org_scenario.manage` |
| `POST` | `/org-scenarios/{scenarioId}/departments/merge` | Sáp nhập nhiều đơn vị vào một đơn vị. Body: sourceIds[], targetId | `org_scenario.manage` |
| `POST` | `/org-scenarios/{scenarioId}/departments/{scenarioDepartmentId}/split` | Tách đơn vị thành nhiều đơn vị | `org_scenario.manage` |
| `DELETE` | `/org-scenarios/{scenarioId}/departments/{scenarioDepartmentId}` | Giải thể đơn vị trong sandbox | `org_scenario.manage` |
| `GET` | `/org-scenarios/{scenarioId}/employee-moves` | Danh sách điều chuyển nhân sự giả lập | `org_scenario.view` |
| `PUT` | `/org-scenarios/{scenarioId}/employee-moves/{employeeId}` | Gán nhân viên sang đơn vị/quản lý mới trong kịch bản | `org_scenario.manage` |
| `DELETE` | `/org-scenarios/{scenarioId}/employee-moves/{employeeId}` | Bỏ điều chuyển giả lập | `org_scenario.manage` |

#### Phân tích & phê duyệt

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/org-scenarios/{scenarioId}/impact` | Phân tích tác động (số nhân viên, chi phí, quy trình, quyền) — tính toán, không lưu | `org_scenario.view` |
| `GET` | `/org-scenarios/compare` | So sánh các phương án. Query: scenarioIds | `org_scenario.view` |
| `POST` | `/org-scenarios/{scenarioId}/submit` | Trình phê duyệt (Workflow `ORG_SCENARIO`) | `org_scenario.manage` |
| `POST` | `/org-scenarios/{scenarioId}/apply` | Áp dụng vào cơ cấu thật (chỉ khi `APPROVED`) | `org_scenario.apply` |
| `POST` | `/org-scenarios/{scenarioId}/cancel` | Hủy kịch bản | `org_scenario.manage` |

---

### 3. PHÂN QUYỀN (Role & Permission)

#### Quyền chức năng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/permissions` | Danh mục quyền (resource + action) | `role.view` |

#### Vai trò

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/roles` | Danh sách vai trò (mặc định hệ thống và tùy chỉnh theo công ty). Query: companyId | `role.view` |
| `POST` | `/roles` | Tạo vai trò tùy chỉnh | `role.manage` |
| `GET` | `/roles/{roleId}` | Chi tiết vai trò | `role.view` |
| `PUT` | `/roles/{roleId}` | Sửa tên/mô tả (không sửa vai trò hệ thống) | `role.manage` |
| `DELETE` | `/roles/{roleId}` | Xóa vai trò chưa được gán | `role.manage` |
| `GET` | `/roles/{roleId}/permissions` | Quyền của vai trò kèm phạm vi dữ liệu | `role.view` |
| `PUT` | `/roles/{roleId}/permissions` | Thiết lập toàn bộ quyền + `dataScope` (OWN/TEAM/DEPARTMENT/COMPANY/ALL) cho từng quyền | `role.manage` |

#### Gán vai trò cho người dùng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/users/{userId}/role-assignments` | Vai trò của người dùng theo công ty | `role.view` |
| `POST` | `/users/{userId}/role-assignments` | Gán vai trò. Body: roleId, companyId | `role.assign` |
| `DELETE` | `/role-assignments/{assignmentId}` | Gỡ vai trò | `role.assign` |
| `GET` | `/roles/{roleId}/users` | Người dùng đang giữ vai trò | `role.view` |

---

### 4. TUYỂN DỤNG (Recruitment)

#### Đề xuất tuyển dụng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/recruitment-requests` | Trưởng bộ phận lập đề xuất (`PENDING_APPROVAL`, tự gửi Workflow). Body: departmentId, jobTitleId, jobLevelId?, requestedQuantity, justification | `recruitment_request.create` |
| `GET` | `/recruitment-requests` | Danh sách đề xuất. Query: departmentId, status | `recruitment_request.view` |
| `GET` | `/recruitment-requests/{requestId}` | Chi tiết đề xuất và tiến trình duyệt | `recruitment_request.view` |
| `PUT` | `/recruitment-requests/{requestId}` | Sửa đề xuất (khi chưa có bước duyệt xử lý) | `recruitment_request.create` |
| `POST` | `/recruitment-requests/{requestId}/cancel` | Người tạo hủy khi còn `PENDING_APPROVAL` | `recruitment_request.create` |

#### Vị trí tuyển dụng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/job-openings` | Tạo vị trí tuyển dụng từ đề xuất `APPROVED` (JD, khung lương, hạn) | `recruitment.manage` |
| `GET` | `/job-openings` | Danh sách vị trí. Query: status, departmentId, keyword | `recruitment.view` |
| `GET` | `/job-openings/{openingId}` | Chi tiết vị trí, số đã tuyển (tính), số hồ sơ theo giai đoạn | `recruitment.view` |
| `PUT` | `/job-openings/{openingId}` | Sửa JD, khung lương, hạn | `recruitment.manage` |
| `POST` | `/job-openings/{openingId}/hold` | Tạm dừng (`ON_HOLD`) | `recruitment.manage` |
| `POST` | `/job-openings/{openingId}/reopen` | Mở lại (`OPEN`) | `recruitment.manage` |
| `POST` | `/job-openings/{openingId}/close` | Đóng vị trí (`CLOSED`) | `recruitment.manage` |
| `GET` | `/job-openings/{openingId}/pipeline` | Bảng ATS Pipeline: hồ sơ theo từng giai đoạn | `recruitment.view` |

#### Kênh tuyển dụng & tin đăng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/recruitment-channels` | Danh sách kênh/nguồn | `recruitment.view` |
| `POST` | `/recruitment-channels` | Tạo kênh | `recruitment.manage` |
| `PUT` | `/recruitment-channels/{channelId}` | Sửa kênh | `recruitment.manage` |
| `DELETE` | `/recruitment-channels/{channelId}` | Xóa kênh (chưa được tham chiếu) | `recruitment.manage` |
| `GET` | `/job-openings/{openingId}/postings` | Tin đăng của vị trí trên các kênh | `recruitment.view` |
| `POST` | `/job-openings/{openingId}/postings` | Tạo tin đăng nhiều kênh một lần. Body: channelIds[], expiresAt | `recruitment.manage` |
| `POST` | `/job-postings/{postingId}/publish` | Xuất bản lên kênh (ghi `FAILED` nếu tích hợp thất bại) | `recruitment.manage` |
| `POST` | `/job-postings/{postingId}/withdraw` | Gỡ tin | `recruitment.manage` |

#### Cổng tuyển dụng công khai (ứng viên)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/public/job-openings` | Danh sách vị trí đang tuyển (không yêu cầu đăng nhập). Query: keyword, departmentId | `Public` |
| `GET` | `/public/job-openings/{slug}` | Trang ứng tuyển riêng của vị trí (`landing_slug`) | `Public` |
| `POST` | `/public/job-openings/{slug}/applications` | Ứng viên nộp hồ sơ + CV (multipart); chống trùng email/SĐT. Body: fullName, email, phone, cv | `Public` |

#### Ứng viên

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/candidates` | Tìm ứng viên. Query: keyword, skillId, sourceChannelId | `candidate.view` |
| `POST` | `/candidates` | HR nhập tay ứng viên | `candidate.manage` |
| `GET` | `/candidates/{candidateId}` | Hồ sơ ứng viên đầy đủ, các lần ứng tuyển | `candidate.view` |
| `PUT` | `/candidates/{candidateId}` | Sửa thông tin liên hệ | `candidate.manage` |
| `POST` | `/candidates/parse-cv` | CV Parser: trích xuất thông tin từ CV (multipart) để HR kiểm tra trước khi lưu | `candidate.manage` |
| `PUT` | `/candidates/{candidateId}/work-experiences` | Thay thế danh sách kinh nghiệm làm việc | `candidate.manage` |
| `PUT` | `/candidates/{candidateId}/educations` | Thay thế danh sách học vấn | `candidate.manage` |
| `PUT` | `/candidates/{candidateId}/skills` | Thay thế danh sách kỹ năng. Body: skillIds[] | `candidate.manage` |

#### Ngân hàng hồ sơ (Talent Pool)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/talent-pool` | Danh sách ứng viên tiềm năng. Query: skillId, sourceChannelId, keyword | `candidate.view` |
| `POST` | `/talent-pool` | Đưa ứng viên vào kho. Body: candidateId, note | `candidate.manage` |
| `PUT` | `/talent-pool/{candidateId}` | Sửa ghi chú | `candidate.manage` |
| `DELETE` | `/talent-pool/{candidateId}` | Gỡ khỏi kho | `candidate.manage` |

#### Hồ sơ ứng tuyển & ATS Pipeline

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/applications` | HR thêm hồ sơ ứng tuyển cho ứng viên có sẵn. Body: candidateId, jobOpeningId, sourceChannelId?, referrerEmployeeId? | `candidate.manage` |
| `GET` | `/applications` | Danh sách hồ sơ. Query: jobOpeningId, stage, keyword | `candidate.view` |
| `GET` | `/applications/{applicationId}` | Chi tiết hồ sơ, lịch sử giai đoạn, phỏng vấn, offer | `candidate.view` |
| `POST` | `/applications/{applicationId}/stage-transitions` | Chuyển giai đoạn. Body: stage, note | `candidate.manage` |
| `GET` | `/applications/{applicationId}/stage-transitions` | Lịch sử chuyển giai đoạn | `candidate.view` |
| `POST` | `/applications/{applicationId}/ai-review` | Chạy AI CV Review (kết quả tham khảo) | `candidate.manage` |
| `GET` | `/applications/{applicationId}/ai-reviews` | Các kết quả AI review đã lưu | `candidate.view` |

#### Vòng, tiêu chí, câu hỏi phỏng vấn

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/job-openings/{openingId}/interview-rounds` | Các vòng phỏng vấn | `interview.view` |
| `POST` | `/job-openings/{openingId}/interview-rounds` | Tạo vòng. Body: roundNo, roundType | `interview.manage` |
| `PUT` | `/interview-rounds/{roundId}` | Sửa vòng | `interview.manage` |
| `DELETE` | `/interview-rounds/{roundId}` | Xóa vòng (chưa có buổi phỏng vấn) | `interview.manage` |
| `GET` | `/interview-rounds/{roundId}/criteria` | Tiêu chí đánh giá | `interview.view` |
| `POST` | `/interview-rounds/{roundId}/criteria` | Thêm tiêu chí (tên, thang điểm, trọng số) | `interview.manage` |
| `PUT` | `/interview-criteria/{criterionId}` | Sửa tiêu chí | `interview.manage` |
| `DELETE` | `/interview-criteria/{criterionId}` | Xóa tiêu chí | `interview.manage` |
| `GET` | `/interview-rounds/{roundId}/questions` | Bộ câu hỏi chuẩn và câu hỏi riêng. Query: applicationId | `interview.view` |
| `POST` | `/interview-rounds/{roundId}/questions` | Thêm câu hỏi thủ công | `interview.manage` |
| `PUT` | `/interview-questions/{questionId}` | Sửa câu hỏi | `interview.manage` |
| `DELETE` | `/interview-questions/{questionId}` | Xóa câu hỏi | `interview.manage` |
| `POST` | `/applications/{applicationId}/interview-questions/generate` | AI sinh Interview Kit từ JD + CV. Body: interviewRoundId | `interview.manage` |

#### Buổi phỏng vấn

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/interviews/availability` | Kiểm tra lịch rảnh/trùng lịch của người phỏng vấn. Query: employeeIds, from, to | `interview.manage` |
| `POST` | `/interviews` | Lên lịch (chống trùng lịch). Body: applicationId, interviewRoundId, scheduledStart, scheduledEnd, format, locationOrLink, panelistIds[] | `interview.manage` |
| `GET` | `/interviews` | Danh sách buổi phỏng vấn. Query: from, to, applicationId, status | `interview.view` |
| `GET` | `/interviews/mine` | Lịch phỏng vấn tôi tham gia | `Auth` |
| `GET` | `/interviews/{interviewId}` | Chi tiết buổi phỏng vấn | `interview.view` |
| `PUT` | `/interviews/{interviewId}` | Đổi lịch/hình thức (gửi thông báo lại) | `interview.manage` |
| `PUT` | `/interviews/{interviewId}/panelists` | Thay đổi hội đồng phỏng vấn | `interview.manage` |
| `POST` | `/interviews/{interviewId}/complete` | Đánh dấu đã diễn ra | `interview.manage` |
| `POST` | `/interviews/{interviewId}/cancel` | Hủy buổi phỏng vấn | `interview.manage` |

#### Phiếu đánh giá (Blind Grading)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/interviews/{interviewId}/scorecards/mine` | Phiếu của tôi (bản nháp hoặc đã nộp) | `Auth` |
| `PUT` | `/interviews/{interviewId}/scorecards/mine` | Lưu nháp điểm theo tiêu chí và nhận xét | `Auth` |
| `POST` | `/interviews/{interviewId}/scorecards/mine/submit` | Nộp phiếu (sau khi nộp mới được xem phiếu người khác) | `Auth` |
| `GET` | `/interviews/{interviewId}/scorecards` | Phiếu của các giám khảo — chỉ trả khi người xem đã nộp phiếu của mình | `interview.view` |
| `GET` | `/applications/{applicationId}/score-summary` | Tổng hợp điểm, cảnh báo bất đồng điểm giữa giám khảo (tính toán) | `interview.view` |

#### Cảnh báo nội dung phỏng vấn

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/interviews/{interviewId}/content-scan` | AI quét câu hỏi/ghi chú tìm nội dung không phù hợp | `interview.manage` |
| `GET` | `/interview-content-flags` | Danh sách cảnh báo. Query: reviewStatus | `interview.manage` |
| `PUT` | `/interview-content-flags/{flagId}/review` | HR xem xét. Body: reviewStatus (CONFIRMED/DISMISSED) | `interview.manage` |

#### Offer

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/offers` | Tạo offer cho hồ sơ ứng tuyển. Body: applicationId, baseSalary, expectedStartDate, responseDeadline, templateVersionId, allowances[] | `offer.manage` |
| `GET` | `/offers` | Danh sách offer. Query: status, applicationId | `offer.view` |
| `GET` | `/offers/{offerId}` | Chi tiết offer | `offer.view` |
| `PUT` | `/offers/{offerId}` | Sửa offer (khi `DRAFT`) | `offer.manage` |
| `POST` | `/offers/{offerId}/generate-letter` | Sinh thư mời từ mẫu (`OFFER_LETTER`) | `offer.manage` |
| `POST` | `/offers/{offerId}/submit` | Trình phê duyệt (Offer Approval Matrix: vượt khung lương thêm bước duyệt) | `offer.manage` |
| `POST` | `/offers/{offerId}/send` | Gửi thư mời cho ứng viên (chỉ khi `APPROVED`) | `offer.manage` |
| `POST` | `/offers/{offerId}/accept` | Ghi nhận ứng viên đồng ý | `offer.manage` |
| `POST` | `/offers/{offerId}/decline` | Ghi nhận từ chối. Body: declineReason, declineNote | `offer.manage` |
| `POST` | `/offers/{offerId}/cancel` | HR hủy offer | `offer.manage` |

#### Cơ hội nội bộ (Internal Talent Marketplace)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/internal-opportunities` | Quản lý đăng cơ hội (vị trí mở/dự án ngắn hạn) | `internal_opportunity.manage` |
| `GET` | `/internal-opportunities` | Danh sách cơ hội. Query: type, status, departmentId | `Auth` |
| `GET` | `/internal-opportunities/{opportunityId}` | Chi tiết cơ hội | `Auth` |
| `PUT` | `/internal-opportunities/{opportunityId}` | Sửa cơ hội | `internal_opportunity.manage` |
| `POST` | `/internal-opportunities/{opportunityId}/close` | Đóng cơ hội | `internal_opportunity.manage` |
| `POST` | `/internal-opportunities/{opportunityId}/interests` | Nhân viên bày tỏ quan tâm. Body: motivation | `Auth` |
| `DELETE` | `/internal-opportunities/{opportunityId}/interests/mine` | Nhân viên rút quan tâm | `Auth` |
| `GET` | `/internal-opportunities/{opportunityId}/interests` | Danh sách nhân viên quan tâm | `internal_opportunity.manage` |
| `POST` | `/internal-opportunity-applications/{interestId}/select` | Chọn nhân viên, giao nhiệm vụ. Body: assignedTask | `internal_opportunity.manage` |
| `POST` | `/internal-opportunity-applications/{interestId}/reject` | Không chọn | `internal_opportunity.manage` |
| `POST` | `/internal-opportunity-applications/{interestId}/outcome` | Ghi nhận kết quả/đóng góp khi dự án kết thúc | `internal_opportunity.manage` |
| `GET` | `/me/internal-opportunity-applications` | Quan tâm/lịch sử tham gia của tôi | `Auth` |

---

### 5. HỒ SƠ NHÂN SỰ (Employee Profile & Lifecycle)

#### Hồ sơ nhân viên

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees` | Danh sách nhân viên (theo phạm vi dữ liệu). Query: keyword, departmentId, branchId, jobTitleId, status, page, size | `employee.view` |
| `POST` | `/employees` | Tạo hồ sơ (nhập tay hoặc tiếp nhận từ ứng viên trúng tuyển). Body: personal info, sourceApplicationId?, identityDocument, assignment | `employee.create` |
| `GET` | `/employees/{employeeId}` | Hồ sơ đầy đủ (công tác và trạng thái hiện hành được tính) | `employee.view` |
| `PUT` | `/employees/{employeeId}` | Cập nhật thông tin cá nhân | `employee.update` |
| `GET` | `/employees/export` | Xuất danh sách nhân viên (async) | `employee.export` |
| `GET` | `/me/profile` | Hồ sơ của tôi | `Auth` |
| `PUT` | `/me/profile` | Cập nhật các trường được phép tự sửa (liên hệ, địa chỉ, người liên hệ khẩn cấp) | `Auth` |

#### Giấy tờ định danh, ngân hàng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees/{employeeId}/identity-documents` | Danh sách giấy tờ định danh | `employee.view_sensitive` |
| `POST` | `/employees/{employeeId}/identity-documents` | Thêm CCCD/hộ chiếu (kiểm tra trùng số) | `employee.update` |
| `PUT` | `/identity-documents/{documentId}` | Sửa giấy tờ | `employee.update` |
| `DELETE` | `/identity-documents/{documentId}` | Xóa giấy tờ | `employee.update` |
| `GET` | `/employees/{employeeId}/bank-account` | Tài khoản nhận lương | `employee.view_sensitive` |
| `PUT` | `/employees/{employeeId}/bank-account` | Thiết lập/cập nhật tài khoản nhận lương | `employee.update` |

#### Người phụ thuộc, liên hệ khẩn cấp

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees/{employeeId}/dependents` | Người phụ thuộc | `employee.view` |
| `POST` | `/employees/{employeeId}/dependents` | Thêm người phụ thuộc | `employee.update` |
| `PUT` | `/dependents/{dependentId}` | Sửa (kể cả thời gian giảm trừ gia cảnh) | `employee.update` |
| `DELETE` | `/dependents/{dependentId}` | Xóa | `employee.update` |
| `GET` | `/employees/{employeeId}/emergency-contacts` | Liên hệ khẩn cấp | `employee.view` |
| `POST` | `/employees/{employeeId}/emergency-contacts` | Thêm liên hệ khẩn cấp | `employee.update` |
| `PUT` | `/emergency-contacts/{contactId}` | Sửa | `employee.update` |
| `DELETE` | `/emergency-contacts/{contactId}` | Xóa | `employee.update` |

#### Công tác (lịch sử hiệu lực)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees/{employeeId}/work-assignments` | Lịch sử công tác (phòng ban, chi nhánh, chức danh, cấp bậc, quản lý, loại hình) | `employee.view` |
| `GET` | `/employees/{employeeId}/work-assignments/at` | Công tác tại một ngày. Query: date | `employee.view` |
| `POST` | `/employees/{employeeId}/work-assignments` | Thêm dòng công tác mới (bổ nhiệm/điều chỉnh) mà không qua điều chuyển. Body: effectiveFrom, changeReason, ... | `employee.assign` |
| `GET` | `/employees/{employeeId}/direct-reports` | Nhân viên cấp dưới trực tiếp (tính từ quản lý hiện tại) | `employee.view` |

#### Trạng thái làm việc & thử việc

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees/{employeeId}/status-history` | Lịch sử trạng thái làm việc | `employee.view` |
| `POST` | `/employees/{employeeId}/status-changes` | Ghi nhận đổi trạng thái (vd `SUSPENDED`). Body: status, effectiveFrom, note | `employee.status` |
| `GET` | `/employees/{employeeId}/probation-evaluations` | Kết quả thử việc | `employee.view` |
| `POST` | `/employees/{employeeId}/probation-evaluations` | Ghi kết quả thử việc (đạt/không đạt/gia hạn) | `employee.status` |
| `GET` | `/employees/{employeeId}/official-eligibility` | Kiểm tra điều kiện chuyển chính thức (kết quả thử việc, hội nhập, hợp đồng) | `employee.status` |
| `POST` | `/employees/{employeeId}/confirm-official` | Chuyển `PROBATION → ACTIVE` khi đủ điều kiện | `employee.status` |

#### Đăng ký khuôn mặt (sinh trắc)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees/{employeeId}/face-enrollments` | Lịch sử đăng ký khuôn mặt | `employee.face_manage` |
| `POST` | `/employees/{employeeId}/face-enrollments` | Đăng ký khuôn mặt (ảnh + liveness + sự đồng ý xử lý dữ liệu sinh trắc) | `employee.face_manage` |
| `POST` | `/face-enrollments/{enrollmentId}/revoke` | Thu hồi mẫu. Body: reason | `employee.face_manage` |
| `GET` | `/me/face-enrollment` | Trạng thái đăng ký khuôn mặt của tôi | `Auth` |
| `POST` | `/me/face-enrollment` | Tự đăng ký khuôn mặt | `Auth` |
| `DELETE` | `/me/face-enrollment` | Yêu cầu xóa dữ liệu khuôn mặt (`EMPLOYEE_REQUEST`) | `Auth` |

---

### 6. HỘI NHẬP NHÂN SỰ (Onboarding)

#### Mẫu checklist

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/onboarding-templates` | Danh sách mẫu. Query: departmentId, jobTitleId, active | `onboarding.view` |
| `POST` | `/onboarding-templates` | Tạo mẫu kèm các hạng mục | `onboarding.manage` |
| `GET` | `/onboarding-templates/{templateId}` | Chi tiết mẫu | `onboarding.view` |
| `PUT` | `/onboarding-templates/{templateId}` | Sửa mẫu (không ảnh hưởng tiến trình đang chạy) | `onboarding.manage` |
| `PUT` | `/onboarding-templates/{templateId}/items` | Thay thế danh sách hạng mục | `onboarding.manage` |
| `POST` | `/onboarding-templates/{templateId}/deactivate` | Ngừng sử dụng mẫu | `onboarding.manage` |

#### Danh mục tài khoản CNTT

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/it-account-types` | Danh sách loại tài khoản | `onboarding.view` |
| `POST` | `/it-account-types` | Tạo loại tài khoản | `onboarding.manage` |
| `PUT` | `/it-account-types/{typeId}` | Sửa | `onboarding.manage` |
| `DELETE` | `/it-account-types/{typeId}` | Xóa (chưa được tham chiếu) | `onboarding.manage` |

#### Buổi đào tạo định hướng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/orientation-sessions` | Danh sách buổi đào tạo. Query: from, to, status | `onboarding.view` |
| `POST` | `/orientation-sessions` | Tạo buổi đào tạo | `onboarding.manage` |
| `PUT` | `/orientation-sessions/{sessionId}` | Sửa | `onboarding.manage` |
| `POST` | `/orientation-sessions/{sessionId}/complete` | Hoàn thành buổi đào tạo | `onboarding.manage` |
| `POST` | `/orientation-sessions/{sessionId}/cancel` | Hủy buổi đào tạo | `onboarding.manage` |
| `POST` | `/orientation-sessions/{sessionId}/attendance` | Ghi nhận tham dự (hoàn thành các task `ORIENTATION` tương ứng). Body: employeeIds[] | `onboarding.manage` |

#### Tiến trình hội nhập

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/onboarding-processes` | Khởi tạo tiến trình cho nhân viên từ mẫu (sao chép hạng mục thành task). Body: employeeId, templateId | `onboarding.manage` |
| `GET` | `/onboarding-processes` | Danh sách tiến trình. Query: status, departmentId | `onboarding.view` |
| `GET` | `/onboarding-processes/{processId}` | Chi tiết, tiến độ (số việc/hoàn thành tính toán) | `onboarding.view` |
| `GET` | `/employees/{employeeId}/onboarding` | Tiến trình hội nhập của nhân viên | `onboarding.view` |
| `GET` | `/me/onboarding` | Tiến trình hội nhập của tôi | `Auth` |
| `POST` | `/onboarding-processes/{processId}/accept` | HR nghiệm thu (yêu cầu hoàn thành mọi hạng mục bắt buộc) | `onboarding.manage` |
| `POST` | `/onboarding-processes/{processId}/cancel` | Hủy tiến trình | `onboarding.manage` |

#### Công việc hội nhập

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/onboarding-processes/{processId}/tasks` | Danh sách công việc | `onboarding.view` |
| `POST` | `/onboarding-processes/{processId}/tasks` | Thêm công việc ngoài mẫu | `onboarding.manage` |
| `POST` | `/onboarding-tasks/{taskId}/complete` | Hoàn thành công việc (tài liệu/tài khoản/thiết bị được kiểm tra từ module tương ứng) | `onboarding.manage` |
| `POST` | `/onboarding-tasks/{taskId}/skip` | Bỏ qua (chỉ hạng mục không bắt buộc) | `onboarding.manage` |

#### Yêu cầu cấp tài khoản CNTT

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/it-account-requests` | Hàng đợi yêu cầu cho bộ phận IT. Query: status | `onboarding.it_handle` |
| `POST` | `/it-account-requests/{requestId}/provision` | Ghi nhận đã cấp tài khoản. Body: accountIdentifier | `onboarding.it_handle` |
| `POST` | `/it-account-requests/{requestId}/fail` | Ghi nhận thất bại. Body: failureReason | `onboarding.it_handle` |

---

### 7. SỐ HÓA & LƯU KHO HỒ SƠ (Digital Records)

#### Cấu hình danh mục

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/retention-policies` | Danh sách chính sách lưu trữ | `document.config` |
| `POST` | `/retention-policies` | Tạo chính sách | `document.config` |
| `PUT` | `/retention-policies/{policyId}` | Sửa (không đổi hạn đã chốt của tài liệu cũ) | `document.config` |
| `DELETE` | `/retention-policies/{policyId}` | Xóa (chưa được tham chiếu) | `document.config` |
| `GET` | `/document-types` | Danh sách loại tài liệu | `document.view` |
| `POST` | `/document-types` | Tạo loại tài liệu | `document.config` |
| `PUT` | `/document-types/{typeId}` | Sửa | `document.config` |
| `DELETE` | `/document-types/{typeId}` | Xóa (chưa có tài liệu) | `document.config` |
| `GET` | `/document-types/{typeId}/metadata-fields` | Cấu hình trường metadata | `document.view` |
| `PUT` | `/document-types/{typeId}/metadata-fields` | Thay thế danh sách trường metadata | `document.config` |
| `GET` | `/roles/{roleId}/document-type-permissions` | Quyền truy cập tài liệu theo loại | `role.view` |
| `PUT` | `/roles/{roleId}/document-type-permissions` | Thiết lập quyền theo loại tài liệu, hành động, phạm vi | `role.manage` |

#### Bộ hồ sơ

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees/{employeeId}/dossiers` | Các bộ hồ sơ của nhân viên | `document.view` |
| `POST` | `/employees/{employeeId}/dossiers` | Tạo bộ hồ sơ theo mục đích | `document.upload` |
| `GET` | `/me/dossiers` | Bộ hồ sơ của tôi | `Auth` |

#### Tải lên & OCR

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/document-uploads` | Tải tệp scan/ảnh (multipart); kiểm tra chất lượng, chuẩn hóa, chạy OCR. Body: dossierId, file | `document.upload` |
| `GET` | `/document-uploads/{uploadId}` | Kết quả kiểm tra chất lượng và OCR | `document.upload` |
| `POST` | `/document-uploads/{uploadId}/split` | Tách tệp nhiều trang thành các tài liệu. Body: segments[{pageFrom,pageTo,documentTypeId}] | `document.upload` |

#### Tài liệu & phiên bản

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/documents` | Tìm tài liệu. Query: employeeId, documentTypeId, status, expiringWithinDays, keyword | `document.view` |
| `GET` | `/documents/{documentId}` | Chi tiết tài liệu, metadata, phiên bản (ghi Audit khi tài liệu nhạy cảm) | `document.view` |
| `PUT` | `/documents/{documentId}/metadata` | Nhập/sửa metadata (trường dưới ngưỡng OCR được đánh dấu cần kiểm tra) | `document.edit_metadata` |
| `POST` | `/documents/{documentId}/verify` | HR xác thực metadata (`VERIFIED`) | `document.verify` |
| `GET` | `/documents/{documentId}/versions` | Danh sách phiên bản | `document.view` |
| `POST` | `/documents/{documentId}/versions` | Tải phiên bản mới (tài liệu đã lưu kho không bị ghi đè). Body: file, changeReason | `document.upload` |
| `GET` | `/documents/{documentId}/preview` | Xem trước có watermark động | `document.view` |
| `GET` | `/documents/{documentId}/download` | Tải xuống (watermark, ghi Audit `DOWNLOAD`) | `document.download` |
| `POST` | `/documents/{documentId}/submit-archive` | Gửi nộp lưu kho chính thức (Workflow `DOCUMENT_ARCHIVE`) | `document.archive` |
| `GET` | `/documents/expiring` | Giấy tờ sắp/đã hết hạn. Query: withinDays | `document.view` |
| `GET` | `/me/documents` | Tài liệu của tôi (theo quyền ESS) | `Auth` |
| `POST` | `/me/documents` | Nhân viên tự nộp giấy tờ | `Auth` |

#### Tạm giữ pháp lý

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/documents/{documentId}/legal-holds` | Lịch sử tạm giữ | `document.hold` |
| `POST` | `/documents/{documentId}/legal-holds` | Đặt tạm giữ. Body: reason, note | `document.hold` |
| `POST` | `/legal-holds/{holdId}/release` | Gỡ tạm giữ | `document.hold` |

#### Tiêu hủy tài liệu

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/documents/destruction-candidates` | Tài liệu đủ điều kiện hủy (hết `retention_until`, không có hold). Query: retentionPolicyId | `document.destroy` |
| `POST` | `/destruction-proposals` | Lập đề xuất hủy. Body: retentionPolicyId, documentIds[], reason, councilMemberIds[] | `document.destroy` |
| `GET` | `/destruction-proposals` | Danh sách đề xuất. Query: status | `document.destroy` |
| `GET` | `/destruction-proposals/{proposalId}` | Chi tiết đề xuất, tài liệu, hội đồng và kết quả biểu quyết | `document.destroy` |
| `POST` | `/destruction-proposals/{proposalId}/submit` | Chuyển hội đồng xét hủy (`COUNCIL_REVIEW`) | `document.destroy` |
| `POST` | `/destruction-proposals/{proposalId}/votes` | Thành viên hội đồng biểu quyết. Body: vote, comment | `Auth` |
| `POST` | `/destruction-proposals/{proposalId}/execute` | Thực hiện tiêu hủy (khi `APPROVED`), đính kèm biên bản. Body: evidenceFileId | `document.destroy` |

#### Xuất trọn bộ hồ sơ

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/employees/{employeeId}/dossier-exports` | Yêu cầu xuất (PDF gộp/ZIP); hồ sơ nhạy cảm cần phê duyệt (`DOCUMENT_EXPORT`) | `document.export` |
| `GET` | `/dossier-exports` | Lịch sử yêu cầu xuất. Query: employeeId | `document.export` |
| `GET` | `/dossier-exports/{exportId}/download` | Tải tệp kết quả sau khi được phép | `document.export` |

---

### 8. HỢP ĐỒNG & HỢP ĐỒNG ĐIỆN TỬ (Contract)

#### Mẫu hợp đồng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/contract-templates` | Danh sách mẫu. Query: templateKind, contractType, jobTitleId, departmentId, branchId, active | `contract.view` |
| `POST` | `/contract-templates` | Tạo mẫu | `contract.template_manage` |
| `GET` | `/contract-templates/{templateId}` | Chi tiết mẫu | `contract.view` |
| `PUT` | `/contract-templates/{templateId}` | Sửa thuộc tính áp dụng của mẫu | `contract.template_manage` |
| `POST` | `/contract-templates/{templateId}/deactivate` | Ngừng sử dụng mẫu | `contract.template_manage` |
| `GET` | `/contract-templates/{templateId}/versions` | Phiên bản mẫu | `contract.view` |
| `POST` | `/contract-templates/{templateId}/versions` | Tải phiên bản mới (DOCX/HTML chứa biến `{{...}}`) | `contract.template_manage` |
| `GET` | `/contract-template-versions/{versionId}/download` | Tải tệp mẫu | `contract.view` |

#### Hợp đồng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/contracts` | Tạo hợp đồng từ mẫu + nhân viên (tự điền dữ liệu, sinh `contract_no`). Body: employeeId, templateVersionId, contractType, terms, allowances[] | `contract.create` |
| `GET` | `/contracts` | Danh sách hợp đồng. Query: employeeId, contractType, status (kể cả trạng thái suy ra), expiringWithinDays | `contract.view` |
| `GET` | `/contracts/expiring` | Hợp đồng sắp hết hạn theo mốc nhắc cấu hình. Query: withinDays | `contract.view` |
| `GET` | `/contracts/{contractId}` | Chi tiết, trạng thái tổng hợp (ký/hiệu lực/hết hạn tính toán) | `contract.view` |
| `PUT` | `/contracts/{contractId}` | Sửa điều khoản (khi `DRAFT`) | `contract.create` |
| `PUT` | `/contracts/{contractId}/allowances` | Thay thế phụ cấp thỏa thuận | `contract.create` |
| `POST` | `/contracts/{contractId}/compliance-check` | Kiểm tra tuân thủ (thời hạn, số lần ký, thử việc...) trước khi trình | `contract.create` |
| `POST` | `/contracts/{contractId}/submit` | Trình phê duyệt nội bộ (Workflow `CONTRACT`) | `contract.create` |
| `POST` | `/contracts/{contractId}/send-for-signature` | Phát hành bản ký và mời các bên ký (khi đã duyệt) | `contract.sign_manage` |
| `POST` | `/contracts/{contractId}/cancel` | Hủy hợp đồng trước khi hoàn tất ký | `contract.create` |
| `POST` | `/contracts/{contractId}/renew` | Tạo hợp đồng mới kế tiếp (`previous_contract_id`) | `contract.create` |
| `POST` | `/contracts/{contractId}/archive` | Đồng bộ bản đã ký đầy đủ vào kho tài liệu | `contract.archive` |
| `GET` | `/employees/{employeeId}/contracts` | Hợp đồng của nhân viên | `contract.view` |
| `GET` | `/me/contracts` | Hợp đồng của tôi | `Auth` |

#### Phiên bản văn bản

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/contracts/{contractId}/versions` | Các phiên bản văn bản (hợp đồng và phụ lục) | `contract.view` |
| `POST` | `/contracts/{contractId}/versions` | Phát hành phiên bản mới (hủy lượt ký của phiên bản cũ nếu đã ký một phần). Body: appendixId?, changeReason | `contract.create` |
| `GET` | `/contract-versions/{versionId}/download` | Tải văn bản | `contract.view` |
| `GET` | `/contract-versions/{versionId}/verify-integrity` | Kiểm tra toàn vẹn bằng SHA-256 và chứng thư | `contract.view` |

#### Ký & bằng chứng giao kết

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/contract-versions/{versionId}/signers` | Danh sách bên ký, thứ tự, trạng thái | `contract.view` |
| `POST` | `/contract-signers/{signerId}/request-otp` | Gửi OTP xác thực ký (chữ ký điện tử OTP) | `Auth` |
| `POST` | `/contract-signers/{signerId}/sign` | Ký (chữ ký số/OTP). Body: method, otp?, signatureData | `Auth` |
| `POST` | `/contract-signers/{signerId}/decline` | Từ chối ký. Body: reason | `Auth` |
| `POST` | `/contract-signers/{signerId}/confirm-wet-ink` | HR xác nhận đã ký giấy trực tiếp | `contract.sign_manage` |
| `GET` | `/contract-signers/{signerId}/evidence` | Chứng cứ ký: chứng thư, mã giao dịch, dấu thời gian | `contract.view` |
| `GET` | `/me/contract-signing-tasks` | Văn bản đang chờ tôi ký | `Auth` |

#### Phụ lục hợp đồng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/contracts/{contractId}/appendices` | Danh sách phụ lục | `contract.view` |
| `POST` | `/contracts/{contractId}/appendices` | Tạo phụ lục (chỉ các trường `new_*`; không sửa thời hạn) | `contract.create` |
| `GET` | `/contract-appendices/{appendixId}` | Chi tiết phụ lục | `contract.view` |
| `PUT` | `/contract-appendices/{appendixId}` | Sửa (khi `DRAFT`) | `contract.create` |
| `PUT` | `/contract-appendices/{appendixId}/allowances` | Thay thế phụ cấp thay đổi | `contract.create` |
| `POST` | `/contract-appendices/{appendixId}/submit` | Trình phê duyệt (Workflow `CONTRACT_APPENDIX`) | `contract.create` |
| `POST` | `/contract-appendices/{appendixId}/send-for-signature` | Phát hành bản ký | `contract.sign_manage` |
| `POST` | `/contract-appendices/{appendixId}/cancel` | Hủy phụ lục | `contract.create` |
| `POST` | `/contract-appendices/{appendixId}/archive` | Đồng bộ vào kho tài liệu | `contract.archive` |

---

### 9. CHẤM CÔNG & CA LÀM VIỆC (Attendance)

#### Ca làm việc

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/shifts` | Danh sách ca. Query: companyId, active | `attendance.view` |
| `POST` | `/shifts` | Tạo ca (giờ, nghỉ giữa ca, định mức công, ân hạn) | `attendance.shift_manage` |
| `GET` | `/shifts/{shiftId}` | Chi tiết ca | `attendance.view` |
| `PUT` | `/shifts/{shiftId}` | Sửa ca | `attendance.shift_manage` |
| `POST` | `/shifts/{shiftId}/activate` | Kích hoạt | `attendance.shift_manage` |
| `POST` | `/shifts/{shiftId}/deactivate` | Ngừng sử dụng | `attendance.shift_manage` |
| `DELETE` | `/shifts/{shiftId}` | Xóa ca chưa được phân | `attendance.shift_manage` |

#### Phân ca

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/shift-assignments` | Lịch phân ca. Query: employeeId, departmentId, from, to | `attendance.view` |
| `POST` | `/shift-assignments/bulk` | Phân ca hàng loạt theo khoảng ngày (khai triển thành từng ngày). Body: employeeIds[], shiftId, fromDate, toDate | `attendance.shift_manage` |
| `PUT` | `/shift-assignments/{assignmentId}` | Đổi ca của một ngày | `attendance.shift_manage` |
| `DELETE` | `/shift-assignments/{assignmentId}` | Xóa phân ca | `attendance.shift_manage` |
| `GET` | `/me/shifts` | Lịch ca của tôi. Query: from, to | `Auth` |

#### Chấm công khuôn mặt + GPS

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/attendance/check-in` | Check-in: ảnh khuôn mặt, liveness, GPS, `transactionCode` (multipart); ghi log kể cả khi thất bại | `Auth` |
| `POST` | `/attendance/check-out` | Check-out (cùng cơ chế) | `Auth` |
| `GET` | `/me/attendance/today` | Trạng thái chấm công hôm nay của tôi | `Auth` |
| `GET` | `/me/attendance/logs` | Nhật ký chấm công của tôi. Query: from, to | `Auth` |
| `GET` | `/attendance/logs` | Tra cứu log gốc. Query: employeeId, from, to, verificationResult | `attendance.view` |
| `GET` | `/attendance/logs/{logId}` | Chi tiết log (điểm so khớp, GPS, ảnh nếu có) | `attendance.view` |

#### Kết quả công theo ngày (tính toán)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/me/attendance/daily-records` | Kết quả từng ngày của tôi (đi muộn, về sớm, thiếu chấm công...). Query: year, month | `Auth` |
| `GET` | `/attendance/daily-records` | Kết quả công theo ngày của nhân viên/đơn vị. Query: employeeId, departmentId, from, to | `attendance.view` |
| `GET` | `/attendance/monthly-summary` | Bảng công tháng hiện thời (chưa khóa), tính trực tiếp. Query: year, month, departmentId | `attendance.view` |
| `GET` | `/attendance/exceptions` | Danh sách ngoại lệ cần xử lý (thiếu chấm công, xác thực lỗi, vắng không phép). Query: from, to | `attendance.view` |

#### Giải trình / chấm công ngoại lệ

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/attendance-requests` | Gửi đơn giải trình (Workflow `ATTENDANCE_REQUEST`). Body: workDate, requestType, proposedCheckIn, proposedCheckOut, reason | `Auth` |
| `GET` | `/me/attendance-requests` | Đơn của tôi | `Auth` |
| `GET` | `/attendance-requests` | Danh sách đơn. Query: employeeId, status, from, to | `attendance.view` |
| `GET` | `/attendance-requests/{requestId}` | Chi tiết đơn và điều chỉnh phát sinh | `Auth` |
| `POST` | `/attendance-requests/{requestId}/attachments` | Đính kèm minh chứng. Body: fileId | `Auth` |
| `POST` | `/attendance-requests/{requestId}/cancel` | Hủy đơn khi còn chờ | `Auth` |
| `PUT` | `/attendance-requests/{requestId}/approved-times` | Người duyệt hiệu chỉnh giờ được thừa nhận trước khi tạo bản ghi điều chỉnh | `attendance.approve` |
| `GET` | `/attendance-adjustments` | Các bản ghi điều chỉnh. Query: employeeId, from, to | `attendance.view` |

#### Kỳ công & snapshot

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/timesheet-periods` | Danh sách kỳ công. Query: year | `attendance.view` |
| `POST` | `/timesheet-periods` | Mở kỳ công. Body: companyId, year, month | `attendance.period_manage` |
| `GET` | `/timesheet-periods/{periodId}` | Chi tiết kỳ công | `attendance.view` |
| `GET` | `/timesheet-periods/{periodId}/pre-lock-check` | Kiểm tra trước khi khóa (đơn giải trình còn chờ, thiếu chấm công...) | `attendance.period_manage` |
| `POST` | `/timesheet-periods/{periodId}/lock` | Khóa kỳ, tạo snapshot và chuyển dữ liệu sang Payroll | `attendance.period_manage` |
| `POST` | `/timesheet-periods/{periodId}/unlock` | Mở khóa có kiểm soát (bắt buộc lý do, ghi Audit `UNLOCK`). Body: reason | `attendance.period_unlock` |
| `GET` | `/timesheet-periods/{periodId}/snapshots` | Bảng công đã chốt của toàn bộ nhân viên (kèm giờ OT). Query: departmentId | `attendance.view` |
| `GET` | `/me/timesheet-snapshots` | Bảng công đã chốt của tôi. Query: year | `Auth` |
| `GET` | `/timesheet-periods/{periodId}/export` | Xuất bảng công (async) | `attendance.export` |

---

### 10. BẢNG LƯƠNG & TÍNH LƯƠNG TỰ ĐỘNG (Payroll)

#### Thành phần lương

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/salary-components` | Danh sách thành phần lương. Query: category, active | `payroll.view` |
| `POST` | `/salary-components` | Tạo thành phần | `payroll.config` |
| `PUT` | `/salary-components/{componentId}` | Sửa thành phần | `payroll.config` |
| `DELETE` | `/salary-components/{componentId}` | Xóa (chưa được sử dụng) | `payroll.config` |

#### Khoản lương theo nhân viên & lịch sử lương

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/employees/{employeeId}/salary-items` | Khoản lương ngoài hợp đồng (định kỳ/một lần) | `payroll.view` |
| `POST` | `/employees/{employeeId}/salary-items` | Thêm khoản (khấu trừ kỷ luật phải có `disciplineCaseId`) | `payroll.manage` |
| `PUT` | `/salary-items/{itemId}` | Sửa khoản | `payroll.manage` |
| `DELETE` | `/salary-items/{itemId}` | Xóa khoản chưa vào kỳ lương đã chốt | `payroll.manage` |
| `GET` | `/employees/{employeeId}/salary-histories` | Lịch sử mức lương (hiệu lực theo thời gian) | `payroll.view_salary` |
| `POST` | `/employees/{employeeId}/salary-histories` | Ghi nhận điều chỉnh lương (số quyết định, căn cứ hợp đồng/phụ lục). Body: effectiveFrom, baseSalary, insuranceSalary, reason, decisionNo | `payroll.manage` |
| `GET` | `/employees/{employeeId}/salary-histories/at` | Mức lương tại một ngày. Query: date | `payroll.view_salary` |

#### Tạm ứng lương

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/salary-advances` | Tạo đề nghị tạm ứng (Workflow `SALARY_ADVANCE`) | `Auth` |
| `GET` | `/me/salary-advances` | Tạm ứng của tôi | `Auth` |
| `GET` | `/salary-advances` | Danh sách. Query: employeeId, status | `payroll.view` |
| `GET` | `/salary-advances/{advanceId}` | Chi tiết (kèm trạng thái đã khấu trừ — tính toán) | `payroll.view` |
| `POST` | `/salary-advances/{advanceId}/cancel` | Hủy khi chưa duyệt | `Auth` |
| `POST` | `/salary-advances/{advanceId}/disburse` | Kế toán ghi nhận giải ngân, chọn kỳ thu hồi. Body: recoveryPayrollPeriodId | `payroll.manage` |

#### Kỳ lương

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/payroll-periods` | Mở kỳ lương (gắn kỳ công đã `LOCKED`). Body: companyId, code, startDate, endDate, plannedPaymentDate, standardWorkDays, timesheetPeriodId | `payroll.manage` |
| `GET` | `/payroll-periods` | Danh sách kỳ lương. Query: companyId, status, year | `payroll.view` |
| `GET` | `/payroll-periods/{periodId}` | Chi tiết kỳ kèm số liệu tổng hợp (Gross, Net, quỹ lương, số nhân viên — tính toán) | `payroll.view` |
| `PUT` | `/payroll-periods/{periodId}` | Sửa tham số kỳ (chỉ khi `OPEN`) | `payroll.manage` |
| `GET` | `/payroll-periods/{periodId}/precheck` | Danh sách thiếu dữ liệu: chưa có công, lương, tài khoản ngân hàng, hợp đồng... | `payroll.manage` |
| `POST` | `/payroll-periods/{periodId}/calculate` | Tính lương tự động toàn bộ kỳ (async); ghi `payroll_period_rule_versions` | `payroll.calculate` |
| `POST` | `/payroll-periods/{periodId}/employees/{employeeId}/recalculate` | Tính lại một nhân viên | `payroll.calculate` |
| `GET` | `/payroll-periods/{periodId}/anomalies` | Cảnh báo lương biến động vượt ngưỡng so với kỳ trước | `payroll.view` |
| `GET` | `/payroll-periods/{periodId}/rule-versions` | Phiên bản quy tắc pháp lý đã dùng | `payroll.view` |
| `POST` | `/payroll-periods/{periodId}/submit` | Trình phê duyệt (Workflow `PAYROLL`) | `payroll.manage` |
| `POST` | `/payroll-periods/{periodId}/start-payment` | Bắt đầu chi trả (khi `APPROVED`) | `payroll.pay` |
| `POST` | `/payroll-periods/{periodId}/lock` | Khóa sổ kỳ lương | `payroll.pay` |

#### Bảng lương nhân viên

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/payroll-periods/{periodId}/records` | Danh sách bảng lương nhân viên. Query: departmentId, keyword | `payroll.view` |
| `GET` | `/payroll-records/{recordId}` | Chi tiết bảng lương và các dòng | `payroll.view` |
| `GET` | `/payroll-records/{recordId}/trace` | Truy vết nguồn gốc từng dòng (công, hợp đồng, quy tắc, thưởng) | `payroll.view` |
| `POST` | `/payroll-records/{recordId}/adjustments` | Thêm dòng điều chỉnh thủ công (bắt buộc lý do, ghi Audit `OVERRIDE`) | `payroll.adjust` |
| `PUT` | `/payroll-record-lines/{lineId}` | Sửa dòng điều chỉnh thủ công | `payroll.adjust` |
| `DELETE` | `/payroll-record-lines/{lineId}` | Xóa dòng điều chỉnh thủ công | `payroll.adjust` |

#### Chi trả

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/payroll-periods/{periodId}/payments` | Danh sách giao dịch chi trả. Query: status | `payroll.view` |
| `POST` | `/payroll-periods/{periodId}/payments/export-bank-file` | Xuất tệp chuyển khoản ngân hàng | `payroll.pay` |
| `POST` | `/payroll-periods/{periodId}/payments/import-bank-result` | Nhập kết quả đối soát từ ngân hàng | `payroll.pay` |
| `PUT` | `/payroll-payments/{paymentId}` | Cập nhật kết quả giao dịch (`PAID`/`REJECTED`, mã tham chiếu) | `payroll.pay` |
| `POST` | `/payroll-payments/{paymentId}/retry` | Tạo lại giao dịch chi sau khi bị ngân hàng từ chối | `payroll.pay` |

#### Phiếu lương

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/payroll-periods/{periodId}/payslips/generate` | Sinh phiếu lương PDF mã hóa cho kỳ | `payroll.pay` |
| `POST` | `/payslips/{payslipId}/resend` | Gửi lại phiếu lương | `payroll.pay` |
| `GET` | `/me/payslips` | Phiếu lương của tôi. Query: year | `Auth` |
| `GET` | `/payslips/{payslipId}/download` | Tải phiếu lương (ghi Audit `DOWNLOAD`) | `Auth` |
| `GET` | `/me/payroll-records/{periodId}` | Chi tiết bảng lương của tôi trong kỳ đã chốt | `Auth` |

---

### 11. HIỆU SUẤT & KPI (Performance)

#### Kỳ đánh giá

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/performance-cycles` | Danh sách kỳ đánh giá. Query: status, year | `performance.view` |
| `POST` | `/performance-cycles` | Tạo kỳ (`DRAFT`) | `performance.config` |
| `GET` | `/performance-cycles/{cycleId}` | Chi tiết kỳ | `performance.view` |
| `PUT` | `/performance-cycles/{cycleId}` | Sửa kỳ (khi `DRAFT`) | `performance.config` |
| `DELETE` | `/performance-cycles/{cycleId}` | Xóa kỳ `DRAFT` | `performance.config` |
| `POST` | `/performance-cycles/{cycleId}/activate` | Kích hoạt kỳ | `performance.config` |
| `POST` | `/performance-cycles/{cycleId}/close` | Đóng kỳ | `performance.config` |
| `GET` | `/performance-cycles/{cycleId}/summary` | Thống kê phân bố xếp loại (tính toán) | `performance.view` |

#### Danh mục KPI

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/kpis` | Danh sách KPI. Query: departmentId, active | `performance.view` |
| `POST` | `/kpis` | Tạo KPI | `performance.config` |
| `PUT` | `/kpis/{kpiId}` | Sửa KPI | `performance.config` |
| `DELETE` | `/kpis/{kpiId}` | Xóa KPI chưa được gán | `performance.config` |

#### Phiếu đánh giá & mục tiêu

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/performance-cycles/{cycleId}/reviews` | Khởi tạo phiếu đánh giá cho nhân viên. Body: employeeIds[] | `performance.manage` |
| `GET` | `/performance-reviews` | Danh sách phiếu. Query: cycleId, employeeId, status | `performance.view` |
| `GET` | `/performance-reviews/{reviewId}` | Chi tiết phiếu, mục tiêu, điểm tạm tính | `performance.view` |
| `GET` | `/me/performance-reviews` | Phiếu đánh giá của tôi | `Auth` |
| `POST` | `/performance-reviews/{reviewId}/goals` | Thêm mục tiêu (tổng trọng số ≤ 100) | `performance.manage` |
| `PUT` | `/performance-goals/{goalId}` | Sửa mục tiêu | `performance.manage` |
| `DELETE` | `/performance-goals/{goalId}` | Xóa mục tiêu | `performance.manage` |
| `PATCH` | `/performance-goals/{goalId}/status` | Cập nhật tiến độ thực hiện (`GoalStatus`) | `Auth` |
| `PUT` | `/performance-reviews/{reviewId}/self-assessment` | Nhân viên tự đánh giá (điểm/nhận xét từng mục tiêu + nhận xét chung) | `Auth` |
| `POST` | `/performance-reviews/{reviewId}/self-assessment/submit` | Nộp tự đánh giá (`SELF_REVIEWED`) | `Auth` |
| `PUT` | `/performance-reviews/{reviewId}/manager-assessment` | Quản lý đánh giá từng mục tiêu và nhận xét chung | `performance.review` |
| `POST` | `/performance-reviews/{reviewId}/manager-assessment/submit` | Nộp đánh giá quản lý (`MANAGER_REVIEWED`) | `performance.review` |
| `GET` | `/performance-reviews/{reviewId}/score-preview` | Điểm tổng hợp và xếp loại tính thử trước khi chốt | `performance.review` |
| `POST` | `/performance-reviews/{reviewId}/finalize` | Chốt kết quả bất biến (`FINALIZED`) | `performance.finalize` |

---

### 12. KHEN THƯỞNG, KỶ LUẬT & KHIẾU NẠI

#### Khen thưởng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/reward-decisions` | Lập quyết định khen thưởng (thưởng tiền yêu cầu `amount`) | `reward.manage` |
| `GET` | `/reward-decisions` | Danh sách. Query: employeeId, rewardType, from, to | `reward.view` |
| `GET` | `/reward-decisions/{decisionId}` | Chi tiết (kèm trạng thái đã chuyển Payroll — tính toán) | `reward.view` |
| `PUT` | `/reward-decisions/{decisionId}` | Sửa (bị khóa khi đã có dòng lương tham chiếu) | `reward.manage` |
| `DELETE` | `/reward-decisions/{decisionId}` | Xóa (khi chưa chuyển Payroll) | `reward.manage` |
| `GET` | `/me/reward-decisions` | Khen thưởng của tôi | `Auth` |

#### Kỷ luật

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/discipline-cases` | Mở hồ sơ vi phạm | `discipline.manage` |
| `GET` | `/discipline-cases` | Danh sách. Query: employeeId, status, discipline_form | `discipline.view` |
| `GET` | `/discipline-cases/{caseId}` | Chi tiết hồ sơ (thời hiệu còn lại, hiệu lực kỷ luật — tính toán) | `discipline.view` |
| `PUT` | `/discipline-cases/{caseId}` | Cập nhật hồ sơ (khi `DRAFT`) | `discipline.manage` |
| `GET` | `/discipline-cases/{caseId}/eligibility` | Kiểm tra thời hiệu và diện hạn chế xử lý (nghỉ ốm, thai sản, nuôi con < 12 tháng) | `discipline.manage` |
| `PUT` | `/discipline-cases/{caseId}/participants` | Thay thế thành phần tham dự họp | `discipline.manage` |
| `GET` | `/discipline-cases/{caseId}/evidences` | Bằng chứng | `discipline.view` |
| `POST` | `/discipline-cases/{caseId}/evidences` | Thêm bằng chứng | `discipline.manage` |
| `DELETE` | `/discipline-evidences/{evidenceId}` | Xóa bằng chứng | `discipline.manage` |
| `POST` | `/discipline-cases/{caseId}/decide` | Ban hành quyết định (không áp dụng cho `SA_THAI`) | `discipline.decide` |
| `POST` | `/discipline-cases/{caseId}/submit-dismissal` | Trình phê duyệt sa thải (Workflow `DISMISSAL`) | `discipline.manage` |
| `GET` | `/me/discipline-cases` | Quyết định kỷ luật liên quan tôi | `Auth` |

#### Khiếu nại

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/complaints` | Nhân viên gửi khiếu nại/phản ánh | `Auth` |
| `GET` | `/me/complaints` | Khiếu nại của tôi | `Auth` |
| `GET` | `/complaints` | Danh sách (HR). Query: status, category | `complaint.manage` |
| `GET` | `/complaints/{complaintId}` | Chi tiết | `complaint.manage` |
| `POST` | `/complaints/{complaintId}/assign` | Phân công người xử lý. Body: handlerEmployeeId | `complaint.manage` |
| `POST` | `/complaints/{complaintId}/start-investigation` | Bắt đầu điều tra (`INVESTIGATING`) | `complaint.manage` |
| `POST` | `/complaints/{complaintId}/resolve` | Ghi phương án giải quyết (`RESOLVED`). Body: resolution | `complaint.manage` |
| `POST` | `/complaints/{complaintId}/close` | Đóng khiếu nại | `complaint.manage` |

---

### 13. PHÁT TRIỂN NHÂN SỰ & QUY HOẠCH KẾ NHIỆM (Career & Succession)

#### Lộ trình thăng tiến (CareerPathController)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/career-paths` | Danh sách lộ trình. Query: fromJobTitleId, toJobTitleId | `career.view` |
| `POST` | `/career-paths` | Tạo lộ trình | `career.manage` |
| `GET` | `/career-paths/{pathId}` | Chi tiết | `career.view` |
| `PUT` | `/career-paths/{pathId}` | Sửa | `career.manage` |
| `DELETE` | `/career-paths/{pathId}` | Xóa mềm | `career.manage` |
| `GET` | `/career-paths/graph` | Đồ thị lộ trình từ một chức danh. Query: fromJobTitleId | `career.view` |

#### Kế hoạch kế nhiệm (SuccessionPlanController)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/succession-plans` | Danh sách vị trí trọng yếu. Query: departmentId, riskLevel | `succession.view` |
| `POST` | `/succession-plans` | Tạo kế hoạch cho cặp (phòng ban, chức danh) | `succession.manage` |
| `GET` | `/succession-plans/{planId}` | Chi tiết, ứng viên, người đang giữ vị trí (tính toán) | `succession.view` |
| `PUT` | `/succession-plans/{planId}` | Sửa mức rủi ro/ngày rà soát | `succession.manage` |
| `DELETE` | `/succession-plans/{planId}` | Xóa kế hoạch | `succession.manage` |
| `POST` | `/succession-plans/{planId}/candidates` | Thêm ứng viên kế nhiệm (không được là người đang giữ vị trí) | `succession.manage` |
| `PUT` | `/succession-plans/{planId}/candidates/{employeeId}` | Sửa mức sẵn sàng/nhận xét | `succession.manage` |
| `DELETE` | `/succession-plans/{planId}/candidates/{employeeId}` | Gỡ ứng viên | `succession.manage` |
| `GET` | `/succession-plans/{planId}/suggestions` | Gợi ý ứng viên phù hợp (tính toán) | `succession.view` |

#### Kho nhân tài nội bộ (InternalTalentPoolController)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/internal-talent-pool` | Danh sách nhân tài. Query: tag, departmentId | `succession.view` |
| `POST` | `/internal-talent-pool` | Gắn thẻ nhân tài. Body: employeeId, tag, reason | `succession.manage` |
| `DELETE` | `/internal-talent-pool/{entryId}` | Gỡ thẻ | `succession.manage` |
| `GET` | `/employees/{employeeId}/talent-tags` | Thẻ nhân tài của nhân viên | `succession.view` |

#### Mô phỏng lộ trình sự nghiệp (CareerSimulatorController)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/career-simulator/paths` | Các lộ trình khả dụng cho nhân viên hiện tại. Query: employeeId | `Auth` |
| `POST` | `/career-simulator/simulate` | Mô phỏng lộ trình (độ tương thích, thời gian dự kiến) — không lưu | `Auth` |
| `GET` | `/career-simulator/similar-profiles` | Hồ sơ nhân viên tương đồng đã thăng tiến (ẩn danh). Query: targetJobTitleId | `Auth` |
| `POST` | `/career-simulations` | Lưu kịch bản đã mô phỏng | `Auth` |
| `GET` | `/career-simulations` | Kịch bản đã lưu của tôi | `Auth` |
| `GET` | `/career-simulations/{simulationId}` | Chi tiết (chỉ chủ sở hữu) | `Auth` |
| `DELETE` | `/career-simulations/{simulationId}` | Xóa kịch bản (chỉ chủ sở hữu) | `Auth` |

---

### 14. QUẢN LÝ NGHỈ PHÉP (Leave)

#### Loại nghỉ & chính sách

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/leave-types` | Danh sách loại nghỉ. Query: group, active | `Auth` |
| `POST` | `/leave-types` | Tạo loại nghỉ | `leave.config` |
| `PUT` | `/leave-types/{leaveTypeId}` | Sửa loại nghỉ | `leave.config` |
| `DELETE` | `/leave-types/{leaveTypeId}` | Xóa (chưa có chính sách/đơn tham chiếu) | `leave.config` |
| `GET` | `/leave-policies` | Danh sách chính sách nghỉ phép năm | `leave.view` |
| `POST` | `/leave-policies` | Tạo chính sách (hiệu lực theo ngày) | `leave.config` |
| `PUT` | `/leave-policies/{policyId}` | Sửa chính sách | `leave.config` |
| `DELETE` | `/leave-policies/{policyId}` | Xóa chính sách | `leave.config` |

#### Quỹ phép

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/me/leave-balances` | Quỹ phép của tôi: được cấp, chuyển, đã dùng, chờ duyệt, còn lại (tính toán). Query: year | `Auth` |
| `GET` | `/employees/{employeeId}/leave-balances` | Quỹ phép nhân viên. Query: year | `leave.view` |
| `POST` | `/leave-balances/generate` | Cấp quỹ phép năm cho nhân viên theo chính sách. Body: year, employeeIds? | `leave.manage` |
| `POST` | `/employees/{employeeId}/leave-balances/recalculate` | Tính lại số được cấp (HR yêu cầu). Body: year, leaveTypeId | `leave.manage` |
| `POST` | `/leave-balances/carry-over` | Chuyển phép năm trước sang năm sau theo chính sách. Body: fromYear | `leave.manage` |

#### Đơn xin nghỉ

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/leave-requests/preview` | Xem trước số ngày nghỉ (lịch ca + ngày lễ) và số dư còn lại trước khi gửi | `Auth` |
| `POST` | `/leave-requests` | Gửi đơn (Workflow `LEAVE_REQUEST`, tự duyệt nếu loại không cần duyệt). HR có thể tạo thay (`employeeId`) | `Auth` |
| `GET` | `/me/leave-requests` | Đơn của tôi. Query: status, year | `Auth` |
| `GET` | `/leave-requests` | Danh sách đơn theo phạm vi dữ liệu. Query: employeeId, departmentId, status, from, to | `leave.view` |
| `GET` | `/leave-requests/{requestId}` | Chi tiết đơn và tiến trình duyệt | `Auth` |
| `POST` | `/leave-requests/{requestId}/cancel` | Hủy đơn (giữ chỗ được hoàn lại tự động vì số dư là tính toán) | `Auth` |
| `GET` | `/leave-calendar` | Lịch nghỉ của đội/phòng. Query: departmentId, from, to | `leave.view` |

---

### 15. ĐIỀU CHUYỂN NHÂN SỰ (Transfer)

#### Phiếu điều chuyển

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/transfer-requests` | Lập phiếu (`DRAFT`); hệ thống chụp dữ liệu gốc `from_*` từ công tác hiện tại; chặn nếu nhân viên đang có phiếu mở. Body: employeeId, transferType, effectiveDate, endDate?, reason, to* | `transfer.create` |
| `GET` | `/transfer-requests` | Danh sách phiếu. Query: employeeId, status, from, to | `transfer.view` |
| `GET` | `/transfer-requests/{requestId}` | Chi tiết phiếu và tiến trình duyệt | `transfer.view` |
| `PUT` | `/transfer-requests/{requestId}` | Sửa phiếu (chỉ khi `DRAFT`) | `transfer.create` |
| `PUT` | `/transfer-requests/{requestId}/allowances` | Thay thế phụ cấp mới đề xuất | `transfer.create` |
| `GET` | `/transfer-requests/{requestId}/diff` | So sánh trước/sau và phát hiện hồ sơ nhân viên đã đổi so với dữ liệu gốc của phiếu | `transfer.view` |
| `POST` | `/transfer-requests/{requestId}/submit` | Trình phê duyệt (Workflow `TRANSFER_REQUEST`, khóa nội dung) | `transfer.create` |
| `POST` | `/transfer-requests/{requestId}/cancel` | Hủy phiếu | `transfer.create` |
| `POST` | `/transfer-requests/{requestId}/complete` | HR hoàn thành: sinh dòng `employee_work_assignments` mới (khi `APPROVED`) | `transfer.complete` |
| `GET` | `/employees/{employeeId}/transfer-history` | Lịch sử điều chuyển của nhân viên | `transfer.view` |

---

### 16. THÔI VIỆC & CHẤM DỨT HỢP ĐỒNG (Offboarding)

#### Đơn xin thôi việc

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/resignation-requests` | Nhân viên gửi đơn (Workflow `RESIGNATION`); kiểm tra thời hạn báo trước theo loại hợp đồng. Body: requestedLastWorkingDate, reasonGroup, explanation | `Auth` |
| `GET` | `/me/resignation-requests` | Đơn của tôi | `Auth` |
| `GET` | `/resignation-requests` | Danh sách đơn. Query: status, departmentId | `offboarding.view` |
| `GET` | `/resignation-requests/{requestId}` | Chi tiết đơn | `offboarding.view` |
| `PUT` | `/resignation-requests/{requestId}/confirmed-last-working-date` | Người duyệt/HR xác nhận ngày làm việc cuối khi chấp thuận | `offboarding.manage` |
| `POST` | `/resignation-requests/{requestId}/cancel` | Nhân viên rút đơn khi còn chờ | `Auth` |

#### Quyết định chấm dứt hợp đồng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/termination-decisions` | HR lập quyết định (sa thải bắt buộc `disciplineCaseId`) | `offboarding.terminate` |
| `GET` | `/termination-decisions` | Danh sách. Query: status, reasonGroup | `offboarding.view` |
| `GET` | `/termination-decisions/{decisionId}` | Chi tiết | `offboarding.view` |
| `PUT` | `/termination-decisions/{decisionId}` | Sửa quyết định (khi chưa trình duyệt) | `offboarding.terminate` |
| `GET` | `/termination-decisions/{decisionId}/severance-preview` | Ước tính trợ cấp thôi việc/mất việc, phép chưa nghỉ (tính toán theo quy tắc pháp lý) | `offboarding.view` |
| `POST` | `/termination-decisions/{decisionId}/submit` | Trình phê duyệt pháp lý (Workflow `TERMINATION`) | `offboarding.terminate` |
| `POST` | `/termination-decisions/{decisionId}/cancel` | Hủy quyết định | `offboarding.terminate` |

#### Hồ sơ Offboarding & bàn giao

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/offboarding-cases` | Tạo hồ sơ từ đơn/quyết định đã `APPROVED` (tự sinh 5 hạng mục). Body: resignationRequestId hoặc terminationDecisionId | `offboarding.manage` |
| `GET` | `/offboarding-cases` | Danh sách hồ sơ. Query: status | `offboarding.view` |
| `GET` | `/offboarding-cases/{caseId}` | Chi tiết, tiến độ bàn giao, tài sản chưa trả (tính toán) | `offboarding.view` |
| `GET` | `/employees/{employeeId}/offboarding` | Hồ sơ Offboarding của nhân viên | `offboarding.view` |
| `GET` | `/offboarding-cases/{caseId}/clearance-items` | Các hạng mục bàn giao | `offboarding.view` |
| `PUT` | `/offboarding-clearance-items/{itemId}/confirm` | Xác nhận hạng mục `CLEARED` (hạng mục `ASSET` yêu cầu 0 tài sản chưa trả, lưu snapshot) | `offboarding.clearance` |
| `PUT` | `/offboarding-clearance-items/{itemId}/reject` | Đánh dấu không đạt, ghi chú | `offboarding.clearance` |
| `POST` | `/offboarding-cases/{caseId}/complete` | Hoàn tất: ghi trạng thái `RESIGNED`/`TERMINATED`, khóa tài khoản đăng nhập | `offboarding.manage` |
| `POST` | `/offboarding-cases/{caseId}/cancel` | Hủy hồ sơ | `offboarding.manage` |

#### Phỏng vấn nghỉ việc

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/exit-interviews` | Ghi nhận phỏng vấn nghỉ việc (không bắt buộc để hoàn tất) | `offboarding.manage` |
| `GET` | `/exit-interviews` | Danh sách. Query: from, to | `offboarding.view` |
| `GET` | `/exit-interviews/{interviewId}` | Chi tiết | `offboarding.view` |
| `PUT` | `/exit-interviews/{interviewId}` | Sửa | `offboarding.manage` |

---

### 17. PHÁP LUẬT & TUÂN THỦ (Legal & Compliance)

#### Văn bản pháp luật

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/legal-documents` | Tra cứu văn bản. Query: keyword, legalDomain, effectiveFrom, effectiveTo | `legal.view` |
| `POST` | `/legal-documents` | Thêm văn bản (kèm tệp gốc/bản hợp nhất) | `legal.manage` |
| `GET` | `/legal-documents/{documentId}` | Chi tiết văn bản | `legal.view` |
| `PUT` | `/legal-documents/{documentId}` | Sửa thông tin văn bản | `legal.manage` |
| `GET` | `/legal-documents/{documentId}/relations` | Quan hệ sửa đổi/bổ sung/thay thế/bãi bỏ | `legal.view` |
| `POST` | `/legal-documents/{documentId}/relations` | Thêm quan hệ với văn bản khác. Body: targetDocumentId, relationType | `legal.manage` |
| `DELETE` | `/legal-documents/{documentId}/relations/{targetDocumentId}/{relationType}` | Gỡ quan hệ | `legal.manage` |
| `GET` | `/legal-documents/{documentId}/provisions` | Điều khoản của văn bản (đánh dấu điều khoản thay đổi) | `legal.view` |
| `POST` | `/legal-documents/{documentId}/provisions` | Thêm điều khoản (có thể chỉ định điều khoản bị thay thế) | `legal.manage` |
| `PUT` | `/legal-provisions/{provisionId}` | Sửa điều khoản | `legal.manage` |

#### Quy tắc tuân thủ

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/compliance-rules` | Danh sách quy tắc. Query: ruleGroup, keyword | `compliance.view` |
| `POST` | `/compliance-rules` | Tạo quy tắc (định danh ổn định) | `compliance.manage` |
| `GET` | `/compliance-rules/{ruleId}` | Chi tiết quy tắc và các phiên bản | `compliance.view` |
| `PUT` | `/compliance-rules/{ruleId}` | Sửa tên/nhóm | `compliance.manage` |
| `GET` | `/compliance-rules/effective` | Tra quy tắc/phiên bản đang áp dụng tại một ngày. Query: ruleCode, date, module | `Service` |

#### Phiên bản quy tắc

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/compliance-rules/{ruleId}/versions` | Các phiên bản | `compliance.view` |
| `POST` | `/compliance-rules/{ruleId}/versions` | Tạo phiên bản mới (`DRAFT`) | `compliance.manage` |
| `GET` | `/compliance-rule-versions/{versionId}` | Chi tiết phiên bản, tham số, căn cứ pháp lý | `compliance.view` |
| `PUT` | `/compliance-rule-versions/{versionId}` | Sửa (chỉ khi `DRAFT`; bản `PUBLISHED` bất biến) | `compliance.manage` |
| `PUT` | `/compliance-rule-versions/{versionId}/parameters` | Thay thế bộ tham số của phiên bản | `compliance.manage` |
| `PUT` | `/compliance-rule-versions/{versionId}/provisions` | Thay thế căn cứ pháp lý (N:M tới điều khoản) | `compliance.manage` |
| `POST` | `/compliance-rule-versions/{versionId}/submit` | Trình rà soát Pháp chế → BA → Kỹ thuật → thẩm quyền (Workflow `COMPLIANCE_RULE`) | `compliance.manage` |
| `POST` | `/compliance-rule-versions/{versionId}/publish` | Công bố sau khi đủ phê duyệt | `compliance.publish` |
| `GET` | `/compliance-parameters` | Tra tham số pháp lý tại một ngày. Query: paramKey, qualifierKey, qualifierValue, date | `Service` |

#### Ánh xạ quy tắc ↔ chức năng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/compliance-rules/{ruleId}/module-usages` | Chức năng/module sử dụng quy tắc | `compliance.view` |
| `POST` | `/compliance-rules/{ruleId}/module-usages` | Thêm ánh xạ | `compliance.manage` |
| `DELETE` | `/compliance-rule-module-usages/{usageId}` | Gỡ ánh xạ | `compliance.manage` |

#### Đánh giá tác động pháp lý

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/legal-impact-assessments` | Danh sách cần đánh giá. Query: provisionId, outcome | `compliance.assess` |
| `POST` | `/legal-provisions/{provisionId}/impact-assessments/generate` | Sinh danh sách quy tắc/chức năng bị ảnh hưởng khi điều khoản mới/sửa đổi | `compliance.assess` |
| `PUT` | `/legal-impact-assessments/{assessmentId}` | Ghi kết luận, phân công. Body: outcome, assignedToEmployeeId, note | `compliance.assess` |

#### Kiểm tra tuân thủ & cảnh báo

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/compliance-checks` | Module nghiệp vụ gọi kiểm tra tuân thủ. Body: ruleCode, requestingModule, subjectType, subjectId, context | `Service` |
| `GET` | `/compliance-checks` | Tra cứu lịch sử kiểm tra. Query: ruleId, module, result, subjectType, subjectId | `compliance.view` |
| `GET` | `/compliance-checks/{checkId}` | Chi tiết kiểm tra, phiên bản quy tắc đã dùng | `compliance.view` |
| `GET` | `/compliance-alerts` | Danh sách cảnh báo. Query: status, severity | `compliance.view` |
| `GET` | `/compliance-alerts/{alertId}` | Chi tiết cảnh báo | `compliance.view` |
| `PUT` | `/compliance-alerts/{alertId}/assign` | Phân công bộ phận xử lý, hạn | `compliance.manage` |
| `POST` | `/compliance-alerts/{alertId}/escalate` | Chuyển Pháp chế đánh giá (`ESCALATED_TO_LEGAL`) | `compliance.manage` |
| `POST` | `/compliance-alerts/{alertId}/resolve` | Ghi nhận đã khắc phục. Body: resolutionNote | `compliance.manage` |
| `GET` | `/compliance/dashboard` | Tổng quan tuân thủ (tính toán từ checks/alerts) | `compliance.view` |

---

### 18. TRỢ LÝ AI 1-1 (AI Assistant)

#### Hội thoại

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/ai/conversations` | Tạo cuộc hội thoại | `Auth` |
| `GET` | `/ai/conversations` | Danh sách hội thoại của tôi | `Auth` |
| `GET` | `/ai/conversations/{conversationId}/messages` | Lịch sử tin nhắn (kèm trích dẫn, function đã gọi) | `Auth` |
| `DELETE` | `/ai/conversations/{conversationId}` | Xóa hội thoại của tôi | `Auth` |
| `POST` | `/ai/conversations/{conversationId}/messages` | Gửi câu hỏi: phân loại (data/policy/ngoài phạm vi), Function Calling theo quyền người hỏi hoặc RAG; trả lời (hỗ trợ SSE streaming). Body: content | `Auth` |
| `POST` | `/ai/messages/{messageId}/feedback` | Đánh giá câu trả lời (hữu ích/không). Body: feedback | `Auth` |

#### Kho tri thức (RAG)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/ai/knowledge-documents` | Danh sách tài liệu tri thức. Query: category, status | `ai.knowledge_manage` |
| `POST` | `/ai/knowledge-documents` | Tạo tài liệu kèm phiên bản đầu (tải tệp; xử lý chia đoạn + embedding bất đồng bộ) | `ai.knowledge_manage` |
| `GET` | `/ai/knowledge-documents/{documentId}` | Chi tiết và phiên bản | `ai.knowledge_manage` |
| `PUT` | `/ai/knowledge-documents/{documentId}` | Sửa tiêu đề/nhóm | `ai.knowledge_manage` |
| `POST` | `/ai/knowledge-documents/{documentId}/versions` | Tải phiên bản mới | `ai.knowledge_manage` |
| `POST` | `/ai/knowledge-documents/{documentId}/archive` | Lưu trữ (không còn được viện dẫn) | `ai.knowledge_manage` |
| `POST` | `/ai/knowledge-documents/{documentId}/reindex` | Lập lại chỉ mục phiên bản đang dùng | `ai.knowledge_manage` |

#### Khoảng trống tri thức

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/ai/knowledge-gaps` | Cụm câu hỏi chưa có lời giải. Query: status | `ai.knowledge_manage` |
| `GET` | `/ai/knowledge-gaps/{clusterId}` | Chi tiết cụm và câu hỏi | `ai.knowledge_manage` |
| `PUT` | `/ai/knowledge-gaps/{clusterId}` | Đánh dấu đã xử lý/bỏ qua. Body: status, resolvedByDocumentId? | `ai.knowledge_manage` |

---

### 19. SƠ ĐỒ GHẾ NGỒI & KHÔNG GIAN LÀM VIỆC (Smart Workplace)

#### Cơ sở, tầng, bản vẽ

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/sites` | Danh sách cơ sở. Query: branchId | `workplace.view` |
| `POST` | `/workplace/sites` | Tạo cơ sở (mã được chuẩn hóa in hoa) | `workplace.manage` |
| `GET` | `/workplace/sites/{siteId}` | Chi tiết | `workplace.view` |
| `PUT` | `/workplace/sites/{siteId}` | Sửa | `workplace.manage` |
| `DELETE` | `/workplace/sites/{siteId}` | Xóa mềm | `workplace.manage` |
| `GET` | `/workplace/sites/{siteId}/floors` | Danh sách tầng | `workplace.view` |
| `POST` | `/workplace/sites/{siteId}/floors` | Tạo tầng | `workplace.manage` |
| `PUT` | `/workplace/floors/{floorId}` | Sửa tầng | `workplace.manage` |
| `DELETE` | `/workplace/floors/{floorId}` | Xóa tầng (chưa có phân khu/bản vẽ) | `workplace.manage` |
| `GET` | `/workplace/floors/{floorId}/plans` | Các phiên bản bản vẽ | `workplace.view` |
| `POST` | `/workplace/floors/{floorId}/plans` | Tạo bản vẽ mới (nền, Canvas, tỷ lệ) | `workplace.manage` |
| `PUT` | `/workplace/floor-plans/{planId}` | Sửa bản vẽ `DRAFT` | `workplace.manage` |
| `POST` | `/workplace/floor-plans/{planId}/publish` | Phát hành (bản đang phát hành trước đó chuyển `ARCHIVED`) | `workplace.manage` |
| `POST` | `/workplace/floor-plans/{planId}/archive` | Lưu trữ bản vẽ | `workplace.manage` |

#### Phân khu, cụm bàn, bàn

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/floors/{floorId}/zones` | Phân khu của tầng | `workplace.view` |
| `POST` | `/workplace/floors/{floorId}/zones` | Tạo phân khu (gồm các đỉnh ranh giới) | `workplace.manage` |
| `PUT` | `/workplace/zones/{zoneId}` | Sửa phân khu và ranh giới | `workplace.manage` |
| `DELETE` | `/workplace/zones/{zoneId}` | Xóa phân khu (chưa có cụm bàn) | `workplace.manage` |
| `GET` | `/workplace/zones/{zoneId}/seat-rows` | Cụm/dãy bàn của phân khu | `workplace.view` |
| `POST` | `/workplace/zones/{zoneId}/seat-rows` | Tạo cụm bàn | `workplace.manage` |
| `PUT` | `/workplace/seat-rows/{rowId}` | Sửa cụm (vị trí, góc xoay, kiểu bố trí) | `workplace.manage` |
| `DELETE` | `/workplace/seat-rows/{rowId}` | Xóa cụm bàn | `workplace.manage` |
| `POST` | `/workplace/seat-rows/{rowId}/generate-seats` | Tạo bàn hàng loạt (bỏ qua mã đã tồn tại) | `workplace.manage` |
| `GET` | `/workplace/seats` | Tìm bàn. Query: floorId, zoneId, seatType, status, amenityId | `workplace.view` |
| `GET` | `/workplace/seats/{seatId}` | Chi tiết bàn: người được phân bổ, tiện ích, tài sản | `workplace.view` |
| `POST` | `/workplace/seats` | Tạo bàn đơn lẻ | `workplace.manage` |
| `PUT` | `/workplace/seats/{seatId}` | Sửa bàn (vị trí, hình dạng, loại bàn) | `workplace.manage` |
| `PATCH` | `/workplace/seats/{seatId}/status` | Đổi trạng thái (`IN_SERVICE`/`MAINTENANCE`/`BLOCKED`) | `workplace.manage` |
| `DELETE` | `/workplace/seats/{seatId}` | Xóa bàn chưa có phân bổ/đặt chỗ | `workplace.manage` |
| `GET` | `/workplace/seats/{seatId}/qr` | Mã QR của bàn (sinh từ `qr_token`) | `workplace.view` |

#### Tiện ích, tài sản, vật thể

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/amenities` | Danh mục tiện ích | `workplace.view` |
| `POST` | `/workplace/amenities` | Tạo tiện ích | `workplace.manage` |
| `PUT` | `/workplace/amenities/{amenityId}` | Sửa | `workplace.manage` |
| `DELETE` | `/workplace/amenities/{amenityId}` | Xóa (chưa gắn bàn) | `workplace.manage` |
| `PUT` | `/workplace/seats/{seatId}/amenities` | Thiết lập tiện ích của bàn | `workplace.manage` |
| `POST` | `/workplace/seats/{seatId}/assets` | Gắn tài sản vào bàn (xác minh qua Asset) | `workplace.manage` |
| `DELETE` | `/workplace/seat-assets/{seatAssetId}` | Tháo liên kết tài sản | `workplace.manage` |
| `GET` | `/workplace/floors/{floorId}/objects` | Vật thể không phải bàn | `workplace.view` |
| `POST` | `/workplace/floors/{floorId}/objects` | Tạo vật thể (phòng họp, thang máy, vật cản...) | `workplace.manage` |
| `PUT` | `/workplace/objects/{objectId}` | Sửa vật thể | `workplace.manage` |
| `DELETE` | `/workplace/objects/{objectId}` | Xóa vật thể | `workplace.manage` |
| `PUT` | `/workplace/meeting-rooms/{objectId}` | Thiết lập sức chứa phòng họp | `workplace.manage` |

#### Bản đồ & điều hướng

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/floors/{floorId}/map` | Bản đồ tầng (bản vẽ đã phát hành, phân khu, bàn, vật thể) kèm trạng thái trống/có người theo ngày (tính toán). Query: date | `Auth` |
| `GET` | `/workplace/navigation/route` | Đường đi ngắn nhất (A*) giữa hai điểm/bàn/phòng. Query: fromType, fromId, toType, toId | `Auth` |
| `GET` | `/workplace/employees/{employeeId}/location` | Vị trí chỗ ngồi của đồng nghiệp (theo quyền) | `Auth` |
| `GET` | `/workplace/qr/resolve` | Giải mã QR (bàn/phòng họp/điểm xuất phát). Query: token | `Auth` |
| `GET` | `/me/workplace/seat` | Bàn cố định của tôi | `Auth` |

#### Phân bổ bàn cố định

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/seat-assignments` | Danh sách phân bổ. Query: floorId, employeeId, activeOnly | `workplace.view` |
| `POST` | `/workplace/seat-assignments` | Phân bổ bàn `DEDICATED` cho nhân viên (một người một bàn) | `workplace.manage` |
| `POST` | `/workplace/seat-assignments/{assignmentId}/release` | Thu hồi bàn | `workplace.manage` |

#### Đặt bàn linh hoạt

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/desk-bookings/availability` | Bàn `HOT_DESK` còn trống. Query: date, floorId, amenityIds | `Auth` |
| `POST` | `/workplace/desk-bookings` | Đặt bàn theo ngày (mỗi người một bàn/ngày) | `Auth` |
| `GET` | `/me/workplace/desk-bookings` | Đặt bàn của tôi | `Auth` |
| `GET` | `/workplace/desk-bookings` | Danh sách đặt bàn (quản trị). Query: date, floorId, employeeId | `workplace.view` |
| `POST` | `/workplace/desk-bookings/{bookingId}/check-in` | Check-in bằng QR (từ `CONFIRMED`) | `Auth` |
| `POST` | `/workplace/desk-bookings/{bookingId}/cancel` | Hủy đặt bàn | `Auth` |

#### Đặt phòng họp

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/meeting-rooms/availability` | Phòng họp trống. Query: from, to, minCapacity, floorId | `Auth` |
| `POST` | `/workplace/room-bookings` | Đặt phòng (chặn chồng thời gian, kiểm tra sức chứa). Office Admin có thể đặt thay | `Auth` |
| `GET` | `/me/workplace/room-bookings` | Lượt đặt phòng của tôi | `Auth` |
| `GET` | `/workplace/room-bookings` | Lịch phòng họp. Query: roomId, date | `workplace.view` |
| `POST` | `/workplace/room-bookings/{bookingId}/check-in` | Check-in phòng họp | `Auth` |
| `POST` | `/workplace/room-bookings/{bookingId}/cancel` | Hủy đặt phòng | `Auth` |

#### Sự cố cơ sở vật chất

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/workplace/issues` | Báo sự cố (gắn bàn/vật thể/điểm tự do trên tầng); sự cố gắn bàn tự khóa bàn (`BLOCKED`) | `Auth` |
| `GET` | `/me/workplace/issues` | Sự cố tôi đã báo | `Auth` |
| `GET` | `/workplace/issues` | Danh sách sự cố. Query: status, severity, floorId | `workplace.view` |
| `GET` | `/workplace/issues/{issueId}` | Chi tiết sự cố | `workplace.view` |
| `PUT` | `/workplace/issues/{issueId}/assign` | Phân công xử lý | `workplace.manage` |
| `POST` | `/workplace/issues/{issueId}/start` | Bắt đầu xử lý (`IN_PROGRESS`) | `workplace.manage` |
| `POST` | `/workplace/issues/{issueId}/resolve` | Hoàn tất (khôi phục bàn `IN_SERVICE`). Body: resolutionNote | `workplace.manage` |

#### Báo cáo sử dụng (tính toán)

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/workplace/reports/utilization` | Tỷ lệ lấp đầy, mức sử dụng bàn/phòng họp. Query: floorId, from, to | `workplace.report` |

---

### 20. THÔNG BÁO NỘI BỘ (Notification)

> Cơ chế pull (polling), không dùng WebSocket. Mọi thao tác xem/đọc/xóa giới hạn theo người nhận.

#### Hộp thư thông báo

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/notifications` | Danh sách thông báo của tôi. Query: read (true/false), type, page, size | `Auth` |
| `GET` | `/notifications/unread-count` | Số thông báo chưa đọc (cho biểu tượng quả chuông) | `Auth` |
| `POST` | `/notifications/{notificationId}/read` | Đánh dấu đã đọc | `Auth` |
| `POST` | `/notifications/read-all` | Đánh dấu đọc tất cả | `Auth` |
| `DELETE` | `/notifications/{notificationId}` | Xóa thông báo của tôi | `Auth` |

#### Phát thông báo

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `POST` | `/notifications/broadcast` | Phát thông báo toàn công ty (fan-out mỗi người một dòng). Body: title, content, actionUrl? | `notification.broadcast` |
| `POST` | `/internal/notifications` | Các module nghiệp vụ tạo thông báo cho người dùng (service-to-service). Body: userIds[], type, title, content, actionUrl | `Service` |

---

### 21. NHẬT KÝ KIỂM TOÁN (Audit Log)

> Chỉ đọc qua API; ghi log thực hiện nội bộ (INSERT-only, bất đồng bộ), không có endpoint tạo/sửa/xóa.

#### Tra cứu & truy vết

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/audit-logs` | Tra cứu nhật ký. Query: actorUserId, action, entityType, entityId, from, to, keyword, ipAddress, page, size | `audit.view` |
| `GET` | `/audit-logs/{logId}` | Chi tiết một bản ghi (giá trị trước/sau) | `audit.view` |
| `GET` | `/audit-logs/entity/{entityType}/{entityId}` | Audit Trail của một đối tượng theo thời gian | `audit.view` |
| `GET` | `/audit-logs/actions` | Danh mục hành động chuẩn hóa | `audit.view` |
| `GET` | `/audit-logs/export` | Xuất nhật ký theo bộ lọc (async, ghi Audit `EXPORT`) | `audit.export` |

---

### NHÓM TIỆN ÍCH CHUNG

#### Tiện ích

| Method | Endpoint | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/lookups/{enumName}` | Danh mục giá trị enum cho giao diện (vd `EmploymentStatus`) | `Auth` |
| `GET` | `/health` | Kiểm tra tình trạng dịch vụ | `Public` |

---

## Phụ lục A — Luồng phê duyệt (Workflow)

Mọi nghiệp vụ cần phê duyệt dùng **chung** `workflow_definitions` / `workflow_requests` ([ASSUMPTION A2] trong `DATABASE_DESIGN.md`). Bảng dưới cho biết endpoint gửi duyệt của từng loại; bước duyệt luôn qua `POST /workflow-requests/{requestId}/steps/{stepId}/approve|reject`.

| `WorkflowRequestType` | Đối tượng | Endpoint gửi duyệt | Hệ quả khi hoàn tất duyệt |
| --- | --- | --- | --- |
| `RECRUITMENT_REQUEST` | Đề xuất tuyển dụng | `POST /recruitment-requests` (tự gửi khi tạo) | Đề xuất `APPROVED` → được tạo vị trí tuyển dụng |
| `OFFER` | Thư mời nhận việc | `POST /offers/{offerId}/submit` | Offer `APPROVED` → được gửi cho ứng viên |
| `ORG_SCENARIO` | Kịch bản tái cơ cấu | `POST /org-scenarios/{scenarioId}/submit` | Kịch bản `APPROVED` → được áp dụng |
| `CONTRACT` | Hợp đồng lao động | `POST /contracts/{contractId}/submit` | Hợp đồng `PENDING_SIGNATURE` → phát hành ký |
| `CONTRACT_APPENDIX` | Phụ lục hợp đồng | `POST /contract-appendices/{appendixId}/submit` | Phụ lục `PENDING_SIGNATURE` → phát hành ký |
| `DOCUMENT_ARCHIVE` | Nộp lưu kho tài liệu | `POST /documents/{documentId}/submit-archive` | Tài liệu `ARCHIVED`, chốt `retention_until` |
| `DESTRUCTION_PROPOSAL` | Đề xuất hủy tài liệu | `POST /destruction-proposals/{proposalId}/submit` (hội đồng biểu quyết riêng) | Đề xuất `APPROVED` → thực hiện tiêu hủy |
| `DOCUMENT_EXPORT` | Xuất trọn bộ hồ sơ nhạy cảm | `POST /employees/{employeeId}/dossier-exports` | Cho phép tải tệp xuất |
| `ATTENDANCE_REQUEST` | Đơn giải trình chấm công | `POST /attendance-requests` | Sinh `attendance_adjustments` |
| `SALARY_ADVANCE` | Tạm ứng lương | `POST /salary-advances` | Tạm ứng `APPROVED` → kế toán giải ngân |
| `PAYROLL` | Bảng lương kỳ | `POST /payroll-periods/{periodId}/submit` | Kỳ lương `APPROVED` → chi trả |
| `LEAVE_REQUEST` | Đơn xin nghỉ | `POST /leave-requests` | Đơn `APPROVED` → trừ vào quỹ phép (tính toán) |
| `TRANSFER_REQUEST` | Phiếu điều chuyển | `POST /transfer-requests/{requestId}/submit` | Phiếu `APPROVED` → HR hoàn thành |
| `RESIGNATION` | Đơn xin thôi việc | `POST /resignation-requests` | Đơn `APPROVED` → mở hồ sơ Offboarding |
| `TERMINATION` | Quyết định chấm dứt hợp đồng | `POST /termination-decisions/{decisionId}/submit` | Quyết định `APPROVED` → mở hồ sơ Offboarding |
| `DISMISSAL` | Quyết định kỷ luật sa thải | `POST /discipline-cases/{caseId}/submit-dismissal` | Hồ sơ `DECIDED`, tạo quyết định chấm dứt |
| `COMPLIANCE_RULE` | Quy tắc tuân thủ | `POST /compliance-rule-versions/{versionId}/submit` | Cho phép `publish` phiên bản |

## Phụ lục B — API xử lý bất đồng bộ

Các endpoint dưới đây trả `202 Accepted` kèm tiến trình/kết quả nhận được qua thông báo (`/notifications`) hoặc truy vấn lại tài nguyên; không tạo bảng tiến trình riêng.

| Endpoint | Lý do bất đồng bộ |
| --- | --- |
| `POST /payroll-periods/{periodId}/calculate` | Tính lương toàn bộ nhân viên của kỳ |
| `POST /payroll-periods/{periodId}/payslips/generate` | Sinh và mã hóa hàng loạt phiếu lương PDF |
| `POST /document-uploads` | Chuẩn hóa tệp và OCR |
| `POST /ai/knowledge-documents` và `.../versions`, `.../reindex` | Chia đoạn và tạo embedding |
| `POST /candidates/parse-cv`, `POST /applications/{id}/ai-review` | Gọi mô hình AI |
| `GET /employees/export`, `GET /timesheet-periods/{id}/export`, `GET /audit-logs/export` | Xuất tập dữ liệu lớn |
| `POST /dossier-exports` (sau khi được phê duyệt) | Gộp tài liệu thành PDF/ZIP |
| `POST /timesheet-periods/{periodId}/lock` | Tạo snapshot cho toàn bộ nhân viên |

## Phụ lục C — Danh mục mã quyền

Các mã quyền xuất hiện trong tài liệu (109 mã) — dùng làm dữ liệu khởi tạo cho bảng `permissions` (`resource` = phần trước dấu chấm viết hoa, `action` = phần sau, viết hoa).

| Resource | Các action |
| --- | --- |
| `AI` | `knowledge_manage` |
| `ASSET` | `assign`, `manage`, `view` |
| `ATTENDANCE` | `approve`, `export`, `period_manage`, `period_unlock`, `shift_manage`, `view` |
| `AUDIT` | `export`, `view` |
| `CANDIDATE` | `manage`, `view` |
| `CAREER` | `manage`, `view` |
| `COMPLAINT` | `manage` |
| `COMPLIANCE` | `assess`, `manage`, `publish`, `view` |
| `CONTRACT` | `archive`, `create`, `sign_manage`, `template_manage`, `view` |
| `DISCIPLINE` | `decide`, `manage`, `view` |
| `DOCUMENT` | `archive`, `config`, `destroy`, `download`, `edit_metadata`, `export`, `hold`, `upload`, `verify`, `view` |
| `EMPLOYEE` | `assign`, `create`, `export`, `face_manage`, `status`, `update`, `view`, `view_sensitive` |
| `HOLIDAY` | `manage` |
| `INTERNAL_OPPORTUNITY` | `manage` |
| `INTERVIEW` | `manage`, `view` |
| `LEAVE` | `config`, `manage`, `view` |
| `LEGAL` | `manage`, `view` |
| `NOTIFICATION` | `broadcast` |
| `OFFBOARDING` | `clearance`, `manage`, `terminate`, `view` |
| `OFFER` | `manage`, `view` |
| `ONBOARDING` | `it_handle`, `manage`, `view` |
| `ORG_SCENARIO` | `apply`, `manage`, `view` |
| `ORGANIZATION` | `manage`, `view` |
| `PAYROLL` | `adjust`, `calculate`, `config`, `manage`, `pay`, `view`, `view_salary` |
| `PERFORMANCE` | `config`, `finalize`, `manage`, `review`, `view` |
| `RECRUITMENT` | `manage`, `view` |
| `RECRUITMENT_REQUEST` | `create`, `view` |
| `REWARD` | `manage`, `view` |
| `ROLE` | `assign`, `manage`, `view` |
| `SKILL` | `manage` |
| `SUCCESSION` | `manage`, `view` |
| `SYSTEM` | `update`, `view` |
| `TRANSFER` | `complete`, `create`, `view` |
| `USER` | `create`, `lock`, `update`, `view` |
| `WORKFLOW` | `manage`, `view` |
| `WORKPLACE` | `manage`, `report`, `view` |

Ghi chú: `audit.export`, `notification.broadcast` là hai quyền được tài liệu nghiệp vụ nêu tên. Các mã còn lại là **đề xuất** theo quy ước `resource.action`, cần đối chiếu với ma trận vai trò khi triển khai.

## Phụ lục D — Giả định khi thiết kế API

| Mã | Giả định |
| --- | --- |
| **B1** | Tài liệu nghiệp vụ chỉ nêu tên cụ thể một số endpoint (`/api/v1/auth/refresh`, `GET /unread-count` của thông báo, `GET /api/v1/audit-logs/entity/{entityType}/{entityId}`, bốn Controller của module 13). Toàn bộ endpoint còn lại là **đề xuất** suy ra từ chức năng, use case và thiết kế CSDL. |
| **B2** | Không có API đổi/quên mật khẩu, tự đăng ký tài khoản vì tài liệu nêu rõ nhân viên không tự đăng ký và không mô tả các luồng này. |
| **B3** | Duyệt/từ chối tập trung ở `/workflow-requests` (A2 của CSDL); module nghiệp vụ không có endpoint `approve/reject` riêng, trừ các thao tác duyệt có dữ liệu đặc thù (`PUT /attendance-requests/{id}/approved-times`, `PUT /resignation-requests/{id}/confirmed-last-working-date`). |
| **B4** | Phản hồi offer của ứng viên được **HR ghi nhận** (`/offers/{id}/accept|decline`) vì CSDL không lưu token phản hồi công khai. Nếu cần cổng ứng viên tự phản hồi, phải bổ sung thiết kế (token/liên kết) ở cả CSDL và API. |
| **B5** | Module Reporting và Bảo hiểm không có mô tả → không có nhóm API riêng; các số liệu tổng hợp chỉ xuất hiện dưới dạng trường tính toán trong response hoặc endpoint `summary`/`dashboard`/`reports` của từng module. |
| **B6** | Mọi endpoint nằm sau API Gateway/Spring Security; endpoint `Public` chỉ gồm đăng nhập, kích hoạt, làm mới token, OAuth2, cổng tuyển dụng công khai và health check. |
| **B7** | Các endpoint `Service` được bảo vệ bằng token dịch vụ nội bộ, không ánh xạ ra giao diện người dùng. |
| **B8** | Danh sách thao tác `DELETE` cho dữ liệu danh mục là hành vi mặc định theo quy ước §1.5; từng module có thể giới hạn chặt hơn theo nghiệp vụ. |

*Hết tài liệu.*