import { z } from 'zod';

import { getZodFieldErrors } from '../../../shared/lib';
import type {
  ReviewFormErrors,
  ReviewFormValues,
} from './review-form-types';
import { REVIEW_TEXT_MAX_LENGTH } from './review-form-constraints';

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
    .max(REVIEW_TEXT_MAX_LENGTH, 'Review text is too long'),
});

export const getReviewFieldErrors = (
  error: z.ZodError<ReviewFormValues>,
): ReviewFormErrors => getZodFieldErrors<ReviewFormValues>(error);
