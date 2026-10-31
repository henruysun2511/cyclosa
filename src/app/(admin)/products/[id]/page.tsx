"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetail } from "@/features/products/components/product-detail";
import {
  useGetProductByIdQuery,
  useDeleteProductMutation,
} from "@/features/products/api/product-api";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductByIdQuery(id, { skip: !id });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (!product) return;
    try {
      await deleteProduct(product.id).unwrap();
      toast.success(`Đã xóa sản phẩm "${product.name}" thành công.`);
      router.push("/products");
    } catch {
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
    }
  };

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
        <PageHeader title="Chi tiết sản phẩm" />
        <ErrorState
          error={error ?? new Error("Không tìm thấy sản phẩm")}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ProductDetail
        product={product}
        onDelete={() => setShowDeleteConfirm(true)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Xác nhận xóa sản phẩm"
        description={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"? Dữ liệu sẽ được đánh dấu xóa mềm.`}
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

