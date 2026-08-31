export interface SourceCitation {
  source_path: string;
  start_line: number;
  end_line: number;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[] | null;
  tokens_used?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message?: ConversationMessage | null;
  lastMessage?: ConversationMessage | null;
}

export interface ConversationsResponse {
  data: Conversation[];
}

export interface ConversationResponse {
  data: Conversation;
}

export interface MessagesResponse {
  data: ConversationMessage[];
}

export interface SendMessageRequest {
  conversationId: string;
  projectId: string;
  question: string;
}

export interface SendMessageResponse {
  data: ConversationMessage;
}
