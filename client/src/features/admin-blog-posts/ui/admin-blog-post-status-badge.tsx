import type { BlogPostStatus } from '../api';

const statusClassNames: Record<BlogPostStatus, string> = {
  archived:
    'border-border-strong bg-background-secondary text-typography-muted',
  draft:
    'border-border-soft bg-background-secondary text-typography-secondary',
  published:
    'border-green-700/30 bg-green-50 text-green-800',
};

export const AdminBlogPostStatusBadge = ({
  status,
}: {
  status: BlogPostStatus;
}) => (
  <span
    className={`inline-flex w-fit rounded border px-2 py-1 block-small capitalize ${statusClassNames[status]}`}
  >
    {status}
  </span>
);
