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
| **8. Quản lý Tổ chức - Công ty & Pháp nhân (Companies)** | 5 | 5/5 (100%) | 5/5 (100%) | Hoàn tất tích hợp 100% |
| **9. Quản lý Tổ chức - Khu vực & Vùng miền (Regions)** | 7 | 7/7 (100%) | 7/7 (100%) | Hoàn tất tích hợp 100% |
| **10. Quản lý Tổ chức - Chi nhánh & GPS (Branches)** | 6 | 6/6 (100%) | 6/6 (100%) | Hoàn tất tích hợp 100% |
| **11. Quản lý Tổ chức - Trung tâm Chi phí (Cost Centers)** | 6 | 6/6 (100%) | 6/6 (100%) | Hoàn tất tích hợp 100% |
| **12. Quản lý Tổ chức - Chức danh Công việc (Job Titles)** | 6 | 6/6 (100%) | 6/6 (100%) | Hoàn tất tích hợp 100% |
| **13. Quản lý Tổ chức - Cấp bậc Chức danh (Job Levels)** | 6 | 6/6 (100%) | 6/6 (100%) | Hoàn tất tích hợp 100% |
| **14. Quản lý Tổ chức - Sơ đồ & Phòng ban (Departments)** | 11 | 11/11 (100%) | 11/11 (100%) | Hoàn tất tích hợp 100% |
| **15. Hồ sơ nhân sự & Vòng đời (Employee Profile)** | 37 | 37/37 (100%) | 26/37 (70%) | Hoàn tất nghiệp vụ lõi (26/37) |
| **16. Quản lý Hợp đồng Lao động & Ký điện tử (Contracts & E-Sign)** | 42 | 42/42 (100%) | 40/42 (95%) | Hoàn tất nghiệp vụ lõi (40/42) |
| **TỔNG CỘNG** | **160** | **160/160 (100%)** | **146/160 (91.3%)** | Đang phát triển |

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
| 35 | `GET` | `/api/v1/companies` | Lấy danh sách công ty có phân trang, bộ lọc trạng thái và tìm kiếm | x | x | Sơ đồ tổ chức & Cấu hình pháp nhân |
| 36 | `GET` | `/api/v1/companies/{companyId}` | Lấy thông tin chi tiết một công ty theo ID | x | x |  |
| 37 | `POST` | `/api/v1/companies` | Tạo mới công ty / pháp nhân trong tập đoàn | x | x | Modal tạo công ty |
| 38 | `PUT` | `/api/v1/companies/{companyId}` | Cập nhật thông tin công ty / pháp nhân | x | x | Modal chỉnh sửa công ty |
| 39 | `DELETE`| `/api/v1/companies/{companyId}` | Xóa mềm công ty / pháp nhân | x | x | Dialog xác nhận xóa |

---

### Module 9: Quản lý Tổ chức - Khu vực & Vùng miền (`RegionController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 40 | `GET` | `/api/v1/regions` | Lấy danh sách khu vực theo công ty có phân trang và tìm kiếm | x | x | Danh mục phân vùng địa lý |
| 41 | `GET` | `/api/v1/regions/all` | Lấy toàn bộ danh sách khu vực theo công ty (không phân trang) | x | x | Dropdown chọn khu vực |
| 42 | `GET` | `/api/v1/regions/{regionId}` | Lấy thông tin chi tiết một khu vực theo ID | x | x |  |
| 43 | `GET` | `/api/v1/regions/{regionId}/branches` | Lấy danh sách các chi nhánh trực thuộc một khu vực | x | x |  |
| 44 | `POST` | `/api/v1/regions` | Tạo mới khu vực / vùng miền trực thuộc công ty | x | x | Modal tạo khu vực |
| 45 | `PUT` | `/api/v1/regions/{regionId}` | Cập nhật thông tin tên khu vực | x | x | Modal sửa khu vực |
| 46 | `DELETE`| `/api/v1/regions/{regionId}` | Xóa mềm khu vực | x | x | Dialog xác nhận xóa |

---

