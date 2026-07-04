import type { ReactNode } from 'react';

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export default function BlogContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    if (listType === 'ol') {
      blocks.push(
        <ol key={key} className="list-decimal pl-5 space-y-2 my-4">
          {listBuffer.map((item, i) => (
            <li key={i} className="leading-relaxed" style={{ color: '#4A4A5A' }}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ol>
      );
    } else {
      blocks.push(
        <ul key={key} className="list-disc pl-5 space-y-2 my-4">
          {listBuffer.map((item, i) => (
            <li key={i} className="leading-relaxed" style={{ color: '#4A4A5A' }}>{renderInline(item, `${key}-${i}`)}</li>
          ))}
        </ul>
      );
    }
    listBuffer = [];
    listType = null;
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    const key = `b-${idx}`;

    if (line.startsWith('## ')) {
      flushList(`list-${key}`);
      blocks.push(
        <h2 key={key} className="font-serif font-bold text-2xl sm:text-3xl mt-10 mb-4" style={{ color: '#163356' }}>
          {line.slice(3)}
        </h2>
      );
      return;
    }

    const numberedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (numberedMatch) {
      if (listType !== 'ol') flushList(`list-${key}`);
      listType = 'ol';
      listBuffer.push(numberedMatch[1]);
      return;
    }

    if (line.startsWith('- ')) {
      if (listType !== 'ul') flushList(`list-${key}`);
      listType = 'ul';
      listBuffer.push(line.slice(2));
      return;
    }

    if (line === '') {
      flushList(`list-${key}`);
      return;
    }

    flushList(`list-${key}`);
    blocks.push(
      <p key={key} className="leading-relaxed mb-4" style={{ color: '#4A4A5A' }}>
        {renderInline(line, key)}
      </p>
    );
  });
  flushList('list-end');

  return <div className="max-w-3xl">{blocks}</div>;
}
