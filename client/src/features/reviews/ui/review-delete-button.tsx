import { Button } from '../../../shared/ui';

type ReviewDeleteButtonProps = {
  isDeleting?: boolean;
  onDelete: () => void;
};

export const ReviewDeleteButton = ({
  isDeleting = false,
  onDelete,
}: ReviewDeleteButtonProps) => {
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={isDeleting}
      onClick={onDelete}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
};
