import type { ProductVariant } from '../../../entities/product';
import { Button } from '../../../shared/ui';
import { getPurchaseState } from '../model';

type ProductPurchasePanelProps = {
  isSelectedVariantInCart: boolean;
  selectedVariant: ProductVariant | null;
  totalQuantity: number;
  onAddToCart: () => void;
  onViewCart: () => void;
};

export const ProductPurchasePanel = ({
  isSelectedVariantInCart,
  selectedVariant,
  totalQuantity,
  onAddToCart,
  onViewCart,
}: ProductPurchasePanelProps) => {
  const purchaseState = getPurchaseState(selectedVariant, totalQuantity);
  const shouldShowViewCartButton =
    isSelectedVariantInCart && !purchaseState.isDisabled;
  const purchaseMessage = shouldShowViewCartButton
    ? 'This variant is already in your cart.'
    : purchaseState.message;

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
          onClick={shouldShowViewCartButton ? onViewCart : onAddToCart}
        >
          {shouldShowViewCartButton ? 'View Cart' : purchaseState.buttonLabel}
        </Button>
      </div>

      <p className="block-medium text-typography-secondary">
        {purchaseMessage}
      </p>
    </div>
  );
};
