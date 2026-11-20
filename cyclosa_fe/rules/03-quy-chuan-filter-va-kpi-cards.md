# Quy chuẩn 03: Tiêu chuẩn Bộ lọc (Filter Bar) & Thẻ Thống kê (KPI Cards)

> **Module chuẩn mực đối chiếu:**
> - [src/features/contract/components/contract-filters.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/contract/components/contract-filters.tsx)
> - [src/features/contract/components/contract-stats-cards.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/contract/components/contract-stats-cards.tsx)
> - [src/features/employee/components/employee-stats-cards.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/employee/components/employee-stats-cards.tsx)

---

## 1. Tiêu chuẩn Bố cục Thanh Bộ lọc (Filter Bar 2 hàng)

Mọi thanh lọc danh sách phải được đóng gói thành component `<Feature>Filters` đặt trong card chuẩn bo góc, viền mờ và phân tách rõ ràng thành **2 hàng**:

```tsx
<div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
  {/* Hàng 1: Ô nhập tìm kiếm từ khóa chính */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Tìm kiếm theo mã, họ tên, từ khóa..."
      className="pl-9 text-sm h-9 bg-background"
    />
  </div>

  {/* Hàng 2: Các Dropdown bộ lọc theo trường + Nút Đặt lại */}
  <div className="flex flex-wrap items-center gap-3">
    {/* Nhóm Filter 1 */}
    <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
      <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs font-medium text-muted-foreground shrink-0">Phòng ban:</span>
      <Select value={departmentId} onValueChange={onDepartmentChange}>
        <SelectTrigger className="h-8 text-xs bg-background flex-1">
          <SelectValue placeholder="Tất cả phòng ban" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Nhóm Filter 2 */}
    <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
      <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="h-8 text-xs bg-background flex-1">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Nút Đặt lại (Reset) */}
    <Button
      variant="ghost"
      size="sm"
      onClick={onReset}
      className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
    >
      <X className="h-3.5 w-3.5 mr-1" />
      <span>Đặt lại</span>
    </Button>
  </div>
</div>
```

### Các nguyên tắc vàng của Filter Bar:
1. **Dropdown dùng shadcn/ui Select:** Bắt buộc import `{ Select, SelectTrigger, SelectValue, SelectContent, SelectItem }` từ `@/components/ui/select`. **TUYỆT ĐỐI CẤM** dùng thẻ `<select>` thô của HTML.
2. **Luôn có tùy chọn "Tất cả":** Mục đầu tiên của mỗi Select phải là giá trị đại diện cho việc không lọc (thường là `"ALL"` hoặc chuỗi rỗng `""`), nhãn hiển thị `"Tất cả [tên trường]"`.
3. **Nút "Đặt lại":** Luôn xuất hiện ở cuối hàng 2 để người dùng xóa nhanh tất cả tiêu chí lọc và đưa trang về trạng thái mặc định ban đầu.

---

## 2. Tiêu chuẩn Thẻ Thống kê KPI (Stats Cards) - BẮT BUỘC CHUẨN CYCLOSA 100%

> **CẢNH BÁO:** TUYỆT ĐỐI KHÔNG dùng thẻ `<Card>`, `<CardHeader>`, `<CardTitle>` thô sơ với icon nhỏ góc phải. Tất cả các module BẮT BUỘC tuân thủ cấu trúc chuẩn mực với Icon Box `h-12 w-12` + Sparkline SVG + Click tương tác lọc danh sách như `contract-stats-cards.tsx` và `employee-stats-cards.tsx`.

Đầu mỗi trang danh sách quản trị lớn (Nhân sự, Hợp đồng, Thôi việc, Hiệu suất, Khen thưởng, Chấm công, Kỳ lương), hiển thị khối thẻ thống kê KPI 4 cột:

