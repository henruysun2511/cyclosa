# BẢNG THEO DÕI TIẾN ĐỘ TÍCH HỢP API HỆ THỐNG CYCLOSA HRM

> **Quy ước đánh dấu tiến độ:**
> * Cột **Backend** / **Frontend**: Điền `x` khi đã hoàn thành, để trống ` ` khi chưa triển khai.
> * Cột **Ghi chú**: Dành riêng cho người dùng tự do ghi chú, đánh giá và theo dõi công việc.

---

## 📊 1. Thống kê tổng quan tiến độ

| Phân hệ / Module | Tổng số API | Backend (Đã xong) | Frontend (Đã xong) | Trạng thái |
| :--- | :---: | :---: | :---: | :---: |
| **1. Xác thực & Hồ sơ (Auth & Settings)** | 9 | 9/9 (100%) | 9/9 (100%) | Hoàn tất tích hợp 100% |
| **2. Quản lý Tài khoản (User Management)** | 6 | 6/6 (100%) | 6/6 (100%) | Hoàn tất tích hợp 100% |
| **3. Quyền chức năng (Permissions)** | 1 | 1/1 (100%) | 1/1 (100%) | Hoàn tất tích hợp 100% |
| **4. Quản lý Vai trò (Roles)** | 7 | 7/7 (100%) | 6/7 (86%) | Màn hình /roles |
| **5. Gán Vai trò & Quyền Hiệu lực (User Roles)** | 4 | 4/4 (100%) | 4/4 (100%) | Hoàn tất tích hợp 100% |
| **6. Quản lý Sản phẩm mẫu (Products)** | 5 | 5/5 (100%) | 5/5 (100%) | Hoàn tất tích hợp 100% |
| **7. Quản lý Tệp tin (Cloudinary Media)** | 2 | 2/2 (100%) | 2/2 (100%) | Hoàn tất tích hợp 100% |
| **8. Quản lý Tổ chức - Công ty & Pháp nhân (Companies)** | 5 | 5/5 (100%) | 0/5 (0%) | Sẵn sàng tích hợp FE |
| **9. Quản lý Tổ chức - Khu vực & Vùng miền (Regions)** | 7 | 7/7 (100%) | 0/7 (0%) | Sẵn sàng tích hợp FE |
| **10. Quản lý Tổ chức - Chi nhánh & GPS (Branches)** | 6 | 6/6 (100%) | 0/6 (0%) | Sẵn sàng tích hợp FE |
| **11. Quản lý Tổ chức - Trung tâm Chi phí (Cost Centers)** | 6 | 6/6 (100%) | 0/6 (0%) | Sẵn sàng tích hợp FE |
| **12. Quản lý Tổ chức - Chức danh Công việc (Job Titles)** | 6 | 6/6 (100%) | 0/6 (0%) | Sẵn sàng tích hợp FE |
| **13. Quản lý Tổ chức - Cấp bậc Chức danh (Job Levels)** | 6 | 6/6 (100%) | 0/6 (0%) | Sẵn sàng tích hợp FE |
| **14. Quản lý Tổ chức - Sơ đồ & Phòng ban (Departments)** | 11 | 11/11 (100%) | 0/11 (0%) | Sẵn sàng tích hợp FE |
| **TỔNG CỘNG** | **81** | **81/81 (100%)** | **33/81 (41%)** | Đang phát triển |

---

## 🔐 2. Danh sách chi tiết API theo từng phân hệ

