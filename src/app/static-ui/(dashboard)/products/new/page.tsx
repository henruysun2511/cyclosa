"use client";

import { useRouter } from "next/navigation";
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
import { PageHeader } from "@/components/common/page-header";
import { ProductForm } from "@/features/products/components/product-form";
import { useCreateProductMutation } from "@/features/products/api/product-api";
import { toast } from "sonner";
import type { CreateProductInput } from "@/features/products/types/product.types";

export default function NewProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (data: CreateProductInput) => {
    try {
      const product = await createProduct(data).unwrap();
      toast.success("Tạo sản phẩm thành công", {
        description: `"${product.name}" đã được tạo.`,
      });
      router.push(`/products/${product.id}`);
    } catch {
      toast.error("Tạo thất bại", {
        description: "Không thể tạo sản phẩm. Vui lòng kiểm tra lại thông tin.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thêm sản phẩm mới"
        action={
          <Button variant="outline" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin để tạo sản phẩm mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm mode="create" onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
