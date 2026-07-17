import { Link } from 'react-router';

import { FeedbackMessage } from '../../../shared/ui';

const linkClassName =
  'inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary';

export const UserReviewsEmptyState = () => (
  <FeedbackMessage
    title="No reviews yet"
    description="Reviews you write will appear here."
    action={
      <Link to="/catalog" className={linkClassName}>
        Browse products
      </Link>
    }
  />
);
