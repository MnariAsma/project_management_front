import { createApi } from "@reduxjs/toolkit/query/react";
import { BaseQuery } from "../../../baseQuery/baseQuery";
import type {
  ConversationResponse,
  ConversationsResponse,
  MessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "../types/conversationTypes";

export const conversationApi = createApi({
  reducerPath: "conversationApi",
  baseQuery: BaseQuery,
  tagTypes: ["Conversations", "Messages"],
  endpoints: (builder) => ({
    getConversations: builder.query<ConversationsResponse, string>({
      query: (projectId) => ({
        url: `/api/projects/${projectId}/conversations`,
        method: "GET",
      }),
      providesTags: (_result, _error, projectId) => [
        { type: "Conversations", id: projectId },
      ],
    }),

    createConversation: builder.mutation<ConversationResponse, string>({
      query: (projectId) => ({
        url: `/api/projects/${projectId}/conversations`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, projectId) => [
        { type: "Conversations", id: projectId },
      ],
    }),

    getMessages: builder.query<MessagesResponse, string>({
      query: (conversationId) => ({
        url: `/api/conversations/${conversationId}/messages`,
        method: "GET",
      }),
      providesTags: (_result, _error, conversationId) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ conversationId, question }) => ({
        url: `/api/conversations/${conversationId}/messages`,
        method: "POST",
        body: { question },
      }),
      invalidatesTags: (_result, _error, { conversationId, projectId }) => [
        { type: "Messages", id: conversationId },
        { type: "Conversations", id: projectId },
      ],
    }),

    deleteConversation: builder.mutation<
      { message: string },
      { conversationId: string; projectId: string }
    >({
      query: ({ conversationId }) => ({
        url: `/api/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Conversations", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteConversationMutation,
} = conversationApi;
