import { useState, useCallback } from "react";
import type { ShiftAssignmentFilter } from "../types/attendance.types";

export function useShiftAssignmentFilters() {
  const now = new Date();
  const [filters, setFilters] = useState<ShiftAssignmentFilter>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    departmentId: undefined,
    shiftId: undefined,
  });

  const setYear = useCallback((year: number) => {
    setFilters((prev) => ({ ...prev, year }));
  }, []);

  const setMonth = useCallback((month: number) => {
    setFilters((prev) => ({ ...prev, month }));
  }, []);

  const setDepartmentId = useCallback((departmentId: string | undefined) => {
    setFilters((prev) => ({ ...prev, departmentId: departmentId || undefined }));
  }, []);

  const setShiftId = useCallback((shiftId: string | undefined) => {
    setFilters((prev) => ({ ...prev, shiftId: shiftId || undefined }));
  }, []);

  const resetFilters = useCallback(() => {
    const current = new Date();
    setFilters({
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      departmentId: undefined,
      shiftId: undefined,
    });
  }, []);

  return {
    filters,
    setYear,
    setMonth,
    setDepartmentId,
    setShiftId,
    resetFilters,
  };
}

