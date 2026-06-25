export const countWords = (text: string) => {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
};

export const countChars = (text: string, includeSpaces: boolean) => {
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
};

export const countSentences = (text: string) => {
  return text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
};

export const countParagraphs = (text: string) => {
  return text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(Boolean).length;
};

export const calculateReadingTime = (text: string) => {
  const wpm = 200;
  const words = countWords(text);
  const minutes = Math.ceil(words / wpm);
  return minutes;
};

export const getLetterFrequency = (text: string) => {
  const freq: Record<string, number> = {};
  const cleanText = text.replace(/[^a-zA-Z]/g, '').toLowerCase();
  for (const char of cleanText) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1]) // Sort by count desc
    .slice(0, 10) // Top 10
    .map(([letter, count]) => ({ name: letter, count }));
};
