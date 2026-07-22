import type { Request, Response } from 'express';

import { getStoreSettingsData } from '../services/store-settings.service';
import type { StoreSettingsResponse } from '../types/api';

export const getStoreSettings = async (
  _req: Request,
  res: Response<StoreSettingsResponse>,
) => {
  const data = await getStoreSettingsData();

  res.status(200).json({
    success: true,
    message: 'Store settings fetched successfully',
    data,
  });
};
