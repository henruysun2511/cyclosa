"use client";

import React, { use } from "react";
import { ContractForm } from "@/features/contract/components/forms/contract-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditContractPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.id;

  return <ContractForm contractId={contractId} />;
}

