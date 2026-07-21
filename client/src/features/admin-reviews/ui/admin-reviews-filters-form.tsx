import type { AdminReviewsFilters } from '../model';
import { ADMIN_REVIEW_RATING_FILTER_OPTIONS } from '../model';
import {
  Button,
  CheckboxFilter,
  SelectFilter,
  TextInput,
} from '../../../shared/ui';

type AdminReviewsFiltersFormProps = {
  rating: AdminReviewsFilters['rating'];
  search: string;
  verifiedPurchase: AdminReviewsFilters['verifiedPurchase'];
  onRatingChange: (rating: AdminReviewsFilters['rating']) => void;
  onReset: () => void;
  onSearchChange: (search: string) => void;
  onVerifiedPurchaseChange: (
    verifiedPurchase: AdminReviewsFilters['verifiedPurchase'],
  ) => void;
};

export const AdminReviewsFiltersForm = ({
  rating,
  search,
  verifiedPurchase,
  onRatingChange,
  onReset,
  onSearchChange,
  onVerifiedPurchaseChange,
}: AdminReviewsFiltersFormProps) => {
  const selectedRating =
    ADMIN_REVIEW_RATING_FILTER_OPTIONS.find(
      (option) => option.value === rating,
    ) ?? ADMIN_REVIEW_RATING_FILTER_OPTIONS[0];

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(12rem,1fr)]">
        <TextInput
          id="admin-reviews-search"
          label="Search reviews"
          placeholder="Product, customer name or email..."
          value={search}
          onChange={onSearchChange}
        />

        <SelectFilter
          className="flex flex-col gap-2.5"
          id="admin-reviews-rating"
          label="Rating:"
          options={ADMIN_REVIEW_RATING_FILTER_OPTIONS}
          value={selectedRating}
          onChange={(option) => onRatingChange(option?.value ?? '')}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CheckboxFilter
          id="admin-reviews-verified-purchase"
          label="Only verified purchase"
          checked={verifiedPurchase === true}
          onChange={(checked) => onVerifiedPurchaseChange(checked ? true : '')}
        />

        <Button
          className="self-start sm:self-auto"
          size="sm"
          type="button"
          variant="secondary"
          onClick={onReset}
        >
          Clear Filters
        </Button>
      </div>
    </form>
  );
};
