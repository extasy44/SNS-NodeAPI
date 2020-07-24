exports.createPostValidatior = (req, res, next) => {
  req.check("title", "Write a title").notEmpty();
  req.check("title", "Title must be between 4 to 150 characters").isLength({
    min: 4,
    max: 150,
  });
  req.check("body", "Write a body").notEmpty();
  req.check("body", "body must be between 4 to 1500 characters").isLength({
    min: 4,
    max: 1500,
  });

  //check for errors
  const errors = req.validationErrors();

  //if error show the first one as they happen
  if (erros) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};
