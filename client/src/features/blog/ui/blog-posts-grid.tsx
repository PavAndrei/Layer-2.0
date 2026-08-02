import type { ReactNode } from 'react';

import {
  BlogPostCard,
  type BlogPostListItem,
} from '../../../entities/blog';

type BlogPostsGridProps = {
  blogPosts: BlogPostListItem[];
  renderBlogPostMedia?: (blogPost: BlogPostListItem) => ReactNode;
  renderBlogPostMeta?: (blogPost: BlogPostListItem) => ReactNode;
};

export const BlogPostsGrid = ({
  blogPosts,
  renderBlogPostMedia,
  renderBlogPostMeta,
}: BlogPostsGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {blogPosts.map((blogPost) => (
        <BlogPostCard
          key={blogPost._id}
          blogPost={blogPost}
          mediaSlot={renderBlogPostMedia?.(blogPost)}
          metaSlot={renderBlogPostMeta?.(blogPost)}
          to={`/blog/${blogPost.slug}`}
        />
      ))}
    </div>
  );
};
