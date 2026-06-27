import type { ReactNode } from 'react';

type SingleProductLayoutFooterProps = {
  children: ReactNode;
};

export const SingleProductLayoutFooter = ({
  children,
}: SingleProductLayoutFooterProps) => {
  return <footer className="py-6">{children}</footer>;
};

