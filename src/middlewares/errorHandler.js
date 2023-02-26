const errorHandler = (error, req, res, next) => {
  const errorMessageTranslated = req.t(error.message);

  res.status(error.status || 500);
  res.json({
    error: {
      code: error.status,
      message: errorMessageTranslated,
    },
  });
  console.log(error);
  console.log("ErrorHandler: ", errorMessageTranslated);
};

export default errorHandler;
