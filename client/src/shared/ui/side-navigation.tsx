import { Link } from 'react-router';

export type SideNavigationItem = {
  id: string;
  label: string;
  to: string;
};

type SideNavigationProps = {
  activeItemId?: string;
  ariaLabel: string;
  items: readonly SideNavigationItem[];
};

export const SideNavigation = ({
  activeItemId,
  ariaLabel,
  items,
}: SideNavigationProps) => {
  return (
    <aside className="flex h-fit min-w-0 flex-col gap-2 rounded border border-border-soft bg-background-surface p-2 lg:sticky lg:top-4">
      <nav className="min-w-0" aria-label={ariaLabel}>
        <ul className="flex min-w-0 gap-2 overflow-x-auto pb-1.5 lg:flex-col lg:overflow-visible lg:pb-0">
          {items.map((item) => {
            const isActive = item.id === activeItemId;

            return (
              <li key={item.id} className="shrink-0 lg:shrink">
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex min-h-10 w-full items-center rounded px-3 py-2 text-left block-medium whitespace-nowrap transition-colors lg:whitespace-normal',
                    isActive
                      ? 'bg-accent-primary text-background-surface'
                      : 'text-typography-secondary hover:bg-background-secondary hover:text-typography-primary',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
