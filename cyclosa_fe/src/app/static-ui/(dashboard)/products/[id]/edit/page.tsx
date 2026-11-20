"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { ProductForm } from "@/features/products/components/product-form";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/features/products/api/product-api";
import { toast } from "sonner";
import type { UpdateProductInput } from "@/features/products/types/product.types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const { data: product, isLoading, isError, error, refetch } =
    useGetProductByIdQuery(id, { skip: !id });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSubmit = async (data: UpdateProductInput) => {
    try {
      await updateProduct({ id, body: data }).unwrap();
      toast.success("Cập nhật thành công", {
        description: "Thông tin sản phẩm đã được lưu.",
      });
      router.push(`/products/${id}`);
    } catch {
      toast.error("Cập nhật thất bại", {
        description: "Không thể lưu thay đổi. Vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chỉnh sửa sản phẩm"
        action={
          <Button variant="outline" asChild>
            <Link href={`/products/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      {isLoading && <Skeleton className="h-96 rounded-xl" />}

      {isError && <ErrorState error={error} onRetry={refetch} />}

      {product && (
        <Card>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>Chỉnh sửa thông tin sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              mode="edit"
              defaultValues={product}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
