# Quy chuẩn 01: Kiến trúc Feature-Driven & Cấu trúc Thư mục Chuẩn cho Feature

> **Áp dụng cho:** Tất cả các phân hệ và lập trình viên / AI Agent khi phát triển trong `cyclosa_fe`.

---

## 1. Nguyên tắc Đóng gói Feature-Driven (Encapsulation)

Hệ thống Frontend `cyclosa_fe` được xây dựng theo mô hình **Feature-Driven Architecture** trên nền tảng Next.js 16 (App Router), TypeScript, Redux Toolkit / RTK Query, Tailwind CSS v4, và shadcn/ui.

- Mọi mã nguồn nghiệp vụ cụ thể của một phân hệ (ví dụ: `auth`, `authorization`, `organization`, `employees`, `attendance`, `leave`, `contracts`, `recruitment`, `onboarding`, `payroll`...) phải nằm gọn gàng bên trong thư mục `src/features/<feature-name>/`.
- Tầng `src/app/(admin)/<feature>/` chỉ đóng vai trò là **Page Container / Orchestrator**:
  - Trực tiếp kết nối URL Search Params thông qua custom hooks (`use<Feature>Filters`).
  - Gọi các query & mutation hooks của RTK Query (`useGet<Entities>Query`, `useUpdate...Mutation`).
  - Khởi tạo và điều phối các UI components con của feature (`Header`, `KPI Stats Cards`, `Filters`, `Table/Checklist`, `Form Dialogs`).
  - **NGHIÊM CẤM** tạo các wrapper component trung gian thừa thãi như `XxxManagementView`, `XxxPageView`, `XxxMainView` trong `src/features/<feature>/components/` chỉ để bọc lại toàn bộ trang. Việc này tạo thêm tầng indirection vô nghĩa và phân mảnh trách nhiệm điều phối của Page Container.

```
[src/app/(admin)/<feature>/page.tsx]  (Page Container / Orchestrator)
        |                     |                       |
        v                     v                       v
[use<Feature>Filters]   [RTK Query API Hooks]   [PermissionGuard]
        |                     |
        +----------+----------+
                   | (truyền state & handlers)
                   v
[src/features/<feature>/components/*] (Sub-components: Header, Stats, Filters, Table, Dialog...)
```

---

## 2. Cấu trúc Thư mục Toàn cục (`src/`)

```
src/
├── app/                        # Next.js App Router (Routes, Route Groups, Layouts)
│   ├── (auth)/                 # Route group xác thực (login, forgot-password)
│   ├── (admin)/                # Route group trang quản trị hệ thống
│   ├── api/                    # Route Handlers nội bộ (BFF nếu cần)
│   ├── layout.tsx              # Root Layout (Fonts, Providers, Toaster)
│   └── globals.css             # Tailwind v4 theme & base styles
├── components/                 # Shared Components dùng chung toàn app
│   ├── ui/                     # Primitives từ shadcn/ui (button, input, select, dialog...)
│   ├── common/                 # Reusable Business UI (data-pagination, confirm-modal...)
│   └── layout/                 # Layout Shell (header, sidebar, user-menu...)
├── config/                     # Configuration (env.ts, site.ts, navigation.ts)
├── features/                   # TẤT CẢ BUSINESS FEATURES NẰM TẠI ĐÂY
├── hooks/                      # Global Hooks (use-debounce, use-permission, use-media-query...)
├── lib/                        # Thư viện tiện ích (utils.ts, cn, date, formatters...)
├── store/                      # Redux Toolkit Root Configuration
│   ├── index.ts                # App Store, Root Reducer & Middleware setup
│   ├── base-api.ts             # RTK Query Base API với interceptor, auth & tenant header
│   └── slices/                 # Global UI / Auth slices (auth-slice.ts, layout-slice.ts)
└── types/                      # Global TypeScript definitions (api.types.ts, auth.types.ts...)
```

---

## 3. Cấu trúc Thư mục Chuẩn cho Một Feature (`src/features/<feature-name>/`)

Mọi feature khi khởi tạo **bắt buộc tuân thủ đúng 100% cấu trúc phân tầng** sau:

