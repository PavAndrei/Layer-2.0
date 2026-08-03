import type { ReactNode } from 'react';

type BlogPostLayoutProps = {
  cover?: ReactNode;
  footer?: ReactNode;
  header: ReactNode;
  main: ReactNode;
};

export const BlogPostLayout = ({
  cover,
  footer,
  header,
  main,
}: BlogPostLayoutProps) => {
  return (
    <main className="container mx-auto flex flex-col gap-6 px-2.5">
      {header}
      {cover}
      <div className="flex w-full flex-col gap-6">
        {main}
        {footer}
      </div>
    </main>
  );
};
