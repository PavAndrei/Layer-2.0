import { Link } from 'react-router';

import { ProductCardSkeleton, ProductGrid } from '../../entities/product';
import { Button, FeedbackMessage } from '../../shared/ui';
import {
  FAVORITES_PAGE_CONTENT,
  useFavoriteProductActions,
  useFavorites,
} from './model';
import { FavoriteProductButton } from './ui';

export const FavoritesPage = () => {
  const { error, isLoading, products, refetch } = useFavorites();
  const {
    favoriteProductIds,
    isFavoriteActionPending,
    toggleFavorite,
  } = useFavoriteProductActions();

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <div className="flex flex-col gap-2">
        <h1 className="heading text-typography-heading">
          {FAVORITES_PAGE_CONTENT.title}
        </h1>
        <p className="description text-typography-secondary">
          {FAVORITES_PAGE_CONTENT.description}
        </p>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-3 2xl:grid-cols-4 2xl:gap-4"
          aria-label="Loading favorite products"
          aria-live="polite"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <FeedbackMessage
          title="Could not load favorites"
          description={error}
          tone="danger"
          action={
            <Button size="sm" variant="secondary" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      )}

      {!isLoading && !error && products.length === 0 && (
        <FeedbackMessage
          title="No favorite products yet"
          description="Save products you like and they will appear here."
          action={
            <Link
              to="/catalog"
              className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
            >
              Browse catalog
            </Link>
          }
        />
      )}

      {!isLoading && !error && products.length > 0 && (
        <ProductGrid
          products={products}
          sourceLabel={FAVORITES_PAGE_CONTENT.sourceLabel}
          renderProductAction={(product) => (
            <FavoriteProductButton
              product={product}
              isFavorite={favoriteProductIds.has(product._id)}
              isPending={isFavoriteActionPending(product._id)}
              onToggle={toggleFavorite}
            />
          )}
        />
      )}
    </main>
  );
};
