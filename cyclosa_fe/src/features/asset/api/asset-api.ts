import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  AssetCategory,
  AssetDetail,
  AssetFilterParams,
  AssetStatistics,
  AssetSummary,
  AssetAssignment,
  CreateAssetCategoryRequest,
  CreateAssetRequest,
  UpdateAssetCategoryRequest,
  UpdateAssetRequest,
  AssignAssetRequest,
  ReturnAssetRequest,
} from "../types/asset.types";

export const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<PageData<AssetSummary>, AssetFilterParams>({
      query: (params) => ({
        url: "/assets",
        method: "GET",
        params: {
          ...params,
          status: params.status === "ALL" ? undefined : params.status,
          conditionStatus:
            params.conditionStatus === "ALL"
              ? undefined
              : params.conditionStatus,
        },
      }),
      transformResponse: (response: ApiResponse<PageData<AssetSummary>>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Asset" as const,
                id,
              })),
              { type: "Asset", id: "LIST" },
            ]
          : [{ type: "Asset", id: "LIST" }],
    }),

    getAssetStatistics: builder.query<AssetStatistics, void>({
      query: () => ({
        url: "/assets/statistics",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AssetStatistics>) =>
        response.data,
      providesTags: [{ type: "Asset", id: "STATS" }],
    }),

    getAssetById: builder.query<AssetDetail, string>({
      query: (id) => ({
        url: `/assets/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AssetDetail>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Asset", id }],
    }),

    createAsset: builder.mutation<AssetDetail, CreateAssetRequest>({
      query: (body) => ({
        url: "/assets",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "STATS" },
      ],
    }),

    updateAsset: builder.mutation<
      AssetDetail,
      { id: string; body: UpdateAssetRequest }
    >({
      query: ({ id, body }) => ({
        url: `/assets/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Asset", id },
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "STATS" },
      ],
    }),

    deleteAsset: builder.mutation<void, string>({
      query: (id) => ({
        url: `/assets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "STATS" },
      ],
    }),

    assignAsset: builder.mutation<
      AssetAssignment,
      { assetId: string; body: AssignAssetRequest }
    >({
      query: ({ assetId, body }) => ({
        url: `/assets/${assetId}/assign`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { assetId }) => [
        { type: "Asset", id: assetId },
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "STATS" },
      ],
    }),

    returnAsset: builder.mutation<
      AssetAssignment,
      { assignmentId: string; assetId?: string; body: ReturnAssetRequest }
    >({
      query: ({ assignmentId, body }) => ({
        url: `/asset-assignments/${assignmentId}/return`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { assetId }) => [
        ...(assetId ? [{ type: "Asset" as const, id: assetId }] : []),
        { type: "Asset", id: "LIST" },
        { type: "Asset", id: "STATS" },
      ],
    }),

    getAssetHistory: builder.query<AssetAssignment[], string>({
      query: (assetId) => ({
        url: `/asset-assignments/history/${assetId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AssetAssignment[]>) =>
        response.data,
      providesTags: (_result, _error, assetId) => [
        { type: "Asset", id: `HISTORY_${assetId}` },
      ],
    }),

    getEmployeeAssets: builder.query<AssetAssignment[], string>({
      query: (employeeId) => ({
        url: `/employees/${employeeId}/assets`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AssetAssignment[]>) =>
        response.data,
      providesTags: (_result, _error, employeeId) => [
        { type: "Asset", id: `EMP_${employeeId}` },
      ],
    }),

    getMyAssets: builder.query<AssetAssignment[], void>({
      query: () => ({
        url: "/me/assets",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AssetAssignment[]>) =>
        response.data,
    }),

    // Category APIs
    getAssetCategories: builder.query<AssetCategory[], void>({
      query: () => ({
        url: "/asset-categories/all",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<AssetCategory[]>) =>
        response.data,
      providesTags: [{ type: "AssetCategory", id: "LIST" }],
    }),

    createAssetCategory: builder.mutation<
      AssetCategory,
      CreateAssetCategoryRequest
    >({
      query: (body) => ({
        url: "/asset-categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AssetCategory", id: "LIST" }],
    }),

    updateAssetCategory: builder.mutation<
      AssetCategory,
      { id: string; body: UpdateAssetCategoryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/asset-categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "AssetCategory", id: "LIST" }],
    }),

    deleteAssetCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/asset-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AssetCategory", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetStatisticsQuery,
  useGetAssetByIdQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useAssignAssetMutation,
  useReturnAssetMutation,
  useGetAssetHistoryQuery,
  useGetEmployeeAssetsQuery,
  useGetMyAssetsQuery,
  useGetAssetCategoriesQuery,
  useCreateAssetCategoryMutation,
  useUpdateAssetCategoryMutation,
  useDeleteAssetCategoryMutation,
} = assetApi;
