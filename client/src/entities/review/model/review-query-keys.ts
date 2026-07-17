export const reviewQueryKeys = {
  all: ['reviews'] as const,
  product: (productId: string) =>
    [...reviewQueryKeys.all, 'product', productId] as const,
  productList: (productId: string, params = '') =>
    [...reviewQueryKeys.product(productId), 'list', params] as const,
};
