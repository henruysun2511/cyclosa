# ĐẶC TẢ TÍNH NĂNG: QUẢN TRỊ VAI TRÒ & THIẾT LẬP MA TRẬN PHÂN QUYỀN
### Feature: Role & Permission Matrix Management
> **Vị trí file:** `cyclosa_fe/docs/FEATURE_ROLE_PERMISSION_MANAGEMENT.md`  
> **Phân hệ:** Hệ thống & Bảo mật (System & Security)  
> **Route màn hình:** `/admin/roles`  
> **Phiên bản:** 1.0 — Chuẩn Enterprise Next.js App Router & Tailwind CSS  

---

## 🎯 1. Mục tiêu & Giá trị Nghiệp vụ

Tính năng **Quản trị Vai trò & Thiết lập Ma trận Phân quyền** là trung tâm bảo mật của CYCLOSA HRM, cho phép Quản trị viên cấp cao:
1. **Quản lý danh mục Vai trò (Roles):** Xem danh sách 10 vai trò mặc định hệ thống (`SUPER_ADMIN`, `HR_ADMIN`, `MANAGER`...) và tạo thêm các vai trò tùy chỉnh phù hợp với từng doanh nghiệp.
2. **Thiết lập Ma trận Quyền trực quan (Permission Matrix):** Bật/tắt 36 quyền chức năng thuộc 12 phân hệ tài nguyên và phân bổ phạm vi dữ liệu (**Data Scope**: `ALL`, `COMPANY`, `DEPARTMENT`, `OWN`) cho từng vai trò mà không cần can thiệp code.
3. **Bảo vệ toàn vẹn hệ thống:** Ngăn chặn sửa/xóa các vai trò hệ thống cốt lõi và kiểm soát chặt chẽ việc xóa vai trò đang có nhân sự nắm giữ.

---

## 🔌 2. Danh sách 8 API Backend tích hợp

Toàn bộ các API đã hoàn thiện $100\%$ tại Backend trong `RoleController` & `PermissionController`:

