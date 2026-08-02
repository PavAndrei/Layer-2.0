import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { formatDisplayDate } from '../../../shared/lib';
import { Button, ConfirmDialog, FeedbackMessage } from '../../../shared/ui';
import type {
  AdminBlogPostListItem,
  BlogPostStatus,
  DeleteAdminBlogPostResponseData,
} from '../api';
import {
  useDeleteAdminBlogPost,
  useUpdateAdminBlogPostStatus,
} from '../model';
import { AdminBlogPostStatusBadge } from './admin-blog-post-status-badge';

type AdminBlogPostsGridProps = {
  blogPosts: AdminBlogPostListItem[];
  onBlogPostDeleted?: (data: DeleteAdminBlogPostResponseData) => void;
};

type BlogPostStatusAction = {
  confirmLabel: string;
  confirmingLabel: string;
  description: string;
  nextStatus: BlogPostStatus;
  title: string;
  triggerLabel: string;
};

type StatusActionFeedback = {
  blogPost: AdminBlogPostListItem;
  message: string;
};

const getBlogPostStatusAction = (
  blogPost: AdminBlogPostListItem,
): BlogPostStatusAction => {
  if (blogPost.status === 'published') {
    return {
      confirmLabel: 'Archive article',
      confirmingLabel: 'Archiving...',
      description:
        `${blogPost.title} will be hidden from public blog pages but kept in admin history.`,
      nextStatus: 'archived',
      title: 'Archive article?',
      triggerLabel: 'Archive',
    };
  }

  if (blogPost.status === 'archived') {
    return {
      confirmLabel: 'Restore draft',
      confirmingLabel: 'Restoring...',
      description:
        `${blogPost.title} will return to drafts and can be edited again.`,
      nextStatus: 'draft',
      title: 'Restore article?',
      triggerLabel: 'Restore',
    };
  }

  return {
    confirmLabel: 'Publish article',
    confirmingLabel: 'Publishing...',
    description:
      `${blogPost.title} will become available for the public blog once public pages are connected.`,
    nextStatus: 'published',
    title: 'Publish article?',
    triggerLabel: 'Publish',
  };
};

const getDeleteMutationError = (
  mutation: ReturnType<typeof useDeleteAdminBlogPost>,
) => {
  if (mutation.data && !mutation.data.success) {
    return mutation.data.message;
  }

  if (mutation.error instanceof Error) {
    return mutation.error.message;
  }

  return null;
};

