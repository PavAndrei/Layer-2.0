import type { ReactNode } from 'react';
import { Breadcrumbs } from '../../../shared/ui';

type CartLayoutProps = {
  children: ReactNode;
  itemsCount: number;
  summary?: ReactNode;
};

const CART_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Cart' },
];

export const CartLayout = ({
  children,
  itemsCount,
  summary,
}: CartLayoutProps) => {
  const contentClassName = summary
    ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]'
    : 'w-full';
  const itemsClassName = summary ? 'order-2 lg:order-1' : '';
  const summaryClassName = 'order-1 lg:order-2';

  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <div className="flex flex-col gap-4 pb-4">
        <Breadcrumbs items={CART_BREADCRUMBS} />

        <div className="flex flex-col gap-2">
          <h1 className="heading text-typography-heading">
            Cart {itemsCount > 0 && `(${itemsCount})`}
          </h1>
          <p className="description text-typography-secondary">
            Review selected items before checkout.
          </p>
        </div>
      </div>

      <div className={contentClassName}>
        <div className={itemsClassName}>{children}</div>
        {summary && <aside className={summaryClassName}>{summary}</aside>}
      </div>
    </main>
  );
};
