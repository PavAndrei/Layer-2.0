import type { ReactNode } from 'react';

type AdminProductsLayoutProps = {
  actions?: ReactNode;
  content: ReactNode;
  filters: ReactNode;
  header: ReactNode;
  pagination?: ReactNode;
  stats?: ReactNode;
};

export const AdminProductsLayout = ({
  actions,
  content,
  filters,
  header,
  pagination,
  stats,
}: AdminProductsLayoutProps) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      {header}
      {actions && <div className="shrink-0">{actions}</div>}
    </div>

    {stats}
    {filters}
    {content}
    {pagination}
  </section>
);
