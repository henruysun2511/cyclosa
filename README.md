# CYCLOSA - Enterprise Human Resource & Workplace Management Platform

Hệ thống quản lý nguồn nhân lực doanh nghiệp toàn diện (Enterprise HRMS), vận hành nơi làm việc số và tự động hóa quy trình nghiệp vụ tích hợp AI.

---

## 📁 Cấu trúc dự án (Monorepo Architecture)

```
CYCLOSA/
├── cyclosa_fe/       # Frontend Application (Next.js 14 App Router, TypeScript, Tailwind CSS, Redux Toolkit)
├── cyclosa_be/       # Core Backend Microservice (Java 17, Spring Boot 3, Spring Security, JPA/Hibernate, PostgreSQL)
├── cyclosa_ai/       # AI & Computer Vision Service (Python 3.10+, FastAPI, Face Recognition, OCR, Document Analysis)
├── cyclosa_docx/     # Biểu mẫu & tài liệu nghiệp vụ
├── .gitignore        # Cấu hình bỏ qua tệp tin toàn hệ thống
└── README.md
```

---

## 🚀 Khởi chạy nhanh (Quick Start)

### 1. Frontend (`cyclosa_fe`)
```bash
cd cyclosa_fe
npm install
npm run dev
# Cổng mặc định: http://localhost:3000
```

### 2. Backend (`cyclosa_be`)
```bash
cd cyclosa_be
./mvnw spring-boot:run
# Cổng mặc định: http://localhost:8080 (API docs: http://localhost:8080/swagger-ui.html)
```

### 3. AI Service (`cyclosa_ai`)
```bash
cd cyclosa_ai
python -m venv .venv
# Kích hoạt venv (Windows): .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Cổng mặc định: http://localhost:8000
```
