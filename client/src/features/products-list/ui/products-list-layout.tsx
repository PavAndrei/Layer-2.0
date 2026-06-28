import type { ReactNode } from 'react';
import { MobileFullscreenDrawer } from '../../../shared/ui';

type ProductsListLayoutProps = {
  desktopFiltersOpen?: boolean;
  header?: ReactNode;
  filters?: ReactNode;
  mobileFiltersOpen?: boolean;
  onMobileFiltersClose?: () => void;
  templates?: ReactNode;
  children: ReactNode;
};

export const ProductsListLayout = ({
  desktopFiltersOpen = true,
  header,
  filters,
  mobileFiltersOpen = false,
  onMobileFiltersClose,
  templates,
  children,
}: ProductsListLayoutProps) => {
  return (
    <div className="container mx-auto px-2.5">
      {header}
      {templates}

      <div
        className={`flex flex-col transition-[gap] duration-300 ease-out md:flex-row ${
          filters && desktopFiltersOpen ? 'md:gap-4' : 'md:gap-0'
        }`}
      >
        {filters && (
          <aside
            aria-hidden={!desktopFiltersOpen}
            className={`hidden overflow-hidden transition-[max-height,opacity,transform,width] duration-300 ease-out md:block md:shrink-0 md:translate-y-0 ${
              desktopFiltersOpen
                ? 'max-h-350 translate-y-0 opacity-100 md:w-72'
                : 'pointer-events-none max-h-0 -translate-y-2 opacity-0 md:w-0'
            }`}
          >
            <div className="md:w-72">{filters}</div>
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col gap-4">{children}</main>
      </div>

      {filters && onMobileFiltersClose && (
        <MobileFullscreenDrawer
          title="Filters"
          closeLabel="Close filters"
          isOpen={mobileFiltersOpen}
          onClose={onMobileFiltersClose}
        >
          {filters}
        </MobileFullscreenDrawer>
      )}
    </div>
  );
};
