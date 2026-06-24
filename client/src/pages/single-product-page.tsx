import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProductCardProps } from '../types/product';
import { BASE_API_URL } from '../constants/api';

export const SingleProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductCardProps | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductCardProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setError(null);
        setIsLoading(true);
        const response = await fetch(`${BASE_API_URL}/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load product');
        }

        setProduct(data.product);
        setRelatedProducts(data.relatedProducts);
      } catch (error: unknown) {
        console.error(error);

        setError(
          error instanceof Error ? error.message : 'Failed to load product',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (isLoading) return <div>Loading...</div>;

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
            <img src={product.img} alt={product.title} />
            <p>{product.description}</p>
            <p>Price: ${product.defaultPrice}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Discount: {product.discountPercent}%</p>
            <p>Rating: {product.rating}</p>
            <p>Categories: {product.categories.join(', ')}</p>
            <p>Color: {product.color}</p>
            <p>Has Discount: {product.hasDiscount ? 'Yes' : 'No'}</p>
            <p>Is New: {product.isNewProduct ? 'Yes' : 'No'}</p>
            <button
              type="button"
              className="rounded border px-2 py-1 max-w-50 cursor-pointer hover:bg-gray-300 transition-colors"
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
