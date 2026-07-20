import { Breadcrumbs } from './breadcrumbs';
import type { BreadcrumbItem } from './breadcrumbs';

type SectionedPageHeaderProps = {
  breadcrumbs: BreadcrumbItem[];
  description: string;
  title: string;
};

export const SectionedPageHeader = ({
  breadcrumbs,
  description,
  title,
}: SectionedPageHeaderProps) => {
  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col gap-2">
        <h1 className="heading text-typography-heading">{title}</h1>
        <p className="description text-typography-secondary">
          {description}
        </p>
      </div>
    </>
  );
};
