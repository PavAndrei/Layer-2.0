type ProductCardColorOption = {
  color: string;
  isAvailable: boolean;
};

type ProductCardColorSelectorProps = {
  colors: ProductCardColorOption[];
  selectedColor: string | null;
  onColorChange: (color: string) => void;
};

const COLOR_SWATCHES: Record<string, string> = {
  black: '#111111',
  white: '#FFFFFF',
  grey: '#808080',
  charcoal: '#36454F',
  cream: '#F3E7D3',
  olive: '#556B2F',
  khaki: '#C3B091',
  navy: '#1F2A44',
  sand: '#D6C3A5',
  burgundy: '#800020',
  'washed-black': '#2A2A2A',
  'heather-grey': '#B6B6B6',
  'dark-brown': '#4A2C2A',
};

const formatColorLabel = (color: string) => color.replace(/-/g, ' ');

export const ProductCardColorSelector = ({
  colors,
  selectedColor,
  onColorChange,
}: ProductCardColorSelectorProps) => {
  if (colors.length === 0) {
    return (
      <span className="block-micro accent-accent-secondary">Out of stock</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {colors.map(({ color, isAvailable }) => {
        const isSelected = selectedColor === color;

        return (
          <button
            key={color}
            type="button"
            disabled={!isAvailable}
            aria-label={formatColorLabel(color)}
            aria-pressed={isSelected}
            title={formatColorLabel(color)}
            onClick={() => onColorChange(color)}
            className={`h-5 w-5 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 ${
              isSelected ? 'border-accent-black p-0.5' : 'border-border-strong'
            }`}
          >
            <span
              className="block h-full w-full rounded-full border border-border-soft"
              style={{
                backgroundColor: COLOR_SWATCHES[color] ?? color,
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
