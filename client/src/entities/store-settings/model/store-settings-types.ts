export type StoreGeneralSettings = {
  address?: string;
  storeName: string;
  supportEmail: string;
  supportPhone?: string;
};

export type StoreSettings = {
  _id: string;
  createdAt: string;
  general: StoreGeneralSettings;
  updatedAt: string;
};
