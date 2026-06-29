import { useEffect, useState } from 'react';

import {
  ReviewCard,
  ReviewListSkeleton,
  type ProductReview,
} from '../../../entities/review';
import { Button, FeedbackMessage } from '../../../shared/ui';
import { useProductReviews } from '../model';

type ProductReviewsAccordionProps = {
  productId: string;
  reviewsCount: number;
};

const REVIEWS_LIMIT = 5;

const formatReviewsCount = (count: number) =>
  `${count} ${count === 1 ? 'review' : 'reviews'}`;

export const ProductReviewsAccordion = ({
  productId,
  reviewsCount,
}: ProductReviewsAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loadedReviews, setLoadedReviews] = useState<ProductReview[]>([]);
  const { reviews, pagination, isLoading, isFetching, error, refetch } =
    useProductReviews({
      productId,
      isEnabled: isOpen,
      limit: REVIEWS_LIMIT,
      page,
    });
  const isInitialLoading = isLoading && loadedReviews.length === 0;
  const isEmpty = !isInitialLoading && loadedReviews.length === 0;
  const hasMoreReviews = pagination.page < pagination.totalPages;
  const totalReviews = pagination.total || reviewsCount;

  useEffect(() => {
    setPage(1);
    setLoadedReviews([]);
  }, [productId]);

  useEffect(() => {
    if (reviews.length === 0) return;

    setLoadedReviews((currentReviews) => {
      if (page === 1) return reviews;

      const reviewIds = new Set(currentReviews.map((review) => review._id));
      const nextReviews = reviews.filter((review) => !reviewIds.has(review._id));

      return [...currentReviews, ...nextReviews];
    });
  }, [page, reviews]);

  return (
    <section className="flex flex-col gap-3 rounded border border-border-soft bg-background-surface p-4">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="flex flex-col gap-1">
          <span className="block-title text-typography-heading">Reviews</span>
          <span className="block-small text-typography-secondary">
            {formatReviewsCount(reviewsCount)}
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
                    onClick={() => refetch()}
                  >
                    Try again
                  </Button>
                }
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
                {loadedReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
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
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Load more reviews
              </Button>
            )}

            <div className="flex flex-col items-start gap-2 border-t border-border-soft pt-3">
              <Button size="sm" variant="ghost" disabled>
                Sign in to write a review
              </Button>
              <p className="block-small text-typography-muted">
                Review writing will be available after sign in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
