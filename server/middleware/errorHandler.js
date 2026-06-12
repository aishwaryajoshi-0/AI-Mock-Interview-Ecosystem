import { apiError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';
  const errors = err.errors || [];

  return apiError(res, message, statusCode, errors);
};
