const notFound = (req, res, next) => {
  const error = new Error(
    `Endpoint not found: ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(
    "SERVER ERROR:",
    err
  );

  const statusCode =
    res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message || "Server Error",

    ...(process.env.NODE_ENV ===
      "development" && {
      stack: err.stack,
    }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};