import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  getProductGalleryImages,
  useSingleProduct,
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
  const navigate = useNavigate();

  const { product, relatedProducts, isLoading, error } = useSingleProduct(id);
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
          categories={product.categories}
          onBack={() => navigate(-1)}
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
                selectedVariant={selectedVariant}
                totalQuantity={product.totalQuantity}
              />
            </>
          }
        />
      }
      footer={
        <SingleProductLayoutFooter>
          <RelatedProductsSlider products={relatedProducts} />
        </SingleProductLayoutFooter>
      }
    />
  );
};
