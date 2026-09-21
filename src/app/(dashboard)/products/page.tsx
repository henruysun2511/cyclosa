"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ProductFilters } from "@/features/products/components/product-filters";
import { getProductColumns } from "@/features/products/components/product-columns";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/features/products/api/product-api";
import { useProductFilters } from "@/features/products/hooks/use-product-filters";
import { toast } from "sonner";
import type { Product } from "@/features/products/types/product.types";

function ProductsContent() {
  const { filters, updateFilters } = useProductFilters();
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery(filters);

  // ── Mutations ──────────────────────────────────────────────────────────
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id).unwrap();
      toast.success("Đã xóa sản phẩm", {
        description: `"${deletingProduct.name}" đã được xóa thành công.`,
      });
      setDeletingProduct(null);
    } catch {
      toast.error("Xóa thất bại", {
        description: "Không thể xóa sản phẩm. Vui lòng thử lại.",
      });
    }
  };

  const columns = getProductColumns((product) => setDeletingProduct(product));

  return (
    <>
      <ProductFilters />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
          />

          {data?.meta && (
            <DataPagination
              meta={data.meta}
              onPageChange={(page) => updateFilters({ page })}
              onPageSizeChange={(limit) => updateFilters({ limit, page: 1 })}
            />
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Xóa sản phẩm"
        description={`Bạn chắc chắn muốn xóa "${deletingProduct?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Sản phẩm"
        description="Quản lý danh sách sản phẩm của bạn"
        action={
          <Button asChild>
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Link>
          </Button>
        }
      />

      <Suspense
        fallback={
          <div className="h-64 rounded-xl bg-muted/40 animate-pulse" />
        }
      >
        <ProductsContent />
      </Suspense>
    </div>
  );
}
