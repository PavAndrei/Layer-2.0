import { Breadcrumbs, type BreadcrumbItem } from '../../../shared/ui';

type SingleProductLayoutHeaderProps = {
  title: string;
  categories: string[];
  breadcrumbs: BreadcrumbItem[];
};

export const SingleProductLayoutHeader = ({
  title,
  breadcrumbs,
  categories,
}: SingleProductLayoutHeaderProps) => {
  return (
    <header className="flex flex-col gap-2 pb-4">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col gap-1">
        <h1 className="heading text-typography-heading">{title}</h1>
        <p className="text-typography-secondary description">
          Categories: {categories.join(', ')}
        </p>
      </div>
    </header>
  );
};
