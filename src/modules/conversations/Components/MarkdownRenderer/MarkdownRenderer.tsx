import React, { useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {

    }
  };

  return (
    <div className="chat-code-block">
      <div className="chat-code-header">
        <span className="chat-code-lang">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="chat-copy-btn"
          title="Copy code"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="chat-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const segments: React.ReactNode[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore) {
      segments.push(renderFormattedText(textBefore, `text-${lastIndex}`));
    }

    const lang = match[1] || "text";
    const code = match[2];
    segments.push(
      <CodeBlock key={`code-${match.index}`} language={lang} code={code.trimEnd()} />
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push(renderFormattedText(content.substring(lastIndex), `text-${lastIndex}`));
  }

  return <div className="chat-markdown-body">{segments}</div>;
};

function renderFormattedText(text: string, keyPrefix: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (idx: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-ul-${idx}`} className="chat-ul">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      flushList(idx);
      elements.push(
        <h4 key={`${keyPrefix}-h3-${idx}`} className="chat-h3">
          {parseInlineFormatting(trimmed.substring(4))}
        </h4>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(idx);
      elements.push(
        <h3 key={`${keyPrefix}-h2-${idx}`} className="chat-h2">
          {parseInlineFormatting(trimmed.substring(3))}
        </h3>
      );
    } else if (trimmed.startsWith("# ")) {
      flushList(idx);
      elements.push(
        <h2 key={`${keyPrefix}-h1-${idx}`} className="chat-h1">
          {parseInlineFormatting(trimmed.substring(2))}
        </h2>
      );
    } else if (trimmed.startsWith("> ")) {
      flushList(idx);
      elements.push(
        <blockquote key={`${keyPrefix}-quote-${idx}`} className="chat-blockquote">
          {parseInlineFormatting(trimmed.substring(2))}
        </blockquote>
      );
    } else if (/^[-*+]\s+/.test(trimmed)) {
      inList = true;
      const itemText = trimmed.replace(/^[-*+]\s+/, "");
      listItems.push(
        <li key={`${keyPrefix}-li-${idx}`}>
          {parseInlineFormatting(itemText)}
        </li>
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      flushList(idx);
      const itemText = trimmed.replace(/^\d+\.\s+/, "");
      elements.push(
        <div key={`${keyPrefix}-num-${idx}`} className="chat-num-item">
          <span className="chat-num-bullet">{trimmed.match(/^\d+\./)?.[0]}</span>
          <span>{parseInlineFormatting(itemText)}</span>
        </div>
      );
    } else if (trimmed === "") {
      flushList(idx);
    } else {
      flushList(idx);
      elements.push(
        <p key={`${keyPrefix}-p-${idx}`} className="chat-p">
          {parseInlineFormatting(line)}
        </p>
      );
    }
  });
  flushList(lines.length);
  return <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*|\[.*?\]\(.*?\))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`b-${match.index}`} className="chat-strong">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={`c-${match.index}`} className="chat-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={`i-${match.index}`}>{token.slice(1, -1)}</em>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const linkMatch = token.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={`a-${match.index}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="chat-link"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }

    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts;
}

export default MarkdownRenderer;
