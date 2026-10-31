import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductStatusBadge } from "./product-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Product } from "../types/product.types";

export function getProductColumns(
  onDelete: (product: Product) => void
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "sku",
      header: "Mã SKU",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.getValue("sku")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên sản phẩm",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex flex-col">
            <Link
              href={`/products/${product.id}`}
              className="font-medium text-foreground hover:underline"
            >
              {product.name}
            </Link>
            {product.description && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {product.description}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue("category")}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Đơn giá",
      cell: ({ row }) => {
        const price = Number(row.getValue("price"));
        return (
          <span className="font-medium text-foreground">
            {formatCurrency(price)}
          </span>
        );
      },
    },
    {
      accessorKey: "stockQuantity",
      header: "Tồn kho",
      cell: ({ row }) => {
        const stock = Number(row.getValue("stockQuantity"));
        return (
          <span
            className={
              stock === 0
                ? "font-semibold text-destructive"
                : stock <= 10
                ? "font-medium text-amber-600"
                : "text-foreground"
            }
          >
            {stock.toLocaleString("vi-VN")}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <ProductStatusBadge status={row.getValue("status")} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Mở menu thao tác</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(product)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa sản phẩm
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
