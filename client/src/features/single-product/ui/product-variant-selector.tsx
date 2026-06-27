import type { ProductSize } from '../../../shared/types';

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
        <legend className="font-semibold">Color</legend>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isAvailable = isColorAvailable(color);

            return (
              <button
                type="button"
                key={color}
                disabled={!isAvailable}
                aria-pressed={selectedColor === color}
                onClick={() => onColorChange(color)}
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
              const isAvailable = isSizeAvailable(size);

              return (
                <button
                  type="button"
                  key={size}
                  disabled={!isAvailable}
                  aria-pressed={selectedSize === size}
                  onClick={() => onSizeChange(size)}
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
    </div>
  );
};

