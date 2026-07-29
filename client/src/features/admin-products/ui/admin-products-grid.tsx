import type { AdminProductListItem } from '../api';
import { formatProductPrice } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';
import { Button } from '../../../shared/ui';
import { AdminProductStatusBadge } from './admin-product-status-badge';

type AdminProductsGridProps = {
  products: AdminProductListItem[];
};

type CategoriesCellProps = {
  categories: string[];
};

const CategoriesCell = ({
  categories,
}: CategoriesCellProps) => {
  const visibleCategories = categories.slice(0, 3);
  const hiddenCategoriesCount = Math.max(
    0,
    categories.length - visibleCategories.length,
  );

  return (
    <div className="flex flex-wrap gap-1">
      {visibleCategories.map((category) => (
        <span
          key={category}
          className="rounded border border-border-soft bg-background-secondary px-2 py-1 block-small text-typography-secondary"
        >
          {category}
        </span>
      ))}
      {hiddenCategoriesCount > 0 && (
        <span className="rounded border border-border-soft bg-background-secondary px-2 py-1 block-small text-typography-muted">
          +{hiddenCategoriesCount}
        </span>
      )}
    </div>
  );
};

const getStockClassName = (totalStock: number) => {
  if (totalStock <= 0) return 'text-accent-secondary';
  if (totalStock <= 5) return 'text-accent-primary';

  return 'text-typography-primary';
};

export const AdminProductsGrid = ({
  products,
}: AdminProductsGridProps) => (
  <div className="overflow-x-auto rounded border border-border-soft bg-background-surface">
    <div className="min-w-[64rem]">
      <div className="grid grid-cols-[minmax(17rem,1.8fr)_7rem_minmax(12rem,1.1fr)_8rem_7rem_7rem_8rem_7rem] gap-3 border-b border-border-soft bg-background-secondary px-4 py-3 block-small text-typography-muted">
        <span>Product</span>
        <span>Status</span>
        <span>Categories</span>
        <span>Price</span>
        <span>Variants</span>
        <span>Stock</span>
        <span>Updated</span>
        <span>Actions</span>
      </div>

      {products.map((product) => (
        <article
          key={product._id}
          className="grid grid-cols-[minmax(17rem,1.8fr)_7rem_minmax(12rem,1.1fr)_8rem_7rem_7rem_8rem_7rem] gap-3 border-b border-border-soft px-4 py-3 last:border-b-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={product.img}
              alt={product.title}
              className="size-14 shrink-0 rounded border border-border-soft object-cover"
              loading="lazy"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="truncate block-medium text-typography-heading">
                {product.title}
              </h3>
              <p className="truncate block-small text-typography-muted">
                {product.slug}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <AdminProductStatusBadge status={product.status} />
          </div>

          <div className="flex items-center">
            <CategoriesCell categories={product.categories} />
          </div>

          <div className="flex flex-col justify-center gap-1">
            <span className="block-medium text-typography-heading">
              {formatProductPrice(
                product.hasDiscount
                  ? product.discountPrice
                  : product.defaultPrice,
              )}
            </span>
            {product.hasDiscount && (
              <span className="block-small text-typography-muted line-through">
                {formatProductPrice(product.defaultPrice)}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center gap-1">
            <span className="block-medium text-typography-heading">
              {product.variantsCount}
            </span>
            <span className="block-small text-typography-muted">
              {product.colorsCount} colors / {product.sizesCount} sizes
            </span>
          </div>

          <div className="flex items-center">
            <span
              className={`block-medium ${getStockClassName(product.totalStock)}`}
            >
              {product.totalStock}
            </span>
          </div>

          <time
            className="flex items-center block-small text-typography-secondary"
            dateTime={product.updatedAt}
          >
            {formatDisplayDate(product.updatedAt)}
          </time>

          <div className="flex items-center">
            <Button disabled size="sm" variant="secondary">
              Edit
            </Button>
          </div>
        </article>
      ))}
    </div>
  </div>
);
