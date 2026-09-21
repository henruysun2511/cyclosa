# CODING GUIDE — Next.js Products

Hướng dẫn cách viết code và bày trí code theo đúng quy ước của project.
Đọc tài liệu này **trước khi viết bất kỳ dòng code mới nào**. Code mới phải
khớp với các quy ước bên dưới, đã có sẵn trong codebase.

---

## 1. Tổng quan Stack

| Thành phần | Vai trò |
|---|---|
| Next.js 15 (App Router) | Server components, routing, metadata |
| RTK Query | Server state: fetch, cache, mutation, invalidate theo tag |
| Redux Toolkit | UI state thuần: auth, ui flags |
| Zod | Schema validation **+ sinh TypeScript types** |
| React Hook Form + zodResolver | Forms |
| TanStack Table | Bảng dữ liệu (`DataTable`) |
| shadcn/ui + Tailwind | Component & styling |
| fetchBaseQuery | HTTP layer (gắn Bearer token, auto refresh 401) |

---

## 2. Cấu trúc thư mục (Feature-Sliced)

```
src/
├── app/                     # Routing (App Router)
│   ├── layout.tsx           # Root layout (server)
│   ├── providers.tsx        # Client providers (Redux, Toaster)
│   ├── (auth)/              # Route group: trang auth (login)
│   └── (dashboard)/         # Route group: trang có sidebar + auth check
│       └── products/        # page.tsx, new/, [id]/, [id]/edit/
├── components/
│   ├── common/              # Component dùng chung, không phụ thuộc feature
│   └── ui/                  # shadcn/ui (không sửa tay trừ khi cần)
├── config/                  # env.ts — đọc biến môi trường tập trung
├── features/                # Module theo feature
│   └── products/
│       ├── api/             # RTK Query endpoints
│       ├── components/      # Component của riêng feature
│       ├── constants/       # Nhãn / options / variants
│       ├── hooks/           # Hook riêng của feature
│       ├── schemas/         # Zod schemas (nguồn sự thật)
│       ├── types/           # Types (infer từ schema)
│       └── utils/           # Hàm thuần của feature
├── lib/                     # Tiện ích dùng chung (api base, utils)
├── store/
│   ├── slices/              # Redux slices
│   ├── hooks.ts             # useAppDispatch / useAppSelector (typed)
│   ├── index.ts             # makeStore + RootState / AppDispatch
│   └── provider.tsx         # Client Provider
└── types/                   # Types dùng chung toàn app
```

**Nguyên tắc quan trọng:**
- Feature ôm trọn mọi thứ của nó: `api / components / hooks / schemas /
  types / constants / utils`. Xóa feature = xóa một folder.
- Component dùng chung cho nhiều feature → `components/common/`.
- Không import từ `features/A/...` vào `components/common/` (tránh phụ thuộc
  ngược — ngoại lệ duy nhất trong codebase hiện có là `data-pagination.tsx`
  import constant page size từ features/products).

---

## 3. Quy ước tên file & symbol

| Thứ | Quy ước | Ví dụ |
|---|---|---|
| File | kebab-case | `product-form.tsx`, `data-table.tsx` |
| Component / function | PascalCase | `ProductForm`, `DataTable` |
| Component file | file kebab-case + export PascalCase | `product-form.tsx` → `ProductForm` |
| Hook | `use` + PascalCase | `useProductFilters` |
| Slice | camelCase + `.slice.ts` | `auth.slice.ts` |
| Schema | camelCase + `.schema.ts` | `product.schema.ts` |
| API feature | camelCase + `.api.ts` | `product-api.ts` |
| Constants | camelCase + `.constants.ts` | `product.constants.ts` |
| Types | camelCase + `.types.ts` | `product.types.ts` |
| Utils | camelCase + `.utils.ts` | `product.utils.ts` |

- **Luôn dùng named export** cho component, hàm, hook.
- **Chỉ** file page của Next.js dùng `default export`.
- Props interface đặt tên `XxxProps`, khai báo ngay phía trên component.

---

## 4. Bày trí code trong file

Thứ tự chuẩn của một file component:

