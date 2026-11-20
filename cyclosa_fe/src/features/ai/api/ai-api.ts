import { baseApi } from "@/store/base-api-rtk";
import type { ApiResponse, PageData } from "@/types/api.types";
import type {
  ChatRequest,
  ChatResponse,
  ConversationDetail,
  ConversationSummary,
  CreateKnowledgeDocRequest,
  KnowledgeDocFilter,
  KnowledgeDocument,
  MessageFeedbackRequest,
  UnansweredQuestion,
  UnansweredQuestionFilter,
} from "../types/ai.types";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── HỘI THOẠI & TIN NHẮN ──
    chat: builder.mutation<ApiResponse<ChatResponse>, ChatRequest>({
      query: (body) => ({
        url: "/assistant/chat",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AiConversation", id: "LIST" }],
    }),

    getConversations: builder.query<
      ApiResponse<PageData<ConversationSummary>>,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/assistant/conversations",
        params: params || { page: 0, size: 20 },
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((item) => ({
                type: "AiConversation" as const,
                id: item.id,
              })),
              { type: "AiConversation", id: "LIST" },
            ]
          : [{ type: "AiConversation", id: "LIST" }],
    }),

    getConversationById: builder.query<ApiResponse<ConversationDetail>, string>({
      query: (id) => `/assistant/conversations/${id}`,
      providesTags: (_res, _err, id) => [{ type: "AiConversation", id }],
    }),

    deleteConversation: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/assistant/conversations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AiConversation", id: "LIST" }],
    }),

    submitFeedback: builder.mutation<
      ApiResponse<void>,
      { messageId: string; body: MessageFeedbackRequest }
    >({
      query: ({ messageId, body }) => ({
        url: `/assistant/messages/${messageId}/feedback`,
        method: "POST",
        body,
      }),
    }),

    // ── QUẢN TRỊ KHO TRI THỨC (KNOWLEDGE BASE) ──
    getKnowledgeDocuments: builder.query<
      ApiResponse<PageData<KnowledgeDocument>>,
      KnowledgeDocFilter | void
    >({
      query: (filter) => {
        const cleanParams: Record<string, unknown> = {};
        if (filter) {
          Object.entries(filter).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== "" && val !== "ALL" && val !== "all") {
              cleanParams[key] = val;
            }
          });
          cleanParams.page = filter.page ? Math.max(0, filter.page - 1) : 0;
          cleanParams.size = filter.size || 20;
        }
        return {
          url: "/assistant/knowledge-base/documents",
          params: cleanParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((item) => ({
                type: "AiKnowledgeDoc" as const,
                id: item.id,
              })),
              { type: "AiKnowledgeDoc", id: "LIST" },
            ]
          : [{ type: "AiKnowledgeDoc", id: "LIST" }],
    }),

    createKnowledgeDocument: builder.mutation<
      ApiResponse<KnowledgeDocument>,
      CreateKnowledgeDocRequest
    >({
      query: (body) => ({
        url: "/assistant/knowledge-base/documents",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AiKnowledgeDoc", id: "LIST" }],
    }),

    archiveKnowledgeDocument: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/assistant/knowledge-base/documents/${id}/archive`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "AiKnowledgeDoc", id: "LIST" }],
    }),

    deleteKnowledgeDocument: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/assistant/knowledge-base/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AiKnowledgeDoc", id: "LIST" }],
    }),

    // ── QUẢN TRỊ CÂU HỎI CHƯA CÓ LỜI GIẢI (KNOWLEDGE GAPS) ──
    getUnansweredQuestions: builder.query<
      ApiResponse<PageData<UnansweredQuestion>>,
      UnansweredQuestionFilter | void
    >({
      query: (filter) => {
        const cleanParams: Record<string, unknown> = {};
        if (filter) {
          Object.entries(filter).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== "" && val !== "ALL" && val !== "all") {
              cleanParams[key] = val;
            }
          });
          cleanParams.page = filter.page ? Math.max(0, filter.page - 1) : 0;
          cleanParams.size = filter.size || 20;
        }
        return {
          url: "/assistant/unanswered-questions",
          params: cleanParams,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map((item) => ({
                type: "AiKnowledgeGap" as const,
                id: item.id,
              })),
              { type: "AiKnowledgeGap", id: "LIST" },
            ]
          : [{ type: "AiKnowledgeGap", id: "LIST" }],
    }),

    resolveUnansweredQuestion: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/assistant/unanswered-questions/${id}/resolve`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "AiKnowledgeGap", id: "LIST" }],
    }),

    dismissUnansweredQuestion: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/assistant/unanswered-questions/${id}/dismiss`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "AiKnowledgeGap", id: "LIST" }],
    }),
  }),
});

export const {
  useChatMutation,
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useDeleteConversationMutation,
  useSubmitFeedbackMutation,
  useGetKnowledgeDocumentsQuery,
  useCreateKnowledgeDocumentMutation,
  useArchiveKnowledgeDocumentMutation,
  useDeleteKnowledgeDocumentMutation,
  useGetUnansweredQuestionsQuery,
  useResolveUnansweredQuestionMutation,
  useDismissUnansweredQuestionMutation,
} = aiApi;
