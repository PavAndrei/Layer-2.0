export const reviewQueryKeys = {
  all: ['reviews'] as const,
  product: (productId: string) =>
    [...reviewQueryKeys.all, 'product', productId] as const,
  productList: (productId: string, params = '') =>
    [...reviewQueryKeys.product(productId), 'list', params] as const,
  userScoped: () => [...reviewQueryKeys.all, 'user'] as const,
  userList: (params = '') =>
    [...reviewQueryKeys.userScoped(), 'list', params] as const,
  productReviewStatus: (productId: string) =>
    [...reviewQueryKeys.userScoped(), 'product-review-status', productId] as const,
};
