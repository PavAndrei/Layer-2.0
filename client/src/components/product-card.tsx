import { Link } from 'react-router';
import { ProductCardProps } from '../types/product';

export const ProductCard = ({ product }: { product: ProductCardProps }) => {
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
        <div>color: {product.color}</div>
        <div>quantity: {product.quantity}</div>
      </div>
      <button className="rounded border mt-auto mb-0 cursor-pointer px-2 py-1 hover:bg-gray-300 transition-colors duration-150">
        Add to Cart
      </button>
    </div>
  );
};
