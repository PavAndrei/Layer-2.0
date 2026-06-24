import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProductCardProps } from '../types/product';
import { getProductById } from '../api/products-api';
import {
  PRODUCT_SIZES,
  type ProductSize,
} from '../types/product-variant';

export const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductCardProps | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  const colors = useMemo(() => {
    if (!product) return [];

    return [...new Set(product.variants.map((variant) => variant.color))];
  }, [product]);

  const sizes = useMemo(() => {
    if (!product || !selectedColor) return [];

    return PRODUCT_SIZES.filter((size) =>
      product.variants.some(
        (variant) => variant.color === selectedColor && variant.size === size,
      ),
    );
  }, [product, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;

    return (
      product.variants.find(
        (variant) =>
          variant.color === selectedColor && variant.size === selectedSize,
      ) ?? null
    );
  }, [product, selectedColor, selectedSize]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    if (!product) {
      setSelectedSize(null);
      return;
    }

    const availableSizes = PRODUCT_SIZES.filter((size) =>
      product.variants.some(
        (variant) =>
          variant.color === color &&
          variant.size === size &&
          variant.quantity > 0,
      ),
    );

    setSelectedSize(availableSizes.length === 1 ? availableSizes[0] : null);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      if (!id) return;

      try {
        setError(null);
        setIsLoading(true);
        setSelectedColor(null);
        setSelectedSize(null);
        const response = await getProductById(id, controller.signal);

        if (!response.success) {
          throw new Error(response.message);
        }

        setProduct(response.data.product);
        setRelatedProducts(response.data.relatedProducts);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        setError(
          error instanceof Error ? error.message : 'Failed to load product',
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;

  if (error || !product)
    return (
      <div>
        <p>Product not found</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
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
                  const isAvailable = product.variants.some(
                    (variant) =>
                      variant.color === color && variant.quantity > 0,
                  );

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
                    const variant = product.variants.find(
                      (productVariant) =>
                        productVariant.color === selectedColor &&
                        productVariant.size === size,
                    );
                    const isAvailable = Boolean(
                      variant && variant.quantity > 0,
                    );

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
