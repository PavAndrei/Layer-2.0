import { Button } from '../../../shared/ui';

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
    <header className="flex flex-col md:flex-row md:justify-between gap-4 pb-4">
      <div className="flex flex-col gap-1">
        <h1 className="heading text-typography-heading">{title}</h1>
        <p className="text-typography-secondary description">
          Categories: {categories.join(', ')}
        </p>
      </div>

      <Button onClick={onBack} variant="secondary">
        Back
      </Button>
    </header>
  );
};
