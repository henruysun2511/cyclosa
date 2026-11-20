"use client";

import { CreateLeaveRequestForm } from "@/features/leave/components/requests/create-leave-request-form";

export default function HrCreateLeaveRequestPage() {
  return (
    <div className="space-y-6">
      <CreateLeaveRequestForm isOnBehalf={true} />
    </div>
  );
}

