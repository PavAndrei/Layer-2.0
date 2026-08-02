import { Router } from 'express';

import {
  getBlogPostBySlug,
  getBlogPosts,
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

export default blogPostsRoute;
