import { Router } from 'express';

import {
  createBlogPostComment,
  deleteBlogPostComment,
  getBlogPostBySlug,
  getBlogPostComments,
  getBlogPosts,
  setBlogPostLike,
  trackBlogPostView,
  updateBlogPostComment,
} from '../controllers/blog-posts.controllers';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  blogPostParamsSchema,
  createBlogPostCommentSchema,
  deleteBlogPostCommentSchema,
  getBlogPostCommentsSchema,
  getBlogPostsSchema,
  setBlogPostLikeSchema,
  updateBlogPostCommentSchema,
} from '../validators/blog-posts.validators';

const blogPostsRoute = Router();

blogPostsRoute.get(
  '/',
  validateRequest(getBlogPostsSchema),
  catchErrors(getBlogPosts),
);

blogPostsRoute.get(
  '/:slug/comments',
  validateRequest(getBlogPostCommentsSchema),
  catchErrors(getBlogPostComments),
);

blogPostsRoute.post(
  '/:slug/comments',
  authMiddleware,
  validateRequest(createBlogPostCommentSchema),
  catchErrors(createBlogPostComment),
);

blogPostsRoute.patch(
  '/:slug/comments/:commentId',
  authMiddleware,
  validateRequest(updateBlogPostCommentSchema),
  catchErrors(updateBlogPostComment),
);

blogPostsRoute.delete(
  '/:slug/comments/:commentId',
  authMiddleware,
  validateRequest(deleteBlogPostCommentSchema),
  catchErrors(deleteBlogPostComment),
);

blogPostsRoute.get(
  '/:slug',
  validateRequest(blogPostParamsSchema),
  catchErrors(getBlogPostBySlug),
);

blogPostsRoute.post(
  '/:slug/view',
  validateRequest(blogPostParamsSchema),
  catchErrors(trackBlogPostView),
);

blogPostsRoute.patch(
  '/:slug/like',
  validateRequest(setBlogPostLikeSchema),
  catchErrors(setBlogPostLike),
);

export default blogPostsRoute;
