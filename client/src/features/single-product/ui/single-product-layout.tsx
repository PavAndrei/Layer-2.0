import type { ReactNode } from 'react';

type SingleProductLayoutProps = {
  header: ReactNode;
  main: ReactNode;
  footer?: ReactNode;
};

export const SingleProductLayout = ({
  header,
  main,
  footer,
}: SingleProductLayoutProps) => {
  return (
    <div className="container mx-auto flex flex-col gap-6 px-2.5">
      {header}
      {main}
      {footer}
    </div>
  );
};

