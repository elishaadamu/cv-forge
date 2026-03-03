import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A simple wrapper around ReactMarkdown that renders content as inline-friendly elements.
 * Useful for CV templates where we want to support basic markdown (like bold/italics) 
 * without breaking the layout with block-level elements like <p>.
 */
export function MarkdownText({ content, className, style }: MarkdownTextProps) {
  if (!content) return null;

  return (
    <div className={className} style={style}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Render paragraphs as spans to maintain inline/flex flow in CVs
          p: ({ node, ...props }) => <span {...props} />,
          // Ensure lists are styled if they appear
          ul: ({ node, ...props }) => <ul className="list-disc ml-4" {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          // Support links if any
          a: ({ node, ...props }) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
