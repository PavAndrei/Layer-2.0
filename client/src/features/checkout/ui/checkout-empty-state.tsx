import { Link } from 'react-router';

import { FeedbackMessage } from '../../../shared/ui';

const linkClassName =
  'inline-flex min-h-10 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-4 py-2 block-medium text-typography-primary transition-[color,background-color,border-color,transform] duration-150 ease-out hover:bg-background-secondary active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black';

export const CheckoutEmptyState = () => (
  <FeedbackMessage
    title="Your cart is empty"
    description="Add products to your cart before starting checkout."
    action={
      <Link to="/catalog" className={linkClassName}>
        Continue shopping
      </Link>
    }
  />
);
