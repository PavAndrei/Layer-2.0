import { Link } from 'react-router';
import type { ReactNode } from 'react';

type AdminDashboardSummaryCardProps = {
  description: string;
  href: string;
  label: string;
  value: ReactNode;
};

export const AdminDashboardSummaryCard = ({
  description,
  href,
  label,
  value,
}: AdminDashboardSummaryCardProps) => (
  <Link
    to={href}
    className="block rounded outline-none transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
  >
    <article className="flex min-h-full flex-col gap-3 rounded border border-border-soft bg-background-surface p-4 transition-colors hover:border-border-strong">
      <div className="flex flex-col gap-1">
        <p className="block-small text-typography-muted">{label}</p>
        <p className="text-2xl font-semibold text-typography-heading">
          {value}
        </p>
      </div>
      <p className="block-small text-typography-secondary">{description}</p>
    </article>
  </Link>
);
