export type SortOrder = "asc" | "desc";

export interface BaseFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export type AsyncState = "idle" | "loading" | "succeeded" | "failed";
