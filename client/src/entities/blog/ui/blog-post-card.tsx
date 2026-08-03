import type { ReactNode } from 'react';
import type { LinkProps } from 'react-router';
import { Link } from 'react-router';

import { formatDisplayDate } from '../../../shared/lib';
import type { BlogPostListItem } from '../model';
import { BlogPostCover } from './blog-post-cover';
import { BlogPostTags } from './blog-post-tags';

type BlogPostCardProps = {
  blogPost: BlogPostListItem;
  mediaSlot?: ReactNode;
  metaSlot?: ReactNode;
  state?: LinkProps['state'];
  to: string;
};

export const BlogPostCard = ({
  blogPost,
  mediaSlot,
  metaSlot,
  state,
  to,
}: BlogPostCardProps) => {
  return (
    <article className="flex min-w-0 flex-col gap-3">
      <Link
        to={to}
        state={state}
        aria-label={`Read ${blogPost.title}`}
        className="block transition-opacity hover:opacity-90"
      >
        {mediaSlot ?? (
          <BlogPostCover
            coverImage={blogPost.coverImage}
            title={blogPost.title}
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-col gap-2">
        {metaSlot ??
          (blogPost.publishedAt && (
            <time
              dateTime={blogPost.publishedAt}
              className="block-small text-typography-muted"
            >
              {formatDisplayDate(blogPost.publishedAt)}
            </time>
          ))}

        <Link
          to={to}
          state={state}
          className="block-title text-typography-heading transition-colors hover:text-accent-hover"
        >
          {blogPost.title}
        </Link>

        <p className="block-medium text-typography-secondary">
          {blogPost.excerpt}
        </p>
        <BlogPostTags tags={blogPost.tags} />
      </div>
    </article>
  );
};
