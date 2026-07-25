import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import {
  useAuthStatus,
  useAuthUser,
  useIsAuthenticated,
} from '../../../features/auth';
import { useProductVariantCart } from '../../../features/cart';
import { useFavoriteProductActions } from '../../../features/favorites';
import {
  getProductGalleryImages,
  useSingleProduct,
  useSingleProductNavigation,
  useSingleProductVariant,
  useSingleProductVariantParams,
} from '../../../features/single-product';
import { useScrollToTopOnChange } from '../../../shared/hooks';
import { useSingleProductReviewsSection } from './use-single-product-reviews-section';

export const useSingleProductPage = () => {
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
  const handleBackToCatalog = () => {
    navigate('/catalog');
  };

  return {
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
  };
};
