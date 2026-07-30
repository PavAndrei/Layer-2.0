import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import type {
  AdminProductListItem,
  DeleteAdminProductResponseData,
} from '../api';
import { formatProductPrice } from '../../../entities/product';
import type { ProductStatus } from '../../../entities/product';
import { formatDisplayDate } from '../../../shared/lib';
import { Button, ConfirmDialog } from '../../../shared/ui';
import {
  useDeleteAdminProduct,
  useUpdateAdminProductStatus,
} from '../model';
import { AdminProductStatusBadge } from './admin-product-status-badge';

type AdminProductsGridProps = {
  onProductDeleted?: (data: DeleteAdminProductResponseData) => void;
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

type ProductStatusAction = {
  confirmLabel: string;
  confirmingLabel: string;
  description: string;
  nextStatus: ProductStatus;
  title: string;
  triggerLabel: string;
};

const getProductStatusAction = (
  product: AdminProductListItem,
): ProductStatusAction => {
  if (product.status === 'archived') {
    return {
      confirmLabel: 'Restore product',
      confirmingLabel: 'Restoring...',
      description:
        `${product.title} will become active and can appear in the storefront again.`,
      nextStatus: 'active',
      title: 'Restore product?',
      triggerLabel: 'Restore',
    };
  }

  return {
    confirmLabel: 'Archive product',
    confirmingLabel: 'Archiving...',
    description:
      `${product.title} will be hidden from the storefront but kept in admin history.`,
    nextStatus: 'archived',
    title: 'Archive product?',
    triggerLabel: 'Archive',
  };
};

const getStatusMutationError = (
  mutation: ReturnType<typeof useUpdateAdminProductStatus>,
) => {
  if (mutation.data && !mutation.data.success) {
    return mutation.data.message;
  }

  if (mutation.error instanceof Error) {
    return mutation.error.message;
  }

  return null;
};

const getDeleteMutationError = (
  mutation: ReturnType<typeof useDeleteAdminProduct>,
) => {
  if (mutation.data && !mutation.data.success) {
    return mutation.data.message;
  }

  if (mutation.error instanceof Error) {
    return mutation.error.message;
  }

  return null;
};

export const AdminProductsGrid = ({
  onProductDeleted,
  products,
}: AdminProductsGridProps) => {
  const updateStatusMutation = useUpdateAdminProductStatus();
  const deleteProductMutation = useDeleteAdminProduct({
    onDeleted: onProductDeleted,
  });
  const [selectedProduct, setSelectedProduct] =
    useState<AdminProductListItem | null>(null);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<AdminProductListItem | null>(null);
  const statusAction = selectedProduct
    ? getProductStatusAction(selectedProduct)
    : null;
  const mutationError = getStatusMutationError(updateStatusMutation);
  const deleteMutationError = getDeleteMutationError(deleteProductMutation);
  const isActionPending = updateStatusMutation.isPending;
  const isDeletePending = deleteProductMutation.isPending;
  const dialogDescription = useMemo(() => {
    if (!statusAction) return undefined;

    return mutationError
      ? `${statusAction.description} ${mutationError}`
      : statusAction.description;
  }, [
    mutationError,
    statusAction,
  ]);
  const deleteDialogDescription = useMemo(() => {
    if (!selectedProductForDelete) return undefined;

    const description =
      `${selectedProductForDelete.title} will be permanently deleted. ` +
      'Product reviews and favorites will be removed. Existing orders will keep their item snapshots.';

    return deleteMutationError
      ? `${description} ${deleteMutationError}`
      : description;
  }, [
    deleteMutationError,
    selectedProductForDelete,
  ]);

  const closeStatusDialog = () => {
    if (isActionPending) return;

    updateStatusMutation.reset();
    setSelectedProduct(null);
  };

  const confirmStatusAction = () => {
    if (!selectedProduct || !statusAction || isActionPending) return;

    updateStatusMutation.mutate(
      {
        payload: {
          status: statusAction.nextStatus,
        },
        productId: selectedProduct._id,
      },
      {
        onSuccess: (response) => {
          if (!response.success) return;

          setSelectedProduct(null);
        },
      },
    );
  };

  const closeDeleteDialog = () => {
    if (isDeletePending) return;

    deleteProductMutation.reset();
    setSelectedProductForDelete(null);
  };

  const confirmDeleteAction = () => {
    if (!selectedProductForDelete || isDeletePending) return;

    deleteProductMutation.mutate(selectedProductForDelete._id, {
      onSuccess: (response) => {
        if (!response.success) return;

        setSelectedProductForDelete(null);
      },
    });
  };

  return (
    <>
      <div className="overflow-x-auto rounded border border-border-soft bg-background-surface">
        <div className="min-w-[70rem]">
          <div className="grid grid-cols-[minmax(17rem,1.8fr)_7rem_minmax(12rem,1.1fr)_8rem_7rem_7rem_8rem_11rem] gap-3 border-b border-border-soft bg-background-secondary px-4 py-3 block-small text-typography-muted">
            <span>Product</span>
            <span>Status</span>
            <span>Categories</span>
            <span>Price</span>
            <span>Variants</span>
            <span>Stock</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>

          {products.map((product) => {
            const productAction = getProductStatusAction(product);
            const isCurrentProductPending =
              isActionPending && selectedProduct?._id === product._id;
            const isCurrentProductDeleting =
              isDeletePending &&
              selectedProductForDelete?._id === product._id;

            return (
              <article
                key={product._id}
                className="grid grid-cols-[minmax(17rem,1.8fr)_7rem_minmax(12rem,1.1fr)_8rem_7rem_7rem_8rem_11rem] gap-3 border-b border-border-soft px-4 py-3 last:border-b-0"
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

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/admin/products/${product._id}/edit`}
                    className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
                  >
                    Edit
                  </Link>
                  <Button
                    disabled={isActionPending || isDeletePending}
                    size="sm"
                    variant={
                      product.status === 'archived' ? 'secondary' : 'danger'
                    }
                    onClick={() => {
                      updateStatusMutation.reset();
                      setSelectedProduct(product);
                    }}
                  >
                    {isCurrentProductPending
                      ? productAction.confirmingLabel
                      : productAction.triggerLabel}
                  </Button>
                  {product.status === 'archived' && (
                    <Button
                      disabled={isActionPending || isDeletePending}
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        deleteProductMutation.reset();
                        setSelectedProductForDelete(product);
                      }}
                    >
                      {isCurrentProductDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        confirmLabel={statusAction?.confirmLabel}
        confirmingLabel={statusAction?.confirmingLabel}
        description={dialogDescription}
        isConfirming={isActionPending}
        isOpen={Boolean(selectedProduct && statusAction)}
        title={statusAction?.title ?? 'Update product status?'}
        tone={
          statusAction?.nextStatus === 'archived' ? 'danger' : 'neutral'
        }
        onCancel={closeStatusDialog}
        onConfirm={confirmStatusAction}
      />
      <ConfirmDialog
        confirmLabel="Delete product"
        confirmingLabel="Deleting..."
        description={deleteDialogDescription}
        isConfirming={isDeletePending}
        isOpen={Boolean(selectedProductForDelete)}
        title="Delete product permanently?"
        tone="danger"
        onCancel={closeDeleteDialog}
        onConfirm={confirmDeleteAction}
      />
    </>
  );
};
