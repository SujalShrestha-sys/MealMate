const errorHandling = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.message === "CORS origin not allowed") {
    return res.status(403).json({
      success: false,
      message: "Request blocked by CORS policy for this origin.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred!",
    error: err.message,
  });
};

export default errorHandling;
