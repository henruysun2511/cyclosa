# BẢNG THEO DÕI TIẾN ĐỘ TÍCH HỢP API HỆ THỐNG CYCLOSA HRM

> **Quy ước đánh dấu tiến độ:**
> * Cột **Backend** / **Frontend**: Điền `x` khi đã hoàn thành, để trống ` ` khi chưa triển khai.
> * Cột **Ghi chú**: Dành riêng cho người dùng tự do ghi chú, đánh giá và theo dõi công việc.

---

## 📊 1. Thống kê tổng quan tiến độ

| Phân hệ / Module | Tổng số API | Backend (Đã xong) | Frontend (Đã xong) | Trạng thái |
| :--- | :---: | :---: | :---: | :---: |
| **1. Xác thực (Authentication)** | 8 | 8/8 (100%) | 7/8 (88%) | Sẵn sàng hoạt động |
| **2. Quản lý Tài khoản (User Management)** | 5 | 5/5 (100%) | 5/5 (100%) | Hoàn tất tích hợp 100% |
| **3. Quyền chức năng (Permissions)** | 1 | 1/1 (100%) | 1/1 (100%) | Hoàn tất tích hợp 100% |
| **4. Quản lý Vai trò (Roles)** | 7 | 7/7 (100%) | 6/7 (86%) | Màn hình /roles |
| **5. Gán Vai trò & Quyền Hiệu lực (User Roles)** | 4 | 4/4 (100%) | 4/4 (100%) | Hoàn tất tích hợp 100% |
| **6. Quản lý Sản phẩm mẫu (Products)** | 5 | 5/5 (100%) | 5/5 (100%) | Hoàn tất tích hợp 100% |
| **TỔNG CỘNG** | **30** | **30/30 (100%)** | **28/30 (93%)** | Đang phát triển |

---

## 🔐 2. Danh sách chi tiết API theo từng phân hệ

### Module 1: Xác thực hệ thống (Authentication - `AuthController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 1 | `POST` | `/api/v1/auth/login` | Đăng nhập bằng Username / Email & Mật khẩu | x | x | Hỗ trợ đăng nhập linh hoạt cả username hoặc email |
| 2 | `GET` | `/api/v1/auth/me` | Lấy thông tin tài khoản đang đăng nhập | x | x |  |
| 3 | `POST` | `/api/v1/auth/refresh` | Làm mới Access Token khi hết hạn | x | x |  |
| 4 | `POST` | `/api/v1/auth/logout` | Đăng xuất tài khoản, thu hồi token trên Redis | x | x |  |
| 5 | `POST` | `/api/v1/auth/activate` | Kích hoạt tài khoản nhân viên (link 48h) & tạo mật khẩu lần đầu | x | x |  |
| 6 | `POST` | `/api/v1/auth/forgot-password` | Yêu cầu gửi mã OTP 6 số (TTL 15 phút) qua Email | x | x |  |
| 7 | `POST` | `/api/v1/auth/reset-password` | Xác thực OTP và đặt lại mật khẩu mới | x | x |  |
| 8 | `PUT` | `/api/v1/auth/change-password` | Đổi mật khẩu cá nhân (yêu cầu Bearer Token) | x |  | Hiện tại đang tạo một trang trong auth, sửa lại sau |

---

### Module 2: Quản lý Tài khoản (User Management - `UserController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 9 | `POST` | `/api/v1/users` | Tạo mới tài khoản nhân viên (ở trạng thái chờ kích hoạt) | x | x | Modal tạo tài khoản người dùng (hỗ trợ nhập username) |
| 10 | `GET` | `/api/v1/users` | Lấy danh sách tài khoản (lọc trạng thái, từ khóa, phân trang) | x | x | Màn hình /users |
| 11 | `POST` | `/api/v1/users/{userId}/resend-activation` | Gửi lại email kèm mã kích hoạt tài khoản 48h | x | x | Thao tác trên từng tài khoản |
| 12 | `POST` | `/api/v1/users/{userId}/lock` | Khóa tài khoản người dùng và hủy phiên đăng nhập | x | x | Dialog xác nhận khóa an toàn |
| 13 | `POST` | `/api/v1/users/{userId}/unlock` | Mở khóa tài khoản người dùng về trạng thái hoạt động | x | x | Dialog xác nhận mở khóa an toàn |

---

### Module 3: Quyền chức năng hệ thống (Permissions - `PermissionController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 14 | `GET` | `/api/v1/permissions/grouped` | Lấy danh mục quyền được gom nhóm theo phân hệ (Resource) | x | x | Tích hợp trong Ma trận quyền |

---

### Module 4: Quản lý Vai trò & Ma trận Phân quyền (Roles - `RoleController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 15 | `GET` | `/api/v1/roles` | Lấy danh sách vai trò có phân trang, bộ lọc và tìm kiếm | x | x | Màn hình /roles (cột trái) |
| 16 | `POST` | `/api/v1/roles` | Tạo mới một vai trò tùy chỉnh | x | x | Modal tạo vai trò |
| 17 | `PUT` | `/api/v1/roles/{roleId}` | Cập nhật thông tin tên và mô tả vai trò tùy chỉnh | x | x | Modal sửa vai trò |
| 18 | `DELETE`| `/api/v1/roles/{roleId}` | Xóa mềm vai trò tùy chỉnh (nếu chưa có user nắm giữ) | x | x | Dialog xác nhận xóa an toàn |
| 19 | `GET` | `/api/v1/roles/{roleId}/permissions` | Lấy ma trận quyền chức năng và phạm vi dữ liệu (DataScope) | x | x | Ma trận quyền vai trò (cột phải) |
| 20 | `PUT` | `/api/v1/roles/{roleId}/permissions` | Thiết lập phân quyền và phạm vi dữ liệu cho vai trò | x | x | Lưu ma trận quyền & DataScope |
| 21 | `PUT` | `/api/v1/roles/{roleId}/document-type-permissions` | Cấu hình quyền thao tác loại tài liệu số cho vai trò | x |   |  |

---

### Module 5: Gán Vai trò & Quyền Hiệu lực (Role Assignments - `UserRoleController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 22 | `GET` | `/api/v1/users/{userId}/role-assignments` | Lấy danh sách các vai trò đã được gán cho người dùng | x | x | Modal phân quyền vai trò |
| 23 | `POST` | `/api/v1/users/{userId}/role-assignments` | Gán vai trò cho người dùng tại một pháp nhân / công ty | x | x | Modal phân quyền vai trò |
| 24 | `DELETE`| `/api/v1/role-assignments/{assignmentId}` | Thu hồi vai trò đã gán khỏi người dùng | x | x | Nút thu hồi vai trò |
| 25 | `GET` | `/api/v1/users/{userId}/effective-permissions` | Tra cứu ma trận quyền hiệu lực của user (tính max DataScope) | x | x | Hook getEffectivePermissions |

---

### Module 6: Quản lý Sản phẩm Mẫu (Product Sample Module - `ProductController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 26 | `GET` | `/api/v1/products` | Lấy danh sách sản phẩm (lọc động đa tiêu chí, phân trang, sort) | x | x |  |
| 27 | `GET` | `/api/v1/products/{id}` | Lấy chi tiết thông tin sản phẩm theo ID | x | x |  |
| 28 | `POST` | `/api/v1/products` | Thêm mới sản phẩm vào hệ thống | x | x |  |
| 29 | `PUT` | `/api/v1/products/{id}` | Cập nhật thông tin sản phẩm theo ID | x | x |  |
| 30 | `DELETE`| `/api/v1/products/{id}` | Xóa mềm sản phẩm theo ID (chuyển deleted = true) | x | x |  |
