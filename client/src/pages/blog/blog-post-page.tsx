import { formatDisplayDate } from '../../shared/lib';
import {
  BlogPostCommentsSection,
  BlogPostLikeButton,
  BlogPostDetailSkeleton,
  BlogPostLayout,
} from '../../features/blog';
import {
  BlogPostContent,
  BlogPostCover,
  BlogPostTags,
} from '../../entities/blog';
import { ProductRecommendationsSection } from '../../entities/product';
import {
  Breadcrumbs,
  Button,
  ConfirmDialog,
  FeedbackMessage,
} from '../../shared/ui';
import { useBlogPostPage } from './model';

export const BlogPostPage = () => {
  const {
    backToBlog,
    blogPostQuery,
    commentsSection,
    isAuthPending,
    likeAction,
    redirectToLogin,
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
    <>
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
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 block-small text-typography-muted">
                {blogPost.publishedAt && (
                  <time dateTime={blogPost.publishedAt}>
                    {formatDisplayDate(blogPost.publishedAt)}
                  </time>
                )}
                {blogPost.publishedAt && <span aria-hidden="true">/</span>}
                <span>
                  {blogPost.viewsCount} views
                </span>
                <span aria-hidden="true">/</span>
                <span>
                  {blogPost.commentsCount} comments
                </span>
              </div>
              <BlogPostLikeButton
                error={likeAction.error}
                isLiked={blogPost.isLikedByViewer}
                isPending={likeAction.pendingSlug === blogPost.slug}
                likesCount={blogPost.likesCount}
                onToggle={() => likeAction.toggleBlogPostLike(blogPost)}
              />
            </div>
            <h1 className="heading text-typography-heading">
              {blogPost.title}
            </h1>
            <p className="description text-typography-secondary">
              {blogPost.excerpt}
            </p>
            <BlogPostTags tags={blogPost.tags} />
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
        footer={
          <>
            <BlogPostCommentsSection
              canManageAllComments={commentsSection.canManageAllComments}
              comments={commentsSection.commentsQuery.comments}
              createError={commentsSection.rootError}
              currentUserId={commentsSection.currentUserId}
              deleteError={commentsSection.deleteError}
              editingCommentId={commentsSection.editingCommentId}
              editError={commentsSection.editError}
              editText={commentsSection.editText}
              error={commentsSection.commentsQuery.error}
              isAuthenticated={commentsSection.isAuthenticated}
              isAuthPending={isAuthPending}
              isDeletingComment={commentsSection.isDeletingComment}
              isEditSubmitting={commentsSection.isEditSubmitting}
              isFetching={commentsSection.commentsQuery.isFetching}
              isLoading={commentsSection.commentsQuery.isLoading}
              isReplySubmitting={commentsSection.isReplySubmitting}
              isRootSubmitting={commentsSection.isRootSubmitting}
              pagination={commentsSection.commentsQuery.pagination}
              replyError={commentsSection.replyError}
              replyingToCommentId={commentsSection.replyingToCommentId}
              replyText={commentsSection.replyText}
              rootText={commentsSection.rootText}
              totalComments={blogPost.commentsCount}
              onCancelEdit={commentsSection.cancelEdit}
              onCancelReply={commentsSection.cancelReply}
              onDeleteComment={commentsSection.deleteComment}
              onEditTextChange={commentsSection.setEditText}
              onPageChange={commentsSection.setPage}
              onRefetch={() => commentsSection.commentsQuery.refetch()}
              onReplyTextChange={commentsSection.setReplyText}
              onRootTextChange={commentsSection.setRootText}
              onSignIn={redirectToLogin}
              onStartEdit={commentsSection.startEdit}
              onStartReply={commentsSection.startReply}
              onSubmitEdit={commentsSection.submitEdit}
              onSubmitReply={commentsSection.submitReply}
              onSubmitRoot={commentsSection.submitRootComment}
            />
            <ProductRecommendationsSection
              title="Shop the story"
              products={blogPost.relatedProducts ?? []}
            />
          </>
        }
      />
      <ConfirmDialog {...commentsSection.deleteCommentDialog} />
    </>
  );
};
