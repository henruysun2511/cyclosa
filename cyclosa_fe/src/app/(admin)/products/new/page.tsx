import { PageHeader } from "@/components/common/page-header";
import { ProductForm } from "@/features/products/components/product-form";

export const metadata = {
  title: "Thêm sản phẩm mới",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Thêm sản phẩm mới"
        breadcrumbs={[
          { label: "Danh mục sản phẩm", href: "/products" },
          { label: "Thêm sản phẩm mới" },
        ]}
      />
      <div className="rounded-lg border bg-card p-6 shadow-xs">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}