```tsx
// 1. "use client" — chỉ khi cần hook / interaction; là dòng ĐẦU TIÊN
"use client";

// 2. Imports, đúng thứ tự:
//    a. Node modules / libs ngoài (react, next, lucide-react, react-hook-form...)
//    b. @/components/ui/...            (shadcn)
//    c. @/components/common/...
//    d. @/lib/..., @/types/..., @/store/..., @/config/...
//    e. Đường dẫn tương đối trong feature (./..., ../api, ../schemas, ../types)

// 3. Interface props — ngay TRÊN component mà nó mô tả
interface ProductFormProps {
  title: string;
}

// 4. Component + export
export function ProductForm({ title }: ProductFormProps) {
  // 5. Bên trong component — theo thứ tự:
  //    hooks trước → handlers (handleX) → JSX
  const form = useForm(/* ... */);
  const handleSubmit = async () => { /* ... */ };

  return <div>{/* JSX */}</div>;
}
```

### Thứ tự import cụ thể (mẫu chuẩn từ `product-form.tsx`)

```tsx
import { useForm } from "react-hook-form";                    // 1. libs
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";              // 2. ui
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PRODUCT_STATUS_OPTIONS } from "../constants/product.constants"; // 3. feature-relative
import { createProductSchema } from "../schemas/product.schema";
import type { CreateProductInput } from "../types/product.types";
```

### Section comment

Nhóm code theo chủ đề bằng comment ngăn cách dạng `// ── Tiêu đề ──...`
(dùng trong API files, schema, page — xem `product-api.ts`, `base-api-rtk.ts`,
`products/page.tsx`):

```ts
// ── GET /products (list + filter + pagination) ───────────────
// ── Mutations ────────────────────────────────────────────────
```

Trong page có nhiều thành phần, ghi rõ từng nhóm:
`// ── Data fetching ──`, `// ── Mutations ──`, `// ── Handlers ──`.

### Format chung

- Indent 2 spaces, **không semicolon**, **single quote** cho chuỗi TS,
  dòng dài thì xuống dòng (print width ~80–100).
- Import type dùng từ khóa `type` rõ ràng: `import type { Product } from "..."`.
- Import shadcn dài thì gộp nhiều phần tử trong `{ }` và để nhiều dòng.

---

## 5. Zod là nguồn sự thật duy nhất (Types)

**Không** viết TS interface trùng lặp cho dữ liệu API. Sinh type từ schema:

```ts
// features/products/schemas/product.schema.ts
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number(),
  status: z.enum(["active", "inactive", "draft"]),
  createdAt: z.string().datetime(),
});

// features/products/types/product.types.ts
import type { z } from "zod";
import type { productSchema } from "../schemas/product.schema";

export type Product = z.infer<typeof productSchema>;
```

Quy ước:
- **Base schema** (`productSchema`) mô tả shape trả về từ API.
- **Form schema** (`createProductSchema`, `updateProductSchema`) mô tả input form,
  kèm message lỗi tiếng Việt (`msg` inline trong từng rule).
- `updateProductSchema = createProductSchema.partial()`.
- Types chỉ chứa: infer từ schema + type UI bổ sung (không thuộc schema),
  ví dụ `ProductTableRow`, `LoginInput`.

---

## 6. API với RTK Query

Mỗi feature có một file `features/<x>/api/<x>.api.ts` dùng `baseApi.injectEndpoints`
(từ `lib/api/base-api-rtk.ts` — nơi quản lý Bearer token + auto refresh khi 401).

Quy tắc bắt buộc:

```ts
import { baseApi } from "@/lib/api/base-api-rtk";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Query lấy danh sách — kết hợp filter/pagination từ params
    getProducts: builder.query<PaginatedResponse<Product>, Partial<ProductFilterParams>>({
      query: (params = {}) => ({ url: `/products?${buildQueryString(params)}`, method: "GET" }),
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }) => ({ type: "Product" as const, id })),
             { type: "Product", id: "LIST" }]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Mutation — invalidate đúng tag để cache tự refresh
    updateProduct: builder.mutation<Product, { id: string; body: UpdateProductInput }>({
      query: ({ id, body }) => ({ url: `/products/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }, { type: "Product", id: "LIST" }],
    }),
  }),
  overrideExisting: false,   // KHÔNG đổi thành true
});