| STT | Method | Endpoint | Quyền yêu cầu | Mô tả chức năng |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/api/v1/roles` | `role.view` | Lấy danh sách vai trò có tìm kiếm, lọc theo loại và phân trang |
| 2 | `POST` | `/api/v1/roles` | `role.manage` | Tạo mới một vai trò tùy chỉnh |
| 3 | `GET` | `/api/v1/roles/{roleId}` | `role.view` | Xem chi tiết vai trò kèm số lượng nhân viên nắm giữ |
| 4 | `PUT` | `/api/v1/roles/{roleId}` | `role.manage` | Cập nhật tên và mô tả vai trò tùy chỉnh |
| 5 | `DELETE`| `/api/v1/roles/{roleId}` | `role.manage` | Xóa mềm vai trò tùy chỉnh (chỉ khi `userCount = 0`) |
| 6 | `GET` | `/api/v1/roles/{roleId}/permissions` | `role.view` | Lấy ma trận quyền và DataScope hiện tại của vai trò |
| 7 | `PUT` | `/api/v1/roles/{roleId}/permissions` | `role.manage` | Lưu thiết lập ma trận quyền và phạm vi dữ liệu cho vai trò |
| 8 | `GET` | `/api/v1/permissions/grouped` | `role.view` | Lấy danh mục 36 quyền gom theo 12 Phân hệ tài nguyên |

---

## 🎨 3. Thiết kế Trải nghiệm Người dùng (UI/UX Specification)

Giao diện tính năng bao gồm **3 màn hình / thành phần chính**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ MÀN HÌNH CHÍNH: /admin/roles                                           │
│ 1. Header: Tiêu đề + Breadcrumb + Nút "Thêm vai trò mới"               │
│ 2. KPI Cards: Tổng vai trò, Vai trò hệ thống, Vai trò tùy chỉnh        │
│ 3. Filter Bar: Tìm kiếm từ khóa, Tabs lọc (Tất cả / Hệ thống / Custom) │
│ 4. Table: Danh sách vai trò + Cột Action (Phân quyền, Sửa, Xóa)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴────────────────────────────┐
       ▼                                                         ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│ MODAL 1: FORM VAI TRÒ                │  │ MODAL 2: MA TRẬN PHÂN QUYỀN          │
│ - Mã vai trò (code)                  │  │ - 12 Nhóm Phân hệ Accordion          │
│ - Tên hiển thị (name)                │  │ - Checkbox bật/tắt từng quyền        │
│ - Mô tả nghiệp vụ                    │  │ - Select DataScope (ALL, COMP, DEPT) │
│ - Nút "Lưu vai trò"                  │  │ - Thống kê số quyền đã cấp (ví dụ 18)│
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

### 3.1. Màn hình Danh sách Vai trò ([`/admin/roles`](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/admin/roles/page.tsx))

* **Header:**
  * Tiêu đề: *"Quản trị Vai trò & Ma trận Phân quyền"*
  * Nút CTA: `<Button>` **"Tạo vai trò mới"** (Được bảo vệ bởi `<PermissionGuard permission={PERMISSIONS.ROLE.MANAGE}>`).
* **KPI Summary Cards (4 thẻ chỉ số):**
  1. *Tổng số vai trò:* Tổng số lượng vai trò đang kích hoạt trong hệ thống.
  2. *Vai trò Hệ thống:* Cố định (10 vai trò chuẩn).
  3. *Vai trò Tùy chỉnh:* Các vai trò do doanh nghiệp tự tạo.
  4. *Nhân sự đã phân quyền:* Tổng số lượt người dùng đã được gán vai trò.
* **Bảng dữ liệu Vai trò (TanStack Table):**
  * **Cột Mã vai trò (`code`):** Hiển thị dạng Font Monospace, in hoa (ví dụ: `HR_ADMIN`, `DEPT_HEAD`).
  * **Cột Tên vai trò (`name`):** Tên tiếng Việt rõ ràng, đậm nét.
  * **Cột Mô tả (`description`):** Tóm tắt quyền hạn và trách nhiệm của vai trò.
  * **Cột Loại vai trò (`isSystemRole`):**
    * `true`: Badge xanh ngọc *"Hệ thống"* (Khóa tính năng sửa mã/xóa).
    * `false`: Badge xám *"Tùy chỉnh"*.
  * **Cột Số nhân sự (`userCount`):** Số người dùng đang nắm vai trò. Bấm vào mở danh sách nhân sự liên quan.
  * **Cột Thao tác (Actions Dropdown / Buttons):**
    * Nút **"Phân quyền" (Icon `KeyRound` / `ShieldCheck`):** Mở Modal thiết lập ma trận quyền.
    * Nút **"Chỉnh sửa" (Icon `Edit2`):** Mở modal sửa tên/mô tả (vô hiệu hóa nếu là vai trò hệ thống).
    * Nút **"Xóa" (Icon `Trash2`):** Mở Confirm Dialog xóa mềm (chỉ cho phép khi `userCount === 0` và không phải vai trò hệ thống).

---

### 3.2. Modal Thiết lập Ma trận Phân quyền (`RolePermissionMatrixModal`)

Đây là **thành phần quan trọng nhất** của tính năng:
* **Kích thước:** Modal lớn / Drawer cạnh phải màn hình (`max-w-4xl`), hỗ trợ cuộn mượt mà.
* **Header Modal:**
  * Tên vai trò đang phân quyền: ví dụ *"Thiết lập quyền cho: Trưởng phòng Nhân sự (HR_ADMIN)"*.
  * Bộ đếm trực quan: Badge số quyền đã cấp trên tổng số (ví dụ: `28/36 quyền đã chọn`).
  * Nút "Chọn tất cả" / "Bỏ chọn tất cả" toàn bộ quyền.
* **Thân Modal (Gom nhóm 12 Phân hệ theo Accordion / Card):**
  Mỗi phân hệ (Resource) như `Hồ sơ nhân sự (EMPLOYEE)`, `Nghỉ phép (LEAVE)`, `Bảng lương (PAYROLL)`... bao gồm:
  1. **Header Phân hệ:** Tên phân hệ, icon đại diện, nút checkbox "Chọn cả nhóm".
  2. **Danh sách các quyền bên trong:**
     * **Checkbox:** Tên quyền (ví dụ: *Xem hồ sơ nhân viên*, *Phê duyệt đơn nghỉ phép*).
     * **Dropdown Data Scope:** Chọn phạm vi dữ liệu áp dụng:
       * `ALL`: Toàn hệ thống
       * `COMPANY`: Trong toàn công ty
       * `DEPARTMENT`: Chỉ trong phòng ban phụ trách
       * `OWN`: Chỉ dữ liệu của chính mình
     * *Quy tắc UX:* Dropdown Data Scope chỉ bật (enable) khi Checkbox quyền tương ứng được tích chọn.
* **Footer Modal:**
  * Nút "Hủy bỏ".
  * Nút "Lưu ma trận phân quyền" (Hiển thị Spinner xoay khi đang gọi API `PUT /api/v1/roles/{id}/permissions`).

---

### 3.3. Modal Tạo mới / Chỉnh sửa Vai trò (`RoleFormDialog`)

* Sử dụng Zod Schema validate chặt chẽ:
  * `code`: Chữ in hoa không dấu, số và gạch dưới (Regex `^[A-Z0-9_]{3,50}$`). Khóa không cho sửa khi ở chế độ Update.
  * `name`: Tối thiểu 3 ký tự, tối đa 100 ký tự.
  * `description`: Tối đa 255 ký tự.

---

## 🏗️ 4. Cấu trúc Thư mục Module trên Frontend

Tuân thủ kiến trúc **Feature-Sliced Design / Domain-Driven** của dự án:

```
src/features/roles/
├── api/
│   └── role-api.ts                     # RTK Query injectEndpoints (8 endpoints)
├── types/
│   └── role.types.ts                   # RoleResponse, RoleDetail, AssignPermissionsRequest
├── schemas/
│   └── role.schema.ts                  # Zod validation schema (create/update role)
├── constants/
│   └── role.constants.ts               # Hằng số, nhãn bảng, tabs phân loại
├── components/
│   ├── role-kpi-cards.tsx              # Thẻ chỉ số tổng quan đầu trang
│   ├── role-filters.tsx                # Bộ lọc tìm kiếm & Tabs hệ thống/tùy chỉnh
│   ├── role-columns.tsx                # Định nghĩa các cột bảng TanStack
│   ├── role-table.tsx                  # Bảng hiển thị danh sách vai trò
│   ├── role-form-dialog.tsx            # Modal thêm mới/sửa vai trò
│   └── role-permission-matrix-modal.tsx # Modal thiết lập ma trận 36 quyền & DataScope
└── index.ts                            # Barrel export

