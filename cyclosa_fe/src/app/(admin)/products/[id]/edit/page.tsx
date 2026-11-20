"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "@/features/products/components/product-form";
import { useGetProductByIdQuery } from "@/features/products/api/product-api";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductByIdQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title="Chỉnh sửa sản phẩm"
          breadcrumbs={[
            { label: "Danh mục sản phẩm", href: "/products" },
            { label: "Chỉnh sửa sản phẩm" },
          ]}
        />
        <ErrorState
          error={error ?? new Error("Không tìm thấy sản phẩm")}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={`Chỉnh sửa: ${product.name}`}
        breadcrumbs={[
          { label: "Danh mục sản phẩm", href: "/products" },
          { label: product.name },
        ]}
      />
      <div className="rounded-lg border bg-card p-6 shadow-xs">
        <ProductForm mode="edit" initialData={product} />
      </div>
    </div>
  );
}

