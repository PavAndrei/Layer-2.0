import { Router } from 'express';

import {
  getBlogPostBySlug,
  getBlogPosts,
  trackBlogPostView,
} from '../controllers/blog-posts.controllers';
import { validateRequest } from '../middlewares/validate-request';
import { catchErrors } from '../utils/catch-errors';
import {
  blogPostParamsSchema,
  getBlogPostsSchema,
} from '../validators/blog-posts.validators';

const blogPostsRoute = Router();

blogPostsRoute.get(
  '/',
  validateRequest(getBlogPostsSchema),
  catchErrors(getBlogPosts),
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

export default blogPostsRoute;
