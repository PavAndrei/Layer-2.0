import type { ReactNode } from 'react';

import type { AuthBenefitsContent } from '../model';
import { AuthBenefits } from './auth-benefits';

type AuthLayoutProps = {
  benefits?: AuthBenefitsContent;
  description: string;
  footerText: ReactNode;
  form: ReactNode;
  title: string;
};

export const AuthLayout = ({
  benefits,
  description,
  footerText,
  form,
  title,
}: AuthLayoutProps) => {
  return (
    <main className="container mx-auto px-2.5">
      <section className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="heading text-typography-heading">{title}</h1>
          <p className="text-typography-secondary description">{description}</p>
        </div>
        <div className="flex gap-6 space-between">
          <div className="border-y border-border-strong py-6 w-full md:w-1/2">
            {form}
          </div>
          <div className="border-y border-border-strong py-6 md:w-1/2">
            {benefits && <AuthBenefits {...benefits} />}
          </div>
        </div>
        <p className="block-small text-typography-secondary">{footerText}</p>
      </section>
    </main>
  );
};
