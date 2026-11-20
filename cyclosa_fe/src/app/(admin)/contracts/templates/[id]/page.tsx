"use client";

import React, { use } from "react";
import { useParams, useRouter } from "next/navigation";
import { ContractTemplateEditor, useGetContractTemplateByIdQuery } from "@/features/contract";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditContractTemplatePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.id;
  const router = useRouter();

  const {
    data: template,
    isLoading,
    isError,
    refetch,
  } = useGetContractTemplateByIdQuery(templateId, {
    skip: !templateId,
  });

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải thông tin biểu mẫu hợp đồng...</p>
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 text-center space-y-4 border rounded-xl bg-card">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Không tìm thấy biểu mẫu</h2>
          <p className="text-xs text-muted-foreground">
            Biểu mẫu không tồn tại hoặc bạn không có quyền truy cập thông tin này.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Link href="/contracts/templates">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách</span>
            </Button>
          </Link>
          <Button size="sm" onClick={() => refetch()} className="text-xs">
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ContractTemplateEditor
        initialData={template}
        isEdit={true}
        onSaveSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}

