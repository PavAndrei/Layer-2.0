import { Request, Response, NextFunction } from 'express';

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const catchErrors =
  (controller: Controller) =>
  (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch(next);
  };
