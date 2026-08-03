import type {
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';

import type { ApiResponse } from '../../../shared/api';
import type {
  BlogPostResponseData,
  BlogPostsResponseData,
} from '../api';
import { blogPostsQueryKeys } from './blog-posts-query-keys';

type BlogPostsListQueryData = ApiResponse<BlogPostsResponseData>;

export type BlogPostLikeQuerySnapshot = {
  detailData: BlogPostResponseData | undefined;
  listEntries: Array<[QueryKey, BlogPostsListQueryData | undefined]>;
};

type BlogPostLikeCacheUpdate = {
  liked: boolean;
  likesCount?: number;
  previousLiked?: boolean;
  slug: string;
};

const getNextLikesCount = (
  likesCount: number,
  previousLiked: boolean,
  liked: boolean,
) => {
  if (previousLiked === liked) return likesCount;

  return Math.max(0, likesCount + (liked ? 1 : -1));
};

export const getBlogPostLikeQuerySnapshot = (
  queryClient: QueryClient,
  slug: string,
): BlogPostLikeQuerySnapshot => ({
  detailData: queryClient.getQueryData<BlogPostResponseData>(
    blogPostsQueryKeys.detail(slug),
  ),
  listEntries:
    queryClient.getQueriesData<BlogPostsListQueryData>({
      queryKey: blogPostsQueryKeys.lists(),
    }),
});

export const restoreBlogPostLikeQuerySnapshot = (
  queryClient: QueryClient,
  slug: string,
  snapshot?: BlogPostLikeQuerySnapshot,
) => {
  if (!snapshot) return;

  queryClient.setQueryData(
    blogPostsQueryKeys.detail(slug),
    snapshot.detailData,
  );

  snapshot.listEntries.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};

export const setBlogPostLikeQueryData = (
  queryClient: QueryClient,
  {
    liked,
    likesCount,
    previousLiked,
    slug,
  }: BlogPostLikeCacheUpdate,
) => {
  let knownPreviousLiked = previousLiked;

  queryClient.setQueryData<BlogPostResponseData>(
    blogPostsQueryKeys.detail(slug),
    (previousData) => {
      if (!previousData) return previousData;

      const wasLiked = previousData.blogPost.isLikedByViewer;
      knownPreviousLiked = wasLiked;

      return {
        ...previousData,
        blogPost: {
          ...previousData.blogPost,
          isLikedByViewer: liked,
          likesCount:
            likesCount ??
            getNextLikesCount(
              previousData.blogPost.likesCount,
              wasLiked,
              liked,
            ),
        },
      };
    },
  );

  queryClient.setQueriesData<BlogPostsListQueryData>(
    {
      queryKey: blogPostsQueryKeys.lists(),
    },
    (previousData) => {
      if (!previousData?.success) return previousData;

      return {
        ...previousData,
        data: {
          ...previousData.data,
          blogPosts: previousData.data.blogPosts.map((blogPost) => {
            if (blogPost.slug !== slug) return blogPost;

            if (likesCount !== undefined) {
              return {
                ...blogPost,
                likesCount,
              };
            }

            if (knownPreviousLiked === undefined) return blogPost;

            return {
              ...blogPost,
              likesCount: getNextLikesCount(
                blogPost.likesCount,
                knownPreviousLiked,
                liked,
              ),
            };
          }),
        },
      };
    },
  );
};
