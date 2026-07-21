type AdminUserStatCardProps = {
  label: string;
  value: string;
};

export const AdminUserStatCard = ({ label, value }: AdminUserStatCardProps) => (
  <article className="flex min-h-28 flex-col justify-between gap-3 rounded border border-border-soft bg-background-surface p-4">
    <span className="block-small text-typography-secondary">{label}</span>
    <strong className="block-title text-typography-heading">{value}</strong>
  </article>
);
