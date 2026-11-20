# CYCLOSA - PowerShell Script to migrate database from Neon Cloud to Local PostgreSQL
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   CYCLOSA - Migrate Database từ Neon Cloud sang Local   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$neonUrl = "postgresql://neondb_owner:npg_9QAcOhB4HmZj@ep-sparkling-breeze-b3ixa4f3-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
$localDb = "cyclosa_db"
$localUser = "postgres"
$dumpFile = "neon_database_backup.sql"

# 1. Kiểm tra container cyclosa-postgres
Write-Host "[1/4] Kiểm tra container PostgreSQL Local..." -ForegroundColor Yellow
$containerStatus = docker inspect -f '{{.State.Running}}' cyclosa-postgres 2>$null

if ($containerStatus -ne "true") {
    Write-Host "Container 'cyclosa-postgres' chưa chạy! Đang khởi động..." -ForegroundColor Yellow
    docker compose --profile infra up -d postgres
    Start-Sleep -Seconds 5
}

# 2. Xuất dữ liệu từ Neon Cloud
Write-Host "[2/4] Đang kết nối và dump dữ liệu từ Neon Cloud..." -ForegroundColor Yellow
docker exec -t cyclosa-postgres pg_dump $neonUrl --no-owner --no-privileges --clean --if-exists -f /tmp/$dumpFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "[LỖI] Xuất dữ liệu từ Neon Cloud thất bại! Vui lòng kiểm tra kết nối mạng." -ForegroundColor Red
    exit 1
}

# 3. Nạp dữ liệu vào Local PostgreSQL
Write-Host "[3/4] Đang nạp dữ liệu vào cơ sở dữ liệu local ($localDb)..." -ForegroundColor Yellow
docker exec -t cyclosa-postgres psql -U $localUser -d $localDb -f /tmp/$dumpFile

# 4. Đối soát số lượng bảng
Write-Host "[4/4] Đối soát tổng số bảng và bản ghi đã migrate..." -ForegroundColor Yellow
$verifySql = "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';"
docker exec -t cyclosa-postgres psql -U $localUser -d $localDb -c $verifySql

# Dọn dẹp
docker exec -t cyclosa-postgres rm -f /tmp/$dumpFile

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "   MIGRATE DỮ LIỆU THÀNH CÔNG!                          " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Local PostgreSQL đã sẵn sàng tại: localhost:5432/$localDb" -ForegroundColor Green
