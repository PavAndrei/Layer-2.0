import type {
  ProductCollection,
  ProductCollectionId,
} from '../model';

export const PRODUCT_COLLECTIONS = {
  catalog: {
    id: 'catalog',
    title: 'Catalog',
    description:
      'Explore the full Layer assortment of streetwear essentials, seasonal drops and everyday pieces.',
    baseFilters: {},
  },
  men: {
    id: 'men',
    title: 'Men',
    description:
      "Streetwear essentials, outerwear and everyday layers selected for the men's section.",
    baseFilters: {
      audience: ['men'],
    },
  },
  women: {
    id: 'women',
    title: 'Women',
    description:
      "Streetwear essentials, soft layers and standout pieces selected for the women's section.",
    baseFilters: {
      audience: ['women'],
    },
  },
  unisex: {
    id: 'unisex',
    title: 'Unisex',
    description:
      'Gender-neutral accessories and apparel designed for everyday rotation.',
    baseFilters: {
      audience: ['unisex'],
    },
  },
  sales: {
    id: 'sales',
    title: 'Sales',
    description:
      'Discounted Layer pieces from past drops, limited runs and seasonal edits.',
    baseFilters: {
      hasDiscount: true,
    },
  },
  new: {
    id: 'new',
    title: 'New Arrivals',
    description:
      'Fresh arrivals from the latest Layer drop, including new silhouettes and updated staples.',
    baseFilters: {
      isNewProduct: true,
    },
  },
} satisfies Record<ProductCollectionId, ProductCollection>;
