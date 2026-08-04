import type { FormEvent } from 'react';

import type { BlogPostComment } from '../../../entities/blog';
import {
  Button,
  FeedbackMessage,
  Pagination,
  Skeleton,
} from '../../../shared/ui';
import type { PaginationData } from '../../../shared/api';
import { BlogPostCommentForm } from './blog-post-comment-form';
import { BlogPostCommentItem } from './blog-post-comment-item';

type BlogPostCommentsSectionProps = {
  canManageAllComments: boolean;
  comments: BlogPostComment[];
  createError?: string | null;
  currentUserId?: string | null;
  deleteError?: string | null;
  editingCommentId: string | null;
  editError?: string | null;
  editText: string;
  error: string | null;
  isAuthPending: boolean;
  isAuthenticated: boolean;
  isDeletingComment: (commentId: string) => boolean;
  isEditSubmitting: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isReplySubmitting: boolean;
  isRootSubmitting: boolean;
  pagination: PaginationData | null;
  totalComments?: number;
  replyError?: string | null;
  replyingToCommentId: string | null;
  replyText: string;
  rootText: string;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  onDeleteComment: (comment: BlogPostComment) => void;
  onEditTextChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
  onReplyTextChange: (value: string) => void;
  onRootTextChange: (value: string) => void;
  onSignIn: () => void;
  onStartEdit: (comment: BlogPostComment) => void;
  onStartReply: (comment: BlogPostComment) => void;
  onSubmitEdit: (comment: BlogPostComment) => void;
  onSubmitReply: (comment: BlogPostComment) => void;
  onSubmitRoot: (event: FormEvent<HTMLFormElement>) => void;
};

const BlogPostCommentsSkeleton = () => (
  <div className="flex flex-col gap-4" aria-label="Loading comments">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export const BlogPostCommentsSection = ({
  canManageAllComments,
  comments,
  createError,
  currentUserId,
  deleteError,
  editingCommentId,
  editError,
  editText,
  error,
  isAuthenticated,
  isAuthPending,
  isDeletingComment,
  isEditSubmitting,
  isFetching,
  isLoading,
  isReplySubmitting,
  isRootSubmitting,
  onCancelEdit,
  onCancelReply,
  onDeleteComment,
  onEditTextChange,
  onPageChange,
  onRefetch,
  onReplyTextChange,
  onRootTextChange,
  onSignIn,
  onStartEdit,
  onStartReply,
  onSubmitEdit,
  onSubmitReply,
  onSubmitRoot,
  pagination,
  replyError,
  replyingToCommentId,
  replyText,
  rootText,
  totalComments: totalCommentsProp,
}: BlogPostCommentsSectionProps) => {
  const totalComments = totalCommentsProp ?? pagination?.total ?? comments.length;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border-soft pb-3">
        <div className="flex flex-col gap-1">
          <h2 className="section-title text-typography-heading">
            Comments
          </h2>
          <p className="block-small text-typography-secondary">
            {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
          </p>
        </div>
        {isFetching && !isLoading && (
          <p className="block-small text-typography-muted">Updating...</p>
        )}
      </div>

      {deleteError && (
        <FeedbackMessage
          tone="danger"
          title="Could not delete comment"
          description={deleteError}
        />
      )}

      {isLoading && <BlogPostCommentsSkeleton />}

      {!isLoading && error && (
        <FeedbackMessage
          tone="danger"
          title="Could not load comments"
          description={error}
          action={
            <Button size="sm" variant="secondary" onClick={onRefetch}>
              Try again
            </Button>
          }
        />
      )}

      {!isLoading && !error && comments.length === 0 && (
        <FeedbackMessage
          title="No comments yet"
          description="Be the first to join the discussion."
        />
      )}

      {!isLoading && !error && comments.length > 0 && (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <BlogPostCommentItem
              key={comment._id}
              canManageAllComments={canManageAllComments}
              comment={comment}
              currentUserId={currentUserId}
              editError={editError}
              editingCommentId={editingCommentId}
              editText={editText}
              isAuthenticated={isAuthenticated}
              isDeletingComment={isDeletingComment}
              isEditSubmitting={
                isEditSubmitting
              }
              isReplySubmitting={
                replyingToCommentId === comment._id && isReplySubmitting
              }
              replyError={
                replyingToCommentId === comment._id ? replyError : null
              }
              replyingToCommentId={replyingToCommentId}
              replyText={replyText}
              onCancelEdit={onCancelEdit}
              onCancelReply={onCancelReply}
              onDelete={onDeleteComment}
              onEditTextChange={onEditTextChange}
              onReplyTextChange={onReplyTextChange}
              onStartEdit={onStartEdit}
              onStartReply={onStartReply}
              onSubmitEdit={onSubmitEdit}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          onPageChange={onPageChange}
        />
      )}

      <div className="border-t border-border-soft pt-4">
        {isAuthenticated ? (
          <BlogPostCommentForm
            id="blog-comment-root"
            error={createError}
            isSubmitting={isRootSubmitting}
            submitLabel="Post comment"
            submittingLabel="Posting..."
            value={rootText}
            onChange={onRootTextChange}
            onSubmit={onSubmitRoot}
          />
        ) : (
          <div className="flex flex-col items-start gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={isAuthPending}
              onClick={onSignIn}
            >
              {isAuthPending
                ? 'Checking session...'
                : 'Sign in to comment'}
            </Button>
            <p className="block-small text-typography-muted">
              Comment writing is available after sign in.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
