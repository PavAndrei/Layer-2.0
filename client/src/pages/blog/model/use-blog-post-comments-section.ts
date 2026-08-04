import { useState } from 'react';
import type { FormEvent } from 'react';

import type { BlogPostComment } from '../../../entities/blog';
import {
  useBlogPostComments,
  useCreateBlogPostComment,
  useDeleteBlogPostComment,
  useUpdateBlogPostComment,
} from '../../../features/blog';
import { useConfirmDialog } from '../../../shared/hooks';
import type { User } from '../../../entities/user';

const BLOG_POST_COMMENTS_LIMIT = 10;

type UseBlogPostCommentsSectionParams = {
  authUser: User | null;
  isAuthenticated: boolean;
  slug?: string;
};

type DeleteCommentPayload = {
  commentId: string;
};

const getMutationError = (error: unknown, fallback: string) => {
  if (!error) return null;

  return error instanceof Error ? error.message : fallback;
};

export const useBlogPostCommentsSection = ({
  authUser,
  isAuthenticated,
  slug,
}: UseBlogPostCommentsSectionParams) => {
  const [page, setPage] = useState(1);
  const [rootText, setRootText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] =
    useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(
    null,
  );
  const [editText, setEditText] = useState('');
  const deleteConfirmDialog = useConfirmDialog<DeleteCommentPayload>();
  const commentsQuery = useBlogPostComments({
    enabled: Boolean(slug),
    params: {
      limit: BLOG_POST_COMMENTS_LIMIT,
      page,
    },
    slug,
  });
  const createCommentMutation = useCreateBlogPostComment();
  const updateCommentMutation = useUpdateBlogPostComment();
  const deleteCommentMutation = useDeleteBlogPostComment();
  const createError = getMutationError(
    createCommentMutation.error,
    'Failed to create comment',
  );
  const updateError = getMutationError(
    updateCommentMutation.error,
    'Failed to update comment',
  );
  const deleteError = getMutationError(
    deleteCommentMutation.error,
    'Failed to delete comment',
  );
  const creatingParentCommentId =
    createCommentMutation.variables?.comment.parentCommentId ?? null;

  const startReply = (comment: BlogPostComment) => {
    createCommentMutation.reset();
    setEditingCommentId(null);
    setEditText('');
    setReplyingToCommentId(comment._id);
    setReplyText('');
  };

  const cancelReply = () => {
    createCommentMutation.reset();
    setReplyingToCommentId(null);
    setReplyText('');
  };

  const startEdit = (comment: BlogPostComment) => {
    updateCommentMutation.reset();
    setReplyingToCommentId(null);
    setReplyText('');
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    updateCommentMutation.reset();
    setEditingCommentId(null);
    setEditText('');
  };

  const submitRootComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!slug || rootText.trim().length === 0) return;

    createCommentMutation.mutate(
      {
        comment: {
          parentCommentId: null,
          text: rootText,
        },
        slug,
      },
      {
        onSuccess: () => {
          setPage(1);
          setRootText('');
        },
      },
    );
  };

  const submitReply = (comment: BlogPostComment) => {
    if (!slug || replyText.trim().length === 0) return;

    createCommentMutation.mutate(
      {
        comment: {
          parentCommentId: comment._id,
          text: replyText,
        },
        slug,
      },
      {
        onSuccess: () => {
          setReplyingToCommentId(null);
          setReplyText('');
        },
      },
    );
  };

  const submitEdit = (comment: BlogPostComment) => {
    if (!slug || editText.trim().length === 0) return;

    updateCommentMutation.mutate(
      {
        comment: {
          text: editText,
        },
        commentId: comment._id,
        slug,
      },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditText('');
        },
      },
    );
  };

  const deleteComment = (comment: BlogPostComment) => {
    if (deleteCommentMutation.isPending) return;

    deleteConfirmDialog.open({
      commentId: comment._id,
    });
  };

  const confirmDeleteComment = () => {
    if (!slug || !deleteConfirmDialog.payload) return;

    deleteCommentMutation.mutate(
      {
        commentId: deleteConfirmDialog.payload.commentId,
        slug,
      },
      {
        onSettled: () => {
          deleteConfirmDialog.close();
        },
      },
    );
  };

  const isRootSubmitting =
    createCommentMutation.isPending && !creatingParentCommentId;

  return {
    canManageAllComments: authUser?.role === 'admin',
    commentsQuery,
    createError,
    currentUserId: authUser?._id ?? null,
    deleteComment,
    deleteCommentDialog: {
      cancelLabel: 'Cancel',
      confirmLabel: 'Delete',
      confirmingLabel: 'Deleting...',
      description:
        'The comment will be hidden, but replies can stay visible.',
      isConfirming: deleteCommentMutation.isPending,
      isOpen: deleteConfirmDialog.isOpen,
      title: 'Delete comment',
      tone: 'danger' as const,
      onCancel: deleteConfirmDialog.close,
      onConfirm: confirmDeleteComment,
    },
    deleteError,
    editingCommentId,
    editError:
      updateCommentMutation.variables?.commentId === editingCommentId
        ? updateError
        : null,
    editText,
    isDeletingComment: (commentId: string) =>
      deleteCommentMutation.isPending &&
      deleteCommentMutation.variables.commentId === commentId,
    isReplySubmitting:
      createCommentMutation.isPending &&
      Boolean(creatingParentCommentId),
    isEditSubmitting: updateCommentMutation.isPending,
    isRootSubmitting,
    replyError:
      creatingParentCommentId === replyingToCommentId ? createError : null,
    replyingToCommentId,
    replyText,
    rootError: !creatingParentCommentId ? createError : null,
    rootText,
    setEditText: (value: string) => {
      updateCommentMutation.reset();
      setEditText(value);
    },
    setPage,
    setReplyText: (value: string) => {
      createCommentMutation.reset();
      setReplyText(value);
    },
    setRootText: (value: string) => {
      createCommentMutation.reset();
      setRootText(value);
    },
    startEdit,
    startReply,
    submitEdit,
    submitReply,
    submitRootComment,
    cancelEdit,
    cancelReply,
    isAuthenticated,
  };
};
