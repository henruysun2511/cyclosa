# DANH SÁCH TRANG FRONTEND — HỆ THỐNG HRM FSI

> **Nguồn:** tài liệu nghiệp vụ `Nghiep-vu.docx` (21 module + Xác thực) và `api-list.md` (726 endpoint).
> **Mục đích:** liệt kê toàn bộ trang (màn hình) cần xây dựng ở frontend, kèm route đề xuất, chức năng chính, API sử dụng và quyền truy cập.
> **Lưu ý:** route, tên trang và cách gộp/tách màn hình là **đề xuất thiết kế** suy ra từ nghiệp vụ và API; không có tài liệu wireframe gốc. Chỗ nào là giả định được đánh dấu *(giả định)*.

## Mục lục

1. [Quy ước đọc tài liệu](#1-quy-ước-đọc-tài-liệu)
2. [Kiến trúc chung](#2-kiến-trúc-chung)
3. [Sơ đồ menu theo vai trò](#3-sơ-đồ-menu-theo-vai-trò)
4. [Thành phần dùng chung (shared components)](#4-thành-phần-dùng-chung-shared-components)
5. [Danh sách trang theo module](#5-danh-sách-trang-theo-module)
6. [Các điểm nghiệp vụ chưa có API tương ứng](#6-các-điểm-nghiệp-vụ-chưa-có-api-tương-ứng)
7. [Thống kê](#7-thống-kê)

---

## 1. Quy ước đọc tài liệu

| Mục | Quy ước |
| --- | --- |
| **ID trang** | `<MÃ MODULE>-<số>`, ví dụ `EMP-03`. Mã module: AUTH, CMN (dùng chung), ORG, SIM, RBAC, REC, EMP, ONB, DOC, CON, ATT, PAY, PERF, RWD, CAR, LEA, TRF, OFF, LEG, AI, WP, NTF, AUD |
| **Route** | Đường dẫn phía frontend. `:id` là tham số. Tiền tố `/me/...` là trang tự phục vụ của nhân viên (ESS), dữ liệu luôn giới hạn ở chính người đăng nhập |
| **Loại trang** | `LIST` danh sách có lọc/phân trang · `DETAIL` chi tiết nhiều tab · `FORM` tạo/sửa · `WIZARD` nhiều bước · `BOARD` bảng kéo thả (Kanban) · `EDITOR` trình soạn thảo trực quan · `CALENDAR` lịch · `DASH` tổng quan/biểu đồ · `MOBILE` ưu tiên giao diện di động · `PUBLIC` không cần đăng nhập · `STATIC` trang tĩnh |
| **API** | `PHƯƠNG THỨC /đường-dẫn` tính từ `/api/v1`. Nhiều phương thức cùng đường dẫn viết gộp, ví dụ `GET,POST /skills` |
| **Quyền** | Mã quyền `resource.action` từ Phụ lục C của tài liệu API. `Auth` = chỉ cần đăng nhập (dữ liệu giới hạn ở chính mình hoặc đối tượng mình là bên liên quan). `Public` = không cần đăng nhập. Phạm vi dữ liệu (`OWN/TEAM/DEPARTMENT/COMPANY/ALL`) do backend quyết định, frontend chỉ ẩn/hiện chức năng theo mã quyền |
| **Trạng thái** | Tên enum giữ nguyên như tài liệu API (vd `PENDING_APPROVAL`). Danh sách giá trị lấy từ `GET /lookups/{enumName}` |

---

## 2. Kiến trúc chung

### 2.1. Các "không gian làm việc" (portal)

Hệ thống có 9 vai trò (theo tài liệu nghiệp vụ). Frontend **không dựng 9 ứng dụng riêng** mà dùng một ứng dụng duy nhất, menu và nút hành động hiển thị theo `GET /auth/me/permissions`.

| Không gian | Đối tượng | Đặc điểm giao diện |
| --- | --- | --- |
| **Cổng ứng viên** | Ứng viên (chưa có tài khoản) | Layout công khai, không sidebar; chỉ có trang việc làm và nộp hồ sơ |
| **ESS – Nhân viên** | Mọi nhân viên (`/me/*`, `/workplace`) | Ưu tiên responsive/di động: chấm công khuôn mặt, đơn nghỉ, phiếu lương, ký hợp đồng, đặt bàn |
| **Quản lý** | Trưởng phòng/Manager | Dùng chung các trang danh sách nhưng dữ liệu lọc theo `TEAM/DEPARTMENT`; thêm hộp thư duyệt |
| **HR** | HR / HR Specialist / HR Admin | Toàn bộ trang nghiệp vụ nhân sự, tuyển dụng, hợp đồng, chấm công, nghỉ phép... |
| **Kế toán** | Kế toán | Trang lương, tạm ứng, chi trả, phiếu lương |
| **IT / Office Admin** | IT, quản trị văn phòng | Hàng đợi cấp tài khoản, tài sản, quản trị không gian làm việc |
| **Pháp chế** | Chuyên viên pháp chế | Văn bản pháp luật, quy tắc tuân thủ, cảnh báo |
| **Ban Giám đốc** | Executive | Phê duyệt, dashboard, hỏi đáp AI về số liệu |
| **Super Admin** | Quản trị hệ thống | Người dùng, vai trò, cấu hình, workflow, audit log |

### 2.2. Layout

| Layout | Dùng cho | Thành phần |
| --- | --- | --- |
| `PublicLayout` | Cổng tuyển dụng công khai | Header thương hiệu, danh sách việc làm, footer |
| `AuthLayout` | Đăng nhập, kích hoạt tài khoản | Form giữa màn hình |
| `AppLayout` | Mọi trang sau đăng nhập | Sidebar (menu theo quyền) · Header (chuyển công ty, chuông thông báo, avatar) · Breadcrumb · Vùng nội dung · Nút nổi mở **Trợ lý AI** |
| `MobileLayout` | Chấm công, quét QR | Thanh điều hướng dưới, nút hành động lớn, dùng camera và GPS |

### 2.3. Cơ chế nền (không có giao diện riêng nhưng frontend bắt buộc xử lý)

| Cơ chế | Mô tả | API |
| --- | --- | --- |
| Đăng nhập & làm mới phiên | Lưu Access/Refresh Token; interceptor gặp `401` thì gọi refresh một lần rồi thử lại, thất bại thì về `/login` | `POST /auth/refresh` |
| Đăng xuất | Xóa token phía client, đưa Access Token vào Blacklist | `POST /auth/logout` |
| Khởi tạo phiên | Sau đăng nhập/tải lại trang: nạp thông tin tài khoản, roles và tập quyền hiệu lực theo từng công ty để dựng menu và route guard | `GET /auth/me`, `GET /auth/me/permissions` |
| Chuyển công ty | Người dùng có vai trò ở nhiều công ty chọn công ty hiện hành; truyền `companyId` ở các API có tham số này | (dùng dữ liệu từ `/auth/me/permissions`) |
| Polling thông báo | Chuông thông báo gọi định kỳ (không dùng WebSocket) | `GET /notifications/unread-count` |
| Danh mục enum | Nạp và cache giá trị enum cho dropdown/badge | `GET /lookups/{enumName}` |
| Tải/xem tệp | Mọi nơi đính kèm hoặc xem tài liệu dùng chung một thành phần | `POST /files`, `GET /files/{fileId}`, `GET /files/{fileId}/download` |
| Kiểm tra dịch vụ | Dùng cho màn hình bảo trì/trang trạng thái *(giả định)* | `GET /health` |
| Xử lý lỗi theo mã HTTP | `400` hiển thị lỗi theo field · `403` trang 403 hoặc toast · `404` trang 404 · `409` thông báo xung đột trạng thái · `422` hiển thị lý do vi phạm quy tắc nghiệp vụ/pháp lý · `202` hiển thị "đang xử lý" và chờ thông báo (Phụ lục B) | — |

---

## 3. Sơ đồ menu theo vai trò

Menu dưới đây là menu **đầy đủ**; từng người chỉ thấy mục mà họ có quyền.

```
Trang chủ
Việc cần làm của tôi ........ Hộp thư duyệt · Yêu cầu tôi đã gửi · Văn bản chờ tôi ký
Thông báo

CÁ NHÂN (ESS)
├─ Hồ sơ của tôi · Khuôn mặt · Tài liệu · Hợp đồng · Tài sản
├─ Chấm công (check-in/out · nhật ký · ca · giải trình · bảng công)
├─ Nghỉ phép (quỹ phép · đơn nghỉ)
├─ Lương (phiếu lương · tạm ứng)
├─ Hiệu suất (phiếu đánh giá) · Phát triển nghề nghiệp (MyCareer)
├─ Hội nhập · Khiếu nại · Khen thưởng/Kỷ luật liên quan tôi · Thôi việc
├─ Cơ hội nội bộ · My Workplace (bàn, phòng họp, sự cố, bản đồ)
└─ Trợ lý AI

NHÂN SỰ
├─ Tổ chức (công ty · vùng/chi nhánh · phòng ban · chức danh/cấp bậc · trung tâm chi phí)
├─ Mô phỏng tái cơ cấu
├─ Nhân viên (hồ sơ · điều chuyển · thôi việc)
├─ Tuyển dụng (đề xuất · vị trí · ứng viên · phỏng vấn · offer · talent pool)
├─ Hội nhập · Hợp đồng · Số hóa & lưu kho hồ sơ
├─ Chấm công & ca · Nghỉ phép
├─ Hiệu suất & KPI · Khen thưởng/Kỷ luật/Khiếu nại · Phát triển & Kế nhiệm
└─ Kho tri thức AI

TÀI CHÍNH
└─ Lương (thành phần · kỳ lương · bảng lương · tạm ứng · chi trả · phiếu lương)

VĂN PHÒNG & TÀI SẢN
├─ Tài sản · Hàng đợi cấp tài khoản IT
└─ Quản trị không gian (cơ sở/tầng · bản đồ · bàn · phòng họp · sự cố · báo cáo)

PHÁP CHẾ & TUÂN THỦ
└─ Văn bản pháp luật · Quy tắc · Đánh giá tác động · Kiểm tra · Cảnh báo · Dashboard

QUẢN TRỊ HỆ THỐNG
└─ Người dùng · Vai trò & quyền · Quy trình phê duyệt · Cấu hình · Ngày lễ · Kỹ năng · Phát thông báo · Nhật ký kiểm toán
```

---

## 4. Thành phần dùng chung (shared components)

Các thành phần này xuất hiện ở nhiều trang; nên xây một lần trong thư viện UI chung.

| Thành phần | Dùng ở | Ghi chú |
| --- | --- | --- |
| `DataTable` + bộ lọc | Mọi trang `LIST` | Phân trang `page/size` (bắt đầu từ 0, tối đa 100), sắp xếp `sort=field,asc`, ô `keyword`, lọc `from/to` |
| `StatusBadge` | Mọi nơi có trạng thái | Màu theo enum; trạng thái "suy ra/tính toán" (hết hạn, thiếu chấm công...) hiển thị như trạng thái thật |
| `ApprovalTimeline` | Đơn nghỉ, hợp đồng, tuyển dụng, lương, điều chuyển... | Hiển thị các bước duyệt từ `GET /workflow-requests/{id}`: người duyệt, quyết định, nhận xét, thời gian |
| `ApprovalActionBar` | Trang chi tiết mà người dùng là người duyệt | Nút Phê duyệt / Từ chối; **từ chối bắt buộc nhập nhận xét** |
| `FileUploader` / `FileViewer` | Đính kèm minh chứng, CV, hợp đồng, giấy tờ | Gọi `/files`; xem qua URL ký có thời hạn |
| `EmployeePicker` | Hầu hết form | Tìm nhân viên theo `keyword`, kết quả theo phạm vi dữ liệu |
| `OrgTreePicker` / `OrgTree` | Phòng ban, mô phỏng, phân khu, lọc | Cây đơn vị, hỗ trợ chọn kèm đơn vị con (`includeChildren`) và xem tại thời điểm `asOf` |
| `AsOfDatePicker` | Cơ cấu tổ chức, công tác, mức lương | Xem dữ liệu hiệu lực tại thời điểm quá khứ |
| `EffectiveDatedHistory` | Công tác, lương, phòng ban | Bảng lịch sử theo ngày hiệu lực |
| `ConfirmReasonDialog` | Từ chối, hủy, mở khóa kỳ công, ghi đè bảng lương | Bắt buộc nhập lý do khi nghiệp vụ yêu cầu |
| `AuditSideBySideDiff` | Chi tiết audit log | So sánh giá trị trước/sau |
| `EntityHistoryButton` | Mọi trang chi tiết nhạy cảm | Mở `/audit-logs/entity/{type}/{id}` |
| `CameraCapture` + `LivenessCheck` | Đăng ký khuôn mặt, chấm công | Yêu cầu quyền camera; gửi kèm GPS |
| `MapPicker` | Chi nhánh (tọa độ + bán kính chấm công) | Chọn điểm và vẽ bán kính |
| `FloorCanvas2D` | Bản đồ tầng, trình soạn bản đồ, đặt bàn | Canvas 2D: ảnh nền, phân khu, bàn, vật thể, đường đi; dùng chung cho Admin và My Workplace |
| `SignaturePad` + `OtpInput` | Ký hợp đồng điện tử | Chữ ký số/OTP |
| `AsyncJobNotice` | Xuất dữ liệu, tính lương, OCR, sinh phiếu lương | Xử lý `202 Accepted`, thông báo hoàn tất qua chuông |
| `ChartBlock` | Dashboard, bảng điều khiển, chatbot (`render_chart`) | Chỉ vẽ từ dữ liệu API trả về |
| `PermissionGate` | Mọi nút hành động | Ẩn/vô hiệu hóa theo mã quyền |
| `SensitiveMask` | CCCD, lương, tài khoản ngân hàng | Che dữ liệu, chỉ hiện khi có `employee.view_sensitive`/`payroll.view_salary` |

---

## 5. Danh sách trang theo module

### 5.0. XÁC THỰC (AUTH)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| AUTH-01 | `/login` | Đăng nhập (`PUBLIC`) | Form email + mật khẩu; nút "Đăng nhập với Google"; thông báo khi tài khoản bị khóa/chưa kích hoạt. Không có đăng ký (tài khoản do quản trị viên tạo) | `POST /auth/login`, `GET /auth/google` | Public |
| AUTH-02 | `/auth/callback` *(giả định)* | Điểm nhận kết quả Google OAuth2 (`PUBLIC`) | Trang trung gian nhận token sau khi backend xử lý callback, lưu phiên rồi chuyển vào trang chủ | `GET /auth/oauth2/callback/google` | Public |
| AUTH-03 | `/auth/activate?token=` | Kích hoạt tài khoản (`PUBLIC`) | Đặt mật khẩu lần đầu từ liên kết email (hiệu lực 48 giờ); thành công thì tự đăng nhập; báo lỗi nếu token hết hạn/đã dùng | `POST /auth/activate` | Public |
| AUTH-04 | `/403`, `/404`, `/session-expired` | Trang lỗi (`STATIC`) | Không đủ quyền / không tìm thấy / hết phiên | — | Public |

> Tài liệu API xác nhận **không có** chức năng quên mật khẩu hoặc đổi mật khẩu vì nghiệp vụ không mô tả — xem mục 6.

### 5.1. DÙNG CHUNG (CMN)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| CMN-01 | `/dashboard` | Trang chủ (`DASH`) | Widget theo vai trò, mỗi widget gọi API sẵn có: số việc chờ duyệt, thông báo chưa đọc, trạng thái chấm công hôm nay, quỹ phép, văn bản chờ ký, hợp đồng và giấy tờ sắp hết hạn | `GET /workflow-requests/inbox`, `GET /me/attendance/today`, `GET /me/leave-balances`, `GET /me/contract-signing-tasks`, `GET /contracts/expiring`, `GET /documents/expiring` | Auth (widget con theo quyền) |
| CMN-02 | `/workflows/pending` | Hộp thư cần tôi duyệt (`LIST`) | Danh sách bước đang chờ, lọc theo loại yêu cầu (`requestType`); mở nhanh chi tiết để duyệt. Là đích điều hướng của thông báo | `GET /workflow-requests/inbox` | Auth |
| CMN-03 | `/workflows/submitted` | Yêu cầu tôi đã gửi (`LIST`) | Theo dõi trạng thái các yêu cầu do mình gửi; hủy yêu cầu đang chờ | `GET /workflow-requests/my-submitted`, `POST /workflow-requests/{requestId}/cancel` | Auth |
| CMN-04 | `/workflows/:requestId` | Chi tiết yêu cầu phê duyệt (`DETAIL`) | Thông tin đối tượng được duyệt (liên kết sang trang nghiệp vụ gốc), timeline các bước, nhận xét. Người được giao thấy nút Phê duyệt / Từ chối (bắt buộc nhận xét) | `GET /workflow-requests/{requestId}`, `POST /workflow-requests/{requestId}/steps/{stepId}/approve`, `POST /workflow-requests/{requestId}/steps/{stepId}/reject` | Auth |
| CMN-05 | `/workflows` | Tra cứu yêu cầu phê duyệt (`LIST`) | HR/Admin tra cứu theo `requestType`, `referenceId`, `status` | `GET /workflow-requests` | `workflow.view` |
| CMN-06 | `/admin/workflow-definitions` | Quy trình phê duyệt (`LIST`) | Danh sách quy trình theo `requestType`; kích hoạt (tự vô hiệu quy trình đang chạy cùng loại) / ngừng áp dụng | `GET /workflow-definitions`, `POST /workflow-definitions/{definitionId}/activate`, `POST /workflow-definitions/{definitionId}/deactivate` | `workflow.manage` |
| CMN-07 | `/admin/workflow-definitions/new`, `/admin/workflow-definitions/:id` | Thiết kế quy trình (`FORM`) | Chọn loại yêu cầu, thêm/sắp xếp các bước và người duyệt. Cảnh báo "chỉ ảnh hưởng yêu cầu tạo sau đó" | `POST /workflow-definitions`, `GET,PUT /workflow-definitions/{definitionId}` | `workflow.manage` |
| CMN-08 | `/admin/system-configs` | Cấu hình hệ thống (`LIST`) | Danh sách khóa cấu hình theo công ty/tiền tố; sửa giá trị; hiển thị giá trị đang được kế thừa từ toàn hệ thống | `GET /system-configurations`, `GET,PUT /system-configurations/{configKey}` | `system.view` / `system.update` |
| CMN-09 | `/admin/holidays` | Ngày nghỉ lễ (`CALENDAR`) | Lịch ngày lễ theo năm và công ty; thêm/sửa/xóa. Ai cũng xem được | `GET,POST /holidays`, `PUT,DELETE /holidays/{holidayId}` | `Auth` (xem) · `holiday.manage` |
| CMN-10 | `/admin/skills` | Danh mục kỹ năng (`LIST`) | CRUD kỹ năng; không xóa được kỹ năng đã được tham chiếu (`409`) | `GET,POST /skills`, `PUT,DELETE /skills/{skillId}` | `Auth` (xem) · `skill.manage` |
| CMN-11 | `/assets/categories` | Loại tài sản (`LIST`) | CRUD loại tài sản | `GET,POST /asset-categories`, `PUT,DELETE /asset-categories/{categoryId}` | `asset.view` / `asset.manage` |
| CMN-12 | `/assets` | Danh sách tài sản (`LIST`) | Lọc theo loại, từ khóa, đang cấp/chưa cấp; tạo tài sản; hành động Cấp phát nhanh | `GET,POST /assets`, `POST /assets/{assetId}/assign` | `asset.view` / `asset.manage` / `asset.assign` |
| CMN-13 | `/assets/:id` | Chi tiết tài sản (`DETAIL`) | Thông tin, người đang giữ, lịch sử cấp/trả; sửa; cấp phát; ghi nhận hoàn trả | `GET,PUT /assets/{assetId}`, `POST /assets/{assetId}/assign`, `POST /asset-assignments/{assignmentId}/return` | `asset.view` / `asset.manage` / `asset.assign` |
| CMN-14 | `/me/assets` | Tài sản tôi đang giữ (`LIST`) | ESS xem thiết bị đang được cấp | `GET /me/assets` | Auth |

> Tab "Tài sản" trong hồ sơ nhân viên (`EMP-03`) dùng `GET /employees/{employeeId}/assets`.

### 5.2. QUẢN LÝ TỔ CHỨC (ORG)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| ORG-01 | `/organization/companies` | Danh sách công ty (`LIST`) | Danh sách pháp nhân, tạo công ty mới (mã, tên, MST, địa chỉ, liên hệ) | `GET,POST /companies` | `organization.view` / `organization.manage` |
| ORG-02 | `/organization/companies/:id` | Thông tin doanh nghiệp (`DETAIL`) | Xem/cập nhật thông tin công ty; lối tắt sang vùng, chi nhánh, trung tâm chi phí | `GET,PUT /companies/{companyId}` | `organization.view` / `organization.manage` |
| ORG-03 | `/organization/regions-branches` | Vùng miền & chi nhánh (`LIST`) | Bố cục hai cột: cột trái danh sách vùng (thêm/sửa/xóa), cột phải chi nhánh của vùng được chọn; lọc theo từ khóa | `GET,POST /companies/{companyId}/regions`, `PUT,DELETE /regions/{regionId}`, `GET /branches`, `POST /regions/{regionId}/branches` | `organization.view` / `organization.manage` |
| ORG-04 | `/organization/branches/:id` | Chi tiết chi nhánh (`FORM`) | Địa chỉ, **tọa độ GPS và bán kính chấm công** chọn trên bản đồ (`MapPicker`); xóa chi nhánh (chặn nếu còn nhân viên/cơ sở tham chiếu) | `GET,PUT,DELETE /branches/{branchId}` | `organization.view` / `organization.manage` |
| ORG-05 | `/organization/cost-centers` | Trung tâm chi phí (`LIST`) | CRUD, hiển thị phòng ban đang dùng | `GET,POST /cost-centers`, `PUT,DELETE /cost-centers/{costCenterId}` | `organization.view` / `organization.manage` |
| ORG-06 | `/organization/job-titles` | Chức danh (`LIST`) | Danh sách + form tạo/sửa; xem chi tiết; xóa khi chưa được tham chiếu | `GET,POST /job-titles`, `GET,PUT,DELETE /job-titles/{jobTitleId}` | `organization.view` / `organization.manage` |
| ORG-07 | `/organization/job-levels` | Cấp bậc (`LIST`) | Danh sách theo thứ tự thẩm quyền (`rank_order`), kéo thả sắp xếp *(giả định)* | `GET,POST /job-levels`, `PUT,DELETE /job-levels/{jobLevelId}` | `organization.view` / `organization.manage` |
| ORG-08 | `/organization/departments` | Sơ đồ tổ chức (`LIST`) | Chuyển đổi giữa **dạng cây** và bảng; chọn thời điểm `asOf` để xem cơ cấu quá khứ; tạo đơn vị; chỉ định quản lý; **Chuyển đơn vị** với bước xem trước tác động (số nhân viên và đơn vị con bị ảnh hưởng, chặn vòng lặp); giải thể đơn vị | `GET /departments/tree`, `GET,POST /departments`, `PUT /departments/{departmentId}/manager`, `GET /departments/{departmentId}/move-impact`, `POST /departments/{departmentId}/move`, `DELETE /departments/{departmentId}` | `organization.view` / `organization.manage` |
| ORG-09 | `/organization/departments/:id` | Chi tiết đơn vị (`DETAIL`) | Tab **Thông tin** (sửa tên/trung tâm chi phí, tạo phiên bản mới có ngày hiệu lực) · **Nhân viên** (kèm/không kèm đơn vị con, theo `asOf`) · **Lịch sử cơ cấu** | `GET,PUT /departments/{departmentId}`, `GET /departments/{departmentId}/versions`, `GET /departments/{departmentId}/employees` | `organization.view` / `organization.manage` |

### 5.3. MÔ PHỎNG TÁI CƠ CẤU TỔ CHỨC (SIM)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| SIM-01 | `/org-simulations` | Danh sách kịch bản (`LIST`) | Lọc theo trạng thái; tạo kịch bản (sao chép cây hiện tại vào sandbox); xóa kịch bản `DRAFT`; hủy kịch bản; chọn nhiều kịch bản để so sánh | `GET,POST /org-scenarios`, `DELETE /org-scenarios/{scenarioId}`, `POST /org-scenarios/{scenarioId}/cancel` | `org_scenario.view` / `org_scenario.manage` |
| SIM-02 | `/org-simulations/:id` | Trình chỉnh sơ đồ sandbox (`EDITOR`) | Cây đơn vị kéo thả: **chuyển**, **sáp nhập** nhiều đơn vị vào một, **tách**, **giải thể**, thêm mới, đổi tên/quản lý/trung tâm chi phí. Panel "Điều chuyển nhân sự giả lập" gán nhân viên sang đơn vị/quản lý mới. Sửa tên, mô tả, ngày hiệu lực dự kiến khi `DRAFT`. Banner nhắc đây là sandbox, chưa ảnh hưởng dữ liệu thật | `GET,PUT /org-scenarios/{scenarioId}`, `GET /org-scenarios/{scenarioId}/departments/tree`, `POST /org-scenarios/{scenarioId}/departments`, `PUT,DELETE /org-scenarios/{scenarioId}/departments/{scenarioDepartmentId}`, `POST /org-scenarios/{scenarioId}/departments/{scenarioDepartmentId}/move`, `POST /org-scenarios/{scenarioId}/departments/merge`, `POST /org-scenarios/{scenarioId}/departments/{scenarioDepartmentId}/split`, `GET /org-scenarios/{scenarioId}/employee-moves`, `PUT,DELETE /org-scenarios/{scenarioId}/employee-moves/{employeeId}` | `org_scenario.view` / `org_scenario.manage` |
| SIM-03 | `/org-simulations/:id/impact` | Phân tích tác động & phê duyệt (`DASH`) | Thống kê nhân viên, chi phí theo trung tâm chi phí, quy trình phê duyệt, quyền hạn bị ảnh hưởng; nút **Trình phê duyệt**; khi `APPROVED` hiện nút **Áp dụng vào cơ cấu thật** (có xác nhận) | `GET /org-scenarios/{scenarioId}/impact`, `POST /org-scenarios/{scenarioId}/submit`, `POST /org-scenarios/{scenarioId}/apply` | `org_scenario.view` / `org_scenario.manage` / `org_scenario.apply` |
| SIM-04 | `/org-simulations/compare?ids=` | So sánh kịch bản (`DASH`) | Bảng đối chiếu song song các phương án (số đơn vị, nhân sự, chi phí, tác động) | `GET /org-scenarios/compare` | `org_scenario.view` |

### 5.4. PHÂN QUYỀN & TÀI KHOẢN (RBAC)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| RBAC-01 | `/admin/users` | Danh sách tài khoản (`LIST`) | Lọc theo từ khóa, trạng thái (`PENDING_ACTIVATION`, `ACTIVE`, `LOCKED`...), vai trò; tạo tài khoản (email, nhân viên liên kết, vai trò) và gửi email kích hoạt | `GET,POST /users` | `user.view` / `user.create` |
| RBAC-02 | `/admin/users/:id` | Chi tiết tài khoản (`DETAIL`) | Trạng thái, lần đăng nhập gần nhất; **Khóa / Mở khóa**; **Gửi lại kích hoạt** (chỉ khi chờ kích hoạt); tab vai trò theo công ty: gán và gỡ vai trò | `GET /users/{userId}`, `POST /users/{userId}/resend-activation`, `POST /users/{userId}/lock`, `POST /users/{userId}/unlock`, `GET,POST /users/{userId}/role-assignments`, `DELETE /role-assignments/{assignmentId}` | `user.view` / `user.update` / `user.lock` / `role.view` / `role.assign` |
| RBAC-03 | `/admin/roles` | Danh sách vai trò (`LIST`) | Vai trò mặc định hệ thống (không sửa) và vai trò tùy chỉnh theo công ty; tạo; xóa vai trò chưa được gán | `GET,POST /roles`, `DELETE /roles/{roleId}` | `role.view` / `role.manage` |
| RBAC-04 | `/admin/roles/:id` | Chi tiết vai trò (`DETAIL`) | Tab **Thông tin** (sửa tên/mô tả) · **Ma trận quyền** (hàng = chức năng, cột = hành động, mỗi quyền chọn phạm vi dữ liệu `OWN/TEAM/DEPARTMENT/COMPANY/ALL`) · **Quyền tài liệu** (theo loại tài liệu, hành động, phạm vi) · **Người dùng** đang giữ vai trò | `GET,PUT /roles/{roleId}`, `GET /permissions`, `GET,PUT /roles/{roleId}/permissions`, `GET,PUT /roles/{roleId}/document-type-permissions`, `GET /roles/{roleId}/users` | `role.view` / `role.manage` |

### 5.5. TUYỂN DỤNG (REC)

#### a) Cổng ứng viên (công khai)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| REC-01 | `/careers` | Danh sách việc làm (`PUBLIC`) | Tìm theo từ khóa, phòng ban; thẻ vị trí đang tuyển | `GET /public/job-openings` | Public |
| REC-02 | `/careers/:slug` | Trang ứng tuyển riêng của vị trí (`PUBLIC`) | Landing page theo `landing_slug`: mô tả công việc, khung lương, hạn nộp; form họ tên, email, SĐT, đính kèm CV; báo lỗi trùng email/SĐT; trang cảm ơn sau khi nộp | `GET /public/job-openings/{slug}`, `POST /public/job-openings/{slug}/applications` | Public |

#### b) Nhu cầu & vị trí tuyển dụng

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| REC-03 | `/recruitment/requests` | Đề xuất tuyển dụng (`LIST`) | Lọc theo phòng ban, trạng thái (`PENDING_APPROVAL`, `APPROVED`...) | `GET /recruitment-requests` | `recruitment_request.view` |
| REC-04 | `/recruitment/requests/new`, `/recruitment/requests/:id/edit` | Lập/sửa đề xuất (`FORM`) | Trưởng bộ phận nhập phòng ban, chức danh, số lượng, lý do. Tạo xong tự gửi duyệt; chỉ sửa được khi chưa có bước duyệt xử lý | `POST /recruitment-requests`, `PUT /recruitment-requests/{requestId}` | `recruitment_request.create` |
| REC-05 | `/recruitment/requests/:id` | Chi tiết đề xuất (`DETAIL`) | Thông tin + `ApprovalTimeline`; hủy khi còn chờ duyệt; nút **Tạo vị trí tuyển dụng** khi `APPROVED` | `GET /recruitment-requests/{requestId}`, `POST /recruitment-requests/{requestId}/cancel` | `recruitment_request.view` / `recruitment_request.create` |
| REC-06 | `/recruitment/openings` | Vị trí tuyển dụng (`LIST`) | Lọc theo trạng thái (`OPEN`, `ON_HOLD`, `CLOSED`), phòng ban; hiển thị số cần tuyển/đã tuyển | `GET /job-openings` | `recruitment.view` |
| REC-07 | `/recruitment/openings/new?requestId=`, `/recruitment/openings/:id/edit` | Tạo/sửa vị trí (`FORM`) | Tạo từ đề xuất đã duyệt: JD, khung lương, hạn tuyển | `POST /job-openings`, `PUT /job-openings/{openingId}` | `recruitment.manage` |
| REC-08 | `/recruitment/openings/:id` | Chi tiết vị trí (`DETAIL`) | Tổng quan, số hồ sơ theo giai đoạn; **Tạm dừng / Mở lại / Đóng**; tab điều hướng sang Pipeline, Tin đăng, Vòng phỏng vấn | `GET /job-openings/{openingId}`, `POST /job-openings/{openingId}/hold`, `POST /job-openings/{openingId}/reopen`, `POST /job-openings/{openingId}/close` | `recruitment.view` / `recruitment.manage` |
| REC-09 | `/recruitment/openings/:id/pipeline` | ATS Pipeline (`BOARD`) | Kanban các giai đoạn tuyển dụng; kéo thẻ hồ sơ để chuyển giai đoạn (nhập ghi chú); mở nhanh chi tiết hồ sơ | `GET /job-openings/{openingId}/pipeline`, `POST /applications/{applicationId}/stage-transitions` | `recruitment.view` / `candidate.manage` |
| REC-10 | `/recruitment/openings/:id/postings` | Tin đăng đa kênh (`LIST`) | Chọn nhiều kênh + hạn đăng, tạo một lần; **Xuất bản** / **Gỡ tin**; hiển thị trạng thái `FAILED` khi tích hợp lỗi | `GET,POST /job-openings/{openingId}/postings`, `POST /job-postings/{postingId}/publish`, `POST /job-postings/{postingId}/withdraw` | `recruitment.view` / `recruitment.manage` |
| REC-11 | `/recruitment/channels` | Kênh tuyển dụng (`LIST`) | CRUD kênh/nguồn ứng viên | `GET,POST /recruitment-channels`, `PUT,DELETE /recruitment-channels/{channelId}` | `recruitment.view` / `recruitment.manage` |

#### c) Ứng viên & hồ sơ ứng tuyển

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| REC-12 | `/recruitment/candidates` | Danh sách ứng viên (`LIST`) | Tìm theo từ khóa, kỹ năng, nguồn | `GET /candidates` | `candidate.view` |
| REC-13 | `/recruitment/candidates/new` | Thêm ứng viên (`WIZARD`) | Bước 1 tải CV · Bước 2 **CV Parser** trích xuất để HR kiểm tra · Bước 3 bổ sung kinh nghiệm, học vấn, kỹ năng · Bước 4 lưu. Tiến trình AI chạy bất đồng bộ | `POST /candidates/parse-cv`, `POST /candidates`, `PUT /candidates/{candidateId}/work-experiences`, `PUT /candidates/{candidateId}/educations`, `PUT /candidates/{candidateId}/skills` | `candidate.manage` |
| REC-14 | `/recruitment/candidates/:id` | Hồ sơ ứng viên (`DETAIL`) | Thông tin liên hệ (sửa), kinh nghiệm, học vấn, kỹ năng, các lần ứng tuyển; nút Thêm vào Talent Pool, Thêm hồ sơ ứng tuyển | `GET,PUT /candidates/{candidateId}`, `PUT /candidates/{candidateId}/work-experiences`, `PUT /candidates/{candidateId}/educations`, `PUT /candidates/{candidateId}/skills` | `candidate.view` / `candidate.manage` |
| REC-15 | `/recruitment/applications` | Hồ sơ ứng tuyển (`LIST`) | Lọc theo vị trí, giai đoạn, từ khóa; HR thêm hồ sơ cho ứng viên có sẵn | `GET,POST /applications` | `candidate.view` / `candidate.manage` |
| REC-16 | `/recruitment/applications/:id` | Chi tiết hồ sơ ứng tuyển (`DETAIL`) | Tab **Tổng quan** (chuyển giai đoạn + lịch sử) · **AI CV Review** (chạy và xem các kết quả đã lưu, ghi rõ là tham khảo) · **Phỏng vấn** (Interview Kit, các buổi) · **Offer**. Nút "Sinh bộ câu hỏi bằng AI" theo từng vòng | `GET /applications/{applicationId}`, `GET,POST /applications/{applicationId}/stage-transitions`, `POST /applications/{applicationId}/ai-review`, `GET /applications/{applicationId}/ai-reviews`, `POST /applications/{applicationId}/interview-questions/generate` | `candidate.view` / `candidate.manage` / `interview.manage` |
| REC-17 | `/recruitment/talent-pool` | Ngân hàng hồ sơ (Talent Pool) (`LIST`) | Tìm lại ứng viên tiềm năng theo kỹ năng, nguồn, từ khóa; sửa ghi chú; gỡ khỏi kho; thêm ứng viên | `GET,POST /talent-pool`, `PUT,DELETE /talent-pool/{candidateId}` | `candidate.view` / `candidate.manage` |

#### d) Phỏng vấn

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| REC-18 | `/recruitment/openings/:id/interview-setup` | Thiết lập vòng phỏng vấn (`EDITOR`) | Danh sách vòng; mỗi vòng có **tiêu chí đánh giá** (thang điểm, trọng số) và **bộ câu hỏi chuẩn**; thêm/sửa/xóa (không xóa vòng đã có buổi phỏng vấn) | `GET,POST /job-openings/{openingId}/interview-rounds`, `PUT,DELETE /interview-rounds/{roundId}`, `GET,POST /interview-rounds/{roundId}/criteria`, `PUT,DELETE /interview-criteria/{criterionId}`, `GET,POST /interview-rounds/{roundId}/questions`, `PUT,DELETE /interview-questions/{questionId}` | `interview.view` / `interview.manage` |
| REC-19 | `/recruitment/interviews` | Lịch phỏng vấn (`CALENDAR`) | Lịch theo ngày/tuần, lọc theo hồ sơ, trạng thái | `GET /interviews` | `interview.view` |
| REC-20 | `/recruitment/interviews/new?applicationId=` | Lên lịch phỏng vấn (`FORM`) | Chọn vòng, thời gian, hình thức, hội đồng; **kiểm tra lịch rảnh/trùng lịch** của người phỏng vấn trước khi lưu | `GET /interviews/availability`, `POST /interviews` | `interview.manage` |
| REC-21 | `/recruitment/interviews/:id` | Chi tiết buổi phỏng vấn (`DETAIL`) | Đổi lịch/hình thức (gửi thông báo lại), đổi hội đồng, **Hoàn thành**, **Hủy**; nút **Quét nội dung không phù hợp**; xem phiếu của các giám khảo (chỉ khi người xem đã nộp phiếu của mình) | `GET,PUT /interviews/{interviewId}`, `PUT /interviews/{interviewId}/panelists`, `POST /interviews/{interviewId}/complete`, `POST /interviews/{interviewId}/cancel`, `POST /interviews/{interviewId}/content-scan`, `GET /interviews/{interviewId}/scorecards` | `interview.view` / `interview.manage` |
| REC-22 | `/me/interviews` | Lịch phỏng vấn tôi tham gia (`LIST`) | Giám khảo xem các buổi được phân công và mở phiếu chấm | `GET /interviews/mine` | Auth |
| REC-23 | `/interviews/:id/scorecard` | Phiếu chấm điểm độc lập (`FORM`) | **Blind Grading**: chấm theo từng tiêu chí, lưu nháp, **Nộp phiếu**. Sau khi nộp mới được xem phiếu giám khảo khác | `GET,PUT /interviews/{interviewId}/scorecards/mine`, `POST /interviews/{interviewId}/scorecards/mine/submit` | Auth |
| REC-24 | `/recruitment/applications/:id/score-summary` | Tổng hợp điểm phỏng vấn (`DASH`) | Điểm tổng hợp theo giám khảo và tiêu chí; **cảnh báo bất đồng điểm** giữa giám khảo | `GET /applications/{applicationId}/score-summary` | `interview.view` |
| REC-25 | `/recruitment/content-flags` | Cảnh báo nội dung phỏng vấn (`LIST`) | Danh sách cảnh báo câu hỏi/ghi chú có nguy cơ phân biệt đối xử; HR xem xét → `CONFIRMED` hoặc `DISMISSED` | `GET /interview-content-flags`, `PUT /interview-content-flags/{flagId}/review` | `interview.manage` |

#### e) Offer & tiếp nhận

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| REC-26 | `/recruitment/offers` | Danh sách offer (`LIST`) | Lọc theo trạng thái, hồ sơ | `GET /offers` | `offer.view` |
| REC-27 | `/recruitment/offers/new?applicationId=`, `/recruitment/offers/:id` | Tạo & chi tiết offer (`FORM`/`DETAIL`) | Nhập lương cơ bản, ngày nhận việc, hạn phản hồi (sửa khi `DRAFT`). Chuỗi hành động theo trạng thái: **Sinh thư mời** → **Trình duyệt** (vượt khung lương thêm bước duyệt) → **Gửi thư** (khi `APPROVED`) → **Ghi nhận đồng ý / từ chối** (chọn lý do) / **Hủy**. Khi ứng viên đồng ý hiện nút **Tiếp nhận thành nhân viên** → chuyển sang `EMP-02` | `POST /offers`, `GET,PUT /offers/{offerId}`, `POST /offers/{offerId}/generate-letter`, `POST /offers/{offerId}/submit`, `POST /offers/{offerId}/send`, `POST /offers/{offerId}/accept`, `POST /offers/{offerId}/decline`, `POST /offers/{offerId}/cancel` | `offer.view` / `offer.manage` |

#### f) Thị trường nhân tài nội bộ

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| REC-28 | `/marketplace` | Cơ hội nội bộ (`LIST`) | Mọi nhân viên xem vị trí mở/dự án ngắn hạn; lọc theo loại, trạng thái, phòng ban | `GET /internal-opportunities` | Auth |
| REC-29 | `/marketplace/:id` | Chi tiết cơ hội (`DETAIL`) | Nhân viên: **Bày tỏ quan tâm** (nhập động lực) / **Rút quan tâm**. Người quản lý cơ hội: danh sách nhân viên quan tâm, **Chọn** (giao nhiệm vụ) / **Không chọn** / **Ghi nhận kết quả đóng góp**, **Đóng cơ hội** | `GET /internal-opportunities/{opportunityId}`, `POST /internal-opportunities/{opportunityId}/interests`, `DELETE /internal-opportunities/{opportunityId}/interests/mine`, `GET /internal-opportunities/{opportunityId}/interests`, `POST /internal-opportunity-applications/{interestId}/select`, `POST /internal-opportunity-applications/{interestId}/reject`, `POST /internal-opportunity-applications/{interestId}/outcome`, `POST /internal-opportunities/{opportunityId}/close` | Auth · `internal_opportunity.manage` |
| REC-30 | `/marketplace/new`, `/marketplace/:id/edit` | Đăng/sửa cơ hội (`FORM`) | Quản lý đăng vị trí mở hoặc dự án ngắn hạn | `POST /internal-opportunities`, `PUT /internal-opportunities/{opportunityId}` | `internal_opportunity.manage` |
| REC-31 | `/me/marketplace` | Cơ hội tôi quan tâm (`LIST`) | Lịch sử quan tâm/tham gia của tôi | `GET /me/internal-opportunity-applications` | Auth |

---

### 5.6. HỒ SƠ NHÂN SỰ (EMP)

Hồ sơ nhân viên là trang `DETAIL` nhiều tab. Mỗi tab có route riêng dạng `/employees/:id/<tab>` để chia sẻ liên kết và lazy-load.

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| EMP-01 | `/employees` | Danh sách nhân viên (`LIST`) | Lọc theo từ khóa, phòng ban, chi nhánh, chức danh, trạng thái; **Xuất danh sách** (bất đồng bộ) | `GET /employees`, `GET /employees/export` | `employee.view` / `employee.export` |
| EMP-02 | `/employees/new?applicationId=` | Tạo hồ sơ nhân viên (`WIZARD`) | Nhập tay hoặc tiếp nhận từ ứng viên trúng tuyển (điền sẵn từ hồ sơ ứng tuyển); kiểm tra trùng mã nhân viên và số CCCD/hộ chiếu; tùy chọn tạo kèm tài khoản | `POST /employees` | `employee.create` |
| EMP-03 | `/employees/:id` | Tổng quan nhân viên (`DETAIL`) | Thẻ thông tin tóm tắt (phòng ban, chức danh, quản lý, trạng thái hiện hành), cấp dưới trực tiếp, cảnh báo thiếu giấy tờ; thanh tab sang các mục dưới | `GET /employees/{employeeId}`, `PUT /employees/{employeeId}`, `GET /employees/{employeeId}/direct-reports` | `employee.view` / `employee.update` |
| EMP-04 | `/employees/:id/personal` | Cá nhân & pháp lý (`DETAIL`) | Giấy tờ định danh (CCCD/hộ chiếu, kiểm tra trùng số); tài khoản ngân hàng nhận lương. Dữ liệu che mặc định (`SensitiveMask`) | `GET,POST /employees/{employeeId}/identity-documents`, `PUT,DELETE /identity-documents/{documentId}`, `GET,PUT /employees/{employeeId}/bank-account` | `employee.view_sensitive` / `employee.update` |
| EMP-05 | `/employees/:id/assignments` | Công tác (`DETAIL`) | Lịch sử công tác theo ngày hiệu lực (phòng ban, chi nhánh, chức danh, cấp bậc, quản lý, loại hình); xem **tại một ngày**; thêm dòng bổ nhiệm/điều chỉnh không qua điều chuyển | `GET,POST /employees/{employeeId}/work-assignments`, `GET /employees/{employeeId}/work-assignments/at` | `employee.view` / `employee.assign` |
| EMP-06 | `/employees/:id/family` | Người phụ thuộc & liên hệ khẩn cấp (`DETAIL`) | Hai bảng CRUD; người phụ thuộc có thời gian giảm trừ gia cảnh | `GET,POST /employees/{employeeId}/dependents`, `PUT,DELETE /dependents/{dependentId}`, `GET,POST /employees/{employeeId}/emergency-contacts`, `PUT,DELETE /emergency-contacts/{contactId}` | `employee.view` / `employee.update` |
| EMP-07 | `/employees/:id/status` | Trạng thái & thử việc (`DETAIL`) | Lịch sử trạng thái, ghi nhận đổi trạng thái (vd `SUSPENDED`); kết quả thử việc (đạt/không đạt/gia hạn); **kiểm tra điều kiện chuyển chính thức** và nút **Xác nhận chính thức** (`PROBATION → ACTIVE`) | `GET /employees/{employeeId}/status-history`, `POST /employees/{employeeId}/status-changes`, `GET,POST /employees/{employeeId}/probation-evaluations`, `GET /employees/{employeeId}/official-eligibility`, `POST /employees/{employeeId}/confirm-official` | `employee.view` / `employee.status` |
| EMP-08 | `/employees/:id/face` | Đăng ký khuôn mặt – HR (`DETAIL`) | Lịch sử đăng ký, đăng ký thay nhân viên (ảnh + liveness + ghi nhận đồng ý xử lý dữ liệu sinh trắc), **thu hồi mẫu** kèm lý do | `GET,POST /employees/{employeeId}/face-enrollments`, `POST /face-enrollments/{enrollmentId}/revoke` | `employee.face_manage` |
| EMP-09 | `/me/profile` | Hồ sơ của tôi (`DETAIL`) | Xem hồ sơ; tự sửa các trường được phép (liên hệ, địa chỉ, người liên hệ khẩn cấp) | `GET,PUT /me/profile` | Auth |
| EMP-10 | `/me/face-enrollment` | Khuôn mặt của tôi (`MOBILE`) | Xem trạng thái; tự đăng ký (chụp ảnh, liveness, đồng ý điều khoản dữ liệu sinh trắc); **yêu cầu xóa dữ liệu khuôn mặt** | `GET,POST,DELETE /me/face-enrollment` | Auth |

**Các tab liên module trong hồ sơ nhân viên** (dùng lại API của module tương ứng, mô tả ở phần riêng):

| Tab | Route | Nguồn API | Trang gốc |
| --- | --- | --- | --- |
| Hợp đồng | `/employees/:id/contracts` | `GET /employees/{employeeId}/contracts` | CON-03 |
| Tài liệu & bộ hồ sơ | `/employees/:id/documents` | `GET,POST /employees/{employeeId}/dossiers` | DOC-09 |
| Hội nhập | `/employees/:id/onboarding` | `GET /employees/{employeeId}/onboarding` | ONB-05 |
| Tài sản | `/employees/:id/assets` | `GET /employees/{employeeId}/assets` | CMN-13 |
| Lương (ẩn nếu không có quyền) | `/employees/:id/payroll` | Xem `PAY-09` | PAY-09 |
| Quỹ phép | `/employees/:id/leave` | `GET /employees/{employeeId}/leave-balances` | LEA-03 |
| Lịch sử điều chuyển | `/employees/:id/transfers` | `GET /employees/{employeeId}/transfer-history` | TRF-04 |
| Thôi việc | `/employees/:id/offboarding` | `GET /employees/{employeeId}/offboarding` | OFF-07 |
| Thẻ nhân tài | `/employees/:id/talent` | `GET /employees/{employeeId}/talent-tags` | CAR-05 |

---

### 5.7. HỘI NHẬP NHÂN SỰ (ONB)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| ONB-01 | `/onboarding/templates` | Mẫu checklist (`LIST`) | Lọc theo phòng ban, chức danh, đang dùng; ngừng sử dụng mẫu | `GET /onboarding-templates`, `POST /onboarding-templates/{templateId}/deactivate` | `onboarding.view` / `onboarding.manage` |
| ONB-02 | `/onboarding/templates/new`, `/onboarding/templates/:id` | Thiết kế mẫu (`EDITOR`) | Thông tin mẫu + danh sách hạng mục kéo thả sắp xếp, đánh dấu bắt buộc, loại việc (giấy tờ, tài khoản IT, thiết bị, đào tạo). Ghi chú: sửa mẫu không ảnh hưởng tiến trình đang chạy | `POST /onboarding-templates`, `GET,PUT /onboarding-templates/{templateId}`, `PUT /onboarding-templates/{templateId}/items` | `onboarding.view` / `onboarding.manage` |
| ONB-03 | `/onboarding/processes` | Tiến trình hội nhập (`LIST`) | Lọc theo trạng thái, phòng ban; thanh tiến độ | `GET /onboarding-processes` | `onboarding.view` |
| ONB-04 | `/onboarding/processes/new` | Khởi tạo tiến trình (`FORM`) | Chọn nhân viên mới + mẫu checklist (gợi ý theo phòng ban/chức danh) | `POST /onboarding-processes` | `onboarding.manage` |
| ONB-05 | `/onboarding/processes/:id` | Chi tiết tiến trình (`DETAIL`) | Checklist theo nhóm, tiến độ (số việc/hoàn thành); **Hoàn thành** / **Bỏ qua** (chỉ việc không bắt buộc) / **Thêm việc ngoài mẫu**; **Nghiệm thu** (chặn nếu còn việc bắt buộc); **Hủy** | `GET /onboarding-processes/{processId}`, `GET,POST /onboarding-processes/{processId}/tasks`, `POST /onboarding-tasks/{taskId}/complete`, `POST /onboarding-tasks/{taskId}/skip`, `POST /onboarding-processes/{processId}/accept`, `POST /onboarding-processes/{processId}/cancel`, `GET /employees/{employeeId}/onboarding` | `onboarding.view` / `onboarding.manage` |
| ONB-06 | `/onboarding/orientation-sessions` | Buổi đào tạo định hướng (`CALENDAR`) | Tạo/sửa buổi; **Hoàn thành**, **Hủy**; **điểm danh** nhiều nhân viên (tự hoàn thành task `ORIENTATION` tương ứng) | `GET,POST /orientation-sessions`, `PUT /orientation-sessions/{sessionId}`, `POST /orientation-sessions/{sessionId}/complete`, `POST /orientation-sessions/{sessionId}/cancel`, `POST /orientation-sessions/{sessionId}/attendance` | `onboarding.view` / `onboarding.manage` |
| ONB-07 | `/onboarding/it-account-types` | Loại tài khoản CNTT (`LIST`) | CRUD danh mục (email, phần mềm, hệ thống nội bộ) | `GET,POST /it-account-types`, `PUT,DELETE /it-account-types/{typeId}` | `onboarding.view` / `onboarding.manage` |
| ONB-08 | `/onboarding/it-requests` | Hàng đợi cấp tài khoản (IT) (`LIST`) | Yêu cầu theo trạng thái; **Đã cấp** (nhập định danh tài khoản) / **Thất bại** (nhập lý do) | `GET /it-account-requests`, `POST /it-account-requests/{requestId}/provision`, `POST /it-account-requests/{requestId}/fail` | `onboarding.it_handle` |
| ONB-09 | `/me/onboarding` | Hội nhập của tôi (`DETAIL`) | Nhân viên mới xem checklist, tiến độ, lịch đào tạo, thiết bị và tài khoản được cấp | `GET /me/onboarding` | Auth |

---

### 5.8. SỐ HÓA & LƯU KHO HỒ SƠ (DOC)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| DOC-01 | `/records/config/retention-policies` | Chính sách lưu trữ (`LIST`) | CRUD thời hạn và sự kiện bắt đầu tính hạn. Ghi chú: sửa không đổi hạn đã chốt của tài liệu cũ | `GET,POST /retention-policies`, `PUT,DELETE /retention-policies/{policyId}` | `document.config` |
| DOC-02 | `/records/config/document-types` | Loại tài liệu (`LIST`) | CRUD loại tài liệu; lối tắt sang cấu hình metadata | `GET,POST /document-types`, `PUT,DELETE /document-types/{typeId}` | `document.view` / `document.config` |
| DOC-03 | `/records/config/document-types/:id/metadata` | Cấu hình trường metadata (`EDITOR`) | Danh sách trường (tên, kiểu, bắt buộc, ngưỡng OCR) kéo thả; lưu thay thế toàn bộ | `GET,PUT /document-types/{typeId}/metadata-fields` | `document.view` / `document.config` |
| DOC-04 | `/records/documents` | Kho tài liệu (`LIST`) | Tìm theo nhân viên, loại, trạng thái, sắp hết hạn, từ khóa | `GET /documents` | `document.view` |
| DOC-05 | `/records/upload` | Tải lên & OCR (`WIZARD`) | Bước 1 chọn bộ hồ sơ + tải ảnh/scan/PDF (hỗ trợ chụp từ di động) · Bước 2 xem kết quả kiểm tra chất lượng và OCR (xử lý bất đồng bộ) · Bước 3 **tách tệp nhiều trang** thành các tài liệu theo khoảng trang và loại · Bước 4 sang nhập metadata | `POST /document-uploads`, `GET /document-uploads/{uploadId}`, `POST /document-uploads/{uploadId}/split` | `document.upload` |
| DOC-06 | `/records/documents/:id` | Chi tiết tài liệu (`DETAIL`) | Thông tin + metadata; **xem trước có watermark động**; **tải xuống** (watermark, ghi audit); tab **Phiên bản** (tải bản mới kèm lý do, không ghi đè bản đã lưu kho); tab **Tạm giữ pháp lý** (đặt/gỡ); **Nộp lưu kho** (đi workflow) | `GET /documents/{documentId}`, `GET,POST /documents/{documentId}/versions`, `GET /documents/{documentId}/preview`, `GET /documents/{documentId}/download`, `POST /documents/{documentId}/submit-archive`, `GET,POST /documents/{documentId}/legal-holds`, `POST /legal-holds/{holdId}/release` | `document.view` / `document.download` / `document.upload` / `document.archive` / `document.hold` |
| DOC-07 | `/records/documents/:id/review` | Nhập & xác thực metadata (`EDITOR`) | Màn hình chia đôi: ảnh tài liệu bên trái, form metadata bên phải (tự điền từ OCR, **đánh dấu trường dưới ngưỡng tin cậy**); HR bấm **Xác thực** (`VERIFIED`) | `PUT /documents/{documentId}/metadata`, `POST /documents/{documentId}/verify` | `document.edit_metadata` / `document.verify` |
| DOC-08 | `/records/expiring` | Giấy tờ sắp/đã hết hạn (`LIST`) | Lọc theo số ngày `withinDays`; nhắc bổ sung | `GET /documents/expiring` | `document.view` |
| DOC-09 | `/employees/:id/documents` | Bộ hồ sơ của nhân viên (`DETAIL`) | Các dossier theo mục đích, tài liệu bên trong, giấy tờ còn thiếu; tạo dossier; **Xuất trọn bộ hồ sơ** (PDF gộp/ZIP, hồ sơ nhạy cảm cần phê duyệt) | `GET,POST /employees/{employeeId}/dossiers`, `POST /employees/{employeeId}/dossier-exports` | `document.view` / `document.upload` / `document.export` |
| DOC-10 | `/records/exports` | Lịch sử xuất hồ sơ (`LIST`) | Theo dõi trạng thái yêu cầu xuất; tải tệp kết quả khi được phép | `GET /dossier-exports`, `GET /dossier-exports/{exportId}/download` | `document.export` |
| DOC-11 | `/records/destruction` | Tiêu hủy tài liệu (`LIST`) | Tab **Đủ điều kiện hủy** (hết hạn lưu, không bị tạm giữ; lọc theo chính sách) và tab **Đề xuất hủy**; lập đề xuất (chọn tài liệu, lý do, thành viên hội đồng) | `GET /documents/destruction-candidates`, `GET,POST /destruction-proposals` | `document.destroy` |
| DOC-12 | `/records/destruction/:id` | Chi tiết đề xuất hủy (`DETAIL`) | Danh sách tài liệu, hội đồng và kết quả biểu quyết; **Chuyển hội đồng xét**; thành viên hội đồng **biểu quyết** kèm ý kiến; khi `APPROVED` → **Thực hiện tiêu hủy** (đính kèm biên bản) | `GET /destruction-proposals/{proposalId}`, `POST /destruction-proposals/{proposalId}/submit`, `POST /destruction-proposals/{proposalId}/votes`, `POST /destruction-proposals/{proposalId}/execute` | `document.destroy` · biểu quyết: Auth |
| DOC-13 | `/me/documents` | Tài liệu của tôi (ESS) (`LIST`) | Giấy tờ đã nộp, còn thiếu, cần cập nhật; **tự nộp giấy tờ** (chụp/tải lên); xem các bộ hồ sơ của mình | `GET,POST /me/documents`, `GET /me/dossiers` | Auth |

---

### 5.9. HỢP ĐỒNG & HỢP ĐỒNG ĐIỆN TỬ (CON)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| CON-01 | `/contract-templates` | Mẫu hợp đồng (`LIST`) | Lọc theo loại mẫu, loại hợp đồng, chức danh, phòng ban, chi nhánh, đang dùng; ngừng sử dụng | `GET /contract-templates`, `POST /contract-templates/{templateId}/deactivate` | `contract.view` / `contract.template_manage` |
| CON-02 | `/contract-templates/new`, `/contract-templates/:id` | Thiết kế mẫu & phiên bản (`DETAIL`) | Thuộc tính áp dụng của mẫu; tab **Phiên bản** (tải DOCX/HTML chứa biến `{{...}}`, tải về). Phiên bản mới không đổi hợp đồng đã phát hành | `POST /contract-templates`, `GET,PUT /contract-templates/{templateId}`, `GET,POST /contract-templates/{templateId}/versions`, `GET /contract-template-versions/{versionId}/download` | `contract.view` / `contract.template_manage` |
| CON-03 | `/contracts` | Danh sách hợp đồng (`LIST`) | Lọc theo nhân viên, loại, trạng thái (kể cả trạng thái suy ra), sắp hết hạn | `GET /contracts`, `GET /employees/{employeeId}/contracts` | `contract.view` |
| CON-04 | `/contracts/expiring` | Hợp đồng sắp hết hạn (`LIST`) | Theo mốc nhắc cấu hình; lối tắt **Tái ký** | `GET /contracts/expiring` | `contract.view` |
| CON-05 | `/contracts/new` | Tạo hợp đồng (`WIZARD`) | Chọn nhân viên + mẫu → hệ thống tự điền dữ liệu và sinh số hợp đồng → chỉnh điều khoản, phụ cấp thỏa thuận → **Kiểm tra tuân thủ** (thời hạn, số lần ký, thử việc...) | `POST /contracts`, `PUT /contracts/{contractId}`, `PUT /contracts/{contractId}/allowances`, `POST /contracts/{contractId}/compliance-check` | `contract.create` |
| CON-06 | `/contracts/:id` | Chi tiết hợp đồng (`DETAIL`) | Thông tin và trạng thái tổng hợp (ký/hiệu lực/hết hạn), xem trước văn bản. Hành động theo trạng thái: **Trình duyệt**, **Phát hành ký**, **Hủy**, **Tái ký** (tạo hợp đồng kế tiếp), **Lưu kho** bản đã ký đủ | `GET /contracts/{contractId}`, `POST /contracts/{contractId}/submit`, `POST /contracts/{contractId}/send-for-signature`, `POST /contracts/{contractId}/cancel`, `POST /contracts/{contractId}/renew`, `POST /contracts/{contractId}/archive` | `contract.view` / `contract.create` / `contract.sign_manage` / `contract.archive` |
| CON-07 | `/contracts/:id/versions` | Phiên bản văn bản (`LIST`) | Các phiên bản hợp đồng và phụ lục; phát hành phiên bản mới (cảnh báo hủy lượt ký cũ nếu đã ký một phần); tải xuống; **kiểm tra toàn vẹn** SHA-256 và chứng thư | `GET,POST /contracts/{contractId}/versions`, `GET /contract-versions/{versionId}/download`, `GET /contract-versions/{versionId}/verify-integrity` | `contract.view` / `contract.create` |
| CON-08 | `/contracts/:id/signers` | Bên ký & bằng chứng (`DETAIL`) | Danh sách bên ký, thứ tự, trạng thái; HR **xác nhận ký giấy trực tiếp**; xem **chứng cứ ký** (chứng thư, mã giao dịch, dấu thời gian) | `GET /contract-versions/{versionId}/signers`, `POST /contract-signers/{signerId}/confirm-wet-ink`, `GET /contract-signers/{signerId}/evidence` | `contract.view` / `contract.sign_manage` |
| CON-09 | `/contracts/:id/appendices` | Phụ lục hợp đồng (`LIST`) | Danh sách phụ lục; tạo phụ lục (chỉ các trường thay đổi `new_*`, không sửa thời hạn) | `GET,POST /contracts/{contractId}/appendices` | `contract.view` / `contract.create` |
| CON-10 | `/contract-appendices/:id` | Chi tiết phụ lục (`DETAIL`) | Sửa khi `DRAFT`, phụ cấp thay đổi; **Trình duyệt → Phát hành ký → Lưu kho**, **Hủy** | `GET,PUT /contract-appendices/{appendixId}`, `PUT /contract-appendices/{appendixId}/allowances`, `POST /contract-appendices/{appendixId}/submit`, `POST /contract-appendices/{appendixId}/send-for-signature`, `POST /contract-appendices/{appendixId}/cancel`, `POST /contract-appendices/{appendixId}/archive` | `contract.view` / `contract.create` / `contract.sign_manage` / `contract.archive` |
| CON-11 | `/me/contracts` | Hợp đồng của tôi (`LIST`) | Xem và tải hợp đồng đã ký | `GET /me/contracts` | Auth |
| CON-12 | `/me/signing` | Văn bản chờ tôi ký (`LIST`) | Danh sách văn bản cần ký, hạn ký | `GET /me/contract-signing-tasks` | Auth |
| CON-13 | `/me/signing/:signerId` | Ký hợp đồng (`MOBILE`) | Đọc văn bản → chọn phương thức (chữ ký số/OTP) → **gửi OTP** → ký; hoặc **từ chối ký** (bắt buộc lý do) | `POST /contract-signers/{signerId}/request-otp`, `POST /contract-signers/{signerId}/sign`, `POST /contract-signers/{signerId}/decline` | Auth |

---

### 5.10. CHẤM CÔNG & CA LÀM VIỆC (ATT)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| ATT-01 | `/attendance/shifts` | Danh mục ca làm việc (`LIST`) | Tạo/sửa ca (giờ vào/ra, nghỉ giữa ca, định mức công, ân hạn, ca qua đêm); kích hoạt/ngừng; xóa ca chưa được phân | `GET,POST /shifts`, `GET,PUT,DELETE /shifts/{shiftId}`, `POST /shifts/{shiftId}/activate`, `POST /shifts/{shiftId}/deactivate` | `attendance.view` / `attendance.shift_manage` |
| ATT-02 | `/attendance/shift-assignments` | Phân ca (`CALENDAR`) | Lưới lịch theo nhân viên × ngày, lọc theo phòng ban; **phân ca hàng loạt** theo khoảng ngày; đổi ca một ngày; xóa phân ca | `GET /shift-assignments`, `POST /shift-assignments/bulk`, `PUT,DELETE /shift-assignments/{assignmentId}` | `attendance.view` / `attendance.shift_manage` |
| ATT-03 | `/me/attendance/check-in` | Chấm công (`MOBILE`) | Hiển thị ca và trạng thái hôm nay; nút **Check-in / Check-out** mở camera (liveness), lấy GPS, gửi kèm mã giao dịch. Hiển thị kết quả so khớp; khi thất bại cho phép thử lại hoặc chuyển sang tạo đơn giải trình (`ATT-10`) | `GET /me/attendance/today`, `POST /attendance/check-in`, `POST /attendance/check-out` | Auth |
| ATT-04 | `/me/attendance` | Chấm công của tôi (`DETAIL`) | Tab **Nhật ký chấm công** (theo khoảng ngày) · **Kết quả theo ngày** (đi muộn, về sớm, thiếu chấm công; chọn tháng/năm) | `GET /me/attendance/logs`, `GET /me/attendance/daily-records` | Auth |
| ATT-05 | `/me/shifts` | Lịch ca của tôi (`CALENDAR`) | Lịch ca theo khoảng ngày kèm ngày lễ | `GET /me/shifts` | Auth |
| ATT-06 | `/attendance/logs` | Tra cứu log chấm công (`LIST`) | Lọc theo nhân viên, khoảng ngày, kết quả xác thực; chi tiết log (điểm so khớp, GPS trên bản đồ, ảnh nếu có) | `GET /attendance/logs`, `GET /attendance/logs/{logId}` | `attendance.view` |
| ATT-07 | `/attendance/daily-records` | Công theo ngày (`LIST`) | Kết quả công đã tính của nhân viên/đơn vị | `GET /attendance/daily-records` | `attendance.view` |
| ATT-08 | `/attendance/monthly-summary` | Bảng công tháng hiện thời (`LIST`) | Ma trận nhân viên × ngày theo tháng, phòng ban (tính trực tiếp, chưa khóa) | `GET /attendance/monthly-summary` | `attendance.view` |
| ATT-09 | `/attendance/exceptions` | Ngoại lệ cần xử lý (`LIST`) | Thiếu chấm công, xác thực lỗi, vắng không phép; lối tắt tạo/xử lý giải trình | `GET /attendance/exceptions` | `attendance.view` |
| ATT-10 | `/me/attendance-requests` | Đơn giải trình của tôi (`LIST`) | Danh sách đơn; **Tạo đơn** (ngày công, loại, giờ vào/ra đề nghị, đính kèm minh chứng); hủy đơn đang chờ | `POST /attendance-requests`, `GET /me/attendance-requests` | Auth |
| ATT-11 | `/attendance/requests` | Đơn giải trình (HR/quản lý) (`LIST`) | Lọc theo nhân viên, trạng thái, khoảng ngày | `GET /attendance-requests` | `attendance.view` |
| ATT-12 | `/attendance/requests/:id` | Chi tiết đơn giải trình (`DETAIL`) | Thông tin đơn, minh chứng, tiến trình duyệt; người duyệt **hiệu chỉnh giờ được thừa nhận** trước khi duyệt (việc duyệt thực hiện ở `CMN-04`); đính kèm thêm minh chứng; hủy | `GET /attendance-requests/{requestId}`, `POST /attendance-requests/{requestId}/attachments`, `POST /attendance-requests/{requestId}/cancel`, `PUT /attendance-requests/{requestId}/approved-times` | Auth · `attendance.approve` |
| ATT-13 | `/attendance/adjustments` | Bản ghi điều chỉnh công (`LIST`) | Truy vết các điều chỉnh phát sinh từ đơn giải trình đã duyệt | `GET /attendance-adjustments` | `attendance.view` |
| ATT-14 | `/attendance/periods` | Kỳ công (`LIST`) | Danh sách theo năm; **Mở kỳ công** (công ty, năm, tháng) | `GET,POST /timesheet-periods` | `attendance.view` / `attendance.period_manage` |
| ATT-15 | `/attendance/periods/:id` | Chi tiết kỳ công (`DETAIL`) | **Kiểm tra trước khi khóa** (đơn giải trình còn chờ, thiếu chấm công...) → **Khóa kỳ** (tạo snapshot, chuyển Payroll, bất đồng bộ) · **Mở khóa** có kiểm soát (bắt buộc lý do) · bảng công đã chốt kèm giờ OT, lọc theo phòng ban · **Xuất bảng công** | `GET /timesheet-periods/{periodId}`, `GET /timesheet-periods/{periodId}/pre-lock-check`, `POST /timesheet-periods/{periodId}/lock`, `POST /timesheet-periods/{periodId}/unlock`, `GET /timesheet-periods/{periodId}/snapshots`, `GET /timesheet-periods/{periodId}/export` | `attendance.view` / `attendance.period_manage` / `attendance.period_unlock` / `attendance.export` |
| ATT-16 | `/me/timesheets` | Bảng công đã chốt của tôi (`LIST`) | Theo năm | `GET /me/timesheet-snapshots` | Auth |

---

### 5.11. BẢNG LƯƠNG & TÍNH LƯƠNG TỰ ĐỘNG (PAY)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| PAY-01 | `/payroll/components` | Thành phần lương (`LIST`) | CRUD phụ cấp, thưởng, khấu trừ, hoàn trả; lọc theo nhóm, đang dùng; liên kết khoản mục với quy tắc thuế/bảo hiểm | `GET /salary-components`, `POST /salary-components`, `PUT,DELETE /salary-components/{componentId}` | `payroll.view` / `payroll.config` |
| PAY-02 | `/payroll/periods` | Kỳ lương (`LIST`) | Danh sách theo công ty, trạng thái, năm; **Mở kỳ lương** (gắn kỳ công đã `LOCKED`) | `GET,POST /payroll-periods` | `payroll.view` / `payroll.manage` |
| PAY-03 | `/payroll/periods/:id` | Tổng quan & điều phối kỳ lương (`DETAIL`) | Số liệu tổng hợp (Gross, Net, quỹ lương, số nhân viên); thanh tiến trình các bước. Hành động theo trạng thái: sửa tham số (chỉ khi `OPEN`) → **Kiểm tra dữ liệu thiếu** (thiếu công/lương/ngân hàng/hợp đồng) → **Tính lương** (bất đồng bộ) → **Trình duyệt** → **Bắt đầu chi trả** → **Khóa sổ** | `GET,PUT /payroll-periods/{periodId}`, `GET /payroll-periods/{periodId}/precheck`, `POST /payroll-periods/{periodId}/calculate`, `POST /payroll-periods/{periodId}/submit`, `POST /payroll-periods/{periodId}/start-payment`, `POST /payroll-periods/{periodId}/lock` | `payroll.view` / `payroll.manage` / `payroll.calculate` / `payroll.pay` |
| PAY-04 | `/payroll/periods/:id/records` | Bảng lương nhân viên (`LIST`) | Danh sách theo phòng ban, từ khóa; **tính lại một nhân viên** | `GET /payroll-periods/{periodId}/records`, `POST /payroll-periods/{periodId}/employees/{employeeId}/recalculate` | `payroll.view` / `payroll.calculate` |
| PAY-05 | `/payroll/periods/:id/review` | Rà soát bất thường & quy tắc (`DASH`) | Cảnh báo lương biến động vượt ngưỡng so với kỳ trước; phiên bản quy tắc pháp lý đã dùng để tính | `GET /payroll-periods/{periodId}/anomalies`, `GET /payroll-periods/{periodId}/rule-versions` | `payroll.view` |
| PAY-06 | `/payroll/records/:id` | Chi tiết bảng lương & truy vết (`DETAIL`) | Các dòng thu nhập/bảo hiểm/thuế/tạm ứng/khấu trừ/thực nhận; **truy vết nguồn gốc từng dòng** (công, hợp đồng, quy tắc, thưởng); thêm/sửa/xóa **dòng điều chỉnh thủ công** (bắt buộc lý do, ghi audit `OVERRIDE`); bị khóa khi kỳ đã chốt | `GET /payroll-records/{recordId}`, `GET /payroll-records/{recordId}/trace`, `POST /payroll-records/{recordId}/adjustments`, `PUT,DELETE /payroll-record-lines/{lineId}` | `payroll.view` / `payroll.adjust` |
| PAY-07 | `/payroll/periods/:id/payments` | Chi trả lương (`LIST`) | Danh sách giao dịch theo trạng thái; **Xuất tệp chuyển khoản ngân hàng**; **Nhập kết quả đối soát**; cập nhật `PAID`/`REJECTED` kèm mã tham chiếu; **tạo lại giao dịch** bị từ chối | `GET /payroll-periods/{periodId}/payments`, `POST /payroll-periods/{periodId}/payments/export-bank-file`, `POST /payroll-periods/{periodId}/payments/import-bank-result`, `PUT /payroll-payments/{paymentId}`, `POST /payroll-payments/{paymentId}/retry` | `payroll.view` / `payroll.pay` |
| PAY-08 | `/payroll/periods/:id/payslips` | Phát hành phiếu lương (`DETAIL`) | **Sinh phiếu lương PDF mã hóa** hàng loạt (bất đồng bộ), theo dõi tiến độ; **gửi lại** phiếu cho từng nhân viên | `POST /payroll-periods/{periodId}/payslips/generate`, `POST /payslips/{payslipId}/resend` | `payroll.pay` |
| PAY-09 | `/employees/:id/payroll` | Lương của nhân viên – HR/Kế toán (`DETAIL`) | Tab **Lịch sử mức lương** (xem tại một ngày, ghi nhận điều chỉnh kèm số quyết định) · tab **Khoản lương ngoài hợp đồng** (định kỳ/một lần; khấu trừ kỷ luật phải gắn hồ sơ kỷ luật; không xóa khoản đã vào kỳ chốt). Che dữ liệu nếu thiếu quyền xem lương | `GET,POST /employees/{employeeId}/salary-items`, `PUT,DELETE /salary-items/{itemId}`, `GET,POST /employees/{employeeId}/salary-histories`, `GET /employees/{employeeId}/salary-histories/at` | `payroll.view` / `payroll.view_salary` / `payroll.manage` |
| PAY-10 | `/payroll/advances` | Quản lý tạm ứng (`LIST`) | Danh sách theo nhân viên, trạng thái; chi tiết (kèm trạng thái đã khấu trừ); kế toán **giải ngân** và chọn kỳ thu hồi (duyệt thực hiện ở `CMN-04`) | `GET /salary-advances`, `GET /salary-advances/{advanceId}`, `POST /salary-advances/{advanceId}/disburse` | `payroll.view` / `payroll.manage` |
| PAY-11 | `/me/salary-advances` | Tạm ứng của tôi (`LIST`) | Danh sách đơn; **Tạo đề nghị** (số tiền, lý do, thời điểm); hủy khi chưa duyệt | `POST /salary-advances`, `GET /me/salary-advances`, `POST /salary-advances/{advanceId}/cancel` | Auth |
| PAY-12 | `/me/payslips` | Phiếu lương của tôi (`LIST`) | Danh sách phiếu theo năm; **tải phiếu** (ghi audit); xem chi tiết bảng lương trong kỳ đã chốt | `GET /me/payslips`, `GET /payslips/{payslipId}/download`, `GET /me/payroll-records/{periodId}` | Auth |

---

### 5.12. HIỆU SUẤT & KPI (PERF)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| PERF-01 | `/performance/cycles` | Kỳ đánh giá (`LIST`) | Lọc theo trạng thái, năm; xóa kỳ `DRAFT` | `GET,POST /performance-cycles`, `DELETE /performance-cycles/{cycleId}` | `performance.view` / `performance.config` |
| PERF-02 | `/performance/cycles/new`, `/performance/cycles/:id/edit` | Tạo/sửa kỳ (`FORM`) | Tên, loại kỳ (quý/nửa năm/năm), thời gian; chỉ sửa khi `DRAFT` | `GET,PUT /performance-cycles/{cycleId}` | `performance.config` |
| PERF-03 | `/performance/cycles/:id` | Chi tiết kỳ đánh giá (`DASH`) | **Kích hoạt / Đóng** kỳ; thống kê phân bố xếp loại (biểu đồ); danh sách phiếu trong kỳ; **Khởi tạo phiếu** cho nhiều nhân viên | `GET /performance-cycles/{cycleId}/summary`, `POST /performance-cycles/{cycleId}/activate`, `POST /performance-cycles/{cycleId}/close`, `POST /performance-cycles/{cycleId}/reviews` | `performance.view` / `performance.config` / `performance.manage` |
| PERF-04 | `/performance/kpis` | Danh mục KPI (`LIST`) | CRUD KPI, phạm vi toàn công ty hoặc một đơn vị; không xóa KPI đã được gán | `GET,POST /kpis`, `PUT,DELETE /kpis/{kpiId}` | `performance.view` / `performance.config` |
| PERF-05 | `/performance/reviews` | Danh sách phiếu đánh giá (`LIST`) | HR/quản lý lọc theo kỳ, nhân viên, trạng thái | `GET /performance-reviews` | `performance.view` |
| PERF-06 | `/performance/reviews/:id` (ESS: `/me/performance/:id`) | Phiếu đánh giá (`DETAIL`) | Một trang, giao diện đổi theo vai trò và trạng thái: **Mục tiêu** (thêm/sửa/xóa, trọng số, tổng ≤ 100, cập nhật tiến độ) → **Tự đánh giá** (nhân viên chấm từng mục tiêu, nộp) → **Đánh giá của quản lý** (chấm, nộp) → **Điểm tạm tính & xếp loại** → **Chốt kết quả** (bất biến, khóa mọi chỉnh sửa) | `GET /performance-reviews/{reviewId}`, `POST /performance-reviews/{reviewId}/goals`, `PUT,DELETE /performance-goals/{goalId}`, `PATCH /performance-goals/{goalId}/status`, `PUT /performance-reviews/{reviewId}/self-assessment`, `POST /performance-reviews/{reviewId}/self-assessment/submit`, `PUT /performance-reviews/{reviewId}/manager-assessment`, `POST /performance-reviews/{reviewId}/manager-assessment/submit`, `GET /performance-reviews/{reviewId}/score-preview`, `POST /performance-reviews/{reviewId}/finalize` | `performance.view` / `performance.manage` / `performance.review` / `performance.finalize` · tự đánh giá & cập nhật tiến độ: Auth |
| PERF-07 | `/me/performance` | Đánh giá của tôi (`LIST`) | Các phiếu của tôi theo kỳ và kết quả đã chốt | `GET /me/performance-reviews` | Auth |

---

### 5.13. KHEN THƯỞNG, KỶ LUẬT & KHIẾU NẠI (RWD)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| RWD-01 | `/rewards` | Quyết định khen thưởng (`LIST`) | Lọc theo nhân viên, hình thức, khoảng ngày; cột "đã chuyển Payroll" | `GET /reward-decisions` | `reward.view` |
| RWD-02 | `/rewards/new`, `/rewards/:id` | Lập & chi tiết khen thưởng (`FORM`/`DETAIL`) | Hình thức (giấy khen, thưởng tiền, đề xuất thăng tiến...); thưởng tiền bắt buộc số tiền. **Khóa sửa/xóa** khi đã có dòng lương tham chiếu | `POST /reward-decisions`, `GET,PUT,DELETE /reward-decisions/{decisionId}` | `reward.view` / `reward.manage` |
| RWD-03 | `/me/rewards` | Khen thưởng của tôi (`LIST`) | Lịch sử khen thưởng | `GET /me/reward-decisions` | Auth |
| RWD-04 | `/discipline` | Hồ sơ kỷ luật (`LIST`) | Lọc theo nhân viên, trạng thái, hình thức kỷ luật | `GET /discipline-cases` | `discipline.view` |
| RWD-05 | `/discipline/new` | Mở hồ sơ vi phạm (`FORM`) | Nhân viên, ngày vi phạm, loại vi phạm, lý do, mô tả | `POST /discipline-cases` | `discipline.manage` |
| RWD-06 | `/discipline/:id` | Chi tiết hồ sơ kỷ luật (`DETAIL`) | Cập nhật khi `DRAFT`. Tab **Điều kiện & thời hiệu** (thời hiệu còn lại, diện hạn chế xử lý: nghỉ ốm, thai sản, nuôi con < 12 tháng) · **Thành phần họp** · **Bằng chứng** (thêm/xóa) · **Ban hành quyết định** (không áp dụng sa thải) · **Trình duyệt sa thải** (workflow riêng) | `GET,PUT /discipline-cases/{caseId}`, `GET /discipline-cases/{caseId}/eligibility`, `PUT /discipline-cases/{caseId}/participants`, `GET,POST /discipline-cases/{caseId}/evidences`, `DELETE /discipline-evidences/{evidenceId}`, `POST /discipline-cases/{caseId}/decide`, `POST /discipline-cases/{caseId}/submit-dismissal` | `discipline.view` / `discipline.manage` / `discipline.decide` |
| RWD-07 | `/me/discipline` | Quyết định kỷ luật liên quan tôi (`LIST`) | Danh sách quyết định của tôi và hiệu lực | `GET /me/discipline-cases` | Auth |
| RWD-08 | `/complaints` | Khiếu nại – HR (`LIST`) | Lọc theo trạng thái, nhóm khiếu nại | `GET /complaints` | `complaint.manage` |
| RWD-09 | `/complaints/:id` | Xử lý khiếu nại (`DETAIL`) | Chi tiết; **Phân công** người xử lý → **Bắt đầu điều tra** (`INVESTIGATING`) → **Ghi phương án giải quyết** (`RESOLVED`) → **Đóng** | `GET /complaints/{complaintId}`, `POST /complaints/{complaintId}/assign`, `POST /complaints/{complaintId}/start-investigation`, `POST /complaints/{complaintId}/resolve`, `POST /complaints/{complaintId}/close` | `complaint.manage` |
| RWD-10 | `/me/complaints` | Khiếu nại của tôi (`LIST`) | Danh sách + **Gửi khiếu nại/phản ánh** mới | `POST /complaints`, `GET /me/complaints` | Auth |

---

### 5.14. PHÁT TRIỂN NHÂN SỰ & QUY HOẠCH KẾ NHIỆM (CAR)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| CAR-01 | `/career/paths` | Lộ trình thăng tiến (`LIST`) | Danh sách lọc theo chức danh xuất phát/đích; chuyển sang **dạng đồ thị** từ một chức danh | `GET,POST /career-paths`, `GET /career-paths/graph` | `career.view` / `career.manage` |
| CAR-02 | `/career/paths/:id` | Chi tiết lộ trình (`FORM`) | Mô tả năng lực, yêu cầu kinh nghiệm; sửa; xóa mềm | `GET,PUT,DELETE /career-paths/{pathId}` | `career.view` / `career.manage` |
| CAR-03 | `/career/succession` | Vị trí trọng yếu (`LIST`) | Lọc theo phòng ban, mức rủi ro; tạo kế hoạch cho cặp (phòng ban, chức danh) | `GET,POST /succession-plans` | `succession.view` / `succession.manage` |
| CAR-04 | `/career/succession/:id` | Kế hoạch kế nhiệm (`DETAIL`) | Người đang giữ vị trí, mức rủi ro, ngày rà soát; danh sách ứng viên kế nhiệm (thêm, sửa mức sẵn sàng/nhận xét, gỡ; không được trùng người đang giữ vị trí); **gợi ý ứng viên phù hợp** | `GET,PUT,DELETE /succession-plans/{planId}`, `POST /succession-plans/{planId}/candidates`, `PUT,DELETE /succession-plans/{planId}/candidates/{employeeId}`, `GET /succession-plans/{planId}/suggestions` | `succession.view` / `succession.manage` |
| CAR-05 | `/career/talent-pool` | Kho nhân tài nội bộ (`LIST`) | Lọc theo thẻ (`HiPo`, `Key Talent`, `Leadership Potential`, `Tech Expert`), phòng ban; gắn/gỡ thẻ kèm lý do; thẻ nhân tài của từng nhân viên | `GET,POST /internal-talent-pool`, `DELETE /internal-talent-pool/{entryId}`, `GET /employees/{employeeId}/talent-tags` | `succession.view` / `succession.manage` |
| CAR-06 | `/me/career` | MyCareer – Mô phỏng lộ trình (`DASH`) | Các lộ trình khả dụng từ vị trí hiện tại; chạy **mô phỏng** (độ tương thích, thời gian dự kiến); xem **hồ sơ tương đồng ẩn danh** đã thăng tiến; **lưu kịch bản** | `GET /career-simulator/paths`, `POST /career-simulator/simulate`, `GET /career-simulator/similar-profiles`, `POST /career-simulations` | Auth |
| CAR-07 | `/me/career/simulations` | Kịch bản đã lưu (`LIST`) | Danh sách kịch bản của tôi | `GET /career-simulations` | Auth |
| CAR-08 | `/me/career/simulations/:id` | Chi tiết kịch bản (`DETAIL`) | Xem và xóa (chỉ chủ sở hữu) | `GET,DELETE /career-simulations/{simulationId}` | Auth |

---

### 5.15. QUẢN LÝ NGHỈ PHÉP (LEA)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| LEA-01 | `/leave/types` | Loại nghỉ (`LIST`) | CRUD loại nghỉ (nguồn chi trả, số ngày cố định, có cần phê duyệt) gồm nghỉ ốm đau, thai sản; lọc theo nhóm, đang dùng | `GET /leave-types` (Auth), `POST /leave-types`, `PUT,DELETE /leave-types/{leaveTypeId}` | `leave.config` |
| LEA-02 | `/leave/policies` | Chính sách nghỉ phép năm (`LIST`) | CRUD chính sách (định mức theo loại hợp đồng, thâm niên, chuyển phép, hạn sử dụng; hiệu lực theo ngày) | `GET /leave-policies`, `POST /leave-policies`, `PUT,DELETE /leave-policies/{policyId}` | `leave.view` / `leave.config` |
| LEA-03 | `/leave/balances` | Quỹ phép nhân viên – HR (`LIST`) | Tra cứu quỹ phép theo nhân viên/năm (cấp, chuyển, đã dùng, chờ duyệt, còn lại); **Cấp quỹ phép năm** (toàn bộ hoặc chọn nhân viên); **Tính lại** cho một nhân viên/loại nghỉ; **Chuyển phép tồn** sang năm sau | `GET /employees/{employeeId}/leave-balances`, `POST /leave-balances/generate`, `POST /employees/{employeeId}/leave-balances/recalculate`, `POST /leave-balances/carry-over` | `leave.view` / `leave.manage` |
| LEA-04 | `/me/leave` | Nghỉ phép của tôi (`DASH`) | Thẻ quỹ phép theo loại + danh sách đơn của tôi (lọc theo trạng thái, năm) | `GET /me/leave-balances`, `GET /me/leave-requests` | Auth |
| LEA-05 | `/me/leave/new`, `/leave/requests/new` (HR tạo thay) | Tạo đơn xin nghỉ (`FORM`) | Chọn loại nghỉ, ngày bắt đầu/kết thúc, buổi nghỉ (nguyên ngày/nửa ngày), lý do. **Xem trước** số ngày nghỉ (theo lịch ca và ngày lễ) và số dư còn lại trước khi gửi; chặn trùng ngày. Loại không cần duyệt tự được duyệt | `POST /leave-requests/preview`, `POST /leave-requests` | Auth |
| LEA-06 | `/leave/requests` | Đơn nghỉ theo phạm vi (`LIST`) | Quản lý/HR lọc theo nhân viên, phòng ban, trạng thái, khoảng ngày | `GET /leave-requests` | `leave.view` |
| LEA-07 | `/leave/requests/:id` | Chi tiết đơn nghỉ (`DETAIL`) | Thông tin, số ngày, `ApprovalTimeline`; **Hủy đơn** (số dư tự hoàn lại) | `GET /leave-requests/{requestId}`, `POST /leave-requests/{requestId}/cancel` | Auth |
| LEA-08 | `/leave/calendar` | Lịch nghỉ của đội/phòng (`CALENDAR`) | Ai nghỉ ngày nào, lọc theo phòng ban, khoảng ngày; hỗ trợ quản lý cân đối nhân sự | `GET /leave-calendar` | `leave.view` |

---

### 5.16. ĐIỀU CHUYỂN NHÂN SỰ (TRF)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| TRF-01 | `/transfers` | Phiếu điều chuyển (`LIST`) | Lọc theo nhân viên, trạng thái, khoảng ngày | `GET /transfer-requests` | `transfer.view` |
| TRF-02 | `/transfers/new`, `/transfers/:id/edit` | Lập/sửa phiếu (`FORM`) | Chọn nhân viên (hệ thống chụp dữ liệu gốc `from_*` từ công tác hiện tại), đơn vị/chi nhánh/quản lý/chức vụ mới, ngày hiệu lực, loại hình (kể cả tạm thời kèm ngày kết thúc), lý do; phụ cấp mới đề xuất. Báo lỗi khi nhân viên đã có phiếu đang xử lý hoặc không có thay đổi. Chỉ sửa khi `DRAFT` | `POST /transfer-requests`, `PUT /transfer-requests/{requestId}`, `PUT /transfer-requests/{requestId}/allowances` | `transfer.create` |
| TRF-03 | `/transfers/:id` | Chi tiết phiếu điều chuyển (`DETAIL`) | Tab **So sánh trước/sau** (kèm cảnh báo hồ sơ nhân viên đã đổi so với dữ liệu gốc) · tiến trình duyệt. Hành động: **Trình duyệt** (khóa nội dung), **Hủy**, **Hoàn thành** (HR áp dụng vào hồ sơ khi `APPROVED`) | `GET /transfer-requests/{requestId}`, `GET /transfer-requests/{requestId}/diff`, `POST /transfer-requests/{requestId}/submit`, `POST /transfer-requests/{requestId}/cancel`, `POST /transfer-requests/{requestId}/complete` | `transfer.view` / `transfer.create` / `transfer.complete` |
| TRF-04 | `/employees/:id/transfers` | Lịch sử điều chuyển của nhân viên (`LIST`) | Dòng thời gian các lần điều chuyển | `GET /employees/{employeeId}/transfer-history` | `transfer.view` |

---

### 5.17. THÔI VIỆC & CHẤM DỨT HỢP ĐỒNG (OFF)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| OFF-01 | `/me/resignation` | Đơn xin thôi việc của tôi (`FORM`) | Nộp đơn (ngày làm việc cuối mong muốn, nhóm lý do, giải thích); hệ thống kiểm tra thời hạn báo trước theo loại hợp đồng; xem trạng thái và **rút đơn** khi còn chờ | `POST /resignation-requests`, `GET /me/resignation-requests`, `POST /resignation-requests/{requestId}/cancel` | Auth |
| OFF-02 | `/offboarding/resignations` | Đơn thôi việc (`LIST`) | Lọc theo trạng thái, phòng ban | `GET /resignation-requests` | `offboarding.view` |
| OFF-03 | `/offboarding/resignations/:id` | Chi tiết đơn thôi việc (`DETAIL`) | Thông tin đơn + tiến trình duyệt (duyệt ở `CMN-04`); khi chấp thuận, người duyệt/HR **xác nhận ngày làm việc cuối**; khi `APPROVED` có nút **Mở hồ sơ Offboarding** | `GET /resignation-requests/{requestId}`, `PUT /resignation-requests/{requestId}/confirmed-last-working-date` | `offboarding.view` / `offboarding.manage` |
| OFF-04 | `/offboarding/terminations` | Quyết định chấm dứt hợp đồng (`LIST`) | Lọc theo trạng thái, nhóm lý do | `GET /termination-decisions` | `offboarding.view` |
| OFF-05 | `/offboarding/terminations/new`, `/offboarding/terminations/:id` | Lập & chi tiết quyết định (`FORM`/`DETAIL`) | HR lập quyết định (sa thải bắt buộc chọn hồ sơ kỷ luật); sửa khi chưa trình duyệt; **xem ước tính trợ cấp** thôi việc/mất việc và phép chưa nghỉ theo quy tắc pháp lý; **Trình duyệt pháp lý**; **Hủy** | `POST /termination-decisions`, `GET,PUT /termination-decisions/{decisionId}`, `GET /termination-decisions/{decisionId}/severance-preview`, `POST /termination-decisions/{decisionId}/submit`, `POST /termination-decisions/{decisionId}/cancel` | `offboarding.view` / `offboarding.terminate` |
| OFF-06 | `/offboarding/cases` | Hồ sơ Offboarding (`LIST`) | Lọc theo trạng thái; **tạo hồ sơ** từ đơn/quyết định đã `APPROVED` (tự sinh 5 hạng mục bàn giao) | `GET,POST /offboarding-cases` | `offboarding.view` / `offboarding.manage` |
| OFF-07 | `/offboarding/cases/:id` | Chi tiết hồ sơ Offboarding (`DETAIL`) | Tiến độ bàn giao, tài sản chưa trả, phép tồn. Danh sách hạng mục: người phụ trách **Xác nhận** `CLEARED` (hạng mục tài sản yêu cầu đã trả hết) hoặc **Đánh dấu không đạt** kèm ghi chú. **Hoàn tất** (ghi `RESIGNED`/`TERMINATED`, khóa tài khoản đăng nhập; chặn nếu chưa đủ điều kiện, `422`) / **Hủy** | `GET /offboarding-cases/{caseId}`, `GET /employees/{employeeId}/offboarding`, `GET /offboarding-cases/{caseId}/clearance-items`, `PUT /offboarding-clearance-items/{itemId}/confirm`, `PUT /offboarding-clearance-items/{itemId}/reject`, `POST /offboarding-cases/{caseId}/complete`, `POST /offboarding-cases/{caseId}/cancel` | `offboarding.view` / `offboarding.clearance` / `offboarding.manage` |
| OFF-08 | `/offboarding/exit-interviews` | Phỏng vấn nghỉ việc (`LIST`) | Danh sách theo khoảng ngày | `GET /exit-interviews` | `offboarding.view` |
| OFF-09 | `/offboarding/exit-interviews/new`, `/offboarding/exit-interviews/:id` | Ghi nhận & chi tiết phỏng vấn (`FORM`/`DETAIL`) | Nhập và sửa nội dung phỏng vấn (không bắt buộc để hoàn tất offboarding) | `POST /exit-interviews`, `GET,PUT /exit-interviews/{interviewId}` | `offboarding.view` / `offboarding.manage` |

---

### 5.18. PHÁP LUẬT & TUÂN THỦ (LEG)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| LEG-01 | `/compliance/dashboard` | Dashboard tuân thủ (`DASH`) | Tổng hợp quy tắc, thay đổi pháp luật chờ đánh giá, cảnh báo theo mức độ | `GET /compliance/dashboard` | `compliance.view` |
| LEG-02 | `/compliance/legal-documents` | Kho văn bản pháp luật (`LIST`) | Tra cứu theo từ khóa, lĩnh vực, khoảng hiệu lực; thêm văn bản (kèm tệp gốc/bản hợp nhất) | `GET,POST /legal-documents` | `legal.view` / `legal.manage` |
| LEG-03 | `/compliance/legal-documents/:id` | Chi tiết văn bản (`DETAIL`) | Thông tin (sửa); tab **Quan hệ** (sửa đổi/bổ sung/thay thế/bãi bỏ; thêm/gỡ); tab **Điều khoản** (thêm, sửa, đánh dấu điều khoản thay đổi và điều khoản bị thay thế) | `GET,PUT /legal-documents/{documentId}`, `GET,POST /legal-documents/{documentId}/relations`, `DELETE /legal-documents/{documentId}/relations/{targetDocumentId}/{relationType}`, `GET,POST /legal-documents/{documentId}/provisions`, `PUT /legal-provisions/{provisionId}` | `legal.view` / `legal.manage` |
| LEG-04 | `/compliance/rules` | Quy tắc tuân thủ (`LIST`) | Lọc theo nhóm, từ khóa; tạo quy tắc (mã định danh ổn định) | `GET,POST /compliance-rules` | `compliance.view` / `compliance.manage` |
| LEG-05 | `/compliance/rules/:id` | Chi tiết quy tắc (`DETAIL`) | Sửa tên/nhóm; danh sách **phiên bản** và tạo phiên bản mới (`DRAFT`); tab **Ánh xạ chức năng** (module nào đang dùng quy tắc, thêm/gỡ) | `GET,PUT /compliance-rules/{ruleId}`, `GET,POST /compliance-rules/{ruleId}/versions`, `GET,POST /compliance-rules/{ruleId}/module-usages`, `DELETE /compliance-rule-module-usages/{usageId}` | `compliance.view` / `compliance.manage` |
| LEG-06 | `/compliance/rules/:id/versions/:versionId` | Soạn phiên bản quy tắc (`EDITOR`) | Thông tin, **bộ tham số pháp lý**, **căn cứ pháp lý** (liên kết N:M tới điều khoản). Chỉ sửa khi `DRAFT`, bản `PUBLISHED` bất biến. **Trình rà soát** (Pháp chế → BA → Kỹ thuật → thẩm quyền) rồi **Công bố** khi đủ phê duyệt | `GET,PUT /compliance-rule-versions/{versionId}`, `PUT /compliance-rule-versions/{versionId}/parameters`, `PUT /compliance-rule-versions/{versionId}/provisions`, `POST /compliance-rule-versions/{versionId}/submit`, `POST /compliance-rule-versions/{versionId}/publish` | `compliance.view` / `compliance.manage` / `compliance.publish` |
| LEG-07 | `/compliance/impact-assessments` | Đánh giá tác động pháp lý (`LIST`) | Danh sách điều khoản mới/sửa đổi cần đánh giá; **sinh danh sách quy tắc/chức năng bị ảnh hưởng**; ghi kết luận, phân công người xử lý | `GET /legal-impact-assessments`, `POST /legal-provisions/{provisionId}/impact-assessments/generate`, `PUT /legal-impact-assessments/{assessmentId}` | `compliance.assess` |
| LEG-08 | `/compliance/checks` | Lịch sử kiểm tra tuân thủ (`LIST`) | Lọc theo quy tắc, module, kết quả, đối tượng; chi tiết kèm phiên bản quy tắc đã dùng | `GET /compliance-checks`, `GET /compliance-checks/{checkId}` | `compliance.view` |
| LEG-09 | `/compliance/alerts` | Cảnh báo tuân thủ (`LIST`) | Lọc theo trạng thái, mức độ nghiêm trọng | `GET /compliance-alerts` | `compliance.view` |
| LEG-10 | `/compliance/alerts/:id` | Xử lý cảnh báo (`DETAIL`) | Chi tiết; **Phân công** bộ phận + hạn; **Chuyển Pháp chế** (`ESCALATED_TO_LEGAL`); **Ghi nhận khắc phục** | `GET /compliance-alerts/{alertId}`, `PUT /compliance-alerts/{alertId}/assign`, `POST /compliance-alerts/{alertId}/escalate`, `POST /compliance-alerts/{alertId}/resolve` | `compliance.view` / `compliance.manage` |

---

### 5.19. TRỢ LÝ AI 1-1 (AI)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| AI-01 | `/ai-assistant` (và cửa sổ chat nổi trên mọi trang) | Trợ lý AI (`DETAIL`) | Danh sách hội thoại cũ và hội thoại mới; khung chat hỏi đáp số liệu nhân sự (theo quyền người hỏi) và chính sách nội bộ (RAG); hiển thị **trích dẫn tài liệu**, biểu đồ (`render_chart`) từ dữ liệu đã truy xuất; thông báo "chưa có thông tin, vui lòng liên hệ HR" khi không tìm thấy; **đánh giá hữu ích / không hữu ích**; xóa hội thoại | `POST,GET /ai/conversations`, `DELETE /ai/conversations/{conversationId}`, `GET,POST /ai/conversations/{conversationId}/messages`, `POST /ai/messages/{messageId}/feedback` | Auth |
| AI-02 | `/ai/knowledge` | Kho tri thức (`LIST`) | Lọc theo nhóm, trạng thái; thêm tài liệu (xử lý chia đoạn + embedding bất đồng bộ) | `GET,POST /ai/knowledge-documents` | `ai.knowledge_manage` |
| AI-03 | `/ai/knowledge/:id` | Chi tiết tài liệu tri thức (`DETAIL`) | Sửa tiêu đề/nhóm; **tải phiên bản mới**; **Lưu trữ** (không còn được viện dẫn); **Lập lại chỉ mục** | `GET,PUT /ai/knowledge-documents/{documentId}`, `POST /ai/knowledge-documents/{documentId}/versions`, `POST /ai/knowledge-documents/{documentId}/archive`, `POST /ai/knowledge-documents/{documentId}/reindex` | `ai.knowledge_manage` |
| AI-04 | `/ai/knowledge-gaps` | Câu hỏi chưa có lời giải (`LIST`) | Các cụm câu hỏi tương tự chưa tìm được tài liệu; lọc theo trạng thái | `GET /ai/knowledge-gaps` | `ai.knowledge_manage` |
| AI-05 | `/ai/knowledge-gaps/:id` | Chi tiết cụm câu hỏi (`DETAIL`) | Danh sách câu hỏi trong cụm; đánh dấu **đã xử lý** (chọn tài liệu đã bổ sung) hoặc **bỏ qua** | `GET,PUT /ai/knowledge-gaps/{clusterId}` | `ai.knowledge_manage` |

---

### 5.20. SƠ ĐỒ GHẾ NGỒI & KHÔNG GIAN LÀM VIỆC (WP)

Module có hai giao diện: **Workplace Administration** (Office Admin, tiền tố `/workplace/admin`) và **My Workplace** (nhân viên, tiền tố `/workplace`). Cả hai dùng chung thành phần `FloorCanvas2D`.

#### a) Workplace Administration

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| WP-01 | `/workplace/admin/sites` | Cơ sở (`LIST`) | Danh sách theo chi nhánh; tạo cơ sở (mã tự chuẩn hóa in hoa) | `GET,POST /workplace/sites` | `workplace.view` / `workplace.manage` |
| WP-02 | `/workplace/admin/sites/:id` | Chi tiết cơ sở & tầng (`DETAIL`) | Sửa/xóa mềm cơ sở; danh sách tầng, thêm/sửa/xóa tầng (chặn nếu còn phân khu/bản vẽ) | `GET,PUT,DELETE /workplace/sites/{siteId}`, `GET,POST /workplace/sites/{siteId}/floors`, `PUT,DELETE /workplace/floors/{floorId}` | `workplace.view` / `workplace.manage` |
| WP-03 | `/workplace/admin/floors/:id/plans` | Bản vẽ tầng (`LIST`) | Các phiên bản bản vẽ; tạo bản vẽ (ảnh nền, kích thước Canvas, tỷ lệ thực tế); sửa bản `DRAFT`; **Phát hành** (bản đang phát hành trước đó tự chuyển `ARCHIVED`); lưu trữ | `GET,POST /workplace/floors/{floorId}/plans`, `PUT /workplace/floor-plans/{planId}`, `POST /workplace/floor-plans/{planId}/publish`, `POST /workplace/floor-plans/{planId}/archive` | `workplace.view` / `workplace.manage` |
| WP-04 | `/workplace/admin/floors/:id/editor` | Trình soạn bản đồ tầng (`EDITOR`) | Canvas 2D trên bản vẽ: thanh công cụ vẽ **phân khu** (hình chữ nhật/đa giác, gắn phòng ban, màu), **cụm/dãy bàn** (vị trí, góc xoay, kiểu bố trí), **sinh bàn hàng loạt**, thêm/sửa **bàn đơn lẻ**, **vật thể** (phòng họp, thang máy, cầu thang, WC, pantry, máy in, tủ đồ, vật cản), thiết lập sức chứa phòng họp. Chọn đối tượng mở panel thuộc tính bên phải | `GET /workplace/floors/{floorId}/map`, `GET,POST /workplace/floors/{floorId}/zones`, `PUT,DELETE /workplace/zones/{zoneId}`, `GET,POST /workplace/zones/{zoneId}/seat-rows`, `PUT,DELETE /workplace/seat-rows/{rowId}`, `POST /workplace/seat-rows/{rowId}/generate-seats`, `POST /workplace/seats`, `PUT,DELETE /workplace/seats/{seatId}`, `GET,POST /workplace/floors/{floorId}/objects`, `PUT,DELETE /workplace/objects/{objectId}`, `PUT /workplace/meeting-rooms/{objectId}` | `workplace.manage` |
| WP-05 | `/workplace/admin/seats/:id` | Chi tiết bàn (`DETAIL`) | Người được phân bổ; đổi trạng thái (`IN_SERVICE`/`MAINTENANCE`/`BLOCKED`); thiết lập **tiện ích**; **gắn/tháo tài sản** (xác minh qua module Tài sản); **mã QR** để in | `GET /workplace/seats/{seatId}`, `PATCH /workplace/seats/{seatId}/status`, `PUT /workplace/seats/{seatId}/amenities`, `POST /workplace/seats/{seatId}/assets`, `DELETE /workplace/seat-assets/{seatAssetId}`, `GET /workplace/seats/{seatId}/qr` | `workplace.view` / `workplace.manage` |
| WP-06 | `/workplace/admin/seats` | Danh sách bàn (`LIST`) | Tìm theo tầng, phân khu, loại bàn (`DEDICATED`/`HOT_DESK`), trạng thái, tiện ích | `GET /workplace/seats` | `workplace.view` |
| WP-07 | `/workplace/admin/amenities` | Danh mục tiện ích (`LIST`) | CRUD tiện ích (màn hình rời, ổ cắm...); không xóa tiện ích đã gắn bàn | `GET,POST /workplace/amenities`, `PUT,DELETE /workplace/amenities/{amenityId}` | `workplace.view` / `workplace.manage` |
| WP-08 | `/workplace/admin/seat-assignments` | Phân bổ bàn cố định (`LIST`) | Danh sách phân bổ (lọc tầng, nhân viên, đang hiệu lực); phân bổ bàn `DEDICATED` (một người một bàn); **thu hồi** | `GET,POST /workplace/seat-assignments`, `POST /workplace/seat-assignments/{assignmentId}/release` | `workplace.view` / `workplace.manage` |
| WP-09 | `/workplace/admin/desk-bookings` | Quản lý đặt bàn (`LIST`) | Danh sách đặt bàn linh hoạt theo ngày, tầng, nhân viên | `GET /workplace/desk-bookings` | `workplace.view` |
| WP-10 | `/workplace/admin/room-bookings` | Lịch phòng họp (`CALENDAR`) | Lịch theo phòng và ngày; Office Admin **đặt thay** cho nhân viên | `GET /workplace/room-bookings` | `workplace.view` |
| WP-11 | `/workplace/admin/issues` | Sự cố cơ sở vật chất (`LIST`) | Lọc theo trạng thái, mức độ, tầng | `GET /workplace/issues` | `workplace.view` |
| WP-12 | `/workplace/admin/issues/:id` | Xử lý sự cố (`DETAIL`) | Chi tiết + vị trí trên bản đồ; **Phân công** → **Bắt đầu xử lý** → **Hoàn tất** (ghi chú; bàn tự khôi phục `IN_SERVICE`) | `GET /workplace/issues/{issueId}`, `PUT /workplace/issues/{issueId}/assign`, `POST /workplace/issues/{issueId}/start`, `POST /workplace/issues/{issueId}/resolve` | `workplace.view` / `workplace.manage` |
| WP-13 | `/workplace/admin/reports` | Báo cáo sử dụng không gian (`DASH`) | Tỷ lệ lấp đầy, mức sử dụng bàn và phòng họp theo tầng, khoảng ngày | `GET /workplace/reports/utilization` | `workplace.report` |

#### b) My Workplace (nhân viên)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| WP-14 | `/workplace` | My Workplace (`DASH`) | Một nơi tập hợp: bàn cố định của tôi, lượt đặt bàn, lượt đặt phòng họp, sự cố tôi đã báo; lối tắt tới bản đồ, đặt bàn, đặt phòng, báo sự cố | `GET /me/workplace/seat`, `GET /me/workplace/desk-bookings`, `GET /me/workplace/room-bookings`, `GET /me/workplace/issues` | Auth |
| WP-15 | `/workplace/map` | Bản đồ văn phòng & tìm đường (`MOBILE`) | Bản đồ tầng đã phát hành kèm trạng thái bàn trống/có người; **tìm vị trí đồng nghiệp** (theo quyền); **chỉ đường** A* giữa hai điểm/bàn/phòng, vẽ đường đi trên canvas | `GET /workplace/floors/{floorId}/map`, `GET /workplace/employees/{employeeId}/location`, `GET /workplace/navigation/route` | Auth |
| WP-16 | `/workplace/desk-booking` | Đặt bàn linh hoạt (`WIZARD`) | Chọn ngày, tầng, tiện ích mong muốn → xem bàn `HOT_DESK` trống trên bản đồ → đặt (mỗi người một bàn/ngày); **Check-in bằng QR**; hủy | `GET /workplace/desk-bookings/availability`, `POST /workplace/desk-bookings`, `POST /workplace/desk-bookings/{bookingId}/check-in`, `POST /workplace/desk-bookings/{bookingId}/cancel` | Auth |
| WP-17 | `/workplace/room-booking` | Đặt phòng họp (`WIZARD`) | Chọn khoảng thời gian, sức chứa tối thiểu, tầng → phòng trống → đặt (chặn chồng giờ, kiểm tra sức chứa); check-in; hủy | `GET /workplace/meeting-rooms/availability`, `POST /workplace/room-bookings`, `POST /workplace/room-bookings/{bookingId}/check-in`, `POST /workplace/room-bookings/{bookingId}/cancel` | Auth |
| WP-18 | `/workplace/issues/new` | Báo sự cố (`FORM`) | Loại, mức độ, tiêu đề, mô tả; chọn vị trí: bàn, vật thể hoặc điểm tự do trên bản đồ. Sự cố gắn bàn sẽ tự khóa bàn | `POST /workplace/issues` | Auth |
| WP-19 | `/workplace/qr?token=` | Đích quét mã QR (`MOBILE`) | Giải mã QR của bàn/phòng họp/điểm xuất phát rồi chuyển sang check-in, chi tiết phòng hoặc chỉ đường | `GET /workplace/qr/resolve` | Auth |

---

### 5.21. THÔNG BÁO NỘI BỘ (NTF)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| NTF-01 | `/notifications` (và dropdown từ biểu tượng chuông) | Trung tâm thông báo (`LIST`) | Lọc chưa đọc/đã đọc, theo loại (`WORKFLOW`, `CONTRACT`, `PAYROLL`, `ANNOUNCEMENT`, `SYSTEM`); đánh dấu đã đọc từng cái hoặc **tất cả**; xóa; bấm vào thông báo mở **`action_url`** (deep link, ví dụ `/workflows/pending`, `/contracts/123`) | `GET /notifications`, `POST /notifications/{notificationId}/read`, `POST /notifications/read-all`, `DELETE /notifications/{notificationId}` | Auth |
| NTF-02 | `/admin/broadcast` | Phát thông báo toàn công ty (`FORM`) | Tiêu đề, nội dung, đường dẫn hành động (tùy chọn) | `POST /notifications/broadcast` | `notification.broadcast` |

> Số thông báo chưa đọc (`GET /notifications/unread-count`) được xử lý ở mục 2.3 (polling cho biểu tượng chuông).

---

### 5.22. NHẬT KÝ KIỂM TOÁN (AUD)

| ID | Route | Trang (Loại) | Chức năng chính | API | Quyền |
| --- | --- | --- | --- | --- | --- |
| AUD-01 | `/audit-logs` | Tra cứu nhật ký (`LIST`) | Lọc theo người thực hiện, hành động (danh mục chuẩn hóa), loại đối tượng, mã đối tượng, khoảng thời gian, từ khóa, IP; **Xuất dữ liệu** (bất đồng bộ, bản thân việc xuất cũng được ghi log) | `GET /audit-logs`, `GET /audit-logs/actions`, `GET /audit-logs/export` | `audit.view` / `audit.export` |
| AUD-02 | `/audit-logs/:id` | Chi tiết bản ghi (`DETAIL`) | Hành động, đối tượng, người thực hiện, thời gian, IP, User Agent; **so sánh giá trị trước/sau** dạng side-by-side | `GET /audit-logs/{logId}` | `audit.view` |
| AUD-03 | `/audit-logs/entity/:entityType/:entityId` | Audit Trail của một đối tượng (`DETAIL`) | Dòng thời gian toàn bộ thay đổi của một đối tượng nghiệp vụ (hợp đồng, bảng lương, hồ sơ...). Mở từ nút "Lịch sử thay đổi" ở các trang chi tiết | `GET /audit-logs/entity/{entityType}/{entityId}` | `audit.view` |

---

## 6. Các điểm nghiệp vụ chưa có API tương ứng

Những mục dưới đây có trong tài liệu nghiệp vụ nhưng **không có endpoint** trong `api-list.md`. Frontend nên xác nhận với backend trước khi thiết kế màn hình.

| # | Nội dung | Căn cứ | Hướng xử lý đề xuất |
| --- | --- | --- | --- |
| 1 | **Quên mật khẩu / đổi mật khẩu** | Tài liệu API ghi rõ không có vì nghiệp vụ không mô tả | Chưa làm; hỏi lại nghiệp vụ. Tạm thời nhờ quản trị viên gửi lại kích hoạt (`RBAC-02`) |
| 2 | **Dashboard tổng hợp** cho HR / Ban Giám đốc | Không có API dashboard; chỉ có `compliance/dashboard`, `performance-cycles/{id}/summary`, `workplace/reports/utilization` | `CMN-01` chỉ ghép từ API sẵn có; chỉ số điều hành khác để trợ lý AI (`AI-01`) trả lời |
| 3 | **Báo cáo hợp đồng** (ký kết, tái ký, chấm dứt) và **khai trình sử dụng lao động** | Mục 8.2.9 và bảng 8.3 | Chưa có trang; hiện chỉ có `CON-03`, `CON-04` để lọc |
| 4 | **Báo cáo lý do ứng viên từ chối offer** và **phân tích xu hướng chấm điểm của người phỏng vấn** (Bias Awareness) | Bảng 4.3 | Chưa có trang; dữ liệu thô nằm ở `REC-27` và `REC-24` |
| 5 | **Ký điện tử cho thư mời nhận việc** | Bảng 4.3 ("Tạo thư và ký điện tử") | API Offer chỉ có sinh thư, gửi, ghi nhận đồng ý/từ chối. Chưa rõ ứng viên ký ở đâu |
| 6 | **Ứng viên theo dõi trạng thái hồ sơ** | Cổng công khai chỉ có xem việc làm và nộp hồ sơ | Chưa có trang tra cứu trạng thái cho ứng viên |
| 7 | **Danh mục loại hình điều chuyển** (nội bộ, chi nhánh, công ty, chức vụ, tạm thời) | Mục 15.2.1 | Không có CRUD; coi là enum lấy từ `GET /lookups/{enumName}` *(giả định)* |
| 8 | **Cảnh báo hết hạn / gia hạn / điều chuyển trở lại** cho điều chuyển tạm thời | Bảng 15.3, ghi "đề xuất" | Chưa có API; có thể dùng thông báo hệ thống |
| 9 | **Đồng bộ metadata đã xác thực sang hồ sơ nhân sự** và đối chiếu dữ liệu | Bảng 7.3 | Không có endpoint riêng, chưa rõ cơ chế; tạm thời ở `DOC-07` người dùng tự cập nhật hồ sơ qua các API ở `EMP-03`/`EMP-04` |
| 10 | **Cấu hình ngưỡng xác thực khuôn mặt** | Bảng 9.3 | Không có endpoint riêng; có thể là khóa trong `CMN-08` *(giả định)* |
| 11 | **Xu hướng thăng tiến và luân chuyển theo phòng ban** | Bảng 13.3 ("Phân tích tổ chức") | Chưa có API phân tích |
| 12 | **Quyết toán lương khi thôi việc**, **lập lịch thu hồi quyền truy cập theo ngày nghỉ** | Bảng 16.3, nhóm "Mở rộng" | Chưa có API |
| 13 | **Xem chi tiết một thông báo** | Bảng 20.3 | Không có `GET /notifications/{id}`; dùng nội dung đã có trong danh sách (drawer/modal) |
| 14 | **Tạo mới nhân viên kèm tài khoản** | Bảng 5.3 | `POST /employees` có thể kèm tạo tài khoản; nếu không, dùng thêm `RBAC-01`. Cần xác nhận với backend |

### API chỉ gọi nội bộ (không có trang frontend)

| API | Ghi chú |
| --- | --- |
| `POST /internal/notifications` | Dịch vụ tạo thông báo (service-to-service) |
| `POST /compliance-checks` | Module nghiệp vụ gọi kiểm tra tuân thủ; frontend chỉ xem kết quả ở `LEG-08` |
| `GET /compliance-rules/effective` | Tra quy tắc đang áp dụng, dùng giữa các dịch vụ |
| `GET /compliance-parameters` | Tra tham số pháp lý tại một ngày, dùng giữa các dịch vụ |

---

## 7. Thống kê

| Mã | Module | Số trang |
| --- | --- | ---: |
| AUTH | 0. Xác thực | 4 |
| CMN | Dùng chung (workflow, cấu hình, tài sản...) | 14 |
| ORG | 1. Quản lý tổ chức | 9 |
| SIM | 2. Mô phỏng tái cơ cấu | 4 |
| RBAC | 3. Phân quyền & tài khoản | 4 |
| REC | 4. Tuyển dụng | 31 |
| EMP | 5. Hồ sơ nhân sự | 10 |
| ONB | 6. Hội nhập | 9 |
| DOC | 7. Số hóa & lưu kho hồ sơ | 13 |
| CON | 8. Hợp đồng | 13 |
| ATT | 9. Chấm công & ca | 16 |
| PAY | 10. Bảng lương | 12 |
| PERF | 11. Hiệu suất & KPI | 7 |
| RWD | 12. Khen thưởng, kỷ luật, khiếu nại | 10 |
| CAR | 13. Phát triển & kế nhiệm | 8 |
| LEA | 14. Nghỉ phép | 8 |
| TRF | 15. Điều chuyển | 4 |
| OFF | 16. Thôi việc | 9 |
| LEG | 17. Pháp luật & tuân thủ | 10 |
| AI | 18. Trợ lý AI | 5 |
| WP | 19. Không gian làm việc | 19 |
| NTF | 20. Thông báo | 2 |
| AUD | 21. Nhật ký kiểm toán | 3 |
| | **Tổng** | **224** |

**Phạm vi đối chiếu:** đã kiểm tra bằng script — cả **726/726 endpoint** trong `api-list.md` đều được gán cho ít nhất một trang (hoặc cho cơ chế nền ở mục 2.3, hoặc nằm trong danh sách API chỉ gọi nội bộ ở mục 6). Một endpoint có thể xuất hiện ở nhiều trang (ví dụ `GET /workplace/floors/{floorId}/map`).

**Số trang theo loại** (một số trang gộp hai loại như `FORM`/`DETAIL` nên tổng ở đây có thể lớn hơn số trang):

| Loại | Số lượng |
| --- | ---: |
| `LIST` | 106 |
| `DETAIL` | 55 |
| `FORM` | 20 |
| `DASH` | 11 |
| `CALENDAR` | 7 |
| `EDITOR` | 7 |
| `WIZARD` | 6 |
| `PUBLIC` | 5 |
| `MOBILE` | 5 |
| `STATIC` | 1 |
| `BOARD` | 1 |

**Trang cần chú ý khi lập kế hoạch:** các trang `EDITOR` và `BOARD` phức tạp nhất — `SIM-02` (sandbox sơ đồ tổ chức), `WP-04` (trình soạn bản đồ tầng), `REC-09` (ATS Pipeline), `LEG-06` (soạn phiên bản quy tắc), `DOC-07` (xác thực metadata song song với ảnh) — và các trang `MOBILE` phụ thuộc camera/GPS: `ATT-03`, `EMP-10`, `CON-13`, `WP-15`, `WP-19`.