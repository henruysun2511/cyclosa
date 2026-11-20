# Quy chuẩn 06: Tiêu chuẩn State Management, RTK Query & Đồng bộ URL Params

> **Module chuẩn mực đối chiếu:**
> - [src/features/contract/api/contract-api.ts](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/contract/api/contract-api.ts)
> - [src/features/contract/hooks/use-contract-filters.ts](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/contract/hooks/use-contract-filters.ts)

---

## 1. RTK Query Endpoint Injection & Tiền tố URL

Mọi API phân hệ được định nghĩa bằng `baseApi.injectEndpoints` trong `src/features/<feature>/api/<feature>-api.ts`.

### ⚠️ Quy tắc Vàng: Tuyệt đối không lặp tiền tố `/api/v1`
Biến môi trường `API_BASE_URL` đã cấu hình sẵn tiền tố phiên bản API: `http://localhost:8080/api/v1`.
- ❌ Sai: `url: "/api/v1/job-openings"` $\rightarrow$ Sẽ sinh ra lỗi gọi vào `http://localhost:8080/api/v1/api/v1/job-openings` (HTTP 404).
- ✅ Đúng: Chỉ truyền đường dẫn tương đối: `url: "/job-openings"`, `url: "/contracts"`, `url: "/employees"`.

```typescript
import { baseApi } from "@/store/base-api";
import { ApiResponse, PageData } from "@/types/api.types";
import { JobOpeningDto, JobOpeningFilters, CreateJobOpeningPayload } from "../types";

export const recruitmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobOpenings: builder.query<ApiResponse<PageData<JobOpeningDto>>, JobOpeningFilters>({
      query: (params) => ({
        url: "/job-openings",
        method: "GET",
        params: {
          ...params,
          // BẮT BUỘC: Chuyển đổi 1-based UI page sang 0-based Backend page
          page: params.page ? params.page - 1 : 0,
        },
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "JobOpening" as const, id })),
              { type: "JobOpening", id: "LIST" },
            ]
          : [{ type: "JobOpening", id: "LIST" }],
    }),

    createJobOpening: builder.mutation<ApiResponse<JobOpeningDto>, CreateJobOpeningPayload>({
      query: (body) => ({
        url: "/job-openings",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "JobOpening", id: "LIST" }],
    }),
  }),
});

export const {
  useGetJobOpeningsQuery,
  useCreateJobOpeningMutation,
} = recruitmentApi;
```

---

## 2. Quy tắc Chuyển đổi Phân trang 0-based & 1-based

Backend Spring Boot của CYCLOSA sử dụng **0-based pagination** (`0` là trang đầu tiên), trong khi người dùng và trình duyệt URL luôn sử dụng **1-based** (`1` là trang đầu tiên).

1. **Phía URL Search Params & UI:**
   - URL luôn hiển thị `?page=1`, `?page=2`...
   - Người dùng bấm trang số `1` thì param trên URL là `page=1`.
2. **Phía Client gọi API (RTK Query):**
   - Bắt buộc trừ đi 1 trước khi gửi request:
     $$\text{backendPage} = \text{uiPage} - 1 \quad (\text{với } \text{uiPage} \ge 1)$$
     ```typescript
     page: params.page ? params.page - 1 : 0
     ```
3. **Phía Nhận Dữ Liệu & Hiển thị DataPagination:**
   - Backend trả về `data.pagination.page` (0-based) $\rightarrow$ cộng lại 1 khi truyền vào component:
     ```tsx
     <DataPagination
       page={pagination.page + 1}
       totalPages={pagination.pages}
       onPageChange={setPage}
     />
     ```

---

## 3. Hook Đồng bộ Bộ lọc lên URL (`use<Feature>Filters`)

Mọi trang danh sách có bộ lọc phải sử dụng Custom Hook để đồng bộ trạng thái lên URL Search Params:

