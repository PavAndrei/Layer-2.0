import type { ProductVariant } from '../../../entities/product';
import { Button } from '../../../shared/ui';
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
        <div className="block-medium">
          <p>SKU: {selectedVariant.sku}</p>
          <p>Variant in stock: {selectedVariant.quantity}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button disabled variant="ghost" className="max-w-50">
          Add to Favorites
        </Button>

        <Button
          disabled={purchaseState.isDisabled}
          variant="primary"
          className="max-w-50"
        >
          {purchaseState.buttonLabel}
        </Button>
      </div>

      <p className="block-medium text-typography-secondary">
        {purchaseState.message}
      </p>
    </div>
  );
};
