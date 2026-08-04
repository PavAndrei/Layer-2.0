import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import {
  useBlogPost,
  useToggleBlogPostLike,
  useTrackBlogPostView,
} from '../../../features/blog';
import {
  useAuthStatus,
  useAuthUser,
  useIsAuthenticated,
} from '../../../features/auth';
import { useBlogPostCommentsSection } from './use-blog-post-comments-section';

export const useBlogPostPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const authStatus = useAuthStatus();
  const authUser = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const isAuthPending = authStatus === 'idle' || authStatus === 'loading';
  const blogPostQuery = useBlogPost(slug);
  const likeAction = useToggleBlogPostLike();
  const commentsSection = useBlogPostCommentsSection({
    authUser,
    isAuthenticated,
    slug,
  });
  const viewTracking = useTrackBlogPostView(
    slug,
    Boolean(blogPostQuery.blogPost),
  );

  const backToBlog = useCallback(() => {
    navigate('/blog');
  }, [navigate]);
  const redirectToLogin = useCallback(() => {
    navigate('/login', {
      state: {
        from: location,
      },
    });
  }, [location, navigate]);

  return {
    backToBlog,
    blogPostQuery,
    commentsSection,
    isAuthPending,
    likeAction,
    redirectToLogin,
    slug,
    viewTracking,
  };
};
