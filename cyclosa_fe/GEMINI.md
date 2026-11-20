# CYCLOSA Frontend — Hướng dẫn và Quy chuẩn Bắt buộc cho AI Agent

Mỗi khi thực hiện bất kỳ tác vụ nào (tạo mới tính năng, chỉnh sửa giao diện, sửa lỗi, refactor) trong thư mục `cyclosa_fe`, AI Agent **BẮT BUỘC ĐỌC VÀ TUÂN THỦ NGHIÊM NGẶT** bộ quy chuẩn tại thư mục `rules/`:

1. **Kiến trúc & Cấu trúc Feature:** Đọc [rules/01-kien-truc-va-cau-truc-feature.md](./rules/01-kien-truc-va-cau-truc-feature.md). Mọi feature phải nằm trong `src/features/<feature>/`, tuân thủ cấu trúc chuẩn (`api`, `components`, `constants`, `hooks`, `schemas`, `types`, `utils`, `index.ts`). Page Container tại `src/app/(admin)/<feature>/page.tsx` là điểm điều phối duy nhất, cấm tạo wrapper view trung gian.
2. **Page Header & Breadcrumbs (Golden Standard):** Đọc [rules/02-quy-chuan-header-va-breadcrumbs.md](./rules/02-quy-chuan-header-va-breadcrumbs.md). Lấy `contracts` và `employees` làm chuẩn mực. H1 icon trực tiếp không có hộp màu nền, không có mã `(REC-xx)`, không có tag/badge trạng thái, không có subtitle. Breadcrumbs gốc là `<Link href="/">Trang chủ</Link>` không có icon ngôi nhà và không có nhãn CYCLOSA.
3. **Bộ lọc (Filter Bar) & Thẻ KPI:** Đọc [rules/03-quy-chuan-filter-va-kpi-cards.md](./rules/03-quy-chuan-filter-va-kpi-cards.md). Filter Bar 2 hàng (Hàng 1 tìm kiếm, Hàng 2 các Select có icon + nhãn nhỏ + nút Đặt lại). Dùng Select shadcn/ui. KPI cards 4 cột.
4. **Bảng Dữ liệu & Empty State:** Đọc [rules/04-quy-chuan-table-va-empty-state.md](./rules/04-quy-chuan-table-va-empty-state.md). **BẮT BUỘC dùng Table-Embedded Empty State**: Bảng rỗng vẫn render đầy đủ khung `<Table>` và `<TableHeader>`, render 1 dòng rỗng `colSpan` ở `<TableBody>` kèm icon `FolderOpen`. Tuyệt đối cấm render card tách rời ngoài bảng. Skeleton loading trong `TableBody`.
5. **Form, Dialog & Validation:** Đọc [rules/05-quy-chuan-form-va-dialog.md](./rules/05-quy-chuan-form-va-dialog.md). Zod Schema là Single Source of Truth; Hợp nhất Dialog Tạo mới và Chỉnh sửa thành 1 dialog; cấm icon trang trí trước FormLabel; xử lý `field.value ?? ""`.
6. **State Management & RTK Query:** Đọc [rules/06-quy-chuan-state-va-rtk-query.md](./rules/06-quy-chuan-state-va-rtk-query.md). Cấm lặp tiền tố `/api/v1`; Chuyển đổi phân trang 0-based (Backend) và 1-based (UI/URL); Hook `use<Feature>Filters` đồng bộ URL Search Params.
7. **Phân quyền & Tự kiểm thử (DoD):** Đọc [rules/07-quy-chuan-rbac-va-kiem-thu.md](./rules/07-quy-chuan-rbac-va-kiem-thu.md). 100% Tiếng Việt có dấu; Không ẩn tiệt nút hành động khỏi DOM; Trước khi bàn giao BẮT BUỘC chạy `.\cyclosa_fe\node_modules\.bin\tsc --project cyclosa_fe/tsconfig.json --noEmit` đạt mã thoát `0`.

---
*Đối chiếu trực tiếp với 2 module mẫu:*
- [src/app/(admin)/contracts/page.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/contracts/page.tsx)
- [src/app/(admin)/employees/page.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/employees/page.tsx)