src/app/(admin)/admin/roles/
└── page.tsx                            # Page Route được bọc bởi <RouteGuard permission={PERMISSIONS.ROLE.VIEW}>
```

---

## 📅 5. Kế hoạch Triển khai theo 4 Bước

### Bước 1: Khung Dữ liệu Nền tảng (Data Layer & RTK Query)
* Tạo `role.types.ts` định nghĩa toàn bộ DTO request/response từ Backend.
* Tạo `role.schema.ts` với Zod validation.
* Tạo `role-api.ts` kết nối 8 endpoints của `RoleController` & `PermissionController`.

### Bước 2: Xây dựng Giao diện Danh sách Vai trò (Table & Filters)
* Tạo component `RoleKpiCards` và `RoleFilters`.
* Xây dựng `RoleTable` với TanStack Table, hiển thị huy hiệu loại vai trò và số lượng user.
* Tạo Page route `src/app/(admin)/admin/roles/page.tsx` bọc `<RouteGuard permission={PERMISSIONS.ROLE.VIEW}>`.

### Bước 3: Xây dựng Modal Ma trận Phân quyền (`RolePermissionMatrixModal`)
* Gọi API `GET /api/v1/permissions/grouped` để lấy 36 quyền theo 12 phân hệ.
* Gọi API `GET /api/v1/roles/{id}/permissions` để nạp dữ liệu quyền đang có của vai trò.
* Xử lý tương tác Checkbox bật/tắt quyền và Dropdown chọn DataScope (`ALL`, `COMPANY`, `DEPARTMENT`, `OWN`).
* Gửi `PUT /api/v1/roles/{id}/permissions` lưu cấu hình và hiển thị Toast thành công.

### Bước 4: Xây dựng Modal Thêm mới / Chỉnh sửa & Xóa mềm Vai trò
* Hoàn thiện `RoleFormDialog` cho tạo mới và cập nhật vai trò tùy chỉnh.
* Tích hợp `ConfirmDialog` xác nhận xóa mềm vai trò có kiểm tra `userCount === 0`.
* Kiểm tra toàn diện TypeScript `npx tsc --noEmit` đạt 0 lỗi.

---

> [!IMPORTANT]
> **Cam kết chất lượng:**
> * Giao diện hoàn toàn bằng tiếng Việt có dấu.
> * 100% sử dụng hằng số `PERMISSIONS` và `DATA_SCOPE` đã chuẩn hóa ở lượt trước, không Magic String.
> * Hoạt động mượt mà với cả tài khoản `admin` (Super Admin) và các tài khoản phân quyền hạn chế.

