import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getBlogPosts } from '../api';
import {
  BLOG_POSTS_STALE_TIME_MS,
  blogPostsQueryKeys,
} from './blog-posts-query-keys';

const BLOG_POST_TAGS_LIMIT = 50;

export const useBlogPostTags = () => {
  const query = useQuery({
    queryKey: [...blogPostsQueryKeys.all, 'tags'],
    queryFn: ({ signal }) =>
      getBlogPosts(
        {
          limit: BLOG_POST_TAGS_LIMIT,
          page: 1,
        },
        signal,
      ),
    retry: false,
    staleTime: BLOG_POSTS_STALE_TIME_MS,
  });
  const response = query.data;
  const tags = useMemo(() => {
    if (!response?.success) return [];

    const tagCounts = response.data.blogPosts.reduce<Map<string, number>>(
      (counts, blogPost) => {
        blogPost.tags.forEach((tag) => {
          counts.set(tag, (counts.get(tag) ?? 0) + 1);
        });

        return counts;
      },
      new Map(),
    );

    return [...tagCounts.entries()]
      .sort(([firstTag, firstCount], [secondTag, secondCount]) => {
        if (firstCount !== secondCount) return secondCount - firstCount;

        return firstTag.localeCompare(secondTag);
      })
      .map(([tag]) => tag);
  }, [response]);
  const responseError = response && !response.success ? response.message : null;
  const queryError =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'Failed to load blog post tags'
        : null;

  return {
    error: responseError ?? queryError,
    isLoading: query.isLoading,
    tags,
  };
};
