import { useNavigate, useParams } from 'react-router';
import {
  useSingleProduct,
  useSingleProductVariant,
  useSingleProductVariantParams,
} from './model';

export const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { product, relatedProducts, isLoading, error } = useSingleProduct(id);
  const {
    selectedColor,
    selectedSize,
    setSelectedSize,
    setVariantParams,
  } = useSingleProductVariantParams();
  const {
    colors,
    sizes,
    selectedVariant,
    handleColorChange,
    isColorAvailable,
    isSizeAvailable,
  } = useSingleProductVariant({
    product,
    selectedColor,
    selectedSize,
    setVariantParams,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error || !product)
    return (
      <div>
        <p>Product not found</p>
        <button
          type="button"
          onClick={() => navigate('/catalog')}
          className="rounded border px-2 py-1 max-w-50 cursor-pointer hover:bg-gray-300 transition-colors"
        >
          {'<--'} Back
        </button>
      </div>
    );

  return (
    <div className="container mx-auto">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded border px-2 py-1 max-w-50 cursor-pointer hover:bg-gray-300 transition-colors"
      >
        {'<--'} Back
      </button>
      {product && (
        <>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl">{product.title}</h1>
            <img
              src={selectedVariant?.image ?? product.img}
              alt={product.title}
            />
            <p>{product.description}</p>
            <p>Price: ${product.defaultPrice}</p>
            <p>Total in stock: {product.totalQuantity}</p>
            <p>Discount: {product.discountPercent}%</p>
            <p>Rating: {product.rating}</p>
            <p>Categories: {product.categories.join(', ')}</p>
            <p>Has Discount: {product.hasDiscount ? 'Yes' : 'No'}</p>
            <p>Is New: {product.isNewProduct ? 'Yes' : 'No'}</p>

            <fieldset className="flex flex-col gap-2">
              <legend className="font-semibold">Color</legend>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isAvailable = isColorAvailable(color);

                  return (
                    <button
                      type="button"
                      key={color}
                      disabled={!isAvailable}
                      aria-pressed={selectedColor === color}
                      onClick={() => handleColorChange(color)}
                      className={`rounded border px-3 py-1 capitalize transition-colors ${
                        selectedColor === color ? 'bg-black text-white' : ''
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {color.replace(/-/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {selectedColor && (
              <fieldset className="flex flex-col gap-2">
                <legend className="font-semibold">Size</legend>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const isAvailable = isSizeAvailable(size);

                    return (
                      <button
                        type="button"
                        key={size}
                        disabled={!isAvailable}
                        aria-pressed={selectedSize === size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded border px-3 py-1 transition-colors ${
                          selectedSize === size ? 'bg-black text-white' : ''
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        {size === 'ONE_SIZE' ? 'One size' : size}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {selectedVariant && (
              <div>
                <p>SKU: {selectedVariant.sku}</p>
                <p>Variant in stock: {selectedVariant.quantity}</p>
              </div>
            )}

            <button
              type="button"
              disabled={!selectedVariant || selectedVariant.quantity === 0}
              className="rounded border px-2 py-1 max-w-50 cursor-pointer hover:bg-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to Cart
            </button>
          </div>
          {relatedProducts && (
            <section>
              <h2>Related Products</h2>
              <ul>
                {relatedProducts.map((p) => (
                  <li key={p._id}>
                    <h3>{p.title}</h3>
                    <img src={p.img} alt={p.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
};