export const { useGetProductsQuery, useUpdateProductMutation } = productApi;
```

Quy tắc:
- Bọc response API bằng `transformResponse: (r: ApiResponse<T>) => r.data` (unwrap lớp `data`).
- `providesTags` đánh dấu dữ liệu, `invalidatesTags` khi mutation → auto re-fetch.
- Tag list luôn kèm `id: "LIST"` cho danh sách, và `id` cụ thể cho từng item.
- Export hook dạng `useGetXQuery` / `useXMutation` ở cuối file.

---

## 7. Store & Redux

- Chỉ đưa vào Redux những thứ **thuần UI / toàn cục** (auth tokens, sidebar,
  toast). Dữ liệu server → RTK Query, không lưu duplicate.
- Slice khai báo trong `store/slices/`, export cả `reducer` lẫn `actions`.
- **Import hook typed từ `@/store/hooks`**, không dùng `useDispatch`/`useSelector`
  thô:
  ```ts
  import { useAppDispatch, useAppSelector } from "@/store/hooks";
  ```
- Đăng ký slice vào `makeStore()` trong `store/index.ts`.
- `StoreProvider` (client) bọc ở `app/providers.tsx` → root layout.

---

## 8. Component conventions

**Client vs Server component:**
- Cần hook (`useState`, `useSearchParams`, `useForm`, `useMutation`...) →
  ghi `"use client"` làm dòng đầu tiên.
- Chỉ hiển thị tĩnh (badge, detail đơn giản) → server component, không cần directive.

**Đặt chung hay riêng feature:**
- `components/common/`: generic, tái dùng (`DataTable`, `DataPagination`,
  `PageHeader`, `ConfirmDialog`, `EmptyState`, `ErrorState`).
- `features/<x>/components/`: dành riêng cho feature (`product-form`,
  `product-columns`, `product-filters`...).
- `components/ui/` là shadcn — đừng sửa logic chính, chỉ thêm khi `npx shadcn:add`.

**Props & JSX:**
- Dùng interface `XxxProps` khai báo trước component; các props bắt buộc phải có,
  props tùy chọn không cần default (gán default trong destructuring nếu cần).
- Variant dùng **discriminated union** (xem `ProductFormProps` create/edit).
- Icon lucide: `import { Loader2, Plus } from "lucide-react"`, dùng `.h-4 w-4` theo
  kích thước shadcn, kèm `animate-spin` khi loading.
- Text UI **tiếng Việt có dấu** (nhãn, placeholder, toast, error).
- Class động dùng template string hoặc `cn()` từ `@/lib/utils` (xem
  `ConfirmDialog` dùng `cn(buttonVariants({ variant }), "min-w-24")`).

**Common components (cách dùng có sẵn trong codebase):**
- `PageHeader` — title + description + action.
- `DataTable` — columns (TanStack) + data + `isLoading` (tự render skeleton).
- `DataPagination` — `meta` + `onPageChange` + `onPageSizeChange`.
- `ConfirmDialog` — open + onOpenChange + title/description + `isLoading`.
- `EmptyState` / `ErrorState` — khối rỗng / lỗi với `onRetry`.

---

## 9. Pages (App Router)

- Page là **client component** khi có interaction / query:
  ```tsx
  "use client";
  export default function ProductsPage() { ... }
  ```
- Page tĩnh (login) → server component, export `metadata`:
  ```tsx
  export const metadata: Metadata = { title: "Đăng nhập" };
  ```
- Cấu trúc page chuẩn (xem `products/page.tsx`):
  1. `PageHeader` (title, description, action button → `Link`).
  2. Component filter (`ProductFilters`).
  3. Loading / Error handling: `isLoading` → skeleton (hoặc `DataTable` tự lo),
     `isError` → `<ErrorState error={error} onRetry={refetch} />`.
  4. Data: `DataTable` + `DataPagination`.
  5. Mutation: confirm dialog + `toast` success/error, rồi `router.push`.
- Dynamic route: nhận `params: { id: string }`.
- `layout.tsx` của route group `(dashboard)` là **server component** kiểm tra
  session (redirect) và vẽ sidebar/main.

---

## 10. Forms (React Hook Form + Zod)

```tsx
const form = useForm<CreateProductInput>({
  resolver: zodResolver(createProductSchema),   // schema = nguồn validate
  defaultValues: { name: "", status: "draft" },
});
```

- Dùng `<FormField control={form.control} name="..." render={...}>` từ shadcn
  (mỗi field: FormItem → FormLabel → FormControl → FormMessage).
- Field số (`price`, `stock`): `onChange={(e) => field.onChange(Number(e.target.value))}`.
- Field select: `<Select onValueChange={field.onChange} defaultValue={field.value}>`.
- Nút submit: disable khi `isLoading`; hiện `<Loader2 className="mr-2 h-4 w-4 animate-spin" />`.
- Submit handler là `async`, gọi mutation `.unwrap()`, toast thành công/callback
  trong try, toast lỗi trong catch.

---

## 11. Filter state trong URL (pattern bắt buộc)

Filters không lưu trong Redux/local state — lưu trong **URL search params** để
share được, an toàn với nút back, và validate bằng Zod:

```ts
// features/products/hooks/use-product-filters.ts
const filters = productFilterSchema.parse(Object.fromEntries(searchParams.entries()));
const updateFilters = (updates) => router.push(`${pathname}?${params.toString()}`, { scroll: false });
```

- Parse URL params qua cùng schema dùng cho API (defaults page=1, limit=10...).
- Khi đổi filter bất kỳ → tự reset `page=1` (trừ khi đổi chính `page`).
- Hàm đổi filter có `"use client"`, dùng `useDebouncedCallback` cho ô search
  (`use-debounce`, 400ms).

---

## 12. Utils & format chuẩn

Dùng các hàm có sẵn trong `src/lib/utils.ts` — không viết lại:
- `cn(...)` — merge class (clsx + tailwind-merge).
- `formatCurrency(amount)` — định dạng **VND** (vi-VN).
- `formatDate(date)` — định dạng **DD/MM/YYYY** (vi-VN).
- `buildQueryString(params)` — build query URL từ object, tự bỏ giá trị
  `undefined / null / ""` (dùng trong API query).
- `getErrorMessage(error)` — extract message an toàn từ unknown.

Hàm riêng của feature → `features/<x>/utils/` (nơi dùng các format trên, ví dụ
`toProductTableRow`, `getProductStatusLabel`). Hằng số và nhãn hiển thị →
`features/<x>/constants/` dạng `Record` (`PRODUCT_STATUS_LABELS`,
`PRODUCT_STATUS_VARIANTS`, `..._OPTIONS`).

---

## 13. Checklist — thêm 1 feature mới

1. Tạo `src/features/<tên>/` với đủ: `api/ components/ hooks/ schemas/ types/
   constants/ utils/`.
2. Viết **Zod schema trước**, `z.infer` ra types — không duplicate type.
3. Khai báo endpoint trong `<tên>.api.ts` (có `transformResponse`, tags,
   export hooks). Đăng ký tag type (nếu mới) vào `base-api-rtk.ts`.
4. Viết component theo mẫu: `"use client"` (nếu cần) → import đúng thứ tự →
   interface props → component; dùng common components khi được.
5. Page: fetch query → loading/error/data/empty đầy đủ; mutation kèm
   toast + confirm dialog + redirect.
6. Check format: indent 2 spaces, no semicolon, single quote, tiếng Việt có dấu,
   section comment `// ── ... ──`.
7. Chạy `npm run lint` (và `tsc --noEmit` nếu có) trước khi kết luận.

---

## 14. Anti-patterns (tránh làm)

- ❌ Import `useDispatch`/`useSelector` thô — dùng `useAppDispatch`/
  `useAppSelector` typed.
- ❌ Tự gọi `fetch`/`axios` ở component — đi qua RTK Query + `baseApi`
  (có sẵn token + refresh + error normalize).
- ❌ Viết 2 bảng type cho cùng 1 entity (schema vs interface) — chỉ schema.
- ❌ Lưu dữ liệu server vào Redux slice.
- ❌ Filter state trong local `useState` (mất back-button/share) — dùng URL params.
- ❌ `overrideExisting: true` trên `injectEndpoints`.
- ❌ Sửa tay file trong `components/ui/`.
- ❌ Viết chuỗi tiếng Anh cho UI — dùng tiếng Việt có dấu như toàn codebase.