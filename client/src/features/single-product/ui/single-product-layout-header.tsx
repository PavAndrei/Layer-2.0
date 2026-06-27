type SingleProductLayoutHeaderProps = {
  title: string;
  categories: string[];
  onBack: () => void;
};

export const SingleProductLayoutHeader = ({
  title,
  categories,
  onBack,
}: SingleProductLayoutHeaderProps) => {
  return (
    <header className="flex flex-col gap-3 py-4">
      <button
        type="button"
        onClick={onBack}
        className="max-w-50 cursor-pointer rounded border px-2 py-1 transition-colors hover:bg-gray-300"
      >
        {'<--'} Back
      </button>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold capitalize">{title}</h1>
        <p className="text-sm text-gray-600">Categories: {categories.join(', ')}</p>
      </div>
    </header>
  );
};

