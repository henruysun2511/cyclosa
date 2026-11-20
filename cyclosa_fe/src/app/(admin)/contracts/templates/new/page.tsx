"use client";

import React from "react";
import { ContractTemplateEditor } from "@/features/contract";

export default function NewContractTemplatePage() {
  return (
    <div className="space-y-6">
      <ContractTemplateEditor isEdit={false} />
    </div>
  );
}

