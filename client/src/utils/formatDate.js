import { format } from "date-fns";

export const formatDate = (value) => {
  if (!value) return "-";
  return format(new Date(value), "MMM d, yyyy");
};
