import { useCallback, useEffect, useRef } from 'react';

type ProductDualPriceRangeProps = {
  min: number;
  max: number;
  value: {
    minPrice: number;
    maxPrice: number;
  };
  onChange: (values: { min: number; max: number }) => void;
};

export const ProductDualPriceRange = ({
  min,
  max,
  onChange,
  value,
}: ProductDualPriceRangeProps) => {
  const minPrice = value.minPrice;
  const maxPrice = value.maxPrice;

  const rangeRef = useRef<HTMLDivElement | null>(null);

  const getPercent = useCallback(
    (value: number) => {
      return Math.round(((value - min) / (max - min)) * 100);
    },
    [min, max],
  );

  useEffect(() => {
    const minPercent = getPercent(minPrice);
    const maxPercent = getPercent(maxPrice);

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minPrice, maxPrice, getPercent]);

  return (
    <div className="w-full max-w-md">
      <div className="mb-4 flex justify-between font-semibold">
        <span>${minPrice}</span>
        <span>${maxPrice}</span>
      </div>

      <div className="relative h-8">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-200" />

        <div
          ref={rangeRef}
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-black"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={minPrice}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxPrice - 1);

            onChange({
              min: value,
              max: maxPrice,
            });
          }}
          className="
          pointer-events-none
          absolute
          h-0
          w-full
          appearance-none
          bg-transparent

          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-black

          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:bg-black
          z-30
        "
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxPrice}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minPrice + 1);

            onChange({
              min: minPrice,
              max: value,
            });
          }}
          className="
          pointer-events-none
          absolute
          h-0
          w-full
          appearance-none
          bg-transparent

          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-black

          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:bg-black
          z-40
        "
        />
      </div>
    </div>
  );
};