```tsx
interface FeatureStatsCardsProps {
  stats?: FeatureStatistics;
  items?: FeatureItem[];
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
  isLoading?: boolean;
}

export function FeatureStatsCards({
  stats,
  items,
  selectedStatus,
  onFilterStatus,
  isLoading,
}: FeatureStatsCardsProps) {
  const cards = [
    {
      key: "ALL",
      label: "Tổng hồ sơ",
      count: stats?.total ?? items?.length ?? 0,
      icon: Users,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "ACTIVE",
      label: "Đang hiệu lực / Đang mở",
      count: stats?.activeCount ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      key: "PENDING",
      label: "Chờ phê duyệt",
      count: stats?.pendingCount ?? 0,
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "COMPLETED",
      label: "Đã hoàn tất",
      count: stats?.completedCount ?? 0,
      icon: ShieldCheck,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedStatus && item.key === "ALL") ||
          selectedStatus === item.key;

        return (
          <div
            key={item.key}
            onClick={() => {
              if (!onFilterStatus) return;
              if (item.key === "ALL") {
                onFilterStatus(selectedStatus === "ALL" ? undefined : "ALL");
              } else {
                onFilterStatus(selectedStatus === item.key ? "ALL" : item.key);
              }
            }}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:shadow-md"
            )}
          >
            {/* Cột trái: Icon Box lớn + Label + Số đếm */}
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                  {isLoading ? "..." : item.count}
                </h3>
              </div>
            </div>

            {/* Cột phải: Sparkline SVG */}
            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### Các nguyên tắc vàng của Stats Cards CYCLOSA:
1. **Khối biểu tượng nhận diện (Icon Box):** Kích thước bắt buộc `h-12 w-12 rounded-xl`, icon bên trong `h-6 w-6`, nền màu thương hiệu đặc sắc và chữ trắng (`bg-primary text-white`, `bg-emerald-600 text-white`, `bg-amber-500 text-white`, `bg-blue-600 text-white`, `bg-purple-600 text-white`, `bg-slate-600 text-white`). Hiệu ứng hover: `group-hover:scale-105`.
2. **Đồ thị Sparkline SVG:** Bắt buộc có ở góc phải kích thước `h-9 w-20`, dùng thẻ `<svg viewBox="0 0 100 45">` và `<path>` với màu `stroke` tương ứng trạng thái.
3. **Tương tác click lọc danh sách (Interactive Filter):** Bắt buộc hỗ trợ prop `onFilterStatus` và `selectedStatus`. Click vào thẻ sẽ kích hoạt lọc theo trạng thái đó trên bảng và tự động đưa `page` về `1`. Click lại thẻ đang chọn sẽ bỏ lọc (quay về `ALL`).
4. **Trạng thái Active/Selected:** Khi đang được chọn, thẻ phải có viền sáng `border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm`.
5. **Số liệu lớn font mono:** Số lượng hiển thị bằng class `text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5`. Số liệu phải được tính toán trên toàn bộ bản ghi (không bị cắt vụn bởi phân trang).

---

## 3. Quy chuẩn Phòng chống Hiển thị Tiếng Anh trong Thẻ `<Select>`

### ⚠️ Nguyên nhân Gây Lỗi Hiển thị Tiếng Anh:
Trong `@base-ui/react/select` hoặc `shadcn/ui`, component `<SelectValue>` tìm kiếm nhãn trong danh sách `<SelectItem>` có `value` trùng khớp với prop `value` của `<Select>`.
Lỗi hiển thị tiếng Anh xảy ra khi:
1. **Lệch giá trị hoặc thiếu option:** Truyền `value="ALL"`, `value="PENDING"` hoặc chuỗi viết thường `active`, nhưng trong `<SelectContent>` không có `<SelectItem value="...">` nào khớp chính xác $\to$ Base-UI tự động fallback hiển thị nguyên chuỗi string tiếng Anh thô của value!
2. **Thiếu từ điển Việt hóa:** Lập trình viên viết trực tiếp `<SelectItem value="PENDING">PENDING</SelectItem>` hoặc không khai báo nhãn hiển thị tiếng Việt.
3. **Giá trị khởi tạo rỗng (`""` hoặc `undefined`):** Nhưng placeholder không được chỉ định hoặc bị ghi đè.

### ✅ Quy tắc Vàng Bắt buộc:
1. **Bắt buộc khai báo Từ điển Việt hóa (Localization Map):**
   Mọi Enum trạng thái, phân loại đều phải có một map hằng số rõ ràng:
   ```typescript
   export const SHIFT_STATUS_MAP: Record<string, string> = {
     ALL: "Tất cả trạng thái",
     ACTIVE: "Đang kích hoạt",
     INACTIVE: "Ngừng kích hoạt",
   };

   export const GENDER_MAP: Record<string, string> = {
     ALL: "Tất cả giới tính",
     MALE: "Nam",
     FEMALE: "Nữ",
     OTHER: "Khác",
   };
   ```

2. **Luôn có `<SelectItem value="ALL">` với nhãn Tiếng Việt rõ ràng:**
   ```tsx
   <Select value={status} onValueChange={onStatusChange}>
     <SelectTrigger className="h-8 text-xs">
       <SelectValue placeholder="Tất cả trạng thái" />
     </SelectTrigger>
     <SelectContent>
       <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
       <SelectItem value="PENDING">Chờ phê duyệt</SelectItem>
       <SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
       <SelectItem value="REJECTED">Đã từ chối</SelectItem>
     </SelectContent>
   </Select>
   ```

3. **Fallback An toàn khi hiển thị Value:**
   Khi render nhãn từ value trong bảng hoặc thẻ Badge, luôn dùng hàm chuyển đổi an toàn có fallback tiếng Việt:
   ```typescript
   export function getStatusLabel(status: string | undefined): string {
     if (!status || status === "ALL") return "Tất cả trạng thái";
     return STATUS_MAP[status] || status;
   }
   ```

---

## 4. Quy chuẩn Bẫy lỗi & Tối ưu Bộ lọc (Filter Bugs Prevention)

### ⚠️ 3 Lỗi Phổ biến Khiến Bộ lọc Hoạt động Sai:
1. **Không reset trang về 1 khi đổi tiêu chí lọc:** Người dùng đang ở trang 3, khi gõ tìm kiếm thì URL vẫn giữ `page=3` $\to$ Backend trả về 0 bản ghi (vì kết quả mới chỉ có 1 trang) $\to$ Người dùng tưởng hệ thống không có dữ liệu!
2. **Không Debounce ô tìm kiếm:** Gõ từng chữ gửi request liên tục làm nghẽn mạng và sinh lỗi race condition (kết quả request trước trả về sau đè lên kết quả mới nhất).
3. **Gửi chuỗi `"ALL"` hoặc chuỗi rỗng `""` lên Backend:** Spring Data JPA Specification sẽ tìm kiếm chính xác `WHERE status = 'ALL'` hoặc `department_id = ''` $\to$ Trả về kết quả rỗng!

### ✅ Quy tắc Xử lý Bắt buộc:

1. **Bắt buộc Reset `page = 1` trong Mọi Hàm Thay đổi Bộ lọc:**
   ```typescript
   // Trong hook bộ lọc use<Feature>Filters
   const handleFilterChange = (key: string, value: string) => {
     const params = new URLSearchParams(searchParams.toString());
     if (!value || value === "ALL") {
       params.delete(key);
     } else {
       params.set(key, value);
     }
     // BẮT BUỘC: Đưa về trang 1 mỗi khi đổi tiêu chí lọc
     params.set("page", "1");
     router.push(`?${params.toString()}`);
   };
   ```

2. **Bắt buộc Debounce Ô Tìm kiếm Toàn văn (300ms - 500ms):**
   ```tsx
   const [searchInput, setSearchInput] = useState(search);
   const debouncedSearch = useDebounce(searchInput, 400);

   useEffect(() => {
     if (debouncedSearch !== search) {
       handleFilterChange("search", debouncedSearch);
     }
   }, [debouncedSearch]);
   ```

3. **Hàm Làm sạch Params trước khi Gửi Request API (Clean Params):**
   Trước khi truyền params vào hook RTK Query, luôn loại bỏ các giá trị `"ALL"`, chuỗi rỗng `""`, `null` hoặc `undefined`:
   ```typescript
   export function cleanFilterParams<T extends Record<string, any>>(params: T): Partial<T> {
     const cleaned: Record<string, any> = {};
     Object.entries(params).forEach(([key, value]) => {
       if (value !== undefined && value !== null && value !== "" && value !== "ALL") {
         cleaned[key] = value;
       }
     });
     return cleaned as Partial<T>;
   }
   ```


