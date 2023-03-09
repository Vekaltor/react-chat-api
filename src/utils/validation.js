// const Joi = require("@hapi/joi");
import Joi from "@hapi/joi";
import UserService from "../services/userService";

const errors = (translator) => {
  return {
    name: {
      "string.max": translator("ERR_MAX"),
      "string.empty": translator("ERR_REQUIRED"),
      "any.required": translator("ERR_REQUIRED"),
    },
    surname: {
      "string.max": translator("ERR_MAX"),
      "string.empty": translator("ERR_REQUIRED"),
      "any.required": translator("ERR_REQUIRED"),
    },
    email: {
      "string.email": translator("ERR_EMAIL"),
      "string.empty": translator("ERR_REQUIRED"),
      "any.required": translator("ERR_REQUIRED"),
    },
    pass: {
      "string.min": translator("ERR_MIN_PASS"),
      "string.empty": translator("ERR_REQUIRED"),
      "string.pattern.base": translator("ERR_PATTERN_PASS"),
      "any.required": translator("ERR_REQUIRED"),
    },
  };
};

//Register validation
const registerValidation = (data, translator) => {
  let defaultValidString = Joi.string().required().max(50);
  let patternPass = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%.]).*$/);
  const userService = new UserService();
  const registerSchema = Joi.object({
    name: defaultValidString.messages(errors(translator).name),
    surname: defaultValidString.messages(errors(translator).surname),
    email: Joi.string().required().email().messages(errors(translator).email),
    pass: Joi.string()
      .required()
      .min(8)
      .regex(patternPass)
      .messages(errors(translator).pass),
  });
  return registerSchema.validateAsync(data);
};

//Login validation
const loginValidation = (data, translator) => {
  const loginSchema = Joi.object({
    email: Joi.string().required().messages(errors(translator).email),
    pass: Joi.string().required().messages(errors(translator).pass),
  });

  return loginSchema.validate(data);
};

module.exports = { registerValidation, loginValidation };
