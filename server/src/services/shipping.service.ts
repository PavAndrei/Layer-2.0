import type {
  StoreShippingSettingsDto,
} from '../types/api';
import type { OrderShippingSnapshot } from '../types/order';

const roundMoney = (value: number) => Math.round(value * 100) / 100;

type CalculateShippingTotalParams = {
  merchandiseTotal: number;
  shippingSettings: StoreShippingSettingsDto;
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

export const createOrderShippingSnapshot = ({
  shippingSettings,
  shippingTotal,
}: {
  shippingSettings: StoreShippingSettingsDto;
  shippingTotal: number;
}): OrderShippingSnapshot => ({
  estimatedDeliveryDaysMax: shippingSettings.estimatedDeliveryDaysMax,
  estimatedDeliveryDaysMin: shippingSettings.estimatedDeliveryDaysMin,
  freeShippingEnabled: shippingSettings.freeShippingEnabled,
  freeShippingThreshold: shippingSettings.freeShippingThreshold,
  shippingNotice: shippingSettings.shippingNotice,
  shippingPrice: shippingTotal,
  shippingRegion: shippingSettings.shippingRegion,
  standardShippingPrice: shippingSettings.standardShippingPrice,
});
