import { formatDisplayDate } from '../../../shared/lib';
import { Button } from '../../../shared/ui';
import type { BlogPostComment } from '../../../entities/blog';
import { BlogPostCommentForm } from './blog-post-comment-form';

type BlogPostCommentItemProps = {
  canManageAllComments: boolean;
  comment: BlogPostComment;
  currentUserId?: string | null;
  depth?: 0 | 1;
  editError?: string | null;
  editingCommentId: string | null;
  editText: string;
  isDeletingComment: (commentId: string) => boolean;
  isEditSubmitting: boolean;
  isReplySubmitting: boolean;
  isAuthenticated: boolean;
  replyError?: string | null;
  replyingToCommentId: string | null;
  replyText: string;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  onDelete: (comment: BlogPostComment) => void;
  onEditTextChange: (value: string) => void;
  onReplyTextChange: (value: string) => void;
  onStartEdit: (comment: BlogPostComment) => void;
  onStartReply: (comment: BlogPostComment) => void;
  onSubmitEdit: (comment: BlogPostComment) => void;
  onSubmitReply: (comment: BlogPostComment) => void;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

const getAvatarStyle = (avatarUrl?: string) =>
  avatarUrl
    ? {
        backgroundImage: `url("${avatarUrl}")`,
      }
    : undefined;

export const BlogPostCommentItem = ({
  canManageAllComments,
  comment,
  currentUserId,
  depth = 0,
  editError,
  editingCommentId,
  editText,
  isAuthenticated,
  isDeletingComment,
  isEditSubmitting,
  isReplySubmitting,
  onCancelEdit,
  onCancelReply,
  onDelete,
  onEditTextChange,
  onReplyTextChange,
  onStartEdit,
  onStartReply,
  onSubmitEdit,
  onSubmitReply,
  replyError,
  replyingToCommentId,
  replyText,
}: BlogPostCommentItemProps) => {
  const isDeleted = comment.status === 'deleted';
  const isEditing = editingCommentId === comment._id;
  const isReplying = replyingToCommentId === comment._id;
  const canManageComment =
    !isDeleted &&
    (canManageAllComments || comment.author._id === currentUserId);
  const canReply = depth === 0 && !isDeleted && isAuthenticated;
  const isDeleting = isDeletingComment(comment._id);

  return (
    <article
      className={`flex gap-3 ${
        depth === 1
          ? 'border-l border-border-soft pl-4'
          : 'border-b border-border-soft pb-4 last:border-b-0 last:pb-0'
      }`}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background-secondary bg-cover bg-center block-small text-typography-heading"
        style={getAvatarStyle(comment.author.avatarUrl)}
        aria-hidden="true"
      >
        {!comment.author.avatarUrl && getInitials(comment.author.name)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="block-medium text-typography-heading">
            {comment.author.name}
          </span>
          <time
            className="block-small text-typography-muted"
            dateTime={comment.createdAt}
          >
            {formatDisplayDate(comment.createdAt)}
          </time>
          {comment.editedAt && !isDeleted && (
            <span className="block-small text-typography-muted">
              edited
            </span>
          )}
        </div>

        {isEditing ? (
          <BlogPostCommentForm
            id={`blog-comment-edit-${comment._id}`}
            error={editError}
            isSubmitting={isEditSubmitting}
            submitLabel="Save"
            submittingLabel="Saving..."
            value={editText}
            onCancel={onCancelEdit}
            onChange={onEditTextChange}
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitEdit(comment);
            }}
          />
        ) : (
          <p
            className={`block-medium ${
              isDeleted
                ? 'text-typography-muted'
                : 'text-typography-primary'
            }`}
          >
            {isDeleted ? 'Comment deleted' : comment.text}
          </p>
        )}

        {!isEditing && (canReply || canManageComment) && (
          <div className="flex flex-wrap gap-2">
            {canReply && (
              <Button
                size="sm"
                variant="ghost"
                disabled={isReplySubmitting || isDeleting}
                onClick={() => onStartReply(comment)}
              >
                Reply
              </Button>
            )}
            {canManageComment && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isEditSubmitting || isDeleting}
                  onClick={() => onStartEdit(comment)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isDeleting || isEditSubmitting}
                  onClick={() => onDelete(comment)}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            )}
          </div>
        )}

        {isReplying && (
          <BlogPostCommentForm
            id={`blog-comment-reply-${comment._id}`}
            error={replyError}
            isSubmitting={isReplySubmitting}
            placeholder={`Reply to ${comment.author.name}`}
            submitLabel="Reply"
            submittingLabel="Replying..."
            value={replyText}
            onCancel={onCancelReply}
            onChange={onReplyTextChange}
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitReply(comment);
            }}
          />
        )}

        {comment.replies.length > 0 && (
          <div className="mt-2 flex flex-col gap-4">
            {comment.replies.map((reply) => (
              <BlogPostCommentItem
                key={reply._id}
                canManageAllComments={canManageAllComments}
                comment={reply}
                currentUserId={currentUserId}
                depth={1}
                editError={editError}
                editingCommentId={editingCommentId}
                editText={editText}
                isAuthenticated={isAuthenticated}
                isDeletingComment={isDeletingComment}
                isEditSubmitting={isEditSubmitting}
                isReplySubmitting={isReplySubmitting}
                replyError={replyError}
                replyingToCommentId={replyingToCommentId}
                replyText={replyText}
                onCancelEdit={onCancelEdit}
                onCancelReply={onCancelReply}
                onDelete={onDelete}
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
      </div>
    </article>
  );
};
