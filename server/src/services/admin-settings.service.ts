import type {
  AdminStoreSettingsResponse,
  StoreGeneralSettingsDto,
  StoreOrderSettingsDto,
  StoreShippingSettingsDto,
} from '../types/api';
import { ApiError } from '../exceptions/api-error';
import { createAuditLog } from './audit-logs.service';
import {
  getStoreSettingsDocument,
  storeGeneralSettingsToDto,
  storeOrderSettingsToDto,
  storeShippingSettingsToDto,
  storeSettingsToDto,
} from './store-settings.service';
import type {
  UpdateAdminGeneralSettingsBody,
  UpdateAdminOrderSettingsBody,
  UpdateAdminShippingSettingsBody,
} from '../validators/admin-settings.validators';

const normalizeGeneralSettingsUpdate = (
  update: UpdateAdminGeneralSettingsBody,
) => {
  const normalizedUpdate = {
    ...update,
  };

  if (update.supportEmail !== undefined) {
    normalizedUpdate.supportEmail = update.supportEmail.toLowerCase();
  }

  return normalizedUpdate;
};

const getChangedGeneralSettingsFields = (
  previous: StoreGeneralSettingsDto,
  next: StoreGeneralSettingsDto,
) => {
  const fields: Array<keyof StoreGeneralSettingsDto> = [
    'address',
    'storeName',
    'supportEmail',
    'supportPhone',
  ];

  return fields.filter((field) => previous[field] !== next[field]);
};

const getChangedShippingSettingsFields = (
  previous: StoreShippingSettingsDto,
  next: StoreShippingSettingsDto,
) => {
  const fields: Array<keyof StoreShippingSettingsDto> = [
    'estimatedDeliveryDaysMax',
    'estimatedDeliveryDaysMin',
    'freeShippingEnabled',
    'freeShippingThreshold',
    'shippingNotice',
    'shippingRegion',
    'standardShippingPrice',
  ];

  return fields.filter((field) => previous[field] !== next[field]);
};

const getChangedOrderSettingsFields = (
  previous: StoreOrderSettingsDto,
  next: StoreOrderSettingsDto,
) => {
  const fields: Array<keyof StoreOrderSettingsDto> = [
    'ordersEnabled',
    'requireVerifiedEmailForCheckout',
  ];

  return fields.filter((field) => previous[field] !== next[field]);
};

const getNextShippingSettings = (
  previous: StoreShippingSettingsDto,
  update: UpdateAdminShippingSettingsBody,
): StoreShippingSettingsDto => {
  const next = {
    ...previous,
  };

  if (update.estimatedDeliveryDaysMax !== undefined) {
    next.estimatedDeliveryDaysMax = update.estimatedDeliveryDaysMax;
  }

  if (update.estimatedDeliveryDaysMin !== undefined) {
    next.estimatedDeliveryDaysMin = update.estimatedDeliveryDaysMin;
  }

  if (Object.hasOwn(update, 'freeShippingEnabled')) {
    next.freeShippingEnabled = Boolean(update.freeShippingEnabled);
  }

  if (update.freeShippingThreshold !== undefined) {
    next.freeShippingThreshold = update.freeShippingThreshold;
  }

  if (Object.hasOwn(update, 'shippingNotice')) {
    next.shippingNotice = update.shippingNotice;
  }

  if (update.shippingRegion !== undefined) {
    next.shippingRegion = update.shippingRegion;
  }

  if (update.standardShippingPrice !== undefined) {
    next.standardShippingPrice = update.standardShippingPrice;
  }

  return next;
};

const getNextOrderSettings = (
  previous: StoreOrderSettingsDto,
  update: UpdateAdminOrderSettingsBody,
): StoreOrderSettingsDto => {
  const next = {
    ...previous,
  };

  if (Object.hasOwn(update, 'ordersEnabled')) {
    next.ordersEnabled = Boolean(update.ordersEnabled);
  }

  if (Object.hasOwn(update, 'requireVerifiedEmailForCheckout')) {
    next.requireVerifiedEmailForCheckout = Boolean(
      update.requireVerifiedEmailForCheckout,
    );
  }

  return next;
};

