import type { AdminProductsStats } from '../api';

type AdminProductsStatCardsProps = {
  stats: AdminProductsStats;
};

type StatCardProps = {
  description: string;
  label: string;
  value: string | number;
};

const StatCard = ({
  description,
  label,
  value,
}: StatCardProps) => (
  <article className="flex min-h-full flex-col gap-2 rounded border border-border-soft bg-background-surface p-4">
    <p className="block-small text-typography-muted">{label}</p>
    <p className="text-2xl font-semibold text-typography-heading">{value}</p>
    <p className="block-small text-typography-secondary">{description}</p>
  </article>
);

export const AdminProductsStatCards = ({
  stats,
}: AdminProductsStatCardsProps) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      label="Products"
      value={stats.total}
      description={`${stats.active} active, ${stats.draft} draft, ${stats.archived} archived.`}
    />
    <StatCard
      label="Stock"
      value={stats.totalStock}
      description={`${stats.inStock} in stock, ${stats.lowStock} low, ${stats.outOfStock} out.`}
    />
    <StatCard
      label="Variants"
      value={stats.totalVariants}
      description="Total size and color combinations across catalog."
    />
    <StatCard
      label="Discounted"
      value={stats.discounted}
      description="Products with a lower current selling price."
    />
  </div>
);
