type ProductsListFiltersToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const ProductsListFiltersToggle = ({
  isOpen,
  onToggle,
}: ProductsListFiltersToggleProps) => {
  return (
    <button
      type="button"
      className="rounded border px-3 py-1 text-sm transition-colors hover:bg-gray-200"
      onClick={onToggle}
    >
      {isOpen ? 'Hide filters' : 'Show filters'}
    </button>
  );
};