### Module 1: Xác thực & Hồ sơ người dùng (Authentication & Profile - `AuthController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 1 | `POST` | `/api/v1/auth/login` | Đăng nhập bằng Username / Email & Mật khẩu | x | x | Hỗ trợ đăng nhập linh hoạt cả username hoặc email |
| 2 | `GET` | `/api/v1/auth/me` | Lấy thông tin tài khoản đang đăng nhập | x | x | Màn hình /settings/profile |
| 3 | `PUT` | `/api/v1/auth/me` | Cập nhật thông tin cá nhân tài khoản đang đăng nhập | x | x | Màn hình /settings/profile |
| 4 | `POST` | `/api/v1/auth/refresh` | Làm mới Access Token khi hết hạn | x | x | Tự động qua RTK Query baseApi |
| 5 | `POST` | `/api/v1/auth/logout` | Đăng xuất tài khoản, thu hồi token trên Redis | x | x | Thao tác trên Header Menu |
| 6 | `POST` | `/api/v1/auth/activate` | Kích hoạt tài khoản nhân viên (link 48h) & tạo mật khẩu lần đầu | x | x | Màn hình /activate |
| 7 | `POST` | `/api/v1/auth/forgot-password` | Yêu cầu gửi mã OTP 6 số (TTL 15 phút) qua Email | x | x | Màn hình /forgot-password |
| 8 | `POST` | `/api/v1/auth/reset-password` | Xác thực OTP và đặt lại mật khẩu mới | x | x | Màn hình /reset-password |
| 9 | `PUT` | `/api/v1/auth/change-password` | Đổi mật khẩu cá nhân (yêu cầu Bearer Token) | x | x | Màn hình /settings/security |

---

### Module 2: Quản lý Tài khoản (User Management - `UserController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 10 | `POST` | `/api/v1/users` | Tạo mới tài khoản nhân viên (ở trạng thái chờ kích hoạt) | x | x | Modal tạo tài khoản người dùng (hỗ trợ nhập username) |
| 11 | `POST` | `/api/v1/users/bulk` | Tạo hàng loạt tài khoản nhân viên từ tệp Excel/CSV | x | x | Modal Nhập hàng loạt UserBulkImportDialog |
| 12 | `GET` | `/api/v1/users` | Lấy danh sách tài khoản (lọc trạng thái, từ khóa, phân trang) | x | x | Màn hình /users |
| 13 | `POST` | `/api/v1/users/{userId}/resend-activation` | Gửi lại email kèm mã kích hoạt tài khoản 48h | x | x | Thao tác trên từng tài khoản |
| 14 | `POST` | `/api/v1/users/{userId}/lock` | Khóa tài khoản người dùng và hủy phiên đăng nhập | x | x | Dialog xác nhận khóa an toàn |
| 15 | `POST` | `/api/v1/users/{userId}/unlock` | Mở khóa tài khoản người dùng về trạng thái hoạt động | x | x | Dialog xác nhận mở khóa an toàn |

---

### Module 3: Quyền chức năng hệ thống (Permissions - `PermissionController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 16 | `GET` | `/api/v1/permissions/grouped` | Lấy danh mục quyền được gom nhóm theo phân hệ (Resource) | x | x | Tích hợp trong Ma trận quyền |

---

### Module 4: Quản lý Vai trò & Ma trận Phân quyền (Roles - `RoleController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 17 | `GET` | `/api/v1/roles` | Lấy danh sách vai trò có phân trang, bộ lọc và tìm kiếm | x | x | Màn hình /roles (cột trái) |
| 18 | `POST` | `/api/v1/roles` | Tạo mới một vai trò tùy chỉnh | x | x | Modal tạo vai trò |
| 19 | `PUT` | `/api/v1/roles/{roleId}` | Cập nhật thông tin tên và mô tả vai trò tùy chỉnh | x | x | Modal sửa vai trò |
| 20 | `DELETE`| `/api/v1/roles/{roleId}` | Xóa mềm vai trò tùy chỉnh (nếu chưa có user nắm giữ) | x | x | Dialog xác nhận xóa an toàn |
| 21 | `GET` | `/api/v1/roles/{roleId}/permissions` | Lấy ma trận quyền chức năng và phạm vi dữ liệu (DataScope) | x | x | Ma trận quyền vai trò (cột phải) |
| 22 | `PUT` | `/api/v1/roles/{roleId}/permissions` | Thiết lập phân quyền và phạm vi dữ liệu cho vai trò | x | x | Lưu ma trận quyền & DataScope |
| 23 | `PUT` | `/api/v1/roles/{roleId}/document-type-permissions` | Cấu hình quyền thao tác loại tài liệu số cho vai trò | x |   |  |

