const errorHandling = (err, req, res, next) => {
  console.log(err.stack);
  return res.status(500).json({
    status: 500,
    message: "An unexpected error occured!",
    error: err.message,
  });
};

export default errorHandling;
