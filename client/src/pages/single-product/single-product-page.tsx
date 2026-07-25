import { FavoriteProductButton } from '../../features/favorites';
import { ConfirmDialog } from '../../shared/ui';
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
} from '../../features/single-product';
import { useSingleProductPage } from './model';

export const SingleProductPage = () => {
  const {
    addToCart,
    breadcrumbs,
    colors,
    error,
    favoriteProductIds,
    galleryImages,
    handleBackToCatalog,
    handleColorChange,
    handleViewCart,
    isAuthenticated,
    isAuthPending,
    isColorAvailable,
    isFavoriteActionPending,
    isLoading,
    isSelectedVariantInCart,
    isSizeAvailable,
    product,
    productLinkState,
    redirectToLogin,
    relatedProducts,
    reviewsSection,
    selectedColor,
    selectedSize,
    selectedVariant,
    setSelectedSize,
    sizes,
    toggleFavorite,
  } = useSingleProductPage();

  if (isLoading) return <SingleProductLoading />;

  if (error || !product)
    return (
      <SingleProductError
        message={error}
        onBack={handleBackToCatalog}
      />
    );

  return (
    <>
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
                  isReviewStatusLoading={
                    reviewsSection.isReviewStatusLoading
                  }
                  loadedReviews={reviewsSection.loadedReviews}
                  loadMoreReviews={reviewsSection.loadMoreReviews}
                  refetchReviews={reviewsSection.refetchReviews}
                  refetchReviewStatus={reviewsSection.refetchReviewStatus}
                  renderReviewActions={reviewsSection.renderReviewActions}
                  renderReviewEditForm={reviewsSection.renderReviewEditForm}
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
      <ConfirmDialog {...reviewsSection.deleteReviewDialog} />
    </>
  );
};