---

### Module 5: Gán Vai trò & Quyền Hiệu lực (Role Assignments - `UserRoleController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 24 | `GET` | `/api/v1/users/{userId}/role-assignments` | Lấy danh sách các vai trò đã được gán cho người dùng | x | x | Modal phân quyền vai trò |
| 25 | `POST` | `/api/v1/users/{userId}/role-assignments` | Gán vai trò cho người dùng tại một pháp nhân / công ty | x | x | Modal phân quyền vai trò |
| 26 | `DELETE`| `/api/v1/role-assignments/{assignmentId}` | Thu hồi vai trò đã gán khỏi người dùng | x | x | Nút thu hồi vai trò |
| 27 | `GET` | `/api/v1/users/{userId}/effective-permissions` | Tra cứu ma trận quyền hiệu lực của user (tính max DataScope) | x | x | Hook getEffectivePermissions |

---

### Module 6: Quản lý Sản phẩm Mẫu (Product Sample Module - `ProductController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 28 | `GET` | `/api/v1/products` | Lấy danh sách sản phẩm (lọc động đa tiêu chí, phân trang, sort) | x | x |  |
| 29 | `GET` | `/api/v1/products/{id}` | Lấy chi tiết thông tin sản phẩm theo ID | x | x |  |
| 30 | `POST` | `/api/v1/products` | Thêm mới sản phẩm vào hệ thống | x | x |  |
| 31 | `PUT` | `/api/v1/products/{id}` | Cập nhật thông tin sản phẩm theo ID | x | x |  |
| 32 | `DELETE`| `/api/v1/products/{id}` | Xóa mềm sản phẩm theo ID (chuyển deleted = true) | x | x |  |

---

### Module 7: Quản lý Tệp tin & Đa phương tiện (Media - `MediaController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 33 | `POST` | `/api/v1/media/upload` | Tải lên tệp tin hình ảnh lên Cloudinary (MultipartFile, max 5MB) | x | x | Tích hợp trong AvatarUploader |
| 34 | `DELETE`| `/api/v1/media` | Xóa tệp tin đa phương tiện khỏi Cloudinary bằng publicId | x | x | Nút [X] xóa ảnh & tự xóa ảnh cũ khi đổi |

---

### Module 8: Quản lý Tổ chức - Công ty & Pháp nhân (`CompanyController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 35 | `GET` | `/api/v1/companies` | Lấy danh sách công ty có phân trang, bộ lọc trạng thái và tìm kiếm | x |   | Sơ đồ tổ chức & Cấu hình pháp nhân |
| 36 | `GET` | `/api/v1/companies/{companyId}` | Lấy thông tin chi tiết một công ty theo ID | x |   |  |
| 37 | `POST` | `/api/v1/companies` | Tạo mới công ty / pháp nhân trong tập đoàn | x |   | Modal tạo công ty |
| 38 | `PUT` | `/api/v1/companies/{companyId}` | Cập nhật thông tin công ty / pháp nhân | x |   | Modal chỉnh sửa công ty |
| 39 | `DELETE`| `/api/v1/companies/{companyId}` | Xóa mềm công ty / pháp nhân | x |   | Dialog xác nhận xóa |

---

