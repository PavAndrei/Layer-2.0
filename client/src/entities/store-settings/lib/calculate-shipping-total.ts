import type { StoreShippingSettings } from '../model';

const roundMoney = (value: number) => Math.round(value * 100) / 100;

type CalculateShippingTotalParams = {
  merchandiseTotal: number;
  shippingSettings: StoreShippingSettings;
};

export const calculateShippingTotal = ({
  merchandiseTotal,
  shippingSettings,
}: CalculateShippingTotalParams) => {
  if (shippingSettings.standardShippingPrice === 0) {
    return 0;
  }

  if (
    shippingSettings.freeShippingEnabled &&
    shippingSettings.freeShippingThreshold !== null &&
    merchandiseTotal >= shippingSettings.freeShippingThreshold
  ) {
    return 0;
  }

  return roundMoney(shippingSettings.standardShippingPrice);
};