### Module 10: Quản lý Tổ chức - Chi nhánh & Văn phòng (`BranchController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 47 | `GET` | `/api/v1/branches` | Lấy danh sách chi nhánh theo khu vực có phân trang và bộ lọc | x | x | Quản lý văn phòng làm việc |
| 48 | `GET` | `/api/v1/branches/by-company` | Lấy toàn bộ chi nhánh theo công ty (cho chọn nhanh / GPS) | x | x | Dropdown & Chấm công GPS |
| 49 | `GET` | `/api/v1/branches/{branchId}` | Lấy thông tin chi tiết một chi nhánh theo ID | x | x |  |
| 50 | `POST` | `/api/v1/branches` | Tạo mới chi nhánh / văn phòng kèm tọa độ Lat/Lng và bán kính GPS | x | x | Modal tạo chi nhánh |
| 51 | `PUT` | `/api/v1/branches/{branchId}` | Cập nhật thông tin chi nhánh / tọa độ GPS và bán kính chấm công | x | x | Modal sửa chi nhánh |
| 52 | `DELETE`| `/api/v1/branches/{branchId}` | Xóa mềm chi nhánh | x | x | Dialog xác nhận xóa |

---

### Module 11: Quản lý Tổ chức - Trung tâm Chi phí (`CostCenterController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 53 | `GET` | `/api/v1/cost-centers` | Lấy danh sách trung tâm chi phí theo công ty có phân trang | x | x | Quản lý trung tâm chi phí |
| 54 | `GET` | `/api/v1/cost-centers/all` | Lấy toàn bộ trung tâm chi phí theo công ty (cho dropdown) | x | x | Dropdown gán phòng ban |
| 55 | `GET` | `/api/v1/cost-centers/{costCenterId}` | Lấy thông tin chi tiết một trung tâm chi phí theo ID | x | x |  |
| 56 | `POST` | `/api/v1/cost-centers` | Tạo mới trung tâm chi phí | x | x | Modal tạo trung tâm chi phí |
| 57 | `PUT` | `/api/v1/cost-centers/{costCenterId}` | Cập nhật thông tin trung tâm chi phí | x | x | Modal sửa trung tâm chi phí |
| 58 | `DELETE`| `/api/v1/cost-centers/{costCenterId}` | Xóa mềm trung tâm chi phí | x | x | Dialog xác nhận xóa |

---

### Module 12: Quản lý Tổ chức - Chức danh Công việc (`JobTitleController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 59 | `GET` | `/api/v1/job-titles` | Lấy danh sách chức danh theo công ty có phân trang | x | x | Quản lý chức danh |
| 60 | `GET` | `/api/v1/job-titles/all` | Lấy toàn bộ chức danh theo công ty (cho dropdown) | x | x | Dropdown chức danh nhân viên |
| 61 | `GET` | `/api/v1/job-titles/{jobTitleId}` | Lấy thông tin chi tiết một chức danh theo ID | x | x |  |
| 62 | `POST` | `/api/v1/job-titles` | Tạo mới chức danh công việc | x | x | Modal tạo chức danh |
| 63 | `PUT` | `/api/v1/job-titles/{jobTitleId}` | Cập nhật thông tin chức danh công việc | x | x | Modal sửa chức danh |
| 64 | `DELETE`| `/api/v1/job-titles/{jobTitleId}` | Xóa mềm chức danh công việc | x | x | Dialog xác nhận xóa |

---

### Module 13: Quản lý Tổ chức - Cấp bậc Chức danh (`JobLevelController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 65 | `GET` | `/api/v1/job-levels` | Lấy danh sách cấp bậc theo công ty có phân trang | x | x | Quản lý cấp bậc thẩm quyền |
| 66 | `GET` | `/api/v1/job-levels/all` | Lấy toàn bộ cấp bậc theo công ty đã sắp xếp rank_order tăng dần | x | x | Dropdown cấp bậc nhân viên |
| 67 | `GET` | `/api/v1/job-levels/{jobLevelId}` | Lấy thông tin chi tiết một cấp bậc theo ID | x | x |  |
| 68 | `POST` | `/api/v1/job-levels` | Tạo mới cấp bậc chức danh (kèm thứ tự rank_order) | x | x | Modal tạo cấp bậc |
| 69 | `PUT` | `/api/v1/job-levels/{jobLevelId}` | Cập nhật tên và thứ tự cấp bậc chức danh | x | x | Modal sửa cấp bậc |
| 70 | `DELETE`| `/api/v1/job-levels/{jobLevelId}` | Xóa mềm cấp bậc chức danh | x | x | Dialog xác nhận xóa |

---

