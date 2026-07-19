import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import {
  useAuthStatus,
  useAuthUser,
  useIsAuthenticated,
} from '../auth';
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
import { useSingleProductReviewsSection } from './use-single-product-reviews-section';
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
  const authUser = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const isAuthPending = authStatus === 'idle' || authStatus === 'loading';
  const redirectToLogin = () => {
    navigate('/login', {
      state: {
        from: location,
      },
    });
  };
  const {
    favoriteProductIds,
    isFavoriteActionPending,
    toggleFavorite,
  } = useFavoriteProductActions({
    isAccessPending: isAuthPending,
    isEnabled: isAuthenticated,
    onAccessDenied: redirectToLogin,
  });

  const { product, relatedProducts, isLoading, error } =
    useSingleProduct(identifier);
  const reviewsSection = useSingleProductReviewsSection({
    canManageReviews: authUser?.role === 'admin',
    isAuthenticated,
    productId: product?._id ?? '',
    productIdentifier: identifier,
    reviewsCount: product?.reviewsCount ?? 0,
  });
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
                deleteReviewError={reviewsSection.deleteReviewError}
                error={reviewsSection.error}
                fieldErrors={reviewsSection.fieldErrors}
                hasMoreReviews={reviewsSection.hasMoreReviews}
                isAuthenticated={isAuthenticated}
                isAuthPending={isAuthPending}
                isEmpty={reviewsSection.isEmpty}
                isFetching={reviewsSection.isFetching}
                isFormCreated={reviewsSection.isFormCreated}
                isFormSubmitting={reviewsSection.isFormSubmitting}
                isInitialLoading={reviewsSection.isInitialLoading}
                isOpen={reviewsSection.isOpen}
                isReviewStatusFetching={
                  reviewsSection.isReviewStatusFetching
                }
                isReviewStatusLoading={reviewsSection.isReviewStatusLoading}
                loadedReviews={reviewsSection.loadedReviews}
                loadMoreReviews={reviewsSection.loadMoreReviews}
                refetchReviews={reviewsSection.refetchReviews}
                refetchReviewStatus={reviewsSection.refetchReviewStatus}
                renderReviewActions={reviewsSection.renderReviewActions}
                resetReviews={reviewsSection.resetReviews}
                reviewFormError={reviewsSection.reviewFormError}
                reviewStatusError={reviewsSection.reviewStatusError}
                reviewStatusHasReviewed={
                  reviewsSection.reviewStatusHasReviewed
                }
                reviewStatusReviewId={reviewsSection.reviewStatusReviewId}
                reviewsCountLabel={reviewsSection.reviewsCountLabel}
                totalReviews={reviewsSection.totalReviews}
                values={reviewsSection.values}
                onSignIn={redirectToLogin}
                onSubmitReview={reviewsSection.submitReview}
                onToggleReviews={reviewsSection.toggleReviews}
                onUpdateReviewField={reviewsSection.updateReviewField}
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
