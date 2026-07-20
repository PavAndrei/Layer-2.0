import {
  ADMIN_SECTION_LABELS,
  useAdminPageState,
} from './model';
import { AdminLayout } from './ui';

export const AdminPage = () => {
  const { activeSection } = useAdminPageState();

  return (
    <AdminLayout activeSection={activeSection}>
      <section className="rounded border border-border-soft bg-background-surface p-4">
        <div className="flex flex-col gap-1">
          <h2 className="block-title text-typography-heading">
            {ADMIN_SECTION_LABELS[activeSection]}
          </h2>
          <p className="block-small text-typography-secondary">
            This admin section is prepared and will be connected next.
          </p>
        </div>
      </section>
    </AdminLayout>
  );
};