export const AdminBlogPostsGrid = ({
  blogPosts,
  onBlogPostDeleted,
}: AdminBlogPostsGridProps) => {
  const updateStatusMutation = useUpdateAdminBlogPostStatus();
  const deleteBlogPostMutation = useDeleteAdminBlogPost({
    onDeleted: onBlogPostDeleted,
  });
  const [selectedBlogPost, setSelectedBlogPost] =
    useState<AdminBlogPostListItem | null>(null);
  const [selectedBlogPostForDelete, setSelectedBlogPostForDelete] =
    useState<AdminBlogPostListItem | null>(null);
  const [statusActionFeedback, setStatusActionFeedback] =
    useState<StatusActionFeedback | null>(null);
  const statusAction = selectedBlogPost
    ? getBlogPostStatusAction(selectedBlogPost)
    : null;
  const deleteMutationError = getDeleteMutationError(deleteBlogPostMutation);
  const isActionPending = updateStatusMutation.isPending;
  const isDeletePending = deleteBlogPostMutation.isPending;
  const deleteDialogDescription = useMemo(() => {
    if (!selectedBlogPostForDelete) return undefined;

    const description =
      `${selectedBlogPostForDelete.title} will be permanently deleted. ` +
      'Uploaded cover media will be removed from ImageKit.';

    return deleteMutationError
      ? `${description} ${deleteMutationError}`
      : description;
  }, [
    deleteMutationError,
    selectedBlogPostForDelete,
  ]);

  const closeStatusDialog = () => {
    if (isActionPending) return;

    updateStatusMutation.reset();
    setSelectedBlogPost(null);
  };

  const confirmStatusAction = () => {
    if (!selectedBlogPost || !statusAction || isActionPending) return;

    const currentBlogPost = selectedBlogPost;

    updateStatusMutation.mutate(
      {
        blogPostId: currentBlogPost._id,
        payload: {
          status: statusAction.nextStatus,
        },
      },
      {
        onSuccess: (response) => {
          if (!response.success) {
            setSelectedBlogPost(null);
            setStatusActionFeedback({
              blogPost: currentBlogPost,
              message: response.message,
            });
            return;
          }

          setStatusActionFeedback(null);
          setSelectedBlogPost(null);
        },
        onError: (error) => {
          setSelectedBlogPost(null);
          setStatusActionFeedback({
            blogPost: currentBlogPost,
            message:
              error instanceof Error
                ? error.message
                : 'Article status could not be updated',
          });
        },
      },
    );
  };

  const closeDeleteDialog = () => {
    if (isDeletePending) return;

    deleteBlogPostMutation.reset();
    setSelectedBlogPostForDelete(null);
  };

  const confirmDeleteAction = () => {
    if (!selectedBlogPostForDelete || isDeletePending) return;

    deleteBlogPostMutation.mutate(selectedBlogPostForDelete._id, {
      onSuccess: (response) => {
        if (!response.success) return;

        setSelectedBlogPostForDelete(null);
      },
    });
  };

  return (
    <>
      {statusActionFeedback && (
        <FeedbackMessage
          tone="danger"
          title="Article status could not be updated"
          description={statusActionFeedback.message}
          action={
            <Link
              to={`/admin/blog-posts/${statusActionFeedback.blogPost._id}/edit`}
              className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
            >
              Edit article
            </Link>
          }
        />
      )}

      <div className="overflow-x-auto rounded border border-border-soft bg-background-surface">
        <div className="min-w-[62rem]">
          <div className="grid grid-cols-[minmax(18rem,1.7fr)_7rem_minmax(14rem,1fr)_8rem_8rem_12rem] gap-3 border-b border-border-soft bg-background-secondary px-4 py-3 block-small text-typography-muted">
            <span>Article</span>
            <span>Status</span>
            <span>Excerpt</span>
            <span>Published</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>

          {blogPosts.map((blogPost) => {
            const blogPostAction = getBlogPostStatusAction(blogPost);
            const isCurrentBlogPostPending =
              isActionPending && selectedBlogPost?._id === blogPost._id;
            const isCurrentBlogPostDeleting =
              isDeletePending &&
              selectedBlogPostForDelete?._id === blogPost._id;

            return (
              <article
                key={blogPost._id}
                className="grid grid-cols-[minmax(18rem,1.7fr)_7rem_minmax(14rem,1fr)_8rem_8rem_12rem] gap-3 border-b border-border-soft px-4 py-3 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {blogPost.coverImage ? (
                    <img
                      src={blogPost.coverImage.src}
                      alt={blogPost.coverImage.alt}
                      className="h-14 w-20 shrink-0 rounded border border-border-soft object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded border border-border-soft bg-background-secondary block-small text-typography-muted">
                      No cover
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="truncate block-medium text-typography-heading">
                      {blogPost.title}
                    </h3>
                    <p className="truncate block-small text-typography-muted">
                      {blogPost.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <AdminBlogPostStatusBadge status={blogPost.status} />
                </div>

                <p className="line-clamp-2 self-center block-small text-typography-secondary">
                  {blogPost.excerpt || 'No excerpt'}
                </p>

                <time
                  className="flex items-center block-small text-typography-secondary"
                  dateTime={blogPost.publishedAt ?? undefined}
                >
                  {blogPost.publishedAt
                    ? formatDisplayDate(blogPost.publishedAt)
                    : '-'}
                </time>

                <time
                  className="flex items-center block-small text-typography-secondary"
                  dateTime={blogPost.updatedAt}
                >
                  {formatDisplayDate(blogPost.updatedAt)}
                </time>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/admin/blog-posts/${blogPost._id}/edit`}
                    className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
                  >
                    Edit
                  </Link>
                  <Button
                    disabled={isActionPending || isDeletePending}
                    size="sm"
                    variant={
                      blogPost.status === 'published' ? 'danger' : 'secondary'
                    }
                    onClick={() => {
                      updateStatusMutation.reset();
                      setStatusActionFeedback(null);
                      setSelectedBlogPost(blogPost);
                    }}
                  >
                    {isCurrentBlogPostPending
                      ? blogPostAction.confirmingLabel
                      : blogPostAction.triggerLabel}
                  </Button>
                  {blogPost.status === 'archived' && (
                    <Button
                      disabled={isActionPending || isDeletePending}
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        deleteBlogPostMutation.reset();
                        setSelectedBlogPostForDelete(blogPost);
                      }}
                    >
                      {isCurrentBlogPostDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        confirmLabel={statusAction?.confirmLabel}
        confirmingLabel={statusAction?.confirmingLabel}
        description={statusAction?.description}
        isConfirming={isActionPending}
        isOpen={Boolean(selectedBlogPost && statusAction)}
        title={statusAction?.title ?? 'Update article status?'}
        tone={
          statusAction?.nextStatus === 'archived' ? 'danger' : 'neutral'
        }
        onCancel={closeStatusDialog}
        onConfirm={confirmStatusAction}
      />
      <ConfirmDialog
        confirmLabel="Delete article"
        confirmingLabel="Deleting..."
        description={deleteDialogDescription}
        isConfirming={isDeletePending}
        isOpen={Boolean(selectedBlogPostForDelete)}
        title="Delete article permanently?"
        tone="danger"
        onCancel={closeDeleteDialog}
        onConfirm={confirmDeleteAction}
      />
    </>
  );
};
