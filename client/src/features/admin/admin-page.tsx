import { Breadcrumbs } from '../../shared/ui';

const ADMIN_BREADCRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Admin' },
];

export const AdminPage = () => {
  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <div className="flex flex-col gap-4 pb-4">
        <Breadcrumbs items={ADMIN_BREADCRUMBS} />

        <div className="flex flex-col gap-2">
          <h1 className="heading text-typography-heading">Admin</h1>
          <p className="description text-typography-secondary">
            Manage store content, orders, reviews, and customers.
          </p>
        </div>
      </div>

      <section className="rounded border border-border-soft bg-background-surface p-4">
        <div className="flex flex-col gap-1">
          <h2 className="block-title text-typography-heading">
            Admin area
          </h2>
          <p className="block-small text-typography-secondary">
            The admin contract is connected. Sections will be added next.
          </p>
        </div>
      </section>
    </main>
  );
};
