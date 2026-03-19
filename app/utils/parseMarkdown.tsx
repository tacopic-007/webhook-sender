import React from "react";
import { parseMentions } from "./parseMentions";

export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return text;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let quoteBuffer: string[] = [];
  let elementIndex = 0;

  const flushQuoteBuffer = () => {
    if (quoteBuffer.length > 0) {
      elements.push(
        <div
          key={`quote-${elementIndex++}`}
          className="border-l-4 border-[#4e5058] pl-3 my-0.5"
        >
          {quoteBuffer.map((quoteLine, idx) => (
            <React.Fragment key={`quote-line-${idx}`}>
              {parseBoldAndMentions(quoteLine)}
              {idx < quoteBuffer.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>,
      );
      quoteBuffer = [];
    }
  };

  lines.forEach((line, lineIndex) => {
    // 引用の処理
    if (line.startsWith("> ")) {
      const quotedText = line.substring(2);
      quoteBuffer.push(quotedText);
    } else {
      // 引用バッファをフラッシュ
      flushQuoteBuffer();

      // 通常のテキスト
      if (line || lineIndex === 0) {
        elements.push(
          <React.Fragment key={`line-${elementIndex++}`}>
            {parseBoldAndMentions(line)}
          </React.Fragment>,
        );
      }
    }

    // 最後の行以外は改行を追加（引用行の途中は除く）
    if (lineIndex < lines.length - 1 && !line.startsWith("> ")) {
      elements.push(<br key={`br-${elementIndex++}`} />);
    }
  });

  // 最後に残った引用バッファをフラッシュ
  flushQuoteBuffer();

  return <>{elements}</>;
}

function parseBoldAndMentions(text: string): React.ReactNode {
  // **bold** を処理
  const boldRegex = /\*\*(.+?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let partIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // マッチ前のテキストを追加
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      parts.push(
        <React.Fragment key={`text-${partIndex++}`}>
          {parseMentions(beforeText)}
        </React.Fragment>,
      );
    }

    // bold部分を追加
    const boldText = match[1];
    parts.push(
      <strong key={`bold-${partIndex++}`} className="font-bold">
        {parseMentions(boldText)}
      </strong>,
    );

    lastIndex = match.index + match[0].length;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    parts.push(
      <React.Fragment key={`text-${partIndex++}`}>
        {parseMentions(remainingText)}
      </React.Fragment>,
    );
  }

  return parts.length > 0 ? <>{parts}</> : parseMentions(text);
}
