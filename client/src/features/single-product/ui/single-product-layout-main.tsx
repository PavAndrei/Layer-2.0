import type { ReactNode } from 'react';

type SingleProductLayoutMainProps = {
  gallery: ReactNode;
  details: ReactNode;
};

export const SingleProductLayoutMain = ({
  gallery,
  details,
}: SingleProductLayoutMainProps) => {
  return (
    <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
      <section>{gallery}</section>
      <section className="flex min-w-0 flex-col gap-4">{details}</section>
    </main>
  );
};

