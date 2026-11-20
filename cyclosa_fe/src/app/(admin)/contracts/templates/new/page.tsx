"use client";

import React from "react";
import { ContractTemplateEditor } from "@/features/contract";

export default function NewContractTemplatePage() {
  return (
    <div className="p-6">
      <ContractTemplateEditor isEdit={false} />
    </div>
  );
}

