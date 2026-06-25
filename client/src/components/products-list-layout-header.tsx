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
      <div className="flex max-w-2xl flex-col gap-1">
        <h1 className="text-3xl font-bold capitalize">{title}</h1>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};
