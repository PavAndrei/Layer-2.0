import { PRODUCT_SIZES } from '../model';

export const PRODUCT_SIZE_OPTIONS = PRODUCT_SIZES.map((size) => ({
  label: size === 'ONE_SIZE' ? 'One size' : size,
  value: size,
}));

export const PRODUCT_COLOR_OPTIONS = [
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
  { label: 'Grey', value: 'grey' },
  { label: 'Charcoal', value: 'charcoal' },
  { label: 'Cream', value: 'cream' },
  { label: 'Olive', value: 'olive' },
  { label: 'Khaki', value: 'khaki' },
  { label: 'Navy', value: 'navy' },
  { label: 'Sand', value: 'sand' },
  { label: 'Burgundy', value: 'burgundy' },
  { label: 'Washed Black', value: 'washed-black' },
  { label: 'Heather Grey', value: 'heather-grey' },
  { label: 'Dark Brown', value: 'dark-brown' },
];
