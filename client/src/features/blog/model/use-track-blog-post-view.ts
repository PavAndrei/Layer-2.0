import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { trackBlogPostView } from '../api';
import { blogPostsQueryKeys } from './blog-posts-query-keys';

const BLOG_POST_VIEW_DELAY_MS = 1500;

const getViewedStorageKey = (slug: string) => `blog-post-viewed:${slug}`;

export const useTrackBlogPostView = (slug?: string, enabled = true) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (viewSlug: string) => trackBlogPostView(viewSlug),
    onSuccess: (response, viewSlug) => {
      if (!response.success) return;

      queryClient.setQueryData(
        blogPostsQueryKeys.detail(viewSlug),
        (currentData: unknown) => {
          if (
            !currentData ||
            typeof currentData !== 'object' ||
            !('blogPost' in currentData) ||
            !currentData.blogPost ||
            typeof currentData.blogPost !== 'object'
          ) {
            return currentData;
          }

          return {
            ...currentData,
            blogPost: {
              ...currentData.blogPost,
              viewsCount: response.data.viewsCount,
            },
          };
        },
      );
    },
  });

  useEffect(() => {
    if (!slug || !enabled) return;

    const storageKey = getViewedStorageKey(slug);

    if (window.sessionStorage.getItem(storageKey)) return;

    const timeoutId = window.setTimeout(() => {
      mutation.mutate(slug, {
        onSuccess: (response) => {
          if (response.success) {
            window.sessionStorage.setItem(storageKey, 'true');
          }
        },
      });
    }, BLOG_POST_VIEW_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [
    enabled,
    mutation,
    slug,
  ]);

  return {
    isPending: mutation.isPending,
  };
};
