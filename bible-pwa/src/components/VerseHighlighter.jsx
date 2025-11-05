import { useState, useEffect } from 'react';

const VerseHighlighter = ({ content, highlightedVerses, onVerseClick }) => {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    if (!content) return;

    // Process HTML content to add verse highlighting
    let processed = content;
    
    // Add verse IDs and click handlers
    processed = processed.replace(
      /<span class="verse-num">(\d+)<\/span>/g,
      '<span class="verse-num verse-marker" data-verse-id="$1">$1</span>'
    );

    // Add highlighting classes
    highlightedVerses.forEach(verseId => {
      processed = processed.replace(
        new RegExp(`(<span[^>]*data-verse-id="${verseId}"[^>]*>.*?</span>)`, 'g'),
        '<span class="highlighted-verse bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</span>'
      );
    });

    setProcessedContent(processed);
  }, [content, highlightedVerses]);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: processedContent }}
      onClick={onVerseClick}
      className="verse-content"
    />
  );
};

export default VerseHighlighter;