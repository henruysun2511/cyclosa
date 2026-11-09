"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ContractForm } from "@/features/contract/components/forms/contract-form";

export default function NewContractPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") || undefined;

  return <ContractForm initialCompanyId={companyId} />;
}
