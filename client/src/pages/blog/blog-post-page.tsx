import { formatDisplayDate } from '../../shared/lib';
import {
  BlogPostDetailSkeleton,
  BlogPostLayout,
} from '../../features/blog';
import {
  BlogPostContent,
  BlogPostCover,
} from '../../entities/blog';
import {
  Breadcrumbs,
  Button,
  FeedbackMessage,
} from '../../shared/ui';
import { useBlogPostPage } from './model';

export const BlogPostPage = () => {
  const {
    backToBlog,
    blogPostQuery,
    slug,
  } = useBlogPostPage();
  const { blogPost, error, isLoading } = blogPostQuery;

  if (isLoading) return <BlogPostDetailSkeleton />;

  if (error || !blogPost) {
    return (
      <main className="container mx-auto px-2.5">
        <FeedbackMessage
          title="Article could not be loaded"
          description={
            error ?? `The article ${slug ? `"${slug}"` : ''} was not found.`
          }
          tone="danger"
          action={
            <Button size="sm" variant="secondary" onClick={backToBlog}>
              Back to blog
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <BlogPostLayout
      header={
        <div className="flex flex-col gap-4">
          <Breadcrumbs
            items={[
              {
                label: 'Home',
                to: '/',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: blogPost.title,
              },
            ]}
          />

          <div className="flex w-full max-w-3xl flex-col gap-3">
            {blogPost.publishedAt && (
              <time
                dateTime={blogPost.publishedAt}
                className="block-small text-typography-muted"
              >
                {formatDisplayDate(blogPost.publishedAt)}
              </time>
            )}
            <h1 className="heading text-typography-heading">
              {blogPost.title}
            </h1>
            <p className="description text-typography-secondary">
              {blogPost.excerpt}
            </p>
          </div>
        </div>
      }
      cover={
        <BlogPostCover
          coverImage={blogPost.coverImage}
          title={blogPost.title}
          variant="detail"
        />
      }
      main={<BlogPostContent contentHtml={blogPost.contentHtml} />}
    />
  );
};
