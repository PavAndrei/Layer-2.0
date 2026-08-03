import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { BlogPost } from '../../../entities/blog';
import {
  setBlogPostLike as setBlogPostLikeRequest,
  type SetBlogPostLikePayload,
} from '../api';
import {
  getBlogPostLikeQuerySnapshot,
  restoreBlogPostLikeQuerySnapshot,
  setBlogPostLikeQueryData,
} from './blog-post-like-cache';
import { blogPostsQueryKeys } from './blog-posts-query-keys';

type SetBlogPostLikeVariables = SetBlogPostLikePayload & {
  previousLiked?: boolean;
};

type ToggleBlogPostLikeVariables = Pick<
  BlogPost,
  'isLikedByViewer' | 'slug'
>;

export const useToggleBlogPostLike = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      liked,
      slug,
    }: SetBlogPostLikeVariables) => {
      const response = await setBlogPostLikeRequest({
        liked,
        slug,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    onMutate: async (variables) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: blogPostsQueryKeys.detail(variables.slug),
        }),
        queryClient.cancelQueries({
          queryKey: blogPostsQueryKeys.lists(),
        }),
      ]);

      const snapshot = getBlogPostLikeQuerySnapshot(
        queryClient,
        variables.slug,
      );

      setBlogPostLikeQueryData(queryClient, variables);

      return snapshot;
    },
    onError: (_error, variables, snapshot) => {
      restoreBlogPostLikeQuerySnapshot(
        queryClient,
        variables.slug,
        snapshot,
      );
    },
    onSuccess: (response, variables) => {
      setBlogPostLikeQueryData(queryClient, {
        liked: response.data.liked,
        likesCount: response.data.likesCount,
        slug: variables.slug,
      });
    },
  });

  const toggleBlogPostLike = ({
    isLikedByViewer,
    slug,
  }: ToggleBlogPostLikeVariables) => {
    mutation.mutate({
      liked: !isLikedByViewer,
      previousLiked: isLikedByViewer,
      slug,
    });
  };

  return {
    error:
      mutation.error instanceof Error
        ? mutation.error.message
        : mutation.error
          ? 'Failed to update blog post like'
          : null,
    isPending: mutation.isPending,
    pendingSlug: mutation.variables?.slug ?? null,
    reset: mutation.reset,
    setBlogPostLike: mutation.mutate,
    setBlogPostLikeAsync: mutation.mutateAsync,
    toggleBlogPostLike,
  };
};
