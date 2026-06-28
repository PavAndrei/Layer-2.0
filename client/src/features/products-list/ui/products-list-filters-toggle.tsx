type ProductsListFiltersToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const ProductsListFiltersToggle = ({
  isOpen,
  onToggle,
}: ProductsListFiltersToggleProps) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="block-medium text-typography-secondary">
        {isOpen ? 'Hide filters' : 'Show filters'}
      </span>

      <button
        type="button"
        onClick={onToggle}
        className="w-12 h-4 border rounded flex items-center p-1 cursor-pointer"
      >
        <span
          className={`${isOpen ? 'translate-x-6.5' : 'translate-x-0'} rounded-full w-3 h-3 bg-accent-primary transition-all duration-150 ease-in`}
        />
      </button>
    </div>
  );
};
