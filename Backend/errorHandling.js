const errorHandling = (err, req, res, next) => {
  // Log error to console for the developer
  console.error("Error found:", err.message);

  // If it's a CORS error
  if (err.message === "CORS origin not allowed") {
    return res.status(403).json({
      message: "Browser blocked this request (CORS error)."
    });
  }

  // Generic error response
  res.status(500).json({
    message: "Something went wrong on the server!",
    error: err.message
  });
};

export default errorHandling;
