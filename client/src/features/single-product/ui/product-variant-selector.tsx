import type { ProductSize } from '../../../entities/product';
import { Button } from '../../../shared/ui';

type ProductVariantSelectorProps = {
  colors: string[];
  sizes: ProductSize[];
  selectedColor: string | null;
  selectedSize: ProductSize | null;
  onColorChange: (color: string) => void;
  onSizeChange: (size: ProductSize) => void;
  isColorAvailable: (color: string) => boolean;
  isSizeAvailable: (size: ProductSize) => boolean;
};

export const ProductVariantSelector = ({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  isColorAvailable,
  isSizeAvailable,
}: ProductVariantSelectorProps) => {
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="block-title text-typography-heading">Color</legend>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isAvailable = isColorAvailable(color);

            return (
              <Button
                key={color}
                disabled={!isAvailable}
                aria-pressed={selectedColor === color}
                onClick={() => onColorChange(color)}
                size="sm"
                variant={selectedColor === color ? 'primary' : 'secondary'}
                className="capitalize"
              >
                {color.replace(/-/g, ' ')}
              </Button>
            );
          })}
        </div>
      </fieldset>

      {selectedColor && (
        <fieldset className="flex flex-col gap-2">
          <legend className="block-title text-typography-heading">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isAvailable = isSizeAvailable(size);

              return (
                <Button
                  key={size}
                  disabled={!isAvailable}
                  aria-pressed={selectedSize === size}
                  onClick={() => onSizeChange(size)}
                  size="sm"
                  variant={selectedSize === size ? 'primary' : 'secondary'}
                >
                  {size === 'ONE_SIZE' ? 'One size' : size}
                </Button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
};
