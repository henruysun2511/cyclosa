# CYCLOSA AI Microservice (`cyclosa_ai`)

Dịch vụ AI Gateway chuyên biệt phục vụ hệ sinh thái quản trị nhân sự số **CYCLOSA HRM**, xây dựng trên nền tảng **FastAPI (Python)**, chạy tại cổng mặc định `8000`.

---

## 1. Bản đồ Phân hệ AI Chuyên biệt (Architecture Map)

### 📌 1. Phân hệ OCR & Thẩm định Hồ sơ Số hóa (`/api/v1/ocr/...` - TT 05/2025/TT-BNV)
- **Thẩm định Kỹ thuật Tệp số hóa (`POST /api/v1/ocr/quality-check`):**
  - Kiểm tra độ phân giải: Quy chuẩn $\ge 300\text{ DPI}$ cho hồ sơ bảo quản vĩnh viễn/lâu năm theo Thông tư 05/2025/TT-BNV.
  - Đo độ mờ (Blurry / Sharpness) bằng toán tử Laplacian Variance ($< 100.0$ cảnh báo ảnh nhòe).
  - Tự động phát hiện góc nghiêng (Skew angle) và đánh dấu Deskew.
  - Phân loại trạng thái: `VALID`, `WARNING_BLURRY`, `REJECTED_LOW_RES`.
- **OCR Bóc tách Dữ liệu có Cấu trúc (`POST /api/v1/ocr/extract`):**
  - **CCCD/CMND:** Số định danh 12 số, họ tên có dấu, ngày sinh ISO-8601, quê quán, nơi thường trú, ngày cấp, hạn dùng.
  - **Bằng cấp (Diploma):** Cơ sở đào tạo, chuyên ngành, trình độ, xếp loại, năm tốt nghiệp, số hiệu văn bằng.
  - **Hợp đồng lao động:** Loại hợp đồng, người SDLĐ, người LĐ, chức danh, mức lương cơ bản, thời hạn.
  - **Tài liệu hành chính:** Số ký hiệu, cơ quan ban hành, ngày ban hành, tóm tắt.
  - Tính toán `field_confidences` (0.0 - 1.0) cho từng trường, `overall_confidence`, và tự động gắn cờ `needs_manual_review = true` (kích hoạt Split-screen review cho HR khi $< 85\%$).

### 📌 2. Phân hệ Trợ lý AI 1-1 Chatbot Assistant (`/api/v1/assistant/...` - Module 18)
- **Hội thoại Trợ lý AI (`POST /api/v1/assistant/chat`):**
  - **Tầng 1 (Intent Guard):** Phân loại 3 nhãn (`in_scope_data`, `in_scope_policy`, `out_of_scope`). Chặn đứng tấn công Prompt Injection, Jailbreak, rò rỉ cơ sở dữ liệu.
  - **Tầng 2 (Function Calling với RBAC & DataScope):** 
    - `ROLE_EMPLOYEE`: Chỉ tra cứu dữ liệu cá nhân (`get_my_leave_balance`, `get_my_attendance_summary`, `get_my_payslip_overview`, `get_company_holidays`).
    - `ROLE_DEPARTMENT_HEAD`: Tra cứu thêm tình hình vắng mặt và định biên trong phòng ban (`get_team_leave_status`, `get_headcount_by_department`). Chặn truy cập trái thẩm quyền.
    - `ROLE_HR_MANAGER` / `ROLE_ADMIN`: Tra cứu báo cáo tuyển dụng, định biên toàn công ty.
  - **Tầng 3 (RAG Knowledge Base & Semantic Search):** 
    - Tra cứu Quy chế nội bộ (Thời giờ làm việc, Thai sản, WFH/Remote, Bảo hiểm sức khỏe, Thông tư 05/2025/TT-BNV, BLLĐ 2019).
    - Trích xuất nguồn tham chiếu chính thức (`Citations`: Văn bản, Điều khoản, Trích dẫn).
- **Phân loại Ý định Độc lập (`POST /api/v1/assistant/classify-intent`).**

### 📌 3. Phân hệ Tuyển dụng Thông minh (`/api/v1/recruitment/...`)
- **AI CV Screening & Match Score (`POST /api/v1/recruitment/cv/screen`):**
  - Bắt buộc kiểm tra đồng thuận `ai_screening_consent = true`.
  - Thực thi **PII Redaction** (khử tên, ngày sinh, giới tính, CCCD) để chống thiên vị (Anti-bias).
  - Chấm điểm 0 - 100 kèm bản giải trình điểm mạnh/thiếu sót.
- **AI CV Parsing (`POST /api/v1/recruitment/cv/parse`):** Bóc tách kỹ năng, học vấn, kinh nghiệm.
- **Sinh Câu hỏi Phỏng vấn STAR (`POST /api/v1/recruitment/interviews/generate-questions`).**
- **Rà soát Tuân thủ Tuyển dụng (`POST /api/v1/recruitment/compliance/scan-content`).**

### 📌 4. Phân hệ Chấm công & Nhận diện Khuôn mặt (`/api/v1/attendance/...`)
- **Đăng ký Vector Khuôn mặt (`POST /api/v1/attendance/face/enroll`):** Trích xuất vector 512-dim chuẩn hóa L2.
- **So khớp 1:1 & Anti-Spoofing Liveness (`POST /api/v1/attendance/face/verify`):** Cosine Similarity và phát hiện gian lận chụp lại màn hình.
- **Phát hiện Dị thường Chấm công (`POST /api/v1/attendance/anomaly/detect`):** Phát hiện GPS Spoofing, dịch chuyển bất thường vượt vận tốc cho phép.

---

## 2. Hướng dẫn Cài đặt & Khởi chạy

### Cài đặt môi trường Python:
```bash
cd cyclosa_ai

# Cài đặt thư viện:
pip install -r requirements.txt
```

### Cấu hình tệp `.env`:
```ini
HOST=0.0.0.0
PORT=8000
DEBUG=true
INTERNAL_API_KEY=cyclosa-internal-ai-secret-key-2026

# AI Providers (Tùy chọn: Để trống hệ thống tự kích hoạt Mock/Regex Mode thông minh)
GEMINI_API_KEY=
OPENAI_API_KEY=
DEFAULT_LLM_MODEL=gemini/gemini-1.5-flash
```

### Khởi chạy dịch vụ:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Swagger UI:** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/api/v1/healthz`

### Chạy Kiểm thử Tự động (100% Pass):
```bash
pytest
```
*(Hiện có 32 bài test tự động bao phủ trọn vẹn 4 phân hệ).*
