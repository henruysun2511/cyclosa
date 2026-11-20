import { baseApi } from "@/store/base-api-rtk";
import { buildQueryString } from "@/lib/utils";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  Region,
  CreateRegionInput,
  UpdateRegionInput,
  RegionFilterParams,
} from "../types/region.types";
import { toBackendPaginationParams } from "./api-helper";

export const regionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRegions: builder.query<PageData<Region>, RegionFilterParams>({
      query: (params) => ({
        url: `/regions?${buildQueryString(toBackendPaginationParams(params))}`,
        method: "GET",
      }),
      transformResponse: (res: ApiResponse<PageData<Region>>) => res.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Region" as const, id })),
              { type: "Region", id: "LIST" },
            ]
          : [{ type: "Region", id: "LIST" }],
    }),

    getAllRegions: builder.query<Region[], string>({
      query: (companyId) => ({ url: `/regions/all?companyId=${companyId}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Region[]>) => res.data,
      providesTags: [{ type: "Region", id: "LIST" }],
    }),

    getRegionById: builder.query<Region, string>({
      query: (id) => ({ url: `/regions/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<Region>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Region", id }],
    }),

    createRegion: builder.mutation<Region, CreateRegionInput>({
      query: (body) => ({ url: "/regions", method: "POST", body }),
      transformResponse: (res: ApiResponse<Region>) => res.data,
      invalidatesTags: [{ type: "Region", id: "LIST" }],
    }),

    updateRegion: builder.mutation<Region, { id: string; body: UpdateRegionInput }>({
      query: ({ id, body }) => ({ url: `/regions/${id}`, method: "PUT", body }),
      transformResponse: (res: ApiResponse<Region>) => res.data,
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Region", id },
        { type: "Region", id: "LIST" },
      ],
    }),

    deleteRegion: builder.mutation<void, string>({
      query: (id) => ({ url: `/regions/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Region", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRegionsQuery,
  useGetAllRegionsQuery,
  useGetRegionByIdQuery,
  useCreateRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} = regionApi;

