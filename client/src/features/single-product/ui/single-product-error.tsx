type SingleProductErrorProps = {
  message?: string | null;
  onBack: () => void;
};

export const SingleProductError = ({
  message,
  onBack,
}: SingleProductErrorProps) => {
  return (
    <div className="container mx-auto flex flex-col gap-3 px-2.5 py-6">
      <p>{message ?? 'Product not found'}</p>
      <button
        type="button"
        onClick={onBack}
        className="max-w-50 cursor-pointer rounded border px-2 py-1 transition-colors hover:bg-gray-300"
      >
        {'<--'} Back
      </button>
    </div>
  );
};

