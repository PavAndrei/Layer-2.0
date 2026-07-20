import type { ReactNode } from 'react';

type SectionedPageLayoutProps = {
  children: ReactNode;
  header: ReactNode;
  sidebar: ReactNode;
};

export const SectionedPageLayout = ({
  children,
  header,
  sidebar,
}: SectionedPageLayoutProps) => {
  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      <div className="flex flex-col gap-4 pb-4">{header}</div>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {sidebar}
        <div className="flex min-w-0 flex-col gap-6">{children}</div>
      </div>
    </main>
  );
};
