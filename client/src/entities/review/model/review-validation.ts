import { z } from 'zod';

import { getZodFieldErrors } from '../../../shared/lib';
import type {
  ReviewFormErrors,
  ReviewFormValues,
} from './review-form-types';

export const reviewSchema = z.object({
  rating: z
    .number()
    .int('Choose a rating')
    .min(1, 'Choose a rating')
    .max(5, 'Choose a rating'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title is too long'),
  text: z
    .string()
    .trim()
    .min(1, 'Review text is required')
    .max(2000, 'Review text is too long'),
});

export const getReviewFieldErrors = (
  error: z.ZodError<ReviewFormValues>,
): ReviewFormErrors => getZodFieldErrors<ReviewFormValues>(error);
