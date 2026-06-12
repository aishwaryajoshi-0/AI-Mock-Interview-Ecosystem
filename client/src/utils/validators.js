export const required = (value) => (value ? true : "This field is required.");

export const validateEmail = (value) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value) || "Please enter a valid email address.";
};

export const validatePassword = (value) =>
  value?.length >= 8 || "Password must have at least 8 characters.";

export const matchPassword = (confirm, password) =>
  confirm === password || "Passwords do not match.";
