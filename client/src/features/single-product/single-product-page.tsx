import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useAuthStatus, useIsAuthenticated } from '../auth';
import {
  FavoriteProductButton,
  useFavoriteProductActions,
} from '../favorites';
import { useProductVariantCart } from '../cart';
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
  const { identifier } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const authStatus = useAuthStatus();
  const isAuthenticated = useIsAuthenticated();
  const {
    favoriteProductIds,
    isFavoriteActionPending,
    toggleFavorite,
  } = useFavoriteProductActions({
    isAccessPending: authStatus === 'idle' || authStatus === 'loading',
    isEnabled: isAuthenticated,
    onAccessDenied: () => {
      navigate('/login', {
        state: {
          from: location,
        },
      });
    },
  });

  const { product, relatedProducts, isLoading, error } =
    useSingleProduct(identifier);
  useScrollToTopOnChange(identifier, { skipInitialScroll: false });
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
  const {
    addToCart,
    isInCart: isSelectedVariantInCart,
  } = useProductVariantCart({
    product,
    variant: selectedVariant,
  });

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
                favoriteActionSlot={
                  <FavoriteProductButton
                    product={product}
                    isFavorite={favoriteProductIds.has(product._id)}
                    isPending={isFavoriteActionPending(product._id)}
                    onToggle={toggleFavorite}
                  />
                }
                isSelectedVariantInCart={isSelectedVariantInCart}
                selectedVariant={selectedVariant}
                totalQuantity={product.totalQuantity}
                onAddToCart={addToCart}
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
