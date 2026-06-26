export const singleProductQueryKeys = {
  all: ['single-product'] as const,
  detail: (id: string) =>
    [...singleProductQueryKeys.all, 'detail', id] as const,
};
