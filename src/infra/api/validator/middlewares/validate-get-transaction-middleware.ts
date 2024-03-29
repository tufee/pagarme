import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import logger from "../../../helper/logger";

const schema = Joi.object({
  cpf: Joi.string().required(),
});

export function validateGetTransaction(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { error } = schema.validate(request.query);
  if (error) {
    logger.warn(error);
    return response.status(400).json({ message: error.details[0].message });
  }
  return next();
}
