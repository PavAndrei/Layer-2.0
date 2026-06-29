import { ArrowLeftIcon, Button, FeedbackMessage } from '../../../shared/ui';

type SingleProductErrorProps = {
  message?: string | null;
  onBack: () => void;
};

export const SingleProductError = ({
  message,
  onBack,
}: SingleProductErrorProps) => {
  return (
    <div className="container mx-auto px-2.5 py-6">
      <div className="max-w-md">
        <FeedbackMessage
          title="Could not load product"
          description={
            message ??
            'The product could not be loaded. It may have been removed or is temporarily unavailable.'
          }
          tone="danger"
          action={
            <Button
              aria-label="Go back"
              onClick={onBack}
              size="icon"
              variant="secondary"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          }
        />
      </div>
    </div>
  );
};
