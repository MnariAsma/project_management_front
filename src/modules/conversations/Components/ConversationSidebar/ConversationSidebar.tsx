import React, { useState } from "react";
import type { Conversation } from "../../types/conversationTypes";
import type { Project } from "../../../projects/types/projectTypes";

interface ConversationSidebarProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isCreating: boolean;
  isLoadingConversations: boolean;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  isCreating,
  isLoadingConversations,
}) => {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: "short" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const handleDelete = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      setDeletingId(conversationId);
      onDeleteConversation(conversationId);
    }
  };

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-project-header">
        <label className="chat-sidebar-label">Select Project</label>
        <div className="chat-project-dropdown-wrapper">
          <svg
            className="chat-project-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <select
            className="chat-project-select"
            value={selectedProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {projects.length === 0 && <option value="">No projects available</option>}
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
          <svg
            className="chat-select-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {selectedProject && (
          <div className="chat-project-badge-info">
            <span className="chat-project-repo-count">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              {selectedProject.repositories?.length || 0} Repositories indexed
            </span>
          </div>
        )}
      </div>

      <div className="chat-sidebar-action-wrap">
        <button
          type="button"
          className="chat-new-btn"
          onClick={onCreateConversation}
          disabled={!selectedProjectId || isCreating}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>{isCreating ? "Starting..." : "New Chat"}</span>
        </button>
      </div>

      {conversations.length > 5 && (
        <div className="chat-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="chat-search-input"
          />
        </div>
      )}

      <div className="chat-threads-container">
        <div className="chat-threads-label">Recent Conversations</div>

        {isLoadingConversations && (
          <div className="chat-threads-loading">Loading threads...</div>
        )}

        {!isLoadingConversations && filteredConversations.length === 0 && (
          <div className="chat-threads-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No conversations yet.</p>
            <span>Start a chat to ask questions about this codebase.</span>
          </div>
        )}
        <div className="chat-threads-list">
          {filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                className={`chat-thread-item ${isActive ? "active" : ""}`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="chat-thread-main">
                  <svg
                    className="chat-thread-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <div className="chat-thread-info">
                    <span className="chat-thread-title">{conv.title || "Untitled Chat"}</span>
                    <span className="chat-thread-date">
                      {formatDate(conv.updated_at || conv.created_at)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="chat-thread-delete"
                  onClick={(e) => handleDelete(e, conv.id)}
                  title="Delete conversation"
                  disabled={deletingId === conv.id}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ConversationSidebar;
