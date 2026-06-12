export const apiSuccess = (res, data = null, message = 'Request successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const apiError = (res, message = 'Something went wrong', statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
