# CYCLOSA Frontend — Bộ Quy Chuẩn Kỹ Thuật & Kiến Trúc Feature (Master Rules)

> **Mục đích:** Bộ quy chuẩn toàn diện này là kim chỉ nam **BẮT BUỘC** cho tất cả các lập trình viên và AI Agent khi làm việc với giao diện web `cyclosa_fe` (CYCLOSA HRM Web Portal).
> Trước khi thực hiện bất kỳ task UI/Feature nào, **BẮT BUỘC ĐỌC LẠI** các quy chuẩn liên quan dưới đây để đảm bảo giao diện 100% đồng bộ và không phát sinh lỗi.

---

## Danh mục Các Tệp Quy Chuẩn

| Mã tệp | Tên tài liệu quy chuẩn | Nội dung chính |
| :--- | :--- | :--- |
| [**01**](./01-kien-truc-va-cau-truc-feature.md) | **Kiến trúc Feature-Driven & Cấu trúc Thư mục** | Kiến trúc đóng gói feature, cấu trúc chi tiết `src/features/<feature>/`, Page Container Pattern trong `src/app/(admin)/`, cấm tạo wrapper view trung gian thừa thãi. |
| [**02**](./02-quy-chuan-header-va-breadcrumbs.md) | **Page Header & Breadcrumbs (Golden Standard)** | Lấy `contracts` & `employees` làm chuẩn mực: Tiêu đề H1 icon trực tiếp, cấm icon box màu nền, cấm mã `(REC-xx)`, cấm tag/subtitle trên header; Breadcrumbs gốc "Trang chủ" không icon. |
| [**03**](./03-quy-chuan-filter-va-kpi-cards.md) | **Bộ lọc (Filter Bar) & Thẻ Thống kê (KPI Cards)** | Bố cục Filter Bar 2 hàng; Thẻ KPI 4 cột; **Quy chuẩn chống hiển thị tiếng Anh trong Select (Localization Map)**; Quy chuẩn bẫy lỗi bộ lọc (Bắt buộc reset `page = 1`, Debounce search, Clean params). |
| [**04**](./04-quy-chuan-table-va-empty-state.md) | **Bảng Dữ liệu (Table), Empty State & Loading** | **Quy tắc Table-Embedded Empty State**: Bảng rỗng vẫn giữ nguyên khung và TableHeader, hàng rỗng `colSpan` ở TableBody; Skeleton Loading; Phân trang DataPagination. |
| [**05**](./05-quy-chuan-form-va-dialog.md) | **Biểu mẫu (Form), Dialog & Validation** | Zod Schema là Single Source of Truth; Hợp nhất Dialog Tạo mới & Chỉnh sửa (Single Dialog); Cấm chèn icon trước FormLabel; Xử lý null value an toàn. |
| [**06**](./06-quy-chuan-state-va-rtk-query.md) | **State Management, RTK Query & Đồng bộ URL** | RTK Query injectEndpoints; Cấm lặp `/api/v1`; Quy tắc chuyển đổi 0-based & 1-based pagination; Hook `use<Feature>Filters` đồng bộ URL; **Kiểm tra kết nối API & Xử lý toàn diện 4 trạng thái dữ liệu (Loading / Error / Empty / Success)**; Bọc try/catch unwrap cho mutations. |
| [**07**](./07-quy-chuan-rbac-va-kiem-thu.md) | **Phân quyền RBAC, Ngôn ngữ & Nghiệm thu (DoD)** | Hook `usePermission`; Cấm giấu nút khỏi DOM; 100% Tiếng Việt có dấu chuẩn; Checklist 9 bước tự kiểm tra, lệnh bắt buộc `tsc --noEmit` và **Quy định BẮT BUỘC luôn cập nhật `docs/API_TRACKING.md`**. |

---

## Module Chuẩn mực để Tham Chiếu (Golden Benchmark)

Khi có bất kỳ băn khoăn nào về cách tổ chức code, phong cách UI, bố cục hoặc tương tác, hãy đối chiếu trực tiếp với:
1. **Quản lý Hợp đồng lao động:**
   - Trang quản lý: [`src/app/(admin)/contracts/page.tsx`](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/contracts/page.tsx)
   - Feature components: [`src/features/contract/`](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/contract)
2. **Hồ sơ Nhân sự:**
   - Trang danh sách: [`src/app/(admin)/employees/page.tsx`](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/employees/page.tsx)
   - Trang chi tiết: [`src/app/(admin)/employees/[id]/page.tsx`](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/employees/[id]/page.tsx)

