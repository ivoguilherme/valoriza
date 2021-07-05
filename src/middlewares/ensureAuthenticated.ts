import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).end();
  }

  const [_, token] = authToken.split(' ');

  try {
  const { sub } = verify(token, '213964825cc0c1e5e9bb22ddc25085de') as IPayload;

  request.user_id = sub;

  return next();
  } catch(err) {
    return response.status(401).end();
  }


}