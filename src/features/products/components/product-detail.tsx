import Image from "next/image";
import Link from "next/link";
import { Pencil, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ProductStatusBadge } from "./product-status-badge";
import { getProductCategoryLabel, isLowStock } from "../utils/product.utils";
import type { Product } from "../types/product.types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: Image */}
      <Card className="lg:col-span-1">
        <CardContent className="p-6">
          {product.imageUrl ? (
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
              <Package className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right: Details */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <div className="flex items-center gap-2">
              <ProductStatusBadge status={product.status} />
              <span className="text-sm text-muted-foreground">
                {getProductCategoryLabel(product.category)}
              </span>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/products/${product.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{product.description}</p>

          <Separator />

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Giá</dt>
              <dd className="mt-1 text-lg font-semibold">
                {formatCurrency(product.price)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Tồn kho
              </dt>
              <dd
                className={`mt-1 text-lg font-semibold ${
                  isLowStock(product.stock) ? "text-destructive" : ""
                }`}
              >
                {product.stock}
                {isLowStock(product.stock) && (
                  <span className="ml-2 text-sm font-normal">(Sắp hết)</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Ngày tạo
              </dt>
              <dd className="mt-1">{formatDate(product.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Cập nhật lần cuối
              </dt>
              <dd className="mt-1">{formatDate(product.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
