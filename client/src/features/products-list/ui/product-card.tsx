import { Link } from 'react-router';
import { ProductCardProps } from '../../../shared/types/product-types';

export const ProductCard = ({ product }: { product: ProductCardProps }) => {
  const availableColors = [
    ...new Set(
      product.variants
        .filter((variant) => variant.quantity > 0)
        .map((variant) => variant.color),
    ),
  ];

  return (
    <div className="border rounded p-1 lg:py-2 lg:px-1 2xl:py-3 2xl:px-2 flex flex-col gap-3">
      <Link
        to={`/products/${product._id}`}
        className="bg-gray-300 text-gray-300 rounded"
      >
        <img
          src={product.img}
          alt={product.title}
          className="w-full h-48 object-cover rounded"
        />
      </Link>
      <div className="flex flex-col gap-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-bold capitalize text-xl">{product.title}</h3>
        </Link>
        <p>{product.description}</p>
        {product.hasDiscount ? (
          <div>
            <span className="line-through">
              {product.defaultPrice.toFixed(2)}
            </span>{' '}
            <span>{product.discountPrice.toFixed(2)}</span>
          </div>
        ) : (
          <div>{product.defaultPrice.toFixed(2)}</div>
        )}
        <div>rating: {product.rating}</div>
        <div>categories: {product.categories.join(', ')}</div>
        <div className="flex flex-col gap-1">
          <span>Available colors:</span>
          {availableColors.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {availableColors.map((color) => (
                <span
                  key={color}
                  className="rounded-full bg-gray-200 px-2 py-0.5 text-sm capitalize"
                >
                  {color.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          ) : (
            <span className="font-semibold text-red-600">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};
