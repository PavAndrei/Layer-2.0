import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useBlogPost } from '../../../features/blog';

export const useBlogPostPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const blogPostQuery = useBlogPost(slug);

  const backToBlog = useCallback(() => {
    navigate('/blog');
  }, [navigate]);

  return {
    backToBlog,
    blogPostQuery,
    slug,
  };
};
