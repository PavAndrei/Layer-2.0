import type { ReactNode } from 'react';

type ProductsListLayoutProps = {
  header?: ReactNode;
  filters?: ReactNode;
  filtersOpen?: boolean;
  templates?: ReactNode;
  children: ReactNode;
};

export const ProductsListLayout = ({
  header,
  filters,
  filtersOpen = true,
  templates,
  children,
}: ProductsListLayoutProps) => {
  return (
    <div className="container mx-auto px-2.5">
      {header}
      {templates}

      <div
        className={`flex flex-col transition-[gap] duration-300 ease-out lg:flex-row ${
          filters && filtersOpen ? 'gap-4' : 'gap-0'
        }`}
      >
        {filters && (
          <aside
            aria-hidden={!filtersOpen}
            className={`overflow-hidden transition-[max-height,opacity,transform,width] duration-300 ease-out lg:shrink-0 lg:translate-y-0 ${
              filtersOpen
                ? 'max-h-350 translate-y-0 opacity-100 lg:w-72'
                : 'pointer-events-none max-h-0 -translate-y-2 opacity-0 lg:w-0'
            }`}
          >
            <div className="lg:w-72">{filters}</div>
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col gap-4">{children}</main>
      </div>
    </div>
  );
};