### Module 14: Quản lý Tổ chức - Sơ đồ & Phòng ban (`DepartmentController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 71 | `GET` | `/api/v1/departments` | Lấy danh sách phòng ban theo công ty có phân trang và tìm kiếm | x | x | Màn hình quản lý phòng ban |
| 72 | `GET` | `/api/v1/departments/tree` | Lấy cây sơ đồ tổ chức (Org Tree) theo mốc ngày hiệu lực chốt cơ cấu | x | x | Màn hình [25] Sơ đồ tổ chức (lõi) |
| 73 | `GET` | `/api/v1/departments/export` | Xuất file Excel sơ đồ cơ cấu tổ chức theo ngày hiệu lực chốt | x | x | Xuất báo cáo cấu trúc tổ chức |
| 74 | `GET` | `/api/v1/departments/{departmentId}` | Lấy thông tin chi tiết phòng ban theo ID và ngày hiệu lực | x | x | Chi tiết đơn vị / Drawer |
| 75 | `GET` | `/api/v1/departments/{departmentId}/history` | Lấy toàn bộ lịch sử các phiên bản hiệu lực của một phòng ban | x | x | Drawer lịch sử phiên bản |
| 76 | `GET` | `/api/v1/departments/{departmentId}/move-impact` | Xem trước tác động chuyển nhánh (kiểm tra chu trình & đếm đơn vị con) | x | x | Modal xem trước tác động |
| 77 | `POST` | `/api/v1/departments` | Tạo mới phòng ban và phiên bản cơ cấu ban đầu | x | x | Modal tạo phòng ban mới |
| 78 | `PUT` | `/api/v1/departments/{departmentId}` | Cập nhật phòng ban (tạo phiên bản mới theo ngày hiệu lực) | x | x | Modal sửa cơ cấu phòng ban |
| 79 | `PUT` | `/api/v1/departments/{departmentId}/move` | Điều chuyển vị trí phòng ban trong cây cơ cấu sang phòng ban cha mới | x | x | Kéo thả cây / Modal chuyển vị trí |
| 80 | `PUT` | `/api/v1/departments/{departmentId}/permission-inheritance` | Bật / tắt cờ kế thừa phân quyền xuống các đơn vị con | x | x | Switch toggle kế thừa quyền |
| 81 | `DELETE`| `/api/v1/departments/{departmentId}` | Giải thể phòng ban (chỉ khi không còn phòng ban con trực thuộc) | x | x | Dialog xác nhận giải thể |

---

