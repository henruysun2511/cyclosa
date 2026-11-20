# Quy chuẩn 07: Phân quyền RBAC, Ngôn ngữ Tiếng Việt & Quy trình Kiểm thử (Definition of Done)

> **Mục tiêu:** Đảm bảo hệ thống an toàn về phân quyền, chỉn chu về trải nghiệm người dùng bản địa (Việt Nam) và đạt chuẩn chất lượng mã nguồn 100% trước khi bàn giao.

---

## 1. Phân quyền Client-Side RBAC & Trạng thái Nút bấm

### 1.1. Định dạng Mã Quyền
Mã quyền tuân theo định dạng chuẩn Backend Spring Security:
$$\text{FORMAT: } \texttt{<RESOURCE>:<ACTION>}$$
Ví dụ: `CONTRACT:READ`, `CONTRACT:CREATE`, `RECRUITMENT:MANAGE`, `ONBOARDING:UPDATE`.

### 1.2. Hook `usePermission`
Sử dụng hook `usePermission` trong component:
```tsx
const { can } = usePermission();
const canCreate = can(PERMISSIONS.CONTRACT.CREATE);
const canManage = can(PERMISSIONS.CONTRACT.MANAGE);
```

### 1.3. ⚠️ Quy tắc Trạng thái Nút: Không giấu tiệt khỏi DOM
- **CẤM:** Dùng điều kiện cứng để ẩn tiệt nút hành động cốt lõi (Sửa, Xóa) khỏi DOM khi người dùng đang xem danh sách các bản ghi đặc biệt (như Vai trò hệ thống `isSystemRole` hay Hợp đồng đang hiệu lực). Việc này khiến người dùng tưởng rằng chức năng chưa được lập trình.
- **ĐÚNG:** Luôn hiển thị nút/menu hành động. Nếu bản ghi không cho phép thao tác, chuyển sang trạng thái `disabled` (kèm tooltip giải thích lý do) hoặc hiển thị toast cảnh báo khi bấm vào.

---

## 2. Tiêu chuẩn Ngôn ngữ 100% Tiếng Việt có dấu

Giao diện CYCLOSA phục vụ người dùng doanh nghiệp tại Việt Nam:
1. **100% nội dung hiển thị** (Menu, Header, Table Head, Nút bấm, Placeholder, Toast message, Hộp thoại xác nhận) **BẮT BUỘC LÀ TIẾNG VIỆT CÓ DẤU CHUẨN MỰC**.
2. **Tuyệt đối không để sót các chuỗi tiếng Anh mặc định** (Submit, Cancel, Close, Search, Select option, Delete confirmation, Loading...).
3. **Từ điển chuẩn hóa hệ thống:**
   - *Employee* $\rightarrow$ Nhân viên / Hồ sơ nhân sự
   - *Department* $\rightarrow$ Phòng ban
   - *Contract* $\rightarrow$ Hợp đồng lao động
   - *Recruitment* $\rightarrow$ Tuyển dụng
   - *Onboarding* $\rightarrow$ Hội nhập nhân sự
   - *Attendance* $\rightarrow$ Chấm công
   - *Leave* $\rightarrow$ Nghỉ phép
   - *Payroll* $\rightarrow$ Bảng lương
   - *Active / Inactive* $\rightarrow$ Đang hoạt động / Ngừng hoạt động
   - *Pending / Approved / Rejected* $\rightarrow$ Chờ duyệt / Đã duyệt / Từ chối
   - *Draft* $\rightarrow$ Bản nháp
4. **Hộp thoại xác nhận nguy hiểm:**
   Thao tác Xóa, Hủy bỏ, Thu hồi quyền bắt buộc phải hiển thị Dialog xác nhận với nút bấm đỏ (`variant="destructive"`), không bao giờ thực thi xóa trực tiếp ngay khi click.

---

## 3. Checklist Tự Kiểm thử & Bàn giao (Definition of Done)

Trước khi xác nhận hoàn thành bất kỳ task nào trên Frontend, lập trình viên và AI Agent **BẮT BUỘC PHẢI TỰ KIỂM TRA ĐỦ 9 TIÊU CHÍ SAU**:

- [ ] **1. TypeScript Compile:** Bắt buộc chạy lệnh và đạt mã thoát `0` (không có lỗi kiểu):
  ```bash
  .\cyclosa_fe\node_modules\.bin\tsc --project cyclosa_fe/tsconfig.json --noEmit
  ```
- [ ] **2. Không còn Mock/Hardcode:** Tất cả dữ liệu danh sách, chi tiết, tạo mới, chỉnh sửa đều gắn trực tiếp với RTK Query endpoints tương ứng.
- [ ] **3. Page Header & Breadcrumbs chuẩn 100% (Rule 02):**
  - Icon đặt trực tiếp không có hộp màu nền bo góc.
  - Tiêu đề sạch không chứa mã `(REC-xx)`, `(ONB-xx)`, không có tag trạng thái, không có subtitle.
  - Breadcrumb bắt đầu bằng `<Link href="/">Trang chủ</Link>`.
- [ ] **4. Filter Bar 2 hàng chuẩn (Rule 03):** Hàng 1 tìm kiếm, Hàng 2 các Select shadcn/ui có icon + nhãn nhỏ + nút "Đặt lại".
- [ ] **5. Table-Embedded Empty State (Rule 04):** Khi danh sách trống, bảng vẫn giữ nguyên khung và tiêu đề cột, hiển thị 1 hàng trống `colSpan` ở `TableBody` kèm icon `FolderOpen`.
- [ ] **6. Phân trang 0-based/1-based (Rule 06):** UI hiển thị trang 1-based, gửi lên Backend Spring Boot đúng `page - 1`. Đổi bộ lọc tự động quay về trang 1.
- [ ] **7. Cache Invalidation (Rule 06):** Thêm/Sửa/Xóa dữ liệu xong thì bảng dữ liệu lập tức cập nhật mới mà không cần F5 trình duyệt.
- [ ] **8. Ngôn ngữ 100% Tiếng Việt:** Toàn bộ thông báo toast, validate, modal xác nhận đều dùng tiếng Việt có dấu.
- [ ] **9. BẮT BUỘC Luôn Cập Nhật Tài Liệu API Tracking (`docs/API_TRACKING.md`):**
  - **Đánh dấu cột Frontend:** Ngay khi một endpoint được nối UI và hoạt động hoàn chỉnh, đánh dấu `x` vào cột **Frontend** tại module tương ứng.
  - **Quy tắc Cổng Tự phục vụ (ESS):** Những API nào thuộc cổng ESS (`/me/...`) nếu chưa làm giao diện frontend thì **BẮT BUỘC để trống ` ` ở cột Frontend** kèm ghi chú giải thích cụ thể.
  - **Cập nhật Bảng Thống kê Tổng quan (Mục 1):** Luôn tính toán lại chính xác số lượng API hoàn thành, tỷ lệ phần trăm (%) của module đó và dòng **TỔNG CỘNG** toàn dự án. Tuyệt đối không để lệch số liệu giữa bảng tổng hợp và danh sách chi tiết.

