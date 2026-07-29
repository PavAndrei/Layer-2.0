import type { AdminProductsFilters } from '../model';
import {
  ADMIN_PRODUCT_AUDIENCE_FILTER_OPTIONS,
  ADMIN_PRODUCT_CATEGORY_FILTER_OPTIONS,
  ADMIN_PRODUCT_COLOR_FILTER_OPTIONS,
  ADMIN_PRODUCT_DISCOUNT_FILTER_OPTIONS,
  ADMIN_PRODUCT_SIZE_FILTER_OPTIONS,
  ADMIN_PRODUCT_SORT_FILTER_OPTIONS,
  ADMIN_PRODUCT_STATUS_FILTER_OPTIONS,
  ADMIN_PRODUCT_STOCK_FILTER_OPTIONS,
} from '../model';
import {
  Button,
  SelectFilter,
  TextInput,
} from '../../../shared/ui';

type AdminProductsFiltersFormProps = {
  audience: AdminProductsFilters['audience'];
  category: AdminProductsFilters['category'];
  color: AdminProductsFilters['color'];
  discount: AdminProductsFilters['discount'];
  search: string;
  size: AdminProductsFilters['size'];
  sort: AdminProductsFilters['sort'];
  status: AdminProductsFilters['status'];
  stock: AdminProductsFilters['stock'];
  onAudienceChange: (audience: AdminProductsFilters['audience']) => void;
  onCategoryChange: (category: AdminProductsFilters['category']) => void;
  onColorChange: (color: AdminProductsFilters['color']) => void;
  onDiscountChange: (discount: AdminProductsFilters['discount']) => void;
  onReset: () => void;
  onSearchChange: (search: string) => void;
  onSizeChange: (size: AdminProductsFilters['size']) => void;
  onSortChange: (sort: AdminProductsFilters['sort']) => void;
  onStatusChange: (status: AdminProductsFilters['status']) => void;
  onStockChange: (stock: AdminProductsFilters['stock']) => void;
};

export const AdminProductsFiltersForm = ({
  audience,
  category,
  color,
  discount,
  search,
  size,
  sort,
  status,
  stock,
  onAudienceChange,
  onCategoryChange,
  onColorChange,
  onDiscountChange,
  onReset,
  onSearchChange,
  onSizeChange,
  onSortChange,
  onStatusChange,
  onStockChange,
}: AdminProductsFiltersFormProps) => {
  const selectedStatus =
    ADMIN_PRODUCT_STATUS_FILTER_OPTIONS.find(
      (option) => option.value === status,
    ) ?? ADMIN_PRODUCT_STATUS_FILTER_OPTIONS[0];
  const selectedCategory =
    ADMIN_PRODUCT_CATEGORY_FILTER_OPTIONS.find(
      (option) => option.value === category,
    ) ?? ADMIN_PRODUCT_CATEGORY_FILTER_OPTIONS[0];
  const selectedAudience =
    ADMIN_PRODUCT_AUDIENCE_FILTER_OPTIONS.find(
      (option) => option.value === audience,
    ) ?? ADMIN_PRODUCT_AUDIENCE_FILTER_OPTIONS[0];
  const selectedStock =
    ADMIN_PRODUCT_STOCK_FILTER_OPTIONS.find(
      (option) => option.value === stock,
    ) ?? ADMIN_PRODUCT_STOCK_FILTER_OPTIONS[0];
  const selectedDiscount =
    ADMIN_PRODUCT_DISCOUNT_FILTER_OPTIONS.find(
      (option) => option.value === discount,
    ) ?? ADMIN_PRODUCT_DISCOUNT_FILTER_OPTIONS[0];
  const selectedColor =
    ADMIN_PRODUCT_COLOR_FILTER_OPTIONS.find(
      (option) => option.value === color,
    ) ?? ADMIN_PRODUCT_COLOR_FILTER_OPTIONS[0];
  const selectedSize =
    ADMIN_PRODUCT_SIZE_FILTER_OPTIONS.find(
      (option) => option.value === size,
    ) ?? ADMIN_PRODUCT_SIZE_FILTER_OPTIONS[0];
  const selectedSort =
    ADMIN_PRODUCT_SORT_FILTER_OPTIONS.find((option) => option.value === sort) ??
    ADMIN_PRODUCT_SORT_FILTER_OPTIONS[0];

  return (
    <form
      className="flex flex-col gap-4 rounded border border-border-soft bg-background-surface p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(12rem,1fr))]">
        <TextInput
          id="admin-products-search"
          label="Search products"
          placeholder="Product title or slug..."
          value={search}
          onChange={onSearchChange}
        />

        <SelectFilter
          id="admin-products-status"
          label="Status:"
          options={ADMIN_PRODUCT_STATUS_FILTER_OPTIONS}
          value={selectedStatus}
          onChange={(option) => onStatusChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-products-category"
          label="Category:"
          options={ADMIN_PRODUCT_CATEGORY_FILTER_OPTIONS}
          value={selectedCategory}
          onChange={(option) => onCategoryChange(option?.value ?? '')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SelectFilter
          id="admin-products-audience"
          label="Audience:"
          options={ADMIN_PRODUCT_AUDIENCE_FILTER_OPTIONS}
          value={selectedAudience}
          onChange={(option) => onAudienceChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-products-stock"
          label="Stock:"
          options={ADMIN_PRODUCT_STOCK_FILTER_OPTIONS}
          value={selectedStock}
          onChange={(option) => onStockChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-products-discount"
          label="Discount:"
          options={ADMIN_PRODUCT_DISCOUNT_FILTER_OPTIONS}
          value={selectedDiscount}
          onChange={(option) => onDiscountChange(option?.value ?? '')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SelectFilter
          id="admin-products-color"
          label="Color:"
          options={ADMIN_PRODUCT_COLOR_FILTER_OPTIONS}
          value={selectedColor}
          onChange={(option) => onColorChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-products-size"
          label="Size:"
          options={ADMIN_PRODUCT_SIZE_FILTER_OPTIONS}
          value={selectedSize}
          onChange={(option) => onSizeChange(option?.value ?? '')}
        />

        <SelectFilter
          id="admin-products-sort"
          label="Sort:"
          options={ADMIN_PRODUCT_SORT_FILTER_OPTIONS}
          value={selectedSort}
          onChange={(option) => onSortChange(option?.value ?? 'default')}
        />
      </div>

      <Button
        className="self-start"
        size="sm"
        type="button"
        variant="secondary"
        onClick={onReset}
      >
        Clear Filters
      </Button>
    </form>
  );
};