### Module 15: Hồ sơ nhân sự & Vòng đời nhân viên (Employee Profile & Lifecycle - `EmployeeController`, `EmployeeDocumentController`, `EmployeeFamilyController`, `EmployeeAssignmentController`, `EmployeeLifecycleController`, `FaceEnrollmentController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 82 | `GET` | `/api/v1/employees` | Lấy danh sách nhân viên phân trang (lọc phòng ban, chức danh, chi nhánh, trạng thái) | x | x | Màn hình /employees (Bộ lọc đa tiêu chí, phân trang) |
| 83 | `POST` | `/api/v1/employees` | Tiếp nhận và khởi tạo hồ sơ nhân viên mới (kèm tài khoản & bổ nhiệm ban đầu) | x | x | Modal Tiếp nhận nhân sự (EmployeeCreateDialog) |
| 84 | `GET` | `/api/v1/employees/{employeeId}` | Lấy chi tiết toàn diện hồ sơ nhân viên (tính toán bộ 3 chiều & trạng thái hiện hành) | x | x | Modal Chi tiết nhân viên 5 tabs (EmployeeDetailDialog) |
| 85 | `PUT` | `/api/v1/employees/{employeeId}` | Cập nhật thông tin cá nhân, định danh và thuế - bảo hiểm của nhân sự | x | x | Modal Cập nhật lý lịch (EmployeeEditDialog) |
| 86 | `GET` | `/api/v1/employees/export` | Yêu cầu xuất báo cáo danh sách nhân sự ra file Excel (bất đồng bộ) | x | x | Nút "Xuất Excel" trên trang /employees |
| 87 | `GET` | `/api/v1/me/profile` | Tra cứu thông tin hồ sơ của chính nhân viên đang đăng nhập | x |   | Tạm chưa làm giao diện trang cá nhân (/me/profile) |
| 88 | `PUT` | `/api/v1/me/profile` | Nhân viên tự cập nhật thông tin liên hệ được phép (SĐT, email cá nhân, địa chỉ) | x |   | Tạm chưa làm giao diện trang cá nhân (/me/profile) |
| 89 | `GET` | `/api/v1/employees/{employeeId}/identity-documents` | Lấy danh sách giấy tờ định danh (CCCD, Hộ chiếu) | x | x | Tab Giấy tờ & Ngân hàng (EmployeeDetailDialog) |
| 90 | `POST` | `/api/v1/employees/{employeeId}/identity-documents` | Thêm mới giấy tờ định danh (kiểm tra chống trùng số định danh) | x | x | Modal Thêm giấy tờ (IdentityDocumentDialog) |
| 91 | `PUT` | `/api/v1/identity-documents/{documentId}` | Sửa thông tin ngày cấp, nơi cấp, hạn dùng giấy tờ | x | x | Modal Sửa giấy tờ (IdentityDocumentDialog) |
| 92 | `DELETE`| `/api/v1/identity-documents/{documentId}` | Xóa mềm giấy tờ định danh khỏi hồ sơ | x | x | Nút Xóa giấy tờ kèm xác nhận an toàn |
| 93 | `GET` | `/api/v1/employees/{employeeId}/bank-account` | Xem chi tiết thông tin tài khoản ngân hàng nhận lương | x | x | Tab Giấy tờ & Ngân hàng (EmployeeDetailDialog) |
| 94 | `PUT` | `/api/v1/employees/{employeeId}/bank-account` | Cài đặt / cập nhật tài khoản ngân hàng nhận lương | x | x | Modal Cập nhật tài khoản ngân hàng (BankAccountDialog) |
| 95 | `GET` | `/api/v1/employees/{employeeId}/dependents` | Danh sách người phụ thuộc đăng ký giảm trừ gia cảnh | x | x | Tab Người phụ thuộc & Khẩn cấp (EmployeeDetailDialog) |
| 96 | `POST` | `/api/v1/employees/{employeeId}/dependents` | Đăng ký mới người phụ thuộc giảm trừ gia cảnh | x | x | Modal Thêm người phụ thuộc (DependentDialog) |
| 97 | `PUT` | `/api/v1/dependents/{dependentId}` | Cập nhật thông tin người phụ thuộc và mốc giảm trừ thuế | x | x | Modal Sửa người phụ thuộc (DependentDialog) |
| 98 | `DELETE`| `/api/v1/dependents/{dependentId}` | Xóa bản ghi người phụ thuộc | x | x | Nút Xóa người phụ thuộc kèm xác nhận an toàn |
| 99 | `GET` | `/api/v1/employees/{employeeId}/emergency-contacts` | Lấy danh sách người liên hệ trong trường hợp khẩn cấp | x | x | Tab Người phụ thuộc & Khẩn cấp (EmployeeDetailDialog) |
| 100 | `POST` | `/api/v1/employees/{employeeId}/emergency-contacts` | Thêm mới người liên hệ khẩn cấp | x | x | Modal Thêm liên hệ khẩn cấp (EmergencyContactDialog) |
| 101 | `PUT` | `/api/v1/emergency-contacts/{contactId}` | Cập nhật thông tin người liên hệ khẩn cấp | x | x | Modal Sửa liên hệ khẩn cấp (EmergencyContactDialog) |
| 102 | `DELETE`| `/api/v1/emergency-contacts/{contactId}` | Xóa bản ghi người liên hệ khẩn cấp | x | x | Nút Xóa liên hệ khẩn cấp kèm xác nhận an toàn |
| 103 | `GET` | `/api/v1/employees/{employeeId}/work-assignments` | Tra cứu toàn bộ lịch sử phân công công tác 3 chiều của nhân viên | x | x | Tab Công tác 3 chiều (EmployeeDetailDialog) |
| 104 | `GET` | `/api/v1/employees/{employeeId}/work-assignments/at` | Tra cứu phân công công tác có hiệu lực tại ngày chỉ định | x |   | Chưa có UI chọn ngày lọc công tác (chỉ mới có RTK hook) |
| 105 | `POST` | `/api/v1/employees/{employeeId}/work-assignments` | Phân công công tác mới (Bổ nhiệm, luân chuyển phòng ban/chi nhánh/chức danh) | x | x | Modal Bổ nhiệm / Luân chuyển 3 chiều (WorkAssignmentDialog) |
| 106 | `GET` | `/api/v1/employees/{employeeId}/direct-reports` | Tra cứu danh sách nhân sự cấp dưới trực tiếp do nhân viên này quản lý | x |   | Chưa có UI hiển thị cây cấp dưới (chỉ mới có RTK hook) |
| 107 | `GET` | `/api/v1/employees/{employeeId}/status-history` | Tra cứu toàn bộ lịch sử biến động trạng thái làm việc | x | x | Tab Vòng đời & Thử việc (EmployeeDetailDialog) |
| 108 | `POST` | `/api/v1/employees/{employeeId}/status-changes` | Chuyển trạng thái làm việc (Tạm đình chỉ, Nghỉ chế độ, Thôi việc) | x | x | Modal Đổi trạng thái làm việc (StatusChangeDialog) |
| 109 | `GET` | `/api/v1/employees/{employeeId}/probation-evaluations` | Xem danh sách kết quả đánh giá các kỳ thử việc của nhân sự | x | x | Tab Vòng đời & Thử việc (EmployeeDetailDialog) |
| 110 | `POST` | `/api/v1/employees/{employeeId}/probation-evaluations` | Ghi nhận biên bản đánh giá thử việc (Đạt, Không đạt, Gia hạn) | x | x | Modal Biên bản đánh giá thử việc (ProbationEvaluationDialog) |
| 111 | `GET` | `/api/v1/employees/{employeeId}/official-eligibility` | Kiểm tra tự động điều kiện chuyển chính thức (thời hạn, kết quả thử việc) | x |   | Chưa có widget checklist điều kiện (chỉ mới có RTK hook) |
| 112 | `POST` | `/api/v1/employees/{employeeId}/confirm-official` | Phê duyệt chuyển chính thức sang ACTIVE (kết thúc thử việc) | x | x | Nút Xác nhận chuyển chính thức trên Modal Chi tiết |
| 113 | `GET` | `/api/v1/employees/{employeeId}/face-enrollments` | Tra cứu lịch sử đăng ký và thu hồi dữ liệu sinh trắc khuôn mặt | x |   | Tạm hoãn giao diện sinh trắc khuôn mặt |
| 114 | `POST` | `/api/v1/employees/{employeeId}/face-enrollments` | HR thực hiện thu thập và đăng ký vector mẫu khuôn mặt có sự đồng thuận | x |   | Tạm hoãn giao diện sinh trắc khuôn mặt |
| 115 | `POST` | `/api/v1/face-enrollments/{enrollmentId}/revoke` | Thu hồi / hủy hiệu lực mẫu sinh trắc chấm công của nhân viên | x |   | Tạm hoãn giao diện sinh trắc khuôn mặt |
| 116 | `GET` | `/api/v1/me/face-enrollment` | Kiểm tra tình trạng đăng ký sinh trắc khuôn mặt của chính tôi | x |   | Tạm hoãn giao diện sinh trắc khuôn mặt |
| 117 | `POST` | `/api/v1/me/face-enrollment` | Nhân viên tự chụp và đăng ký mẫu khuôn mặt qua thiết bị di động | x |   | Tạm hoãn giao diện sinh trắc khuôn mặt |
| 118 | `DELETE`| `/api/v1/me/face-enrollment` | Nhân viên yêu cầu xóa bỏ vĩnh viễn dữ liệu sinh trắc cá nhân | x |   | Tạm hoãn giao diện sinh trắc khuôn mặt |

