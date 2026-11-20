# Quy chuẩn 08: Checklist Kiểm thử & Nghiệm thu Backend (Definition of Done)

> **Mục tiêu:** Đảm bảo toàn bộ mã nguồn Backend đạt chất lượng cao nhất, không phát sinh lỗi phân quyền 403, rò rỉ dữ liệu hoặc lỗi biên dịch trước khi bàn giao.

---

## 1. Bảng Checklist Nghiệm thu Tính năng (Definition of Done)

Trước khi coi một module hoặc API backend hoàn thành, lập trình viên và AI Agent **BẮT BUỘC TỰ KIỂM TRA ĐỦ 7 HẠNG MỤC SAU**:

### [ ] 1. Controller & OpenAPI / Swagger
- [ ] `@Tag(name = "...")` danh từ rõ nghĩa, **tuyệt đối không chứa tiền tố số thứ tự** (như `01.`, `02.`...).
- [ ] Mọi API method đều có `@Operation(summary = "...")` mô tả bằng Tiếng Việt rõ ràng.
- [ ] Mọi API method trả về `ResponseEntity<ApiResponse<T>>`, tuyệt đối không trả về JPA Entity trực tiếp hoặc raw Object.

### [ ] 2. Phân quyền RBAC & Bảo mật Endpoint
- [ ] Endpoint có đủ cặp đôi `@PreAuthorize("@perm.has('...')")` và `@RequirePermission('...')`.
- [ ] **BẮT BUỘC:** Toàn bộ mã quyền mới đã được khai báo vào `RolePermissionDataInitializer.seedPermissions()` và gán vai trò mặc định trong `seedRolePermissions()`.
- [ ] Tầng Service có switch-case xử lý `DataScope` tương ứng (OWN, TEAM, DEPARTMENT, COMPANY, ALL).
- [ ] Không mở lộ endpoint nghiệp vụ trong `SecurityConfig.PUBLIC_ENDPOINTS`.

### [ ] 3. Kiến trúc Đóng gói Modular Monolith
- [ ] Không inject Repository của module khác; chỉ giao tiếp qua Public Service.
- [ ] Các tác động phụ liên module (Side-effects) được giải phóng qua Domain Events (`ApplicationEventPublisher`).
- [ ] Không có vòng lặp phụ thuộc (Circular Dependency).

### [ ] 4. DTO & Phân trang
- [ ] Filter DTO kế thừa `BaseFilterRequest`.
- [ ] Dùng `toPageable()` với danh sách trắng `ALLOWED_SORT_FIELDS` hợp lệ để chống SQL Injection.
- [ ] Trả về `PageData<T>` với phân trang 0-based, không trả về raw Spring `Page<T>`.

### [ ] 5. Mã lỗi & Entity JPA
- [ ] Mã lỗi riêng của module định nghĩa trong enum implement `ErrorCode` interface.
- [ ] Entity kế thừa `BaseEntity`, có soft delete `@SQLDelete` và `@SQLRestriction`.
- [ ] Query quan hệ dùng `JOIN FETCH` để chống lỗi N+1.
- [ ] Điều kiện lọc `companyId` an toàn: `AND (r.companyId IS NULL OR r.companyId = :companyId)`.

### [ ] 6. Biên dịch & Kiểm thử Tự động
- [ ] Chạy lệnh biên dịch Maven đạt kết quả thành công (**BUILD SUCCESS**):
  ```bash
  ./mvnw clean test-compile
  ```
- [ ] Chạy kiểm thử tự động vượt qua 100% tests:
  ```bash
  ./mvnw test
  ```

### [ ] 7. BẮT BUỘC Luôn Cập Nhật Tài Liệu API Tracking (`cyclosa_fe/docs/API_TRACKING.md`)
- [ ] **Khai báo đầy đủ API mới:** Khi phát triển module mới hoặc thêm endpoint, lập tức bổ sung STT, Phương thức HTTP, Đường dẫn endpoint và Mô tả chức năng vào bảng chi tiết của module trong `cyclosa_fe/docs/API_TRACKING.md`.
- [ ] **Đánh dấu cột Backend:** Điền `x` vào cột **Backend** ngay khi controller và service đã biên dịch và sẵn sàng phục vụ.
- [ ] **Cập nhật Bảng Thống kê Tổng quan (Mục 1):** Cập nhật số lượng API tổng, số lượng API backend đã xong, tỷ lệ % của module và dòng **TỔNG CỘNG** toàn dự án. Tuyệt đối không để lệch dữ liệu theo dõi giữa Backend và Frontend.

