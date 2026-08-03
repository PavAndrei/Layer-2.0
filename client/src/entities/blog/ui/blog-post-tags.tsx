import { Link } from 'react-router';

import { formatBlogPostTag } from '../lib';

type BlogPostTagsProps = {
  tags: string[];
};

export const BlogPostTags = ({
  tags,
}: BlogPostTagsProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          to={`/blog?tag=${encodeURIComponent(tag)}`}
          className="rounded border border-border-soft bg-background-secondary px-2 py-1 block-small text-typography-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
        >
          {formatBlogPostTag(tag)}
        </Link>
      ))}
    </div>
  );
};
