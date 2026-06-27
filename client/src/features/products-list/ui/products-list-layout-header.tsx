import type { ReactNode } from 'react';

type ProductsListLayoutHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export const ProductsListLayoutHeader = ({
  title,
  description,
  actions,
}: ProductsListLayoutHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 py-4 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="heading text-typography-heading">{title}</h1>
        <p className="text-typography-secondary description">{description}</p>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};
