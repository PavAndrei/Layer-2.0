import { formatProductPrice } from './product-price-format';

type ProductPriceProps = {
  defaultPrice: number;
  discountPrice: number;
  discountPercent: number;
  hasDiscount: boolean;
};

export const ProductPrice = ({
  defaultPrice,
  discountPrice,
  discountPercent,
  hasDiscount,
}: ProductPriceProps) => {
  if (!hasDiscount) {
    return <span>{formatProductPrice(defaultPrice)}</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="line-through block-small text-typography-muted">
        {formatProductPrice(defaultPrice)}
      </span>
      <span className="block-medium">{formatProductPrice(discountPrice)}</span>
      <span className="block-micro">-{discountPercent}%</span>
    </div>
  );
};
