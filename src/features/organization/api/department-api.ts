import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  Department,
  DepartmentNode,
  DepartmentVersion,
  DepartmentImpact,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  MoveDepartmentInput,
  DepartmentFilterParams,
} from "../types/department.types";
import { toBackendPaginationParams } from "./api-helper";

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<PageData<Department>, DepartmentFilterParams>({
      query: (params) => ({
        url: `/departments?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<Department>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Department" as const, id })),
              { type: "Department", id: "LIST" },
            ]
          : [{ type: "Department", id: "LIST" }],
    }),

    getDepartmentTree: builder.query<
      DepartmentNode[],
      { companyId: string; asOfDate?: string }
    >({
      query: ({ companyId, asOfDate }) => {
        const query = asOfDate
          ? `companyId=${companyId}&asOfDate=${asOfDate}`
          : `companyId=${companyId}`;
        return {
          url: `/departments/tree?${query}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<DepartmentNode[]>) => res.data,
      providesTags: [{ type: "DepartmentTree", id: "TREE" }],
    }),

    getDepartmentById: builder.query<
      Department,
      { id: string; asOfDate?: string }
    >({
      query: ({ id, asOfDate }) => {
        const url = asOfDate
          ? `/departments/${id}?asOfDate=${asOfDate}`
          : `/departments/${id}`;
        return { url, method: "GET" };
      },
      transformResponse: (res: ApiResponse<Department>) => res.data,
      providesTags: (_res, _err, { id }) => [{ type: "Department", id }],
    }),

    getDepartmentHistory: builder.query<DepartmentVersion[], string>({
      query: (id) => ({ url: `/departments/${id}/history`, method: "GET" }),
      transformResponse: (res: ApiResponse<DepartmentVersion[]>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Department", id: `HISTORY_${id}` }],
    }),

    calculateMoveImpact: builder.query<
      DepartmentImpact,
      { departmentId: string; targetParentId?: string | null }
    >({
      query: ({ departmentId, targetParentId }) => {
        const query = targetParentId
          ? `targetParentId=${targetParentId}`
          : "";
        return {
          url: `/departments/${departmentId}/move-impact?${query}`,
          method: "GET",
        };
      },
      transformResponse: (res: ApiResponse<DepartmentImpact>) => res.data,
    }),

    createDepartment: builder.mutation<Department, CreateDepartmentInput>({
      query: (body) => ({ url: "/departments", method: "POST", body }),
      transformResponse: (res: ApiResponse<Department>) => res.data,
      invalidatesTags: [
        { type: "Department", id: "LIST" },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    updateDepartment: builder.mutation<
      Department,
      { id: string; body: UpdateDepartmentInput }
    >({
      query: ({ id, body }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ApiResponse<Department>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "Department", id: `HISTORY_${id}` },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    moveDepartment: builder.mutation<
      void,
      { id: string; body: MoveDepartmentInput }
    >({
      query: ({ id, body }) => ({
        url: `/departments/${id}/move`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "Department", id: `HISTORY_${id}` },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    updatePermissionInheritance: builder.mutation<
      void,
      { id: string; isPermissionInherited: boolean }
    >({
      query: ({ id, isPermissionInherited }) => ({
        url: `/departments/${id}/permission-inheritance`,
        method: "PUT",
        body: { isPermissionInherited },
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),

    dissolveDepartment: builder.mutation<
      void,
      string | { id: string; dissolvedDate?: string }
    >({
      query: (arg) => {
        const id = typeof arg === "string" ? arg : arg.id;
        const dissolvedDate =
          typeof arg === "string" ? undefined : arg.dissolvedDate;
        const query = dissolvedDate ? `?dissolvedDate=${dissolvedDate}` : "";
        return {
          url: `/departments/${id}${query}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [
        { type: "Department", id: "LIST" },
        { type: "DepartmentTree", id: "TREE" },
      ],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentTreeQuery,
  useGetDepartmentByIdQuery,
  useGetDepartmentHistoryQuery,
  useLazyCalculateMoveImpactQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useMoveDepartmentMutation,
  useUpdatePermissionInheritanceMutation,
  useDissolveDepartmentMutation,
} = departmentApi;

