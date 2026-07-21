const validateSchema = (schema, source = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map(err => err.message),
      });
    }

    next();
  };
};

module.exports = validateSchema;