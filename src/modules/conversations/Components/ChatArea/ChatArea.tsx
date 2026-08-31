import React, { useState, useRef, useEffect } from "react";
import type { Conversation, ConversationMessage } from "../../types/conversationTypes";
import type { Project } from "../../../projects/types/projectTypes";
import ChatMessage from "../ChatMessage/ChatMessage";

interface ChatAreaProps {
  project?: Project;
  conversation?: Conversation;
  messages: ConversationMessage[];
  isLoadingMessages: boolean;
  isSending: boolean;
  onSendMessage: (question: string) => void;
  userAvatar?: string | null;
  userName?: string | null;
  onToggleMobileSidebar?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  project,
  conversation,
  messages,
  isLoadingMessages,
  isSending,
  onSendMessage,
  userAvatar,
  userName,
  onToggleMobileSidebar,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    onSendMessage(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="chat-main-area">
      <header className="chat-top-bar">
        <div className="chat-top-left">
          {onToggleMobileSidebar && (
            <button
              type="button"
              className="chat-mobile-toggle-btn"
              onClick={onToggleMobileSidebar}
              title="Toggle conversation list"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <div className="chat-top-info">
            <h2 className="chat-top-title">
              {conversation ? conversation.title : "AI Assistant"}
            </h2>
            {project && (
              <span className="chat-top-project-tag">
                <span className="chat-project-dot" />
                Project: {project.name}
              </span>
            )}
          </div>
        </div>
        {project && (
          <div className="chat-top-right">
            <span className="chat-top-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              {project.repositories?.length || 0} Repositories
            </span>
          </div>
        )}
      </header>
      <div className="chat-messages-viewport">
        {isLoadingMessages ? (
          <div className="chat-viewport-loading">
            <div className="chat-loading-spinner" />
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-welcome-state">
            <div className="chat-welcome-hero">
              <div className="chat-welcome-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <h1 className="chat-welcome-title">
                What would you like to explore about{" "}
                <span className="chat-accent-text">{project?.name || "this project"}</span>?
              </h1>
              <p className="chat-welcome-subtitle">
                Ask questions about your codebase, APIs, architecture, or logic. The RAG assistant
                retrieves indexed source excerpts to formulate accurate answers.
              </p>
            </div>
          </div>
        ) : (
          <div className="chat-messages-list">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                userAvatar={userAvatar}
                userName={userName}
              />
            ))}

            {isSending && (
              <div className="chat-message-row assistant-row">
                <div className="chat-message-container">
                  <div className="chat-avatar chat-avatar--ai">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                      <rect x="3" y="10" width="18" height="12" rx="3" />
                      <circle cx="9" cy="16" r="1.5" fill="currentColor" />
                      <circle cx="15" cy="16" r="1.5" fill="currentColor" />
                      <path d="M10 8h4" />
                    </svg>
                  </div>

                  <div className="chat-message-content">
                    <div className="chat-message-header">
                      <span className="chat-sender-name">RAG Assistant</span>
                    </div>
                    <div className="chat-thinking-indicator">
                      <div className="chat-thinking-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="chat-thinking-text">
                        Searching code excerpts & synthesizing answer...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chat-input-dock">
        <div className="chat-input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder={
              project
                ? `Ask anything about ${project.name}... (Enter to send, Shift+Enter for newline)`
                : "Select a project to start chatting..."
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={!project || isSending}
            rows={1}
          />

          <button
            type="button"
            className="chat-send-btn"
            onClick={handleSubmit}
            disabled={!project || !input.trim() || isSending}
            title="Send message"
          >
            {isSending ? (
              <div className="chat-send-spinner" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>

        <div className="chat-input-footer">
          <span>
            RAG Assistant answers using indexed project code. Always verify critical implementation
            details.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
