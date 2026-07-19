import type { ReactNode } from 'react';
import type { FormEvent } from 'react';

import {
  ReviewCard,
  ReviewListSkeleton,
  type ProductReview,
} from '../../../entities/review';
import { Button, FeedbackMessage } from '../../../shared/ui';
import type {
  ProductReviewFormErrors,
  ProductReviewFormValues,
} from '../model';
import { ProductReviewForm } from './product-review-form';

type ProductReviewsAccordionProps = {
  deleteReviewError?: string | null;
  error: string | null;
  fieldErrors: ProductReviewFormErrors;
  hasMoreReviews: boolean;
  isAuthenticated: boolean;
  isAuthPending: boolean;
  isEmpty: boolean;
  isFetching: boolean;
  isFormCreated: boolean;
  isFormSubmitting: boolean;
  isInitialLoading: boolean;
  isOpen: boolean;
  isReviewStatusFetching: boolean;
  isReviewStatusLoading: boolean;
  loadedReviews: ProductReview[];
  renderReviewActions?: (
    review: ProductReview,
    context: {
      currentUserReviewId: string | null;
      resetReviews: () => void;
    },
  ) => ReactNode;
  renderReviewEditForm?: (review: ProductReview) => ReactNode;
  reviewFormError: string | null;
  reviewStatusError: string | null;
  reviewStatusHasReviewed: boolean;
  reviewStatusReviewId: string | null;
  reviewsCountLabel: string;
  totalReviews: number;
  values: ProductReviewFormValues;
  loadMoreReviews: () => void;
  refetchReviews: () => void;
  refetchReviewStatus: () => void;
  resetReviews: () => void;
  onSignIn: () => void;
  onSubmitReview: (event: FormEvent<HTMLFormElement>) => void;
  onToggleReviews: () => void;
  onUpdateReviewField: <Field extends keyof ProductReviewFormValues>(
    field: Field,
    value: ProductReviewFormValues[Field],
  ) => void;
};

export const ProductReviewsAccordion = ({
  deleteReviewError = null,
  error,
  fieldErrors,
  hasMoreReviews,
  isAuthenticated,
  isAuthPending,
  isEmpty,
  isFetching,
  isFormCreated,
  isFormSubmitting,
  isInitialLoading,
  isOpen,
  isReviewStatusFetching,
  isReviewStatusLoading,
  loadedReviews,
  loadMoreReviews,
  onSignIn,
  onSubmitReview,
  onToggleReviews,
  onUpdateReviewField,
  refetchReviews,
  refetchReviewStatus,
  renderReviewActions,
  renderReviewEditForm,
  resetReviews,
  reviewFormError,
  reviewStatusError,
  reviewStatusHasReviewed,
  reviewStatusReviewId,
  reviewsCountLabel,
  totalReviews,
  values,
}: ProductReviewsAccordionProps) => {
  return (
    <section className="flex flex-col gap-3 rounded border border-border-soft bg-background-surface p-4">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
        aria-expanded={isOpen}
        onClick={onToggleReviews}
      >
        <span className="flex flex-col gap-1">
          <span className="block-title text-typography-heading">Reviews</span>
          <span className="block-small text-typography-secondary">
            {reviewsCountLabel}
          </span>
        </span>
        <span
          className={`block-title text-accent-primary transition-transform duration-300 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`flex flex-col gap-3 transition-transform duration-300 ease-out ${
              isOpen ? 'translate-y-0' : '-translate-y-2'
            }`}
            aria-hidden={!isOpen}
          >
            {isInitialLoading && <ReviewListSkeleton />}

            {error && (
              <FeedbackMessage
                title="Could not load reviews"
                description={error}
                tone="danger"
                action={
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={refetchReviews}
                  >
                    Try again
                  </Button>
                }
              />
            )}

            {deleteReviewError && (
              <FeedbackMessage
                title="Could not delete review"
                description={deleteReviewError}
                tone="danger"
              />
            )}

            {!error && isEmpty && (
              <FeedbackMessage
                title="No reviews yet"
                description="Reviews will appear here once customers share their feedback."
              />
            )}

            {!error && loadedReviews.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="block-small text-typography-secondary">
                  Showing {loadedReviews.length} of {totalReviews} reviews
                </p>
                {loadedReviews.map((review) => {
                  const editForm = renderReviewEditForm?.(review);

                  if (editForm) {
                    return <div key={review._id}>{editForm}</div>;
                  }

                  const actionSlot = renderReviewActions?.(review, {
                    currentUserReviewId: reviewStatusReviewId,
                    resetReviews,
                  });

                  return (
                    <ReviewCard
                      key={review._id}
                      actionSlot={actionSlot}
                      review={review}
                    />
                  );
                })}
              </div>
            )}

            {isFetching && !isInitialLoading && (
              <p className="block-small text-typography-secondary">
                Loading more reviews...
              </p>
            )}

            {!error && hasMoreReviews && (
              <Button
                size="sm"
                variant="secondary"
                disabled={isFetching}
                onClick={loadMoreReviews}
              >
                Load more reviews
              </Button>
            )}

            <div className="border-t border-border-soft pt-3">
              {isAuthenticated ? (
                isReviewStatusLoading ? (
                  <p className="block-small text-typography-muted">
                    Checking review status...
                  </p>
                ) : reviewStatusError ? (
                  <FeedbackMessage
                    tone="danger"
                    title="Could not check review status"
                    description={reviewStatusError}
                    action={
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={refetchReviewStatus}
                      >
                        Try again
                      </Button>
                    }
                  />
                ) : reviewStatusHasReviewed ? (
                  <FeedbackMessage
                    title="You have already reviewed this product"
                    description="Thanks for sharing your feedback."
                  />
                ) : (
                  <ProductReviewForm
                    error={reviewFormError}
                    fieldErrors={fieldErrors}
                    isCreated={isFormCreated}
                    isSubmitting={
                      isFormSubmitting || isReviewStatusFetching
                    }
                    values={values}
                    onSubmit={onSubmitReview}
                    onUpdateField={onUpdateReviewField}
                  />
                )
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isAuthPending}
                    onClick={onSignIn}
                  >
                    {isAuthPending
                      ? 'Checking session...'
                      : 'Sign in to write a review'}
                  </Button>
                  <p className="block-small text-typography-muted">
                    Review writing is available after sign in.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