### Module 9: Quản lý Tổ chức - Khu vực & Vùng miền (`RegionController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 40 | `GET` | `/api/v1/regions` | Lấy danh sách khu vực theo công ty có phân trang và tìm kiếm | x |   | Danh mục phân vùng địa lý |
| 41 | `GET` | `/api/v1/regions/all` | Lấy toàn bộ danh sách khu vực theo công ty (không phân trang) | x |   | Dropdown chọn khu vực |
| 42 | `GET` | `/api/v1/regions/{regionId}` | Lấy thông tin chi tiết một khu vực theo ID | x |   |  |
| 43 | `GET` | `/api/v1/regions/{regionId}/branches` | Lấy danh sách các chi nhánh trực thuộc một khu vực | x |   |  |
| 44 | `POST` | `/api/v1/regions` | Tạo mới khu vực / vùng miền trực thuộc công ty | x |   | Modal tạo khu vực |
| 45 | `PUT` | `/api/v1/regions/{regionId}` | Cập nhật thông tin tên khu vực | x |   | Modal sửa khu vực |
| 46 | `DELETE`| `/api/v1/regions/{regionId}` | Xóa mềm khu vực | x |   | Dialog xác nhận xóa |

---

### Module 10: Quản lý Tổ chức - Chi nhánh & Văn phòng (`BranchController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 47 | `GET` | `/api/v1/branches` | Lấy danh sách chi nhánh theo khu vực có phân trang và bộ lọc | x |   | Quản lý văn phòng làm việc |
| 48 | `GET` | `/api/v1/branches/by-company` | Lấy toàn bộ chi nhánh theo công ty (cho chọn nhanh / GPS) | x |   | Dropdown & Chấm công GPS |
| 49 | `GET` | `/api/v1/branches/{branchId}` | Lấy thông tin chi tiết một chi nhánh theo ID | x |   |  |
| 50 | `POST` | `/api/v1/branches` | Tạo mới chi nhánh / văn phòng kèm tọa độ Lat/Lng và bán kính GPS | x |   | Modal tạo chi nhánh |
| 51 | `PUT` | `/api/v1/branches/{branchId}` | Cập nhật thông tin chi nhánh / tọa độ GPS và bán kính chấm công | x |   | Modal sửa chi nhánh |
| 52 | `DELETE`| `/api/v1/branches/{branchId}` | Xóa mềm chi nhánh | x |   | Dialog xác nhận xóa |

---

### Module 11: Quản lý Tổ chức - Trung tâm Chi phí (`CostCenterController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 53 | `GET` | `/api/v1/cost-centers` | Lấy danh sách trung tâm chi phí theo công ty có phân trang | x |   | Quản lý trung tâm chi phí |
| 54 | `GET` | `/api/v1/cost-centers/all` | Lấy toàn bộ trung tâm chi phí theo công ty (cho dropdown) | x |   | Dropdown gán phòng ban |
| 55 | `GET` | `/api/v1/cost-centers/{costCenterId}` | Lấy thông tin chi tiết một trung tâm chi phí theo ID | x |   |  |
| 56 | `POST` | `/api/v1/cost-centers` | Tạo mới trung tâm chi phí | x |   | Modal tạo trung tâm chi phí |
| 57 | `PUT` | `/api/v1/cost-centers/{costCenterId}` | Cập nhật thông tin trung tâm chi phí | x |   | Modal sửa trung tâm chi phí |
| 58 | `DELETE`| `/api/v1/cost-centers/{costCenterId}` | Xóa mềm trung tâm chi phí | x |   | Dialog xác nhận xóa |

---

### Module 12: Quản lý Tổ chức - Chức danh Công việc (`JobTitleController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 59 | `GET` | `/api/v1/job-titles` | Lấy danh sách chức danh theo công ty có phân trang | x |   | Quản lý chức danh |
| 60 | `GET` | `/api/v1/job-titles/all` | Lấy toàn bộ chức danh theo công ty (cho dropdown) | x |   | Dropdown chức danh nhân viên |
| 61 | `GET` | `/api/v1/job-titles/{jobTitleId}` | Lấy thông tin chi tiết một chức danh theo ID | x |   |  |
| 62 | `POST` | `/api/v1/job-titles` | Tạo mới chức danh công việc | x |   | Modal tạo chức danh |
| 63 | `PUT` | `/api/v1/job-titles/{jobTitleId}` | Cập nhật thông tin chức danh công việc | x |   | Modal sửa chức danh |
| 64 | `DELETE`| `/api/v1/job-titles/{jobTitleId}` | Xóa mềm chức danh công việc | x |   | Dialog xác nhận xóa |

