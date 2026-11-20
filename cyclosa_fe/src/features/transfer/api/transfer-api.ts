import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  CurrentWorkSnapshot,
  TransferDetail,
  TransferFilterParams,
  TransferStatistics,
  TransferSummary,
  CreateTransferPayload,
  UpdateTransferPayload,
  ApproveTransferPayload,
  RejectTransferPayload,
  ExtendTransferPayload,
} from "../types/transfer.types";

export const transferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransfers: builder.query<ApiResponse<PageData<TransferSummary>>, TransferFilterParams>({
      query: (params) => {
        const { page, size, keyword, status, transferType, departmentId, isTemporary } = params;
        const queryParams: Record<string, any> = {
          page: page && page > 0 ? page - 1 : 0,
          size: size || 10,
        };
        if (keyword) queryParams.keyword = keyword;
        if (status && status !== "ALL") queryParams.status = status;
        if (transferType && transferType !== "ALL") queryParams.transferType = transferType;
        if (departmentId && departmentId !== "ALL") queryParams.departmentId = departmentId;
        if (isTemporary !== undefined) queryParams.isTemporary = isTemporary;

        return {
          url: "/transfers",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Transfer" as const, id })),
              { type: "Transfer" as const, id: "LIST" },
            ]
          : [{ type: "Transfer" as const, id: "LIST" }],
    }),

    getTransferStatistics: builder.query<ApiResponse<TransferStatistics>, void>({
      query: () => ({
        url: "/transfers/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "Transfer" as const, id: "STATS" }],
    }),

    getTransferById: builder.query<ApiResponse<TransferDetail>, string>({
      query: (id) => ({
        url: `/transfers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Transfer" as const, id }],
    }),

    getCurrentSnapshot: builder.query<ApiResponse<CurrentWorkSnapshot>, string>({
      query: (employeeId) => ({
        url: `/transfers/employee/${employeeId}/current-snapshot`,
        method: "GET",
      }),
    }),

    createTransfer: builder.mutation<ApiResponse<TransferDetail>, CreateTransferPayload>({
      query: (body) => ({
        url: "/transfers",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    updateTransfer: builder.mutation<
      ApiResponse<TransferDetail>,
      { id: string; body: UpdateTransferPayload }
    >({
      query: ({ id, body }) => ({
        url: `/transfers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    deleteTransfer: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/transfers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    submitTransfer: builder.mutation<ApiResponse<TransferDetail>, string>({
      query: (id) => ({
        url: `/transfers/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    approveTransfer: builder.mutation<
      ApiResponse<TransferDetail>,
      { id: string; body?: ApproveTransferPayload }
    >({
      query: ({ id, body }) => ({
        url: `/transfers/${id}/approve`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    rejectTransfer: builder.mutation<
      ApiResponse<TransferDetail>,
      { id: string; body: RejectTransferPayload }
    >({
      query: ({ id, body }) => ({
        url: `/transfers/${id}/reject`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    cancelTransfer: builder.mutation<ApiResponse<TransferDetail>, string>({
      query: (id) => ({
        url: `/transfers/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    applyTransfer: builder.mutation<ApiResponse<TransferDetail>, string>({
      query: (id) => ({
        url: `/transfers/${id}/apply`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
        { type: "Employee" as const, id: "LIST" },
      ],
    }),

    extendTemporaryTransfer: builder.mutation<
      ApiResponse<TransferDetail>,
      { id: string; body: ExtendTransferPayload }
    >({
      query: ({ id, body }) => ({
        url: `/transfers/${id}/temporary/extend`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
      ],
    }),

    returnTemporaryTransfer: builder.mutation<ApiResponse<TransferDetail>, string>({
      query: (id) => ({
        url: `/transfers/${id}/temporary/return`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Transfer" as const, id },
        { type: "Transfer" as const, id: "LIST" },
        { type: "Transfer" as const, id: "STATS" },
        { type: "Employee" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTransfersQuery,
  useGetTransferStatisticsQuery,
  useGetTransferByIdQuery,
  useGetCurrentSnapshotQuery,
  useLazyGetCurrentSnapshotQuery,
  useCreateTransferMutation,
  useUpdateTransferMutation,
  useDeleteTransferMutation,
  useSubmitTransferMutation,
  useApproveTransferMutation,
  useRejectTransferMutation,
  useCancelTransferMutation,
  useApplyTransferMutation,
  useExtendTemporaryTransferMutation,
  useReturnTemporaryTransferMutation,
} = transferApi;
