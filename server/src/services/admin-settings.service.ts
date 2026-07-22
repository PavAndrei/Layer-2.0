import type {
  AdminStoreSettingsResponse,
  StoreGeneralSettingsDto,
} from '../types/api';
import { createAuditLog } from './audit-logs.service';
import {
  getStoreSettingsDocument,
  storeGeneralSettingsToDto,
  storeSettingsToDto,
} from './store-settings.service';
import type {
  UpdateAdminGeneralSettingsBody,
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
