import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),

    email: Joi.string()
      .email()
      .required(),

    phone: Joi.string()
      .pattern(/^\+380\d{9}$/)
      .required(),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
      .required(),
  }),
};
