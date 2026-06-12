export const getTrendLabel = (value) => {
  if (value >= 85) return "Excellent";
  if (value >= 70) return "Strong";
  if (value >= 50) return "Moderate";
  return "Needs Work";
};

export const skillColors = {
  communication: "bg-green-500",
  technical: "bg-brand-500",
  leadership: "bg-orange-500",
  creativity: "bg-cyan-500",
};
