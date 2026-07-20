import { z } from 'zod';

import { REVIEW_STATUSES } from '../../../entities/review';

const clearableString = (name: string, maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum, `${name} is too long`);

export const updateAdminReviewSchema = z
  .object({
    moderationReason: clearableString('Moderation reason', 1000).optional(),
    status: z.enum(REVIEW_STATUSES).optional(),
  })
  .strict();

export type UpdateAdminReviewPayload = z.infer<
  typeof updateAdminReviewSchema
>;
