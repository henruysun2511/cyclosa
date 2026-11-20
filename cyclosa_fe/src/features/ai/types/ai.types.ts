export type AiConversationStatus = "ACTIVE" | "ARCHIVED";
export type AiMessageRole = "USER" | "ASSISTANT" | "SYSTEM";
export type AiResponseType =
  | "OUT_OF_SCOPE"
  | "FUNCTION_CALLING"
  | "RAG_POLICY"
  | "FALLBACK_NO_DATA";
export type AiMessageFeedback = "HELPFUL" | "NOT_HELPFUL";

export type KnowledgeCategory =
  | "HR_POLICY"
  | "EMPLOYEE_HANDBOOK"
  | "SYSTEM_GUIDE"
  | "LEGAL_COMPLIANCE";

export type KnowledgeDocumentStatus = "PROCESSING" | "ACTIVE" | "ARCHIVED";
export type UnansweredQuestionStatus =
  | "PENDING_REVIEW"
  | "DOCUMENT_ADDED"
  | "DISMISSED";

export interface Citation {
  document_title?: string;
  documentTitle?: string;
  section: string;
  content_snippet?: string;
  contentSnippet?: string;
}

export interface ChartConfigData {
  type: "bar" | "line" | "pie";
  title?: string;
  xAxisKey: string;
  dataKeys: string[];
  data: Record<string, unknown>[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  status: AiConversationStatus;
  messageCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageDetail {
  id: string;
  role: AiMessageRole;
  content: string;
  responseType?: AiResponseType;
  functionCalls?: string;
  sourceDocuments?: string;
  chartConfig?: string;
  tokenUsage?: number;
  feedback?: AiMessageFeedback;
  feedbackNote?: string;
  createdAt: string;
}

export interface ConversationDetail {
  id: string;
  title: string;
  status: AiConversationStatus;
  createdAt: string;
  updatedAt?: string;
  messages: MessageDetail[];
}

export interface ChatRequest {
  query: string;
  conversationId?: string;
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
  response: string;
  intent: string;
  functionCalled?: string;
  functionArgs?: Record<string, unknown>;
  citations?: Citation[];
  chartConfig?: string;
  disclaimer: string;
  executionTimeMs: number;
}

export interface MessageFeedbackRequest {
  feedback: AiMessageFeedback;
  note?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategory;
  categoryDescription?: string;
  version: string;
  fileUrl?: string;
  fileSize?: number;
  status: KnowledgeDocumentStatus;
  chunkCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateKnowledgeDocRequest {
  title: string;
  category: KnowledgeCategory;
  version?: string;
  fileUrl?: string;
  fileSize?: number;
  content?: string;
}

export interface KnowledgeDocFilter {
  page?: number;
  size?: number;
  category?: KnowledgeCategory;
  status?: KnowledgeDocumentStatus;
  keyword?: string;
}

export interface UnansweredQuestion {
  id: string;
  questionText: string;
  clusterId?: string;
  status: UnansweredQuestionStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface UnansweredQuestionFilter {
  page?: number;
  size?: number;
  status?: UnansweredQuestionStatus;
  keyword?: string;
}
