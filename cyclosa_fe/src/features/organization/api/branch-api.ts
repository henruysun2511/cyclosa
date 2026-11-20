import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  Branch,
  CreateBranchInput,
  UpdateBranchInput,
  BranchFilterParams,
} from "../types/branch.types";
import { toBackendPaginationParams } from "./api-helper";

export const branchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranches: builder.query<PageData<Branch>, BranchFilterParams>({
      query: (params) => ({
        url: `/branches?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<Branch>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Branch" as const, id })),
              { type: "Branch", id: "LIST" },
            ]
          : [{ type: "Branch", id: "LIST" }],
    }),

    getBranchesByCompany: builder.query<Branch[], string>({
      query: (companyId) => ({
        url: `/branches/by-company?companyId=${companyId}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<Branch[]>) => res.data,
      providesTags: [{ type: "Branch", id: "LIST" }],
    }),

    getBranchById: builder.query<Branch, string>({
      query: (id) => ({ url: `/branches/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Branch>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Branch", id }],
    }),

    createBranch: builder.mutation<Branch, CreateBranchInput>({
      query: (body) => ({ url: "/branches", method: "POST", body }),
      transformResponse: (res: ApiResponse<Branch>) => res.data,
      invalidatesTags: [{ type: "Branch", id: "LIST" }, { type: "Region", id: "LIST" }],
    }),

    updateBranch: builder.mutation<Branch, { id: string; body: UpdateBranchInput }>({
      query: ({ id, body }) => ({ url: `/branches/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<Branch>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Branch", id },
        { type: "Branch", id: "LIST" },
      ],
    }),

    deleteBranch: builder.mutation<void, string>({
      query: (id) => ({ url: `/branches/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }, { type: "Region", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchesByCompanyQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;

