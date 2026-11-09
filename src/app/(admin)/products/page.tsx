"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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
import type { Product } from "@/features/products/types/product.types";

export default function ProductsPage() {
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
      toast.success(`Đã xóa mềm sản phẩm "${deletingProduct.name}" thành công.`);
      setDeletingProduct(null);
    } catch {
      toast.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
    }
  };

  const columns = getProductColumns((product) => setDeletingProduct(product));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Danh mục Sản phẩm (Module mẫu chuẩn)"
        breadcrumbs={[{ label: "Danh mục sản phẩm" }]}
        action={
          <Button asChild>
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm mới
            </Link>
          </Button>
        }
      />

      <ProductFilters />

      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={data?.items ?? []}
            isLoading={isLoading}
          />

          {data?.pagination && (
            <DataPagination
              pagination={data.pagination}
              onPageChange={(page) => updateFilters({ page })}
              onPageSizeChange={(size) => updateFilters({ size, page: 0 })}
            />
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Xác nhận xóa mềm sản phẩm"
        description={`Bạn có chắc chắn muốn xóa sản phẩm "${deletingProduct?.name}" (Mã SKU: ${deletingProduct?.sku})? Dữ liệu sẽ được cập nhật trạng thái xóa mềm trong CSDL.`}
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

