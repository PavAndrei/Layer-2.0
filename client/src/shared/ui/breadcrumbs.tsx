import { Link } from 'react-router';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="block-small text-typography-muted">
      <ol className="flex min-w-0 flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex min-w-0 items-center gap-2"
            >
              {item.to && !isLastItem ? (
                <Link
                  to={item.to}
                  className="text-typography-secondary transition-colors hover:text-accent-hover"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="min-w-0 truncate text-typography-primary"
                  aria-current={isLastItem ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLastItem && (
                <span aria-hidden="true" className="text-border-active">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
