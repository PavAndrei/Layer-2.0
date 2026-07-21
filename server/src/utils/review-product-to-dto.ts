import type { Types } from 'mongoose';

import type { ReviewProductDto } from '../types/api';

type ReviewProductSource = {
  _id: Types.ObjectId;
  img: string;
  slug: string;
  title: string;
};

export const reviewProductToDto = (
  product: ReviewProductSource,
): ReviewProductDto => ({
  _id: product._id.toString(),
  img: product.img,
  slug: product.slug,
  title: product.title,
});
