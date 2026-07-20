import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { FeedbackMessage } from '../../../shared/ui';
import { useAdminMe } from '../model';

type AdminRouteProps = {
  children: ReactNode;
};

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const adminMeQuery = useAdminMe();

  if (adminMeQuery.isPending) {
    return null;
  }

  if (adminMeQuery.isError || !adminMeQuery.data?.success) {
    return (
      <main className="container mx-auto flex flex-col gap-6 px-2.5">
        <FeedbackMessage
          tone="danger"
          title="Admin access required"
          description={
            adminMeQuery.data?.message ??
            'Your account does not have access to this area.'
          }
          action={
            <Link
              to="/profile"
              className="inline-flex min-h-8 w-fit items-center justify-center rounded border border-border-strong bg-background-surface px-3 py-1.5 block-small text-typography-primary transition-colors hover:bg-background-secondary"
            >
              Go to profile
            </Link>
          }
        />
      </main>
    );
  }

  return children;
};
