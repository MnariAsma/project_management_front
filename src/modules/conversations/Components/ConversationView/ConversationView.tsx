import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetProjectsQuery } from "../../../projects/Apis/projectApi";
import {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteConversationMutation,
} from "../../Apis/conversationApi";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import { addToast } from "../../../../slices/toast/toastSlice";
import ConversationSidebar from "../ConversationSidebar/ConversationSidebar";
import ChatArea from "../ChatArea/ChatArea";

export const ConversationView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const projectIdFromUrl = searchParams.get("projectId") || "";
  const conversationIdFromUrl = searchParams.get("conversationId") || "";

  // 1. Fetch user projects
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery();
  const projects = useMemo(() => projectsData?.projects || [], [projectsData]);

  // Determine active project
  const selectedProjectId = useMemo(() => {
    if (projectIdFromUrl && projects.some((p) => p.id === projectIdFromUrl)) {
      return projectIdFromUrl;
    }
    if (projects.length > 0) {
      return projects[0].id;
    }
    return "";
  }, [projectIdFromUrl, projects]);

  // Sync initial projectId to URL if missing
  useEffect(() => {
    if (projects.length > 0 && (!projectIdFromUrl || !projects.some((p) => p.id === projectIdFromUrl))) {
      const nextParams: Record<string, string> = { projectId: projects[0].id };
      if (conversationIdFromUrl) nextParams.conversationId = conversationIdFromUrl;
      setSearchParams(nextParams, { replace: true });
    }
  }, [projects, projectIdFromUrl, conversationIdFromUrl, setSearchParams]);

  // 2. Fetch conversations for selected project
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    isFetching: isFetchingConversations,
  } = useGetConversationsQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  const conversations = useMemo(() => conversationsData?.data || [], [conversationsData]);

  // Determine active conversation
  const activeConversationId = useMemo(() => {
    if (conversations.length === 0) return null;
    if (conversationIdFromUrl && conversations.some((c) => c.id === conversationIdFromUrl)) {
      return conversationIdFromUrl;
    }
    // Default to first conversation if URL param is empty or not in this project
    return conversations[0].id;
  }, [conversationIdFromUrl, conversations]);

  // Sync active conversation to URL if changed
  useEffect(() => {
    if (selectedProjectId && activeConversationId && conversationIdFromUrl !== activeConversationId) {
      setSearchParams(
        { projectId: selectedProjectId, conversationId: activeConversationId },
        { replace: true }
      );
    }
  }, [selectedProjectId, activeConversationId, conversationIdFromUrl, setSearchParams]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 3. Fetch messages for active conversation
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
  } = useGetMessagesQuery(activeConversationId || "", {
    skip: !activeConversationId,
  });

  const messages = useMemo(() => messagesData?.data || [], [messagesData]);

  // 4. Mutations
  const [createConversation, { isLoading: isCreatingConversation }] =
    useCreateConversationMutation();
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
  const [deleteConversation] = useDeleteConversationMutation();

  const handleSelectProject = (projId: string) => {
    setSearchParams({ projectId: projId });
  };

  const handleSelectConversation = (convId: string) => {
    if (selectedProjectId) {
      setSearchParams({ projectId: selectedProjectId, conversationId: convId });
    }
    setIsMobileSidebarOpen(false);
  };

  const handleCreateNewConversation = async () => {
    if (!selectedProjectId) return;
    try {
      const res = await createConversation(selectedProjectId).unwrap();
      if (res?.data?.id) {
        setSearchParams({
          projectId: selectedProjectId,
          conversationId: res.data.id,
        });
        setIsMobileSidebarOpen(false);
      }
    } catch {
      dispatch(
        addToast({
          message: "Failed to create a new conversation.",
          type: "error",
        })
      );
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!selectedProjectId) return;
    try {
      await deleteConversation({
        conversationId: convId,
        projectId: selectedProjectId,
      }).unwrap();

      dispatch(
        addToast({
          message: "Conversation deleted.",
          type: "success",
        })
      );

      if (activeConversationId === convId) {
        const remaining = conversations.filter((c) => c.id !== convId);
        if (remaining.length > 0) {
          setSearchParams({
            projectId: selectedProjectId,
            conversationId: remaining[0].id,
          });
        } else {
          setSearchParams({ projectId: selectedProjectId });
        }
      }
    } catch {
      dispatch(
        addToast({
          message: "Failed to delete conversation.",
          type: "error",
        })
      );
    }
  };

  const handleSendMessage = async (question: string) => {
    if (!selectedProjectId) return;

    let targetConvId = activeConversationId;

    if (!targetConvId) {
      try {
        const created = await createConversation(selectedProjectId).unwrap();
        targetConvId = created.data.id;
        setSearchParams({
          projectId: selectedProjectId,
          conversationId: targetConvId,
        });
      } catch {
        dispatch(
          addToast({
            message: "Failed to start conversation.",
            type: "error",
          })
        );
        return;
      }
    }

    try {
      await sendMessage({
        conversationId: targetConvId,
        projectId: selectedProjectId,
        question,
      }).unwrap();
    } catch {
      dispatch(
        addToast({
          message: "Failed to send message or generate response.",
          type: "error",
        })
      );
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const isMessagesLoading = Boolean(activeConversationId && (isLoadingMessages || isFetchingMessages));

  return (
    <div className="chat-layout-wrapper">
      {isMobileSidebarOpen && (
        <div
          className="chat-mobile-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <div className={`chat-sidebar-wrapper ${isMobileSidebarOpen ? "open" : ""}`}>
        <ConversationSidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isCreating={isCreatingConversation}
          isLoadingConversations={
            isLoadingProjects || (Boolean(selectedProjectId) && (isLoadingConversations || isFetchingConversations))
          }
        />
      </div>
      <ChatArea
        project={selectedProject}
        conversation={activeConversation}
        messages={messages}
        isLoadingMessages={isMessagesLoading}
        isSending={isSendingMessage}
        onSendMessage={handleSendMessage}
        userAvatar={user?.avatar_url}
        userName={user?.name}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
    </div>
  );
};

export default ConversationView;
