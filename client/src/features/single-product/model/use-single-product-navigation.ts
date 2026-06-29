import { useMemo } from 'react';

import type { BreadcrumbItem } from '../../../shared/ui';

type ProductNavigationSource = {
  label: string;
  to: string;
};

type ProductLocationState = {
  from: ProductNavigationSource;
};

type UseSingleProductNavigationParams = {
  productTitle?: string;
  state: unknown;
};

const fallbackNavigationSource: ProductNavigationSource = {
  label: 'Catalog',
  to: '/catalog',
};

const isProductNavigationSource = (
  value: unknown,
): value is ProductNavigationSource => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'label' in value &&
    'to' in value &&
    typeof value.label === 'string' &&
    typeof value.to === 'string'
  );
};

const getProductNavigationSource = (
  state: unknown,
): ProductNavigationSource => {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = (state as Partial<ProductLocationState>).from;

    if (isProductNavigationSource(from)) {
      return from;
    }
  }

  return fallbackNavigationSource;
};

export const useSingleProductNavigation = ({
  productTitle,
  state,
}: UseSingleProductNavigationParams) => {
  const navigationSource = useMemo(() => getProductNavigationSource(state), [
    state,
  ]);
  const productLinkState = useMemo(
    () => ({
      from: navigationSource,
    }),
    [navigationSource],
  );
  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    if (!productTitle) return [];

    return [
      {
        label: navigationSource.label,
        to: navigationSource.to,
      },
      {
        label: productTitle,
      },
    ];
  }, [navigationSource.label, navigationSource.to, productTitle]);

  return {
    breadcrumbs,
    productLinkState,
  };
};
