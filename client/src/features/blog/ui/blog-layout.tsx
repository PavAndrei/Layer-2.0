import type { ReactNode } from 'react';

type BlogLayoutProps = {
  children: ReactNode;
  filters?: ReactNode;
  header: ReactNode;
};

export const BlogLayout = ({
  children,
  filters,
  header,
}: BlogLayoutProps) => {
  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      {header}
      {filters}
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </main>
  );
};