---

### Module 16: Quản lý Hợp đồng lao động & Ký điện tử (Contract Management & E-Contract - `ContractTemplateController`, `ContractController`, `ContractAppendixController`, `ContractSignerController`, `ContractSelfServiceController`)

| STT | Phương thức | Đường dẫn API (Endpoint) | Mô tả chức năng | Backend | Frontend | Ghi chú |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
| 119 | `GET` | `/api/v1/contract-templates` | Lấy danh sách mẫu hợp đồng phân trang (lọc kind, isActive, search) | x | x | Trang /contracts/templates |
| 120 | `GET` | `/api/v1/contract-templates/{id}` | Lấy chi tiết mẫu hợp đồng và phiên bản đang kích hoạt | x | x | Modal ContractTemplateDialog |
| 121 | `POST` | `/api/v1/contract-templates` | Tạo mới mẫu hợp đồng kèm phiên bản ban đầu (version 1) | x | x | Modal tạo mẫu hợp đồng |
| 122 | `PUT` | `/api/v1/contract-templates/{id}` | Cập nhật thông tin chung của mẫu hợp đồng (tên, phân loại) | x | x | Modal sửa mẫu hợp đồng |
| 123 | `POST` | `/api/v1/contract-templates/{id}/versions` | Tạo phiên bản mới cho mẫu hợp đồng đã tồn tại | x | x | Nút lưu thành phiên bản mới |
| 124 | `GET` | `/api/v1/contract-templates/{id}/versions` | Lấy danh sách toàn bộ phiên bản của một mẫu hợp đồng | x | x | Tab Lịch sử phiên bản mẫu |
| 125 | `GET` | `/api/v1/contract-templates/{id}/versions/{versionId}` | Xem chi tiết nội dung mẫu HTML/Handlebars của phiên bản cụ thể | x | x | Chi tiết phiên bản mẫu |
| 126 | `POST` | `/api/v1/contract-templates/{id}/versions/{versionId}/publish` | Kích hoạt phát hành phiên bản mẫu để áp dụng soạn thảo | x | x | Nút kích hoạt bản này |
| 127 | `POST` | `/api/v1/contract-templates/render-preview` | Xem trước nội dung hợp đồng khi gán dữ liệu biến vào mẫu | x | x | Nút Render thử nghiệm Handlebars |
| 128 | `GET` | `/api/v1/contracts` | Lấy danh sách hợp đồng (phân trang, lọc nhân viên, phòng ban, loại HĐ, trạng thái, hạn ký) | x | x | Màn hình chính /contracts & KPI Cards |
| 129 | `POST` | `/api/v1/contracts` | Soạn thảo hợp đồng mới ở trạng thái DRAFT (kèm danh mục phụ cấp và các bên ký) | x | x | Modal Soạn thảo HĐLĐ (ContractCreateDialog) |
| 130 | `GET` | `/api/v1/contracts/{id}` | Lấy chi tiết hợp đồng, danh mục phụ cấp và tiến độ ký số các bên | x | x | Modal Chi tiết 360 độ (ContractDetailDialog) |
| 131 | `PUT` | `/api/v1/contracts/{id}` | Cập nhật nội dung hợp đồng (chỉ cho phép khi DRAFT hoặc PENDING_APPROVAL) | x | x | Chỉnh sửa điều khoản hợp đồng |
| 132 | `DELETE`| `/api/v1/contracts/{id}` | Xóa hợp đồng bản nháp (DRAFT) | x | x | Nút Xóa nháp trên Modal Chi tiết |
| 133 | `POST` | `/api/v1/contracts/{id}/submit-approval` | Trình duyệt hợp đồng lao động (DRAFT -> PENDING_APPROVAL) | x | x | Nút Trình phê duyệt |
| 134 | `POST` | `/api/v1/contracts/{id}/approve` | Phê duyệt nội dung hợp đồng lao động (PENDING_APPROVAL -> APPROVED) | x | x | Nút Phê duyệt hợp đồng |
| 135 | `POST` | `/api/v1/contracts/{id}/reject` | Từ chối phê duyệt hợp đồng kèm lý do | x | x | Nút Từ chối phê duyệt |
| 136 | `POST` | `/api/v1/contracts/{id}/send-signing` | Phát lệnh ký điện tử đa bên (tạo phiên bản PDF, APPROVED -> IN_SIGNING) | x | x | Nút Phát lệnh Ký điện tử |
| 137 | `POST` | `/api/v1/contracts/{id}/activate` | Kích hoạt hiệu lực hợp đồng (chuyển sang ACTIVE sau khi các bên ký đủ) | x | x | Nút Kích hoạt hiệu lực |
| 138 | `POST` | `/api/v1/contracts/{id}/terminate` | Chấm dứt hợp đồng lao động (thanh lý hợp đồng / kết thúc quan hệ lao động) | x | x | Modal Chấm dứt / Thanh lý (ContractTerminateDialog) |
| 139 | `GET` | `/api/v1/contracts/{id}/preview-pdf` | Tải xuống hoặc xem trước bản in / PDF hợp đồng lao động | x | x | Nút In hợp đồng / Preview |
| 140 | `GET` | `/api/v1/contracts/{id}/versions` | Tra cứu lịch sử phiên bản và nhật ký thay đổi của hợp đồng | x | x | Tab 4 Nhật ký & Phiên bản (ContractDetailDialog) |
| 141 | `GET` | `/api/v1/contracts/compliance-check` | Kiểm tra tính tuân thủ pháp lý theo BLLĐ 2019 (số lần ký, thời hạn) | x | x | Tự động kiểm tra tuân thủ trên ContractCreateDialog |
| 142 | `GET` | `/api/v1/contracts/{contractId}/appendices` | Lấy danh sách toàn bộ phụ lục của một hợp đồng lao động | x | x | Tab 2 Phụ lục (ContractDetailDialog) |
| 143 | `POST` | `/api/v1/contracts/{contractId}/appendices` | Soạn thảo phụ lục hợp đồng mới (DRAFT) | x | x | Modal Soạn thảo phụ lục (ContractAppendixDialog) |
| 144 | `GET` | `/api/v1/contract-appendices/{id}` | Lấy chi tiết phụ lục hợp đồng và các điều khoản điều chỉnh | x | x | Modal Chi tiết phụ lục (ContractAppendixDialog) |
| 145 | `PUT` | `/api/v1/contract-appendices/{id}` | Cập nhật nội dung phụ lục hợp đồng (khi đang DRAFT) | x | x | Cập nhật phụ lục bản nháp |
| 146 | `DELETE`| `/api/v1/contract-appendices/{id}` | Xóa phụ lục bản nháp | x | x | Nút Xóa nháp phụ lục |
| 147 | `POST` | `/api/v1/contract-appendices/{id}/submit-approval` | Gửi phê duyệt phụ lục hợp đồng | x | x | Nút Gửi duyệt phụ lục |
| 148 | `POST` | `/api/v1/contract-appendices/{id}/approve` | Phê duyệt phụ lục hợp đồng | x | x | Nút Phê duyệt phụ lục |
| 149 | `POST` | `/api/v1/contract-appendices/{id}/reject` | Từ chối phụ lục hợp đồng kèm lý do | x | x | Nút Từ chối phụ lục |
| 150 | `POST` | `/api/v1/contract-appendices/{id}/send-signing` | Phát lệnh ký số phụ lục hợp đồng | x | x | Nút Phát lệnh ký số phụ lục |
| 151 | `POST` | `/api/v1/contract-appendices/{id}/activate` | Kích hoạt hiệu lực phụ lục hợp đồng | x | x | Nút Kích hoạt phụ lục |
| 152 | `GET` | `/api/v1/contract-appendices/{id}/preview-pdf` | Xem trước hoặc tải PDF phụ lục hợp đồng | x | x | Tích hợp xem trước phụ lục |
| 153 | `GET` | `/api/v1/contracts/{contractId}/signers` | Tra cứu tiến độ ký và danh sách người ký hợp đồng | x | x | Tab 3 & Modal Ký số (ContractSigningDialog) |
| 154 | `POST` | `/api/v1/contract-signers/{id}/resend-otp` | Gửi lại mã xác thực OTP ký số cho người ký qua Email / SMS | x | x | Nút Gửi lại OTP trên ContractSigningDialog |
| 155 | `POST` | `/api/v1/contract-signers/{id}/verify-audit` | Kiểm tra xác thực tính toàn vẹn chữ ký số và mã băm SHA-256 | x | x | Nút Kiểm toán băm SHA-256 |
| 156 | `POST` | `/api/v1/contract-signers/{id}/cancel-request` | Hủy lượt ký hợp đồng của một cá nhân | x | x | Tích hợp hủy yêu cầu ký |
| 157 | `GET` | `/api/v1/me/contracts` | Nhân viên tra cứu danh sách hợp đồng cá nhân của mình | x |   | Tạm thời hoãn trang cá nhân (/me/contracts) |
| 158 | `GET` | `/api/v1/me/contracts/{id}` | Nhân viên xem chi tiết hợp đồng và tải tệp tin hợp đồng đã ký | x |   | Tạm thời hoãn trang cá nhân (/me/contracts) |
| 159 | `POST` | `/api/v1/me/contracts/{id}/request-otp` | Nhân viên bấm yêu cầu nhận mã OTP xác thực ký số cá nhân | x | x | Nút Lấy mã OTP (ContractSigningDialog) |
| 160 | `POST` | `/api/v1/me/contracts/{id}/sign` | Nhân viên xác nhận ký điện tử vào hợp đồng với mã OTP | x | x | Nút Xác nhận Ký (ContractSigningDialog) |

