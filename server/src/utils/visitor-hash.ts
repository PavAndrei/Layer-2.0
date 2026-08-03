import { createHash } from 'node:crypto';

import { VIEW_TRACKING_SECRET } from '../constants/env';

type VisitorHashInput = {
  ip: string;
  userAgent: string;
};

export const getVisitorHash = ({ ip, userAgent }: VisitorHashInput) => {
  return createHash('sha256')
    .update(`${ip}:${userAgent}:${VIEW_TRACKING_SECRET}`)
    .digest('hex');
};
