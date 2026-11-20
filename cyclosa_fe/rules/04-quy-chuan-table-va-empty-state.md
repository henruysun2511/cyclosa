# Quy chuẩn 04: Tiêu chuẩn Bảng Dữ liệu (Table), Trạng thái Trống (Empty State) & Tải trang (Loading)

> **Module chuẩn mực đối chiếu:**
> - [src/features/contract/components/contract-table.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/contract/components/contract-table.tsx)
> - [src/features/employee/components/employee-table.tsx](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/employee/components/employee-table.tsx)

---

## 1. Quy tắc Vàng: Table-Embedded Empty State (Đồng bộ Not Found)

> ⚠️ **LƯU Ý CỐT LÕI:** Khi bảng không có dữ liệu (danh sách rỗng hoặc bộ lọc không tìm thấy kết quả), **BẮT BUỘC PHẢI RENDER ĐẦY ĐỦ KHUNG BẢNG VÀ TIÊU ĐỀ CỘT**.
> **TUYỆT ĐỐI CẤM** tách rời trạng thái rỗng ra một thẻ `Card` hoặc thẻ `div` độc lập làm biến mất khung bảng!

### Mẫu JSX chuẩn 100% cho Table Component:

```tsx
<div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
  <div className="overflow-x-auto">
    <Table>
      <TableHeader className="bg-muted/40">
        <TableRow>
          <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
          <TableHead className="text-xs font-semibold">Họ và tên</TableHead>
          <TableHead className="text-xs font-semibold">Phòng ban</TableHead>
          <TableHead className="text-xs font-semibold">Trạng thái</TableHead>
          <TableHead className="w-20 text-center text-xs font-semibold">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {/* 1. TRƯỜNG HỢP ĐANG TẢI DỮ LIỆU (SKELETON ROWS) */}
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell className="text-center">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>
              <TableCell>
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-7 w-7 rounded-md mx-auto" />
              </TableCell>
            </TableRow>
          ))
        ) : items.length === 0 ? (
          /* 2. TRƯỜNG HỢP DANH SÁCH RỖNG (TABLE-EMBEDDED EMPTY STATE) */
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={5} // Tổng số cột của TableHeader
              className="h-48 text-center text-muted-foreground"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium">Không tìm thấy dữ liệu phù hợp</p>
                <p className="text-xs text-muted-foreground">
                  Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          /* 3. TRƯỜNG HỢP CÓ DỮ LIỆU BẢNH GHI */
          items.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="text-center text-xs text-muted-foreground">
                {(page - 1) * size + index + 1}
              </TableCell>
              <TableCell className="text-xs font-medium text-foreground">
                {item.fullName}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {item.departmentName}
              </TableCell>
              <TableCell>
                <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
                  {item.statusLabel}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-xs">
                    <DropdownMenuItem onClick={() => onDetail(item.id)}>
                      <Eye className="h-3.5 w-3.5 mr-2" />
                      <span>Xem chi tiết</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(item.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>

  {/* Phân trang đặt gọn ở chân bảng */}
  {totalPages > 0 && (
    <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
      <div>
        Hiển thị {Math.min((page - 1) * size + 1, totalItems)}-{Math.min(page * size, totalItems)} trong số {totalItems} bản ghi
      </div>
      <DataPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )}
</div>
```

---

## 2. Các nguyên tắc hiển thị Bảng

1. **Khung bao bọc:** Bọc bảng bằng `div` có class `rounded-xl border border-border bg-card shadow-xs overflow-hidden`.
2. **Cột STT chuẩn:** Tự động tính chỉ số STT theo công thức:
   $$\text{STT} = (\text{page} - 1) \times \text{size} + \text{index} + 1$$
3. **Typography nội dung bảng:**
   - Dòng tiêu đề cột (`TableHead`): `text-xs font-semibold`, nền `bg-muted/40`.
   - Dòng dữ liệu (`TableCell`): `text-xs`, padding vừa vặn, hover sáng nhẹ `hover:bg-muted/50`.
4. **Cột thao tác cuối cùng:** Dùng icon `MoreHorizontal` mở `DropdownMenu` căn lề phải (`align="end"`), thao tác nguy hiểm (Xóa) có màu chữ `text-destructive`.

