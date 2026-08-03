import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  useBlogPost,
  useToggleBlogPostLike,
  useTrackBlogPostView,
} from '../../../features/blog';

export const useBlogPostPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const blogPostQuery = useBlogPost(slug);
  const likeAction = useToggleBlogPostLike();
  const viewTracking = useTrackBlogPostView(
    slug,
    Boolean(blogPostQuery.blogPost),
  );

  const backToBlog = useCallback(() => {
    navigate('/blog');
  }, [navigate]);

  return {
    backToBlog,
    blogPostQuery,
    likeAction,
    slug,
    viewTracking,
  };
};
