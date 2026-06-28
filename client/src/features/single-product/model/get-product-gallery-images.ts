import type {
  ProductCardProps,
  ProductImage,
  ProductImageRole,
  ProductVariant,
} from '../../../shared/types';

type GetProductGalleryImagesParams = {
  product: ProductCardProps;
  selectedColor: string | null;
  selectedVariant: ProductVariant | null;
};

const IMAGE_ROLE_ORDER: Record<ProductImageRole, number> = {
  main: 0,
  front: 1,
  model: 2,
  side: 3,
  back: 4,
  detail: 5,
  fabric: 6,
};

export const getProductGalleryImages = ({
  product,
  selectedColor,
  selectedVariant,
}: GetProductGalleryImagesParams): ProductImage[] => {
  const fallbackVariant =
    product.variants.find(
      (variant) =>
        variant.quantity > 0 &&
        (!selectedColor || variant.color === selectedColor),
    ) ??
    product.variants.find((variant) => variant.quantity > 0) ??
    product.variants[0] ??
    null;
  const activeVariant = selectedVariant ?? fallbackVariant;
  const activeColor = selectedColor ?? activeVariant?.color ?? null;
  const selectedVariantImage = activeVariant?.image;
  const imagesBySrc = new Map<string, ProductImage>();

  const addImage = (image: ProductImage) => {
    if (imagesBySrc.has(image.src)) return;

    imagesBySrc.set(image.src, image);
  };

  if (selectedVariantImage) {
    addImage({
      src: selectedVariantImage,
      alt: `${product.title} in ${activeVariant.color}`,
      role: 'front',
      color: activeVariant.color,
    });
  }

  product.images
    .filter((image) => {
      if (!activeColor) return !image.color;

      return image.color === activeColor;
    })
    .forEach(addImage);

  if (imagesBySrc.size === 0) {
    addImage({
      src: product.img,
      alt: product.title,
      role: 'main',
    });
  }

  return Array.from(imagesBySrc.values()).sort((firstImage, secondImage) => {
    if (selectedVariantImage) {
      if (firstImage.src === selectedVariantImage) return -1;
      if (secondImage.src === selectedVariantImage) return 1;
    }

    return IMAGE_ROLE_ORDER[firstImage.role] - IMAGE_ROLE_ORDER[secondImage.role];
  });
};
