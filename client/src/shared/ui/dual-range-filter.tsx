import { useCallback, useEffect, useRef } from 'react';

type DualRangeValue = {
  min: number;
  max: number;
};

type DualRangeFilterProps = {
  min: number;
  max: number;
  value: DualRangeValue;
  label?: string;
  minGap?: number;
  formatValue?: (value: number) => string;
  onChange: (value: DualRangeValue) => void;
};

export const DualRangeFilter = ({
  min,
  max,
  value,
  label,
  minGap = 1,
  formatValue = String,
  onChange,
}: DualRangeFilterProps) => {
  const rangeRef = useRef<HTMLDivElement | null>(null);

  const getPercent = useCallback(
    (rangeValue: number) => {
      return Math.round(((rangeValue - min) / (max - min)) * 100);
    },
    [min, max],
  );

  useEffect(() => {
    const minPercent = getPercent(value.min);
    const maxPercent = getPercent(value.max);

    if (rangeRef.current) {
      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [value.min, value.max, getPercent]);

  return (
    <div className="w-full max-w-md">
      {label && <p className="mb-2 block-medium">{label}</p>}

      <div className="mb-4 flex justify-between block-medium">
        <span>{formatValue(value.min)}</span>
        <span>{formatValue(value.max)}</span>
      </div>

      <div className="relative h-8">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-200" />

        <div
          ref={rangeRef}
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-typography-primary"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value.min}
          onChange={(event) => {
            const nextMin = Math.min(
              Number(event.target.value),
              value.max - minGap,
            );

            onChange({
              min: nextMin,
              max: value.max,
            });
          }}
          className="
          pointer-events-none
          absolute
          z-10
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
          [&::-webkit-slider-thumb]:bg-typography-primary

          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:bg-typography-primary
        "
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value.max}
          onChange={(event) => {
            const nextMax = Math.max(
              Number(event.target.value),
              value.min + minGap,
            );

            onChange({
              min: value.min,
              max: nextMax,
            });
          }}
          className="
          pointer-events-none
          absolute
          z-20
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
          [&::-webkit-slider-thumb]:bg-typography-primary

          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:bg-typography-primary
        "
        />
      </div>
    </div>
  );
};
