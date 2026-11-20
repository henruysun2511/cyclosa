"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { LeavePageHeader } from "@/features/leave/components/shared/leave-page-header";
import { DepartmentLeaveCalendar } from "@/features/leave/components/calendar/department-leave-calendar";
import { useGetLeaveCalendarQuery } from "@/features/leave/api/leave-api";

export default function LeaveCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month view
  const from = new Date(year, month, 1).toISOString().split("T")[0];
  // Last day of current month view
  const to = new Date(year, month + 1, 0).toISOString().split("T")[0];

  const { data: res, isLoading } = useGetLeaveCalendarQuery({
    from,
    to,
  });

  const events = res?.data || [];

  return (
    <div className="space-y-6">
      <LeavePageHeader
        title="Lịch nghỉ phép đội ngũ"
        breadcrumb="Lịch nghỉ phép"
        icon={Calendar}
      >
        <Button asChild className="gap-2 shadow-xs cursor-pointer">
          <Link href="/me/leave/new">
            <Plus className="h-4 w-4" />
            Đăng ký nghỉ phép
          </Link>
        </Button>
      </LeavePageHeader>

      <DepartmentLeaveCalendar
        events={events}
        isLoading={isLoading}
        currentDate={currentDate}
        onMonthChange={setCurrentDate}
      />
    </div>
  );
}

