const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse and replace req.body with the sanitized/parsed data from Zod
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error); // Passes Zod validation error to the centralized error handler
    }
  };
};

module.exports = validate;