```typescript
export function useJobOpeningFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";
  const departmentId = searchParams.get("departmentId") || "ALL";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce 400ms cho ô tìm kiếm từ khóa
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const updateUrl = useCallback(
    (params: Record<string, string | number | undefined | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      Object.entries(params).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || val === "ALL") {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });

      router.push(`?${current.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const setSearch = (val: string) => updateUrl({ search: val, page: 1 });
  const setStatus = (val: string) => updateUrl({ status: val, page: 1 });
  const setDepartmentId = (val: string) => updateUrl({ departmentId: val, page: 1 });
  const setPage = (val: number) => updateUrl({ page: val });
  const resetFilters = () => router.push("?", { scroll: false });

  return {
    search,
    debouncedSearch,
    status,
    departmentId,
    page,
    size,
    setSearch,
    setStatus,
    setDepartmentId,
    setPage,
    resetFilters,
  };
}
```

### Nguyên tắc bắt buộc của Filter Hook:
- **Tự động đưa về Trang 1:** Khi người dùng đổi từ khóa tìm kiếm hoặc đổi giá trị filter, bắt buộc phải reset `page = 1`.
- **F5 / Chia sẻ link không mất state:** Khi người dùng sao chép đường link gửi cho người khác hoặc F5 lại trang, toàn bộ điều kiện lọc và trang hiện tại phải được giữ nguyên vẹn.

---

## 4. Quy chuẩn Kiểm tra Kết nối API & Xử lý Toàn diện 4 Trạng thái Dữ liệu

### ⚠️ Làm sao Biết API Gọi Được Chưa hay Bị Lỗi?
1. **Kiểm tra Tab Network (DevTools F12):**
   - Lọc `Fetch/XHR`. Mọi request phải trả về mã `200 OK` hoặc `201 Created` kèm body chuẩn `ApiResponse<T>`.
   - Nếu mã `404 Not Found`: Kiểm tra xem có bị **lặp tiền tố `/api/v1`** (thành `/api/v1/api/v1/...`) hay sai chính tả URL endpoint không.
   - Nếu mã `ERR_CONNECTION_REFUSED`: Backend Spring Boot chưa chạy trên cổng `8080` hoặc chưa khởi động xong.
   - Nếu mã `401 Unauthorized`: Token đăng nhập hết hạn hoặc chưa đính kèm Bearer Header.
   - Nếu mã `403 Forbidden`: Người dùng hiện tại thiếu Permission tương ứng.
2. **Tuyệt đối Không Nuốt Lỗi (No Silent Errors):**
   Nếu API bị lỗi kết nối hoặc backend trả mã lỗi 500/400, **TUYỆT ĐỐI KHÔNG** để màn hình trắng tinh hoặc bảng trống không có phản hồi, khiến người dùng lầm tưởng hệ thống không có dữ liệu!

---

### ✅ Xử lý Chuẩn 4 Trạng thái của RTK Query trong Component:

Mọi component danh sách gọi API phải bọc đủ **4 trạng thái**:

```tsx
export function ShiftListTable() {
  const { data, isLoading, isError, error, refetch } = useGetShiftsQuery(cleanParams);

  // Trạng thái 1: Đang tải dữ liệu -> Bắt buộc Skeleton hàng bảng
  if (isLoading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  // Trạng thái 2: Lỗi kết nối / Lỗi server -> Hiển thị Error State kèm nút Thử lại
  if (isError) {
    const errorMsg = (error as any)?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền.";
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
        <p className="text-sm font-medium text-destructive">Lỗi tải dữ liệu</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">{errorMsg}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Thử lại</span>
        </Button>
      </div>
    );
  }

  const items = data?.data?.items || [];

  // Trạng thái 3: Dữ liệu rỗng -> Table-Embedded Empty State theo Rule 04
  if (items.length === 0) {
    return (
      <Table>
        <TableHeader>...</TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-48 text-center text-muted-foreground text-xs">
              <Inbox className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
              Không tìm thấy dữ liệu ca làm việc phù hợp.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  // Trạng thái 4: Tải thành công -> Render dữ liệu bình thường
  return (
    <Table>
      <TableHeader>...</TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>...</TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

### ✅ Quy tắc Bắt buộc với RTK Query Mutations (Thêm / Sửa / Xóa / Phê duyệt):
Mọi hành động gọi Mutation phải dùng `.unwrap()` bên trong khối `try / catch`:
```typescript
try {
  await createShift(payload).unwrap();
  toast.success("Thêm mới ca làm việc thành công");
  setIsDialogOpen(false);
} catch (err: any) {
  // Trích xuất thông báo lỗi chính xác từ backend ApiResponse
  const message = err?.data?.message || "Có lỗi xảy ra trong quá trình lưu dữ liệu";
  toast.error(message);
}
```