const assertValidShippingSettings = (
  shipping: StoreShippingSettingsDto,
) => {
  if (
    shipping.estimatedDeliveryDaysMax <
    shipping.estimatedDeliveryDaysMin
  ) {
    throw ApiError.BadRequest(
      'Estimated delivery max days must be greater than or equal to min days',
    );
  }

  if (
    shipping.freeShippingEnabled &&
    shipping.freeShippingThreshold === null
  ) {
    throw ApiError.BadRequest(
      'Free shipping threshold is required when free shipping is enabled',
    );
  }
};

export const updateAdminGeneralSettingsData = async ({
  adminUserId,
  update,
}: {
  adminUserId: string;
  update: UpdateAdminGeneralSettingsBody;
}): Promise<AdminStoreSettingsResponse['data']> => {
  const settings = await getStoreSettingsDocument();
  const previousGeneralSettings = storeGeneralSettingsToDto(settings);
  const normalizedUpdate = normalizeGeneralSettingsUpdate(update);
  const nextGeneralSettings = {
    ...previousGeneralSettings,
  };

  if (Object.hasOwn(normalizedUpdate, 'address')) {
    nextGeneralSettings.address = normalizedUpdate.address;
  }

  if (normalizedUpdate.storeName !== undefined) {
    nextGeneralSettings.storeName = normalizedUpdate.storeName;
  }

  if (normalizedUpdate.supportEmail !== undefined) {
    nextGeneralSettings.supportEmail = normalizedUpdate.supportEmail;
  }

  if (Object.hasOwn(normalizedUpdate, 'supportPhone')) {
    nextGeneralSettings.supportPhone = normalizedUpdate.supportPhone;
  }

  const changedFields = getChangedGeneralSettingsFields(
    previousGeneralSettings,
    nextGeneralSettings,
  );

  if (changedFields.length === 0) {
    return {
      settings: storeSettingsToDto(settings),
    };
  }

  settings.set('general', nextGeneralSettings);

  await settings.save();
  await createAuditLog({
    action: 'settings.general_updated',
    actorId: adminUserId,
    entityId: settings._id,
    entityType: 'settings',
    metadata: {
      changedFields,
      section: 'general',
    },
  });

  return {
    settings: storeSettingsToDto(settings),
  };
};

export const updateAdminShippingSettingsData = async ({
  adminUserId,
  update,
}: {
  adminUserId: string;
  update: UpdateAdminShippingSettingsBody;
}): Promise<AdminStoreSettingsResponse['data']> => {
  const settings = await getStoreSettingsDocument();
  const previousShippingSettings = storeShippingSettingsToDto(settings);
  const nextShippingSettings = getNextShippingSettings(
    previousShippingSettings,
    update,
  );

  assertValidShippingSettings(nextShippingSettings);

  const changedFields = getChangedShippingSettingsFields(
    previousShippingSettings,
    nextShippingSettings,
  );

  if (changedFields.length === 0) {
    return {
      settings: storeSettingsToDto(settings),
    };
  }

  settings.set('shipping', nextShippingSettings);

  await settings.save();
  await createAuditLog({
    action: 'settings.shipping_updated',
    actorId: adminUserId,
    entityId: settings._id,
    entityType: 'settings',
    metadata: {
      changedFields,
      section: 'shipping',
    },
  });

  return {
    settings: storeSettingsToDto(settings),
  };
};

export const updateAdminOrderSettingsData = async ({
  adminUserId,
  update,
}: {
  adminUserId: string;
  update: UpdateAdminOrderSettingsBody;
}): Promise<AdminStoreSettingsResponse['data']> => {
  const settings = await getStoreSettingsDocument();
  const previousOrderSettings = storeOrderSettingsToDto(settings);
  const nextOrderSettings = getNextOrderSettings(
    previousOrderSettings,
    update,
  );
  const changedFields = getChangedOrderSettingsFields(
    previousOrderSettings,
    nextOrderSettings,
  );

  if (changedFields.length === 0) {
    return {
      settings: storeSettingsToDto(settings),
    };
  }

  settings.set('orders', nextOrderSettings);

  await settings.save();
  await createAuditLog({
    action: 'settings.orders_updated',
    actorId: adminUserId,
    entityId: settings._id,
    entityType: 'settings',
    metadata: {
      changedFields,
      section: 'orders',
    },
  });

  return {
    settings: storeSettingsToDto(settings),
  };
};
