export const calculateFinalScore = ({ contentScore = 0, sentimentScore = 0, keywordScore = 0, confidenceScore = 0 }) => {
  const weights = {
    contentScore: 0.4,
    sentimentScore: 0.2,
    keywordScore: 0.2,
    confidenceScore: 0.2,
  };

  const finalScore =
    contentScore * weights.contentScore +
    sentimentScore * weights.sentimentScore +
    keywordScore * weights.keywordScore +
    confidenceScore * weights.confidenceScore;

  return Number(Math.min(Math.max(finalScore, 0), 100).toFixed(2));
};