```
src/features/<feature-name>/
├── api/                                # RTK Query API endpoints inject vào baseApi
│   ├── <feature>-api.ts                # injectEndpoints({ endpoints: (builder) => ({...}) })
│   └── index.ts                        # (Optional) Export api hooks
├── components/                         # Các components UI riêng biệt của feature
│   ├── <feature>-page-header.tsx       # (Hoặc dùng chung) Header có icon + breadcrumbs
│   ├── <feature>-stats-cards.tsx       # Thẻ KPI thống kê số liệu đầu trang (4 cột)
│   ├── <feature>-filters.tsx           # Thanh bộ lọc 2 hàng (search + selects + reset)
│   ├── <feature>-table.tsx             # Bảng dữ liệu với table-embedded empty row & skeleton
│   ├── <feature>-columns.tsx           # Cấu hình TanStack Table ColumnDef (nếu dùng chung)
│   ├── <feature>-form-dialog.tsx       # Dialog gộp Create & Edit chung 1 form
│   ├── <feature>-detail.tsx            # Thành phần hiển thị chi tiết cho trang [id]
│   └── <feature>-<subpart>.tsx         # Sub-components chuyên biệt khác (badge, card con)
├── constants/                          # Hằng số, options danh mục, query keys, mapping nhãn
│   └── <feature>-constants.ts
├── hooks/                              # Custom hooks điều khiển state của feature
│   └── use-<feature>-filters.ts        # Hook đồng bộ filter, search, page lên URL
├── schemas/                            # Zod validation schemas (Single Source of Truth)
│   └── <feature>-schema.ts
├── types/                              # TypeScript interfaces / types nội bộ feature
│   └── <feature>-types.ts
├── utils/                              # Helper functions / formatters riêng của feature
│   └── <feature>-utils.ts
└── index.ts                            # Public Barrel Export của feature (xuất hooks, components, types)
```

### Mô tả trách nhiệm từng tệp trong Feature:
1. **`api/<feature>-api.ts`**:
   - Sử dụng `baseApi.injectEndpoints` để nạp endpoint vào Redux store.
   - Cung cấp query lấy danh sách (có phân trang 0-based), lấy chi tiết, và các mutations (create, update, delete).
   - Thiết lập `providesTags` và `invalidatesTags` chuẩn xác cho cache invalidation.
2. **`components/`**:
   - Từng component đảm nhận 1 nhiệm vụ duy nhất (Single Responsibility).
   - Component không tự ý fetch dữ liệu độc lập nếu dữ liệu đó cần chia sẻ; ưu tiên nhận data/handlers từ Page Container.
3. **`constants/<feature>-constants.ts`**:
   - Khai báo danh mục status, priority, loại hình thức, mapping màu badge, options cho dropdown.
4. **`hooks/use-<feature>-filters.ts`**:
   - Đọc các param từ URL bằng `useSearchParams`.
   - Cung cấp các hàm cập nhật bộ lọc bằng `router.push(..., { scroll: false })`.
   - Tự động debounce từ khóa tìm kiếm (300ms - 500ms).
   - Tự động reset về trang 1 khi người dùng thay đổi filter hoặc từ khóa tìm kiếm.
5. **`schemas/<feature>-schema.ts`**:
   - Khai báo Zod Schema cho dữ liệu tạo mới / cập nhật.
   - Xuất TypeScript Type bằng `z.infer<typeof schema>`.
   - Thông báo validate bằng Tiếng Việt có dấu chuẩn mực.
6. **`types/<feature>-types.ts`**:
   - DTOs từ Backend, enum định nghĩa, response shapes, payload requests.
7. **`index.ts` (Barrel Export)**:
   - File xuất công khai để các trang trong `src/app/(admin)/` import nhanh chóng:
     ```typescript
     export * from "./api/<feature>-api";
     export * from "./components/<feature>-filters";
     export * from "./components/<feature>-table";
     export * from "./hooks/use-<feature>-filters";
     export * from "./types/<feature>-types";
     ```

---

## 4. Quy chuẩn Routing cho Feature (Next.js 16 App Router)

Mỗi feature quản trị thường có cấu trúc route tương ứng trong `src/app/(admin)/<feature>/`:

1. **Trang danh sách chính:**
   `src/app/(admin)/<feature>/page.tsx` $\rightarrow$ URL: `/<feature>`
2. **Trang tạo mới (khi form phức tạp nhiều bước):**
   `src/app/(admin)/<feature>/new/page.tsx` $\rightarrow$ URL: `/<feature>/new`
   *(Nếu form đơn giản: ưu tiên sử dụng Dialog `<Feature>FormDialog` trực tiếp tại trang danh sách).*
3. **Trang xem chi tiết:**
   `src/app/(admin)/<feature>/[id]/page.tsx` $\rightarrow$ URL: `/<feature>/[id]`
4. **Trang chỉnh sửa chuyên sâu (khi không dùng dialog):**
   `src/app/(admin)/<feature>/[id]/edit/page.tsx` $\rightarrow$ URL: `/<feature>/[id]/edit`

### Lưu ý bắt buộc trong Next.js 16 với Dynamic Params:
Next.js 16 yêu cầu khai báo `params` và `searchParams` dưới dạng **Promise**:
```tsx
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FeatureDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  // Dùng id để fetch dữ liệu qua hook RTK Query
  const { data, isLoading } = useGetFeatureByIdQuery(id);
  ...
}
```

