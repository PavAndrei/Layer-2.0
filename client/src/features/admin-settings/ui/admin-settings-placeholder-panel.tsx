type AdminSettingsPlaceholderPanelProps = {
  description: string;
  title: string;
};

export const AdminSettingsPlaceholderPanel = ({
  description,
  title,
}: AdminSettingsPlaceholderPanelProps) => (
  <section className="rounded border border-border-soft bg-background-surface p-4">
    <div className="flex flex-col gap-1">
      <h3 className="block-title text-typography-heading">{title}</h3>
      <p className="block-small text-typography-secondary">
        {description}
      </p>
    </div>
  </section>
);
