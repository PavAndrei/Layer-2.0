import { Link } from 'react-router';

export const CartEmptyState = () => {
  return (
    <section className="flex min-h-80 flex-col items-center justify-center gap-4 rounded border border-border-soft bg-background-surface p-8 text-center">
      <div className="flex flex-col gap-2">
        <h2 className="section-title text-typography-heading">
          Your cart is empty
        </h2>
        <p className="block-medium max-w-120 text-typography-secondary">
          Add a piece from the catalog and it will appear here.
        </p>
      </div>

      <Link
        to="/catalog"
        className="inline-flex min-h-10 w-fit items-center justify-center rounded border border-accent-primary bg-accent-primary px-4 py-2 block-medium text-background-surface transition-colors hover:border-accent-hover hover:bg-accent-hover"
      >
        Browse Catalog
      </Link>
    </section>
  );
};
