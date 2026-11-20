# Quy chuẩn 02: Tiêu chuẩn Page Header & Breadcrumbs (Golden Standard)

> **Module chuẩn mực đối chiếu:** 
> - [src/app/(admin)/contracts/page.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/contracts/page.tsx)
> - [src/app/(admin)/employees/page.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/app/(admin)/employees/page.tsx)

---

## 1. Cấu trúc Chuẩn của Page Header

Mọi trang danh sách, trang tạo mới và trang chi tiết trong toàn bộ hệ thống CYCLOSA **bắt buộc tuân thủ 100% cấu trúc JSX sau**:

```tsx
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    {/* 1. Tiêu đề H1 với Icon đặt trực tiếp */}
    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
      <Icon className="w-6 h-6 text-primary shrink-0" />
      <span>[Tên màn hình chuẩn hệ thống]</span>
    </h1>

    {/* 2. Đường dẫn Breadcrumb */}
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
      <Link href="/" className="hover:text-primary transition-colors">
        Trang chủ
      </Link>
      <span>/</span>
      <Link href="/[parent-module]" className="hover:text-primary transition-colors">
        [Tên phân hệ cha]
      </Link>
      <span>/</span>
      <span className="text-foreground font-medium">[Tên trang hiện tại]</span>
    </nav>
  </div>

  {/* 3. Nút Thao tác Đầu trang (Actions) */}
  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
    {actions}
  </div>
</div>
```

---

## 2. Các Quy tắc Bắt buộc & Điều Cấm Kỵ với Header

### ❌ CÁC ĐIỀU CẤM TUYỆT ĐỐI (Strictly Forbidden):
1. **CẤM bọc Icon trong hộp màu nền bo góc:**
   - ❌ Sai: `<div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-5 h-5" /></div>`
   - ✅ Đúng: Đặt trực tiếp `<Icon className="w-6 h-6 text-primary shrink-0" />` ngay cạnh văn bản tiêu đề trong thẻ `h1`.
2. **CẤM kèm mã nghiệp vụ / mã màn hình trong ngoặc đơn:**
   - ❌ Sai: `Tiến trình hội nhập (ONB-01)`, `Đề xuất tuyển dụng (REC-02)`, `Hồ sơ nhân sự (EMP-01)`
   - ✅ Đúng: `Tiến trình hội nhập`, `Đề xuất tuyển dụng`, `Hồ sơ nhân sự`.
3. **CẤM gắn tag, badge trạng thái lên Header:**
   - ❌ Sai: Header chứa `<Badge>AI Match</Badge>`, `<Badge>ATS Pipeline</Badge>`, `badgeText="..."`.
   - ✅ Đúng: Giữ tiêu đề sạch sẽ 100%. Các tag trạng thái thuộc về bản ghi phải hiển thị trong body card hoặc detail page bên dưới.
4. **CẤM gắn phần mô tả phụ (subtitle) dưới Header:**
   - ❌ Sai: `<p className="text-sm text-muted-foreground">Quản lý và theo dõi toàn bộ tiến trình tuyển dụng ứng viên của doanh nghiệp...</p>`
   - ✅ Đúng: Không đính kèm subtitle gây loãng bố cục. Giao diện quản trị B2B cần sự tinh gọn, dồn trọng tâm vào thanh lọc và bảng dữ liệu.

---

## 3. Quy chuẩn Breadcrumbs

1. **Gốc Breadcrumb luôn là "Trang chủ":**
   - Bắt buộc dùng: `<Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>`.
   - **CẤM** chèn icon ngôi nhà `<Home className="w-3 h-3" />`.
   - **CẤM** dùng nhãn `CYCLOSA` thay cho `Trang chủ`.
2. **Quy chuẩn Tên Phân hệ Cha (Parent Module):**
   Tên module cha trên breadcrumb phải chuẩn xác, súc tích và tương ứng với tên nhóm trên Menu Sidebar:
   - Module Tuyển dụng: `Tuyển dụng` (❌ Cấm ghi: `Tuyển dụng & Thu hút`)
   - Module Hội nhập: `Hội nhập nhân sự` (❌ Cấm lồng: `Quản trị nhân sự / Hội nhập nhân sự`)
   - Module Hợp đồng: `Hợp đồng lao động` (hoặc `Quản lý hợp đồng`)
   - Module Nghỉ phép: `Nghỉ phép`
   - Module Chấm công: `Chấm công`
   - Module Nhân sự: `Hồ sơ nhân sự`
3. **Trang chi tiết / Trang con:**
   - Cấu trúc: `Trang chủ / [Phân hệ cha] / [Danh sách cha] / [Tên bản ghi hoặc Tạo mới]`
   - Ví dụ tạo mới: `Trang chủ / Tuyển dụng / Vị trí tuyển dụng / Tạo mới`
   - Ví dụ chi tiết: `Trang chủ / Tuyển dụng / Hồ sơ ứng viên / Nguyễn Văn A`

---

## 4. Quy chuẩn Nút Thao tác (Header Actions)

Góc phải header chỉ chứa từ 1 đến 3 nút hành động chính yếu nhất của trang:
1. **Nút Làm mới (`RefreshCw`):**
   ```tsx
   <Button
     variant="outline"
     size="sm"
     onClick={() => refetch()}
     disabled={isFetching}
     className="h-8 text-xs gap-1.5"
   >
     <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
     <span>Làm mới</span>
   </Button>
   ```
2. **Nút Thêm mới / Soạn thảo (`Plus`):**
   ```tsx
   {canManage && (
     <Button
       size="sm"
       onClick={handleOpenCreate}
       className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
     >
       <Plus className="w-3.5 h-3.5" />
       <span>[Tên hành động tạo mới]</span>
     </Button>
   )}
   ```
3. **Nút Quay lại danh sách (`ArrowLeft` - dành cho trang Chi tiết hoặc Tạo mới):**
   ```tsx
   <Button asChild variant="outline" size="sm" className="h-8 text-xs">
     <Link href="/[feature-path]">
       <ArrowLeft className="h-3.5 w-3.5 mr-1" />
       <span>Quay lại danh sách</span>
     </Link>
   </Button>
   ```
   *(Thống nhất dùng cụm từ "Quay lại danh sách", không dùng các biến thể như "Quay lại", "Quay về bảng điều khiển", "Về trang chính").*

