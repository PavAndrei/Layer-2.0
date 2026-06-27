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
      <span className="line-through text-gray-500">
        {formatProductPrice(defaultPrice)}
      </span>
      <span>{formatProductPrice(discountPrice)}</span>
      <span className="text-sm text-red-600">-{discountPercent}%</span>
    </div>
  );
};
