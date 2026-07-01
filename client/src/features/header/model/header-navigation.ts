export type HeaderNavigationItem = {
  label: string;
  path: string;
};

export const HEADER_NAVIGATION_ITEMS: HeaderNavigationItem[] = [
  { label: 'Men', path: '/men' },
  { label: 'Women', path: '/women' },
  { label: 'Unisex', path: '/unisex' },
  { label: 'Sales', path: '/sales' },
  { label: 'New', path: '/new' },
  { label: 'Catalog', path: '/catalog' },
];

export const isHeaderNavigationItemActive = (
  itemPath: string,
  pathname: string,
) => {
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};
