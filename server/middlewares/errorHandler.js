const errorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (error.name === "SequelizeValidationError") {
    statusCode = 400;
    message = error.errors.map((err) => err.message).join(", ");
  } else if (error.name === "ParsingError") {
    statusCode = 500;
    message = error.message;
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.status === 503) {
    statusCode = 503;
    message = "Service Unavailable";
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
