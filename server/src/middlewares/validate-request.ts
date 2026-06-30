import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { ApiError } from '../exceptions/api-error';

type RequestSchemaData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

export const validateRequest =
  (schema: ZodType<RequestSchemaData>): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join('; ');

      return next(ApiError.BadRequest(message || 'Invalid request data'));
    }

    if ('body' in result.data) {
      req.body = result.data.body;
    }

    req.validated = result.data;

    next();
  };
