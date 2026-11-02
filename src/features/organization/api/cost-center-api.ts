import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  CostCenter,
  CreateCostCenterInput,
  UpdateCostCenterInput,
  CostCenterFilterParams,
} from "../types/cost-center.types";
import { toBackendPaginationParams } from "./api-helper";

export const costCenterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCostCenters: builder.query<PageData<CostCenter>, CostCenterFilterParams>({
      query: (params) => ({
        url: `/cost-centers?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<CostCenter>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "CostCenter" as const, id })),
              { type: "CostCenter", id: "LIST" },
            ]
          : [{ type: "CostCenter", id: "LIST" }],
    }),

    getAllCostCenters: builder.query<CostCenter[], string>({
      query: (companyId) => ({ url: `/cost-centers/all?companyId=${companyId}`, method: "GET" }),
      transformResponse: (res: ApiResponse<CostCenter[]>) => res.data,
      providesTags: [{ type: "CostCenter", id: "LIST" }],
    }),

    getCostCenterById: builder.query<CostCenter, string>({
      query: (id) => ({ url: `/cost-centers/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<CostCenter>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "CostCenter", id }],
    }),

    createCostCenter: builder.mutation<CostCenter, CreateCostCenterInput>({
      query: (body) => ({ url: "/cost-centers", method: "POST", body }),
      transformResponse: (res: ApiResponse<CostCenter>) => res.data,
      invalidatesTags: [{ type: "CostCenter", id: "LIST" }],
    }),

    updateCostCenter: builder.mutation<CostCenter, { id: string; body: UpdateCostCenterInput }>({
      query: ({ id, body }) => ({ url: `/cost-centers/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<CostCenter>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "CostCenter", id },
        { type: "CostCenter", id: "LIST" },
      ],
    }),

    deleteCostCenter: builder.mutation<void, string>({
      query: (id) => ({ url: `/cost-centers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "CostCenter", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCostCentersQuery,
  useGetAllCostCentersQuery,
  useGetCostCenterByIdQuery,
  useCreateCostCenterMutation,
  useUpdateCostCenterMutation,
  useDeleteCostCenterMutation,
} = costCenterApi;

