import type { ReactNode } from 'react';

type ProductsListLayoutProps = {
  header?: ReactNode;
  filters?: ReactNode;
  templates?: ReactNode;
  children: ReactNode;
};

export const ProductsListLayout = ({
  header,
  filters,
  templates,
  children,
}: ProductsListLayoutProps) => {
  return (
    <div className="container mx-auto px-2.5">
      {header}
      {templates}

      <div className="flex flex-col gap-4 lg:flex-row">
        {filters && <aside className="lg:w-72 lg:shrink-0">{filters}</aside>}

        <main className="flex min-w-0 flex-1 flex-col gap-4">{children}</main>
      </div>
    </div>
  );
};
