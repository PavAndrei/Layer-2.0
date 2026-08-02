import type { AdminBlogPostsStats } from '../api';

type StatCard = {
  label: string;
  value: number;
};

const getStatCards = (stats: AdminBlogPostsStats): StatCard[] => [
  {
    label: 'Total',
    value: stats.total,
  },
  {
    label: 'Published',
    value: stats.published,
  },
  {
    label: 'Drafts',
    value: stats.draft,
  },
  {
    label: 'Archived',
    value: stats.archived,
  },
];

export const AdminBlogPostsStatCards = ({
  stats,
}: {
  stats: AdminBlogPostsStats;
}) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {getStatCards(stats).map((card) => (
      <article
        key={card.label}
        className="rounded border border-border-soft bg-background-surface p-4"
      >
        <p className="block-small text-typography-secondary">{card.label}</p>
        <p className="mt-2 text-3xl font-semibold text-typography-heading">
          {card.value}
        </p>
      </article>
    ))}
  </div>
);
