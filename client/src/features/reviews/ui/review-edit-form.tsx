import {
  ReviewForm,
  type ReviewFormValues,
} from '../../../entities/review';
import {
  type EditableReview,
  useReviewEditForm,
} from '../model';

type ReviewEditFormProps = {
  isSubmitting: boolean;
  review: EditableReview;
  onCancel: () => void;
  onSubmit: (review: ReviewFormValues) => Promise<{
    message?: string;
    success: boolean;
  }>;
};

export const ReviewEditForm = ({
  isSubmitting,
  onCancel,
  onSubmit,
  review,
}: ReviewEditFormProps) => {
  const form = useReviewEditForm({
    isSubmitting,
    onCancel,
    onSubmit,
    review,
  });

  return (
    <ReviewForm
      cancelLabel="Cancel"
      description="Update your rating, title, or product feedback."
      errorMessage={
        form.error
          ? {
              title: 'Could not update review',
              description: form.error,
            }
          : null
      }
      fieldErrors={form.fieldErrors}
      idPrefix={`review-edit-${review._id}`}
      isSubmitting={isSubmitting}
      submitLabel="Save changes"
      submittingLabel="Saving..."
      title="Edit review"
      values={form.values}
      onCancel={form.handleCancel}
      onSubmit={form.handleSubmit}
      onUpdateField={form.updateField}
    />
  );
};