---

### Module 13: Quản lý Tổ chức - Cấp bậc Chức danh (`JobLevelController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 65 | `GET` | `/api/v1/job-levels` | Lấy danh sách cấp bậc theo công ty có phân trang | x |   | Quản lý cấp bậc thẩm quyền |
| 66 | `GET` | `/api/v1/job-levels/all` | Lấy toàn bộ cấp bậc theo công ty đã sắp xếp rank_order tăng dần | x |   | Dropdown cấp bậc nhân viên |
| 67 | `GET` | `/api/v1/job-levels/{jobLevelId}` | Lấy thông tin chi tiết một cấp bậc theo ID | x |   |  |
| 68 | `POST` | `/api/v1/job-levels` | Tạo mới cấp bậc chức danh (kèm thứ tự rank_order) | x |   | Modal tạo cấp bậc |
| 69 | `PUT` | `/api/v1/job-levels/{jobLevelId}` | Cập nhật tên và thứ tự cấp bậc chức danh | x |   | Modal sửa cấp bậc |
| 70 | `DELETE`| `/api/v1/job-levels/{jobLevelId}` | Xóa mềm cấp bậc chức danh | x |   | Dialog xác nhận xóa |

---

### Module 14: Quản lý Tổ chức - Sơ đồ & Phòng ban (`DepartmentController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 71 | `GET` | `/api/v1/departments` | Lấy danh sách phòng ban theo công ty có phân trang và tìm kiếm | x |   | Màn hình quản lý phòng ban |
| 72 | `GET` | `/api/v1/departments/tree` | Lấy cây sơ đồ tổ chức (Org Tree) theo mốc ngày hiệu lực chốt cơ cấu | x |   | Màn hình [25] Sơ đồ tổ chức (lõi) |
| 73 | `GET` | `/api/v1/departments/export` | Xuất file Excel sơ đồ cơ cấu tổ chức theo ngày hiệu lực chốt | x |   | Xuất báo cáo cấu trúc tổ chức |
| 74 | `GET` | `/api/v1/departments/{departmentId}` | Lấy thông tin chi tiết phòng ban theo ID và ngày hiệu lực | x |   | Chi tiết đơn vị / Drawer |
| 75 | `GET` | `/api/v1/departments/{departmentId}/history` | Lấy toàn bộ lịch sử các phiên bản hiệu lực của một phòng ban | x |   | Drawer lịch sử phiên bản |
| 76 | `GET` | `/api/v1/departments/{departmentId}/move-impact` | Xem trước tác động chuyển nhánh (kiểm tra chu trình & đếm đơn vị con) | x |   | Modal xem trước tác động |
| 77 | `POST` | `/api/v1/departments` | Tạo mới phòng ban và phiên bản cơ cấu ban đầu | x |   | Modal tạo phòng ban mới |
| 78 | `PUT` | `/api/v1/departments/{departmentId}` | Cập nhật phòng ban (tạo phiên bản mới theo ngày hiệu lực) | x |   | Modal sửa cơ cấu phòng ban |
| 79 | `PUT` | `/api/v1/departments/{departmentId}/move` | Điều chuyển vị trí phòng ban trong cây cơ cấu sang phòng ban cha mới | x |   | Kéo thả cây / Modal chuyển vị trí |
| 80 | `PUT` | `/api/v1/departments/{departmentId}/permission-inheritance` | Bật / tắt cờ kế thừa phân quyền xuống các đơn vị con | x |   | Switch toggle kế thừa quyền |
| 81 | `DELETE`| `/api/v1/departments/{departmentId}` | Giải thể phòng ban (chỉ khi không còn phòng ban con trực thuộc) | x |   | Dialog xác nhận giải thể |
