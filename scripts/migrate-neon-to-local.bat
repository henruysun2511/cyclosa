@echo off
chcp 65001 >nul
echo ========================================================
echo   CYCLOSA - Migrate Database từ Neon Cloud sang Local
echo ========================================================
echo.

set NEON_URL=postgresql://neondb_owner:npg_9QAcOhB4HmZj@ep-sparkling-breeze-b3ixa4f3-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
set LOCAL_DB=cyclosa_db
set LOCAL_USER=postgres
set DUMP_FILE=neon_database_backup.sql

echo [1/3] Đang xuất toàn bộ Schema và Dữ liệu từ Neon Cloud...
docker exec -t cyclosa-postgres pg_dump "%NEON_URL%" --no-owner --no-privileges --clean --if-exists -f /tmp/%DUMP_FILE%

if %ERRORLEVEL% NEQ 0 (
    echo [LỖI] Không thể xuất dữ liệu từ Neon Cloud qua Docker container.
    echo Vui lòng đảm bảo container 'cyclosa-postgres' đang chạy (docker compose --profile infra up -d).
    pause
    exit /b 1
)

echo [2/3] Đang nạp dữ liệu vào PostgreSQL Local (cyclosa_db)...
docker exec -t cyclosa-postgres psql -U %LOCAL_USER% -d %LOCAL_DB% -f /tmp/%DUMP_FILE%

echo [3/3] Dọn dẹp tệp tin tạm...
docker exec -t cyclosa-postgres rm -f /tmp/%DUMP_FILE%

echo.
echo ========================================================
echo   MIGRATE HOÀN TẤT THÀNH CÔNG!
echo ========================================================
echo Dữ liệu hiện đã sẵn sàng tại localhost:5432/cyclosa_db.
pause
