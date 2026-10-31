"use client";

import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductStatusBadge } from "./product-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Product } from "../types/product.types";

interface ProductDetailProps {
  product: Product;
  onDelete?: () => void;
}

export function ProductDetail({ product, onDelete }: ProductDetailProps) {
  return (
    <div className="space-y-6">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" asChild className="self-start">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa sản phẩm
          </Button>
        </div>
      </div>

      {/* ── Detail Card ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="border-b bg-muted/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-xs font-semibold text-primary uppercase">
                SKU: {product.sku}
              </span>
              <CardTitle className="text-2xl font-bold mt-1">
                {product.name}
              </CardTitle>
            </div>
            <ProductStatusBadge status={product.status} />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Danh mục
              </dt>
              <dd className="mt-1 text-base font-semibold text-foreground">
                {product.category}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Đơn giá niêm yết
              </dt>
              <dd className="mt-1 text-xl font-bold text-primary">
                {formatCurrency(product.price)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Số lượng tồn kho
              </dt>
              <dd
                className={`mt-1 text-base font-bold ${
                  product.stockQuantity === 0
                    ? "text-destructive"
                    : product.stockQuantity <= 10
                    ? "text-amber-600"
                    : "text-foreground"
                }`}
              >
                {product.stockQuantity.toLocaleString("vi-VN")} đơn vị
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Thời điểm khởi tạo
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {formatDate(product.createdAt)}
              </dd>
            </div>

            {product.updatedAt && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Cập nhật gần nhất
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {formatDate(product.updatedAt)}
                </dd>
              </div>
            )}
          </dl>

          {/* ── Mô tả chi tiết ───────────────────────────────────────── */}
          <div className="mt-8 border-t pt-6">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Mô tả chi tiết sản phẩm
            </h4>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-line bg-muted/30 p-4 rounded-md">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
