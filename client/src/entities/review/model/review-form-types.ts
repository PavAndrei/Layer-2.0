import type { CreateProductReviewData } from './review-types';
import type { FieldErrors } from '../../../shared/lib';

export type ReviewFormValues = CreateProductReviewData;

export type ReviewFormErrors = FieldErrors<ReviewFormValues>;
