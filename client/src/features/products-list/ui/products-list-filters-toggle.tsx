type ProductsListFiltersToggleProps = {
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  onDesktopToggle: () => void;
  onMobileToggle: () => void;
};

export const ProductsListFiltersToggle = ({
  isDesktopOpen,
  isMobileOpen,
  onDesktopToggle,
  onMobileToggle,
}: ProductsListFiltersToggleProps) => {
  const renderToggle = (isOpen: boolean, onToggle: () => void) => (
    <div className="flex items-center gap-2">
      <span className="block-medium text-typography-secondary">
        {isOpen ? 'Hide filters' : 'Show filters'}
      </span>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        className="flex h-4 w-12 cursor-pointer items-center rounded border border-border-strong p-1 transition-colors hover:bg-background-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-black"
      >
        <span
          className={`${isOpen ? 'translate-x-6.5' : 'translate-x-0'} h-3 w-3 rounded-full bg-accent-primary transition-transform duration-150 ease-in`}
        />
      </button>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        {renderToggle(isMobileOpen, onMobileToggle)}
      </div>
      <div className="hidden md:block">
        {renderToggle(isDesktopOpen, onDesktopToggle)}
      </div>
    </>
  );
};
