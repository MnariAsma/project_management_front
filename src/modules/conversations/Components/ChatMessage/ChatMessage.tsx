import React, { useState } from "react";
import type { ConversationMessage } from "../../types/conversationTypes";
import MarkdownRenderer from "../MarkdownRenderer/MarkdownRenderer";

interface ChatMessageProps {
  message: ConversationMessage;
  userAvatar?: string | null;
  userName?: string | null;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userAvatar,
  userName,
}) => {
  const isAssistant = message.role === "assistant";
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const hasSources = message.sources && message.sources.length > 0;

  if (!isAssistant) {
    // ── USER MESSAGE (Aligned Right) ──
    return (
      <div className="chat-message-row user-row">
        <div className="chat-user-message-wrapper">
          <div className="chat-user-bubble">
            <div className="chat-user-text">
              <MarkdownRenderer content={message.content} />
            </div>
            {message.created_at && (
              <span className="chat-user-timestamp">{formatTime(message.created_at)}</span>
            )}
          </div>

          <div className="chat-avatar chat-avatar--user">
            {userAvatar ? (
              <img src={userAvatar} alt={userName || "User"} className="chat-avatar-img" />
            ) : (
              <span className="chat-avatar-letter">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── ASSISTANT MESSAGE (Aligned Left) ──
  return (
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
            <span className="chat-timestamp">{formatTime(message.created_at)}</span>
          </div>

          <div className="chat-message-body">
            <MarkdownRenderer content={message.content} />
          </div>

          {hasSources && (
            <div className="chat-sources-container">
              <button
                type="button"
                className="chat-sources-toggle"
                onClick={() => setSourcesOpen(!sourcesOpen)}
              >
                <div className="chat-sources-toggle-left">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span>
                    {message.sources!.length} Source{message.sources!.length > 1 ? "s" : ""}{" "}
                    used for context
                  </span>
                </div>
                <svg
                  className={`chat-sources-chevron ${sourcesOpen ? "open" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {sourcesOpen && (
                <div className="chat-sources-list">
                  {message.sources!.map((src, i) => (
                    <div key={i} className="chat-source-item">
                      <div className="chat-source-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                        <span className="chat-source-path">
                          {src.source_path || "Code base chunk"}
                        </span>
                        {src.start_line && src.end_line && (
                          <span className="chat-source-lines">
                            Lines {src.start_line}–{src.end_line}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="chat-message-footer">
            {message.tokens_used && message.tokens_used > 0 ? (
              <span className="chat-token-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {message.tokens_used} tokens
              </span>
            ) : null}

            <button
              type="button"
              onClick={handleCopyMessage}
              className="chat-action-btn"
              title="Copy response"
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
