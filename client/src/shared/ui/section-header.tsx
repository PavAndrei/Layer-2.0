type SectionHeaderProps = {
  description: string;
  title: string;
};

export const SectionHeader = ({
  description,
  title,
}: SectionHeaderProps) => (
  <div className="flex flex-col gap-2">
    <h2 className="block-title text-typography-heading">{title}</h2>
    <p className="block-medium text-typography-secondary">{description}</p>
  </div>
);
