import type { CreateProductReviewData } from '../../../entities/review';
import type { FieldErrors } from '../../../shared/lib';

export type ProductReviewFormValues = CreateProductReviewData;

export type ProductReviewFormErrors = FieldErrors<ProductReviewFormValues>;
