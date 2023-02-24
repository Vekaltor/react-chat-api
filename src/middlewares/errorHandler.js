const errorHandler = (error, req, res, next) => {
  const errorMessageTranslated = req.t(error.message);
  console.log(errorMessageTranslated);
  res.status(error.status || 500);
  res.json({
    error: {
      message: errorMessageTranslated,
    },
  });
  console.log(error);
};

export default errorHandler;
