import type { AuthBenefitsContent } from './auth-types';

const AUTH_BENEFIT_ITEMS = [
  'Save favorite products',
  'Track your orders',
  'Faster checkout',
  'Early access to new drops',
] as const;

export const LOGIN_BENEFITS = {
  title: 'Your Layer account',
  items: [...AUTH_BENEFIT_ITEMS],
} satisfies AuthBenefitsContent;

export const REGISTER_BENEFITS = {
  title: 'Create your Layer account',
  items: [...AUTH_BENEFIT_ITEMS],
} satisfies AuthBenefitsContent;
