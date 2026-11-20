# CYCLOSA - Enterprise Human Resource & Workplace Management Platform

Hệ thống quản lý nguồn nhân lực doanh nghiệp toàn diện (Enterprise HRMS), vận hành nơi làm việc số và tự động hóa quy trình nghiệp vụ tích hợp AI.

---

## 📁 Cấu trúc dự án (Monorepo Architecture)

```
CYCLOSA/
├── cyclosa_fe/       # Frontend Application (Next.js 14 App Router, TypeScript, Tailwind CSS, Redux Toolkit)
├── cyclosa_be/       # Core Backend Microservice (Java 21, Spring Boot 3, Spring Security, JPA/Hibernate, PostgreSQL)
├── cyclosa_ai/       # AI & Computer Vision Service (Python 3.10+, FastAPI, Face Recognition, OCR, Document Analysis)
├── cyclosa_docx/     # Biểu mẫu & tài liệu nghiệp vụ
├── docker-compose.yml# Điều phối Docker Fullstack và hạ tầng độc lập
├── .gitignore        # Cấu hình bỏ qua tệp tin toàn hệ thống
└── README.md
```

---

## 🐳 Vận hành bằng Docker (Docker Operations)

### Cách 1: Khởi chạy toàn bộ hệ thống (1 Lệnh duy nhất)
Khởi chạy cả 5 service gồm: PostgreSQL 16 + Redis 7 + Backend + AI Service + Frontend Next.js:
```bash
docker compose up -d --build
```
* **Frontend**: http://localhost:3000
* **Backend API & Swagger**: http://localhost:8080/swagger-ui.html
* **AI Service Docs**: http://localhost:8000/docs
* **PostgreSQL**: `localhost:5432` (database: `cyclosa_db`, user: `postgres`, pass: `postgres`)
* **Redis**: `localhost:6379`

### Cách 2: Chỉ chạy Hạ tầng bằng Docker (DB + Redis), Code chạy trực tiếp máy thật
Tiện lợi nhất cho phát triển hàng ngày (hot-reload), không cần cài PostgreSQL hay Redis lên Windows:
```bash
docker compose --profile infra up -d
```
Sau đó bạn chạy code máy thật bằng terminal như bình thường (xem mục Chạy trực tiếp bên dưới).

### Cách 3: Chạy từng dịch vụ riêng lẻ trong Docker
```bash
# Chỉ chạy Backend (tự động kèm Postgres & Redis)
docker compose up -d cyclosa-be

# Chỉ chạy AI Service (tự động kèm Redis)
docker compose up -d cyclosa-ai

# Chỉ chạy Frontend
docker compose up -d cyclosa-fe
```

---

## 🚀 Khởi chạy trực tiếp trên máy thật (Host Run)

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
# Cổng mặc định: http://localhost:8000 (API docs: http://localhost:8000/docs)
```
