const clampScore = (value) => Number(Math.min(Math.max(value, 0), 100).toFixed(2));

export const calculateKeywordScore = (transcript = '', keywords = []) => {
  if (!keywords.length) {
    return { score: 0, matched: [] };
  }

  const normalizedTranscript = transcript.toLowerCase();
  const matched = keywords.filter((keyword) => normalizedTranscript.includes(String(keyword).toLowerCase()));

  return {
    score: clampScore((matched.length / keywords.length) * 100),
    matched,
  };
};

export const calculateFinalScore = ({
  contentScore = 0,
  sentimentScore = 0,
  keywordScore = 0,
  confidenceScore = 50,
}) => {
  const finalScore =
    contentScore * 0.55 +
    keywordScore * 0.3 +
    confidenceScore * 0.15 +
    sentimentScore * 0;

  return clampScore(finalScore);
};
