import { formatProductPrice } from '../../../entities/product';
import { Button, FeedbackMessage, TextInput } from '../../../shared/ui';
import { useAdminBlogRelatedProducts } from '../model';
import type { AdminBlogRelatedProductOption } from '../api';

const MAX_RELATED_PRODUCTS = 8;

type AdminBlogPostRelatedProductsFieldProps = {
  disabled?: boolean;
  error?: string;
  value: string[];
  onChange: (productIds: string[]) => void;
};

type ProductOptionRowProps = {
  actionLabel: string;
  disabled?: boolean;
  fallbackProductId?: string;
  product: AdminBlogRelatedProductOption | null;
  onAction: () => void;
};

const ProductOptionRow = ({
  actionLabel,
  disabled = false,
  fallbackProductId,
  product,
  onAction,
}: ProductOptionRowProps) => {
  const price = product
    ? formatProductPrice(
        product.hasDiscount ? product.discountPrice : product.defaultPrice,
      )
    : null;

  return (
    <article className="flex items-center gap-3 rounded border border-border-soft bg-background-surface p-2">
      {product ? (
        <img
          src={product.img}
          alt={product.title}
          className="size-14 shrink-0 rounded border border-border-soft object-cover"
          loading="lazy"
        />
      ) : (
        <div className="size-14 shrink-0 rounded border border-border-soft bg-background-secondary" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h4 className="truncate block-medium text-typography-heading">
            {product?.title ?? 'Product details unavailable'}
          </h4>
          {product && (
            <span className="rounded border border-border-soft bg-background-secondary px-2 py-0.5 block-small text-typography-secondary">
              {product.status}
            </span>
          )}
        </div>
        <p className="truncate block-small text-typography-muted">
          {product?.slug ?? fallbackProductId}
        </p>
        {product && (
          <p className="block-small text-typography-secondary">
            {price} / {product.totalStock} in stock
          </p>
        )}
      </div>

      <Button
        disabled={disabled}
        size="sm"
        variant={actionLabel === 'Remove' ? 'ghost' : 'secondary'}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </article>
  );
};

export const AdminBlogPostRelatedProductsField = ({
  disabled = false,
  error,
  onChange,
  value,
}: AdminBlogPostRelatedProductsFieldProps) => {
  const {
    isSearchFetching,
    isSelectedProductsFetching,
    search,
    searchMinLength,
    searchError,
    searchProducts,
    shouldShowSearchResults,
    selectedProducts,
    selectedProductsError,
    setSearch,
  } = useAdminBlogRelatedProducts({
    selectedProductIds: value,
  });
  const isAtLimit = value.length >= MAX_RELATED_PRODUCTS;

  const addProduct = (productId: string) => {
    if (disabled || isAtLimit || value.includes(productId)) return;

    onChange([...value, productId]);
  };

  const removeProduct = (productId: string) => {
    if (disabled) return;

    onChange(value.filter((selectedProductId) => selectedProductId !== productId));
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <FeedbackMessage
          tone="danger"
          title="Related products could not be saved"
          description={error}
        />
      )}
      {selectedProductsError && (
        <FeedbackMessage
          tone="danger"
          title="Selected products could not be loaded"
          description={selectedProductsError}
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h4 className="block-medium text-typography-heading">
            Selected products
          </h4>
          <span className="block-small text-typography-muted">
            {value.length}/{MAX_RELATED_PRODUCTS}
          </span>
        </div>

        {value.length === 0 ? (
          <div className="rounded border border-dashed border-border-soft bg-background-secondary px-3 py-4 block-small text-typography-muted">
            No products selected
          </div>
        ) : (
          <div className="grid gap-2">
            {selectedProducts.map(({ product, productId }) => (
              <ProductOptionRow
                key={productId}
                actionLabel="Remove"
                disabled={disabled}
                fallbackProductId={productId}
                product={product}
                onAction={() => removeProduct(productId)}
              />
            ))}
          </div>
        )}

        {isSelectedProductsFetching && (
          <p className="block-small text-typography-muted">
            Refreshing selected products...
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <TextInput
          disabled={disabled}
          id="admin-blog-post-related-products-search"
          label="Search products"
          placeholder="Search by title or description"
          value={search}
          onChange={setSearch}
        />

        {searchError && (
          <FeedbackMessage
            tone="danger"
            title="Products could not be loaded"
            description={searchError}
          />
        )}

        <div className="grid gap-2">
          {shouldShowSearchResults &&
            searchProducts.map((product) => (
              <ProductOptionRow
                key={product._id}
                actionLabel="Add"
                disabled={disabled || isAtLimit}
                product={product}
                onAction={() => addProduct(product._id)}
              />
            ))}
        </div>

        {!shouldShowSearchResults && (
          <p className="block-small text-typography-muted">
            Enter at least {searchMinLength} characters to search products
          </p>
        )}
        {shouldShowSearchResults && isSearchFetching && (
          <p className="block-small text-typography-muted">
            Searching products...
          </p>
        )}
        {shouldShowSearchResults &&
          !isSearchFetching &&
          searchProducts.length === 0 && (
          <p className="block-small text-typography-muted">
            No matching products
          </p>
        )}
      </div>
    </div>
  );
};
