export const formatHeaderItemsCount = (itemsCount: number) => {
  if (itemsCount > 99) return '99+';

  return String(itemsCount);
};
