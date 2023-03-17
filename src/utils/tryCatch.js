const tryCatch = (service) => async (req, res, next) => {
  try {
    await service(req, res, next);
  } catch (error) {
    return next(error);
  }
};

export default tryCatch;
