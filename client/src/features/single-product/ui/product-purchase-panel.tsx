import type { ProductVariant } from '../../../shared/types';
import { getPurchaseState } from '../model';

type ProductPurchasePanelProps = {
  selectedVariant: ProductVariant | null;
  totalQuantity: number;
};

export const ProductPurchasePanel = ({
  selectedVariant,
  totalQuantity,
}: ProductPurchasePanelProps) => {
  const purchaseState = getPurchaseState(selectedVariant, totalQuantity);

  return (
    <div className="flex flex-col gap-3">
      {selectedVariant && (
        <div>
          <p>SKU: {selectedVariant.sku}</p>
          <p>Variant in stock: {selectedVariant.quantity}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled
          className="max-w-50 cursor-not-allowed rounded border px-2 py-1 opacity-40"
        >
          Add to Favorites
        </button>

        <button
          type="button"
          disabled={purchaseState.isDisabled}
          className="max-w-50 cursor-pointer rounded border px-2 py-1 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {purchaseState.buttonLabel}
        </button>
      </div>

      <p className="text-sm text-gray-600">{purchaseState.message}</p>
    </div>
  );
};
