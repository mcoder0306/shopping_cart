import Joi from "joi";

export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params);
      if (error) throw error;
      req.params = value;
    }

    if (schema.body) {
      const { error, value } = schema.body.validate(req.body);
      if (error) throw error;
      req.body = value;
    }

    if (schema.query) {
      const { error, value } = schema.query.validate(req.query);
      if (error) throw error;

      Object.keys(value).forEach((key) => {
        req.query[key] = value[key];
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
};