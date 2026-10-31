"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { ProductDetail } from "@/features/products/components/product-detail";
import { useGetProductByIdQuery } from "@/features/products/api/product-api";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const { data: product, isLoading, isError, error, refetch } =
    useGetProductByIdQuery(id, { skip: !id });

  if (!isLoading && !product && !isError) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi tiết sản phẩm"
        action={
          <Button variant="outline" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        </div>
      )}

      {isError && <ErrorState error={error} onRetry={refetch} />}

      {product && <ProductDetail product={product} />}
    </div>
  );
}
