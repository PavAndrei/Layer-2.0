import type { ProductVariant } from '../../../shared/types';

export type PurchaseState = {
  buttonLabel: string;
  isDisabled: boolean;
  message: string;
};

export const getPurchaseState = (
  selectedVariant: ProductVariant | null,
): PurchaseState => {
  if (!selectedVariant) {
    return {
      buttonLabel: 'Select Variant',
      isDisabled: true,
      message: 'Choose an available color and size.',
    };
  }

  if (selectedVariant.quantity === 0) {
    return {
      buttonLabel: 'Out of Stock',
      isDisabled: true,
      message: 'This variant is currently out of stock.',
    };
  }

  return {
    buttonLabel: 'Add to Cart',
    isDisabled: false,
    message: `${selectedVariant.quantity} available.`,
  };
};

