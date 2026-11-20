"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, FileCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  useGetDocumentDetailQuery,
} from '@/features/digital-records/api/digital-records-api';
import { SplitScreenReview } from '@/features/digital-records/components/split-screen-review';
import { DigitizationSignModal } from '@/features/digital-records/components/digitization-sign-modal';
import type { DocumentSummary } from '@/features/digital-records/types/digital-records.types';

export default function DocumentReviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [signModalOpen, setSignModalOpen] = useState(false);

  const { data: document, isLoading, refetch } = useGetDocumentDetailQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Đang tải hồ sơ và chuẩn bị giao diện Split-screen...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-8 text-center text-sm text-rose-500">
        Không tìm thấy tài liệu số hóa yêu cầu.
      </div>
    );
  }

  const summaryDoc: DocumentSummary = {
    id: document.id,
    companyId: document.companyId,
    documentCode: document.documentCode,
    title: document.title,
    dossierId: document.dossierId,
    dossierTitle: document.dossierTitle,
    documentTypeId: document.documentTypeId,
    documentTypeCode: document.documentTypeCode,
    documentTypeName: document.documentTypeName,
    isSensitive: document.isSensitive,
    employeeId: document.employeeId,
    employeeCode: document.employeeCode,
    employeeFullName: document.employeeFullName,
    status: document.status,
    isLegalHold: document.isLegalHold,
    issueDate: document.issueDate,
    expiryDate: document.expiryDate,
    retentionUntil: document.retentionUntil,
    isDigitallySigned: document.isDigitallySigned,
    digitallySignedAt: document.digitallySignedAt,
    currentVersionNo: document.currentVersion?.versionNo,
    currentFileUrl: document.currentVersion?.fileUrl,
    currentSha256: document.currentVersion?.sha256Checksum,
    createdAt: document.createdAt,
  };

  return (
    <div className="space-y-4 p-4 max-w-[1700px] mx-auto">
      {/* Header chuẩn mực theo Golden Standard (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Eye className="w-6 h-6 text-primary shrink-0" />
            <span>Thẩm định số hóa & Trích xuất OCR</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/documents" className="hover:text-primary transition-colors">
              Hồ sơ số hóa
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[300px]">
              {document.title}
            </span>
          </nav>
        </div>
      </div>

      <SplitScreenReview
        document={document}
        onOpenSignModal={() => setSignModalOpen(true)}
        onSuccess={() => refetch()}
      />

      <DigitizationSignModal
        document={summaryDoc}
        open={signModalOpen}
        onOpenChange={setSignModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
