const errorHandling = (err, req, res, next) => {
  console.error("Error:", err);
  return res.status(500).json({
    success: false,
    message: "An unexpected error occured!",
    error: err.message,
  });
};

export default errorHandling;
