"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ProductStatusBadge } from "./product-status-badge";
import type { Product } from "../types/product.types";
import { getProductCategoryLabel } from "../utils/product.utils";

interface ColumnActionsProps {
  product: Product;
  onDelete: (product: Product) => void;
}

function ColumnActions({ product, onDelete }: ColumnActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Mở menu</span>
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
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(product)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getProductColumns(
  onDelete: (product: Product) => void
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: "Sản phẩm",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ getValue }) =>
        getProductCategoryLabel(getValue() as Product["category"]),
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ getValue }) => (
        <span className="font-medium">{formatCurrency(Number(getValue()))}</span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Tồn kho",
      cell: ({ getValue }) => {
        const stock = Number(getValue());
        return (
          <span className={stock <= 10 ? "text-destructive font-medium" : ""}>
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => (
        <ProductStatusBadge status={getValue() as Product["status"]} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ getValue }) => formatDate(String(getValue())),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ColumnActions product={row.original} onDelete={onDelete} />
      ),
    },
  ];
}
