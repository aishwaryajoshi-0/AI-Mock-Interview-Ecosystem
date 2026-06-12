export const countTokens = (text = '') => {
  const normalized = String(text).trim();
  if (!normalized) {
    return 0;
  }

  const tokens = normalized.split(/\s+/).length;
  return tokens;
};
