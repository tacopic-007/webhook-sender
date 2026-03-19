import React from 'react';

export function parseMentions(text: string): React.ReactNode {
  if (!text) return text;

  // < の前に空白または行頭がある場合のみマッチ
  const mentionRegex = /(?<=^|\s)<(@&?!?|#)(\d+)>/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let partIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // マッチ前のテキストを追加
    if (match.index > lastIndex) {
      const textContent = text.substring(lastIndex, match.index);
      parts.push(
        <React.Fragment key={`text-${partIndex++}`}>{textContent}</React.Fragment>
      );
    }

    const [fullMatch, prefix, id] = match;

    // メンションタイプに応じてスタイルを適用
    if (prefix === '#') {
      // チャンネルメンション
      parts.push(
        <span key={`mention-${partIndex++}`} className="text-[#00a8fc] font-medium hover:underline cursor-pointer">
          #channel
        </span>
      );
    } else if (prefix === '@&') {
      // ロールメンション
      parts.push(
        <span
          key={`mention-${partIndex++}`}
          className="bg-[#5865f21a] text-[#b3baff] font-medium rounded px-0.5 hover:bg-[#5865f233] cursor-pointer"
        >
          @role
        </span>
      );
    } else if (prefix === '@' || prefix === '@!') {
      // ユーザーメンション
      parts.push(
        <span
          key={`mention-${partIndex++}`}
          className="bg-[#5865f21a] text-[#b3baff] font-medium rounded px-0.5 hover:bg-[#5865f233] cursor-pointer"
        >
          @user
        </span>
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  // 残りのテキストを追加
  if (lastIndex < text.length) {
    const textContent = text.substring(lastIndex);
    parts.push(
      <React.Fragment key={`text-${partIndex++}`}>{textContent}</React.Fragment>
    );
  }

  return parts.length > 0 ? <>{parts}</> : text;
}
