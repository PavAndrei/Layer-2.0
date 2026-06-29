import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  createCartItem,
  getCartItemKey,
  selectCartItems,
  useCartStore,
} from '../cart';
import { useScrollToTopOnChange } from '../../shared/hooks';
import {
  getProductGalleryImages,
  useSingleProduct,
  useSingleProductNavigation,
  useSingleProductVariant,
  useSingleProductVariantParams,
} from './model';
import {
  ProductGallery,
  ProductInfo,
  ProductPurchasePanel,
  ProductReviewsAccordion,
  ProductVariantSelector,
  RelatedProductsSlider,
  SingleProductError,
  SingleProductLayout,
  SingleProductLayoutFooter,
  SingleProductLayoutHeader,
  SingleProductLayoutMain,
  SingleProductLoading,
} from './ui';

export const SingleProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useCartStore(selectCartItems);
  const addCartItem = useCartStore((state) => state.addItem);

  const { product, relatedProducts, isLoading, error } = useSingleProduct(id);
  useScrollToTopOnChange(id, { skipInitialScroll: false });
  const { breadcrumbs, productLinkState } = useSingleProductNavigation({
    productTitle: product?.title,
    state: location.state,
  });

  const { selectedColor, selectedSize, setSelectedSize, setVariantParams } =
    useSingleProductVariantParams();
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
  const galleryImages = useMemo(() => {
    if (!product) return [];

    return getProductGalleryImages({
      product,
      selectedColor,
      selectedVariant,
    });
  }, [product, selectedColor, selectedVariant]);

  const isSelectedVariantInCart = useMemo(() => {
    if (!product || !selectedVariant) return false;

    const selectedVariantKey = getCartItemKey(product._id, selectedVariant._id);

    return cartItems.some((item) => {
      return getCartItemKey(item.productId, item.variantId) === selectedVariantKey;
    });
  }, [cartItems, product, selectedVariant]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addCartItem(
      createCartItem({
        product,
        variant: selectedVariant,
      }),
    );
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  if (isLoading) return <SingleProductLoading />;

  if (error || !product)
    return (
      <SingleProductError
        message={error}
        onBack={() => navigate('/catalog')}
      />
    );

  return (
    <SingleProductLayout
      header={
        <SingleProductLayoutHeader
          title={product.title}
          breadcrumbs={breadcrumbs}
          categories={product.categories}
        />
      }
      main={
        <SingleProductLayoutMain
          gallery={
            <ProductGallery
              images={galleryImages}
              title={product.title}
            />
          }
          details={
            <>
              <ProductInfo product={product} />
              <ProductReviewsAccordion
                productId={product._id}
                reviewsCount={product.reviewsCount}
              />
              <ProductVariantSelector
                colors={colors}
                sizes={sizes}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={handleColorChange}
                onSizeChange={setSelectedSize}
                isColorAvailable={isColorAvailable}
                isSizeAvailable={isSizeAvailable}
              />
              <ProductPurchasePanel
                isSelectedVariantInCart={isSelectedVariantInCart}
                selectedVariant={selectedVariant}
                totalQuantity={product.totalQuantity}
                onAddToCart={handleAddToCart}
                onViewCart={handleViewCart}
              />
            </>
          }
        />
      }
      footer={
        <SingleProductLayoutFooter>
          <RelatedProductsSlider
            products={relatedProducts}
            productLinkState={productLinkState}
          />
        </SingleProductLayoutFooter>
      }
    />
  );
};
