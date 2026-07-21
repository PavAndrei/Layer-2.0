import type { GroupBase, StylesConfig, Theme } from 'react-select';

import type { SelectFilterOption } from './multi-select-filter';

const selectColors = {
  backgroundPrimary: '#F7F5F0',
  backgroundSurface: '#FFFFFF',
  backgroundSecondary: '#F1EEE8',
  backgroundHover: '#E7E2D8',
  typographyPrimary: '#111111',
  typographySecondary: '#666666',
  typographyMuted: '#9A9A9A',
  borderSoft: '#E5E0D8',
  borderStrong: '#D6D0C7',
  accentPrimary: '#4B5320',
  accentHover: '#3F461B',
  accentBlack: '#111111',
};

export const getSelectStyles = <
  Option extends SelectFilterOption<string | number>,
  IsMulti extends boolean,
>(): StylesConfig<Option, IsMulti, GroupBase<Option>> => ({
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 4,
    borderColor: state.isFocused
      ? selectColors.accentBlack
      : selectColors.borderStrong,
    backgroundColor: selectColors.backgroundSurface,
    boxShadow: 'none',
    cursor: 'pointer',
    ':hover': {
      borderColor: selectColors.accentBlack,
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50,
    border: `1px solid ${selectColors.borderSoft}`,
    borderRadius: 4,
    backgroundColor: selectColors.backgroundSurface,
    boxShadow: '0 12px 28px rgb(17 17 17 / 0.08)',
    overflow: 'hidden',
  }),
  menuList: (base) => ({
    ...base,
    paddingBlock: 4,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? selectColors.accentPrimary
      : state.isFocused
        ? selectColors.backgroundHover
        : selectColors.backgroundSurface,
    color: state.isSelected
      ? selectColors.backgroundSurface
      : selectColors.typographyPrimary,
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: '20px',
    ':active': {
      backgroundColor: state.isSelected
        ? selectColors.accentHover
        : selectColors.backgroundSecondary,
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: selectColors.typographyPrimary,
  }),
  placeholder: (base) => ({
    ...base,
    color: selectColors.typographyMuted,
  }),
  input: (base) => ({
    ...base,
    color: selectColors.typographyPrimary,
  }),
  multiValue: (base) => ({
    ...base,
    border: `1px solid ${selectColors.borderSoft}`,
    borderRadius: 999,
    backgroundColor: selectColors.backgroundPrimary,
    overflow: 'hidden',
  }),
  multiValueLabel: (base) => ({
    ...base,
    paddingInline: 8,
    color: selectColors.typographySecondary,
    fontSize: 13,
    lineHeight: '18px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: selectColors.typographySecondary,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: selectColors.backgroundHover,
      color: selectColors.typographyPrimary,
    },
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused
      ? selectColors.accentBlack
      : selectColors.typographySecondary,
    ':hover': {
      color: selectColors.accentBlack,
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: selectColors.typographySecondary,
    cursor: 'pointer',
    ':hover': {
      color: selectColors.accentBlack,
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: selectColors.borderSoft,
  }),
});

export const getSelectTheme = (theme: Theme): Theme => ({
  ...theme,
  borderRadius: 4,
  colors: {
    ...theme.colors,
    primary: selectColors.accentPrimary,
    primary75: selectColors.accentHover,
    primary50: selectColors.backgroundHover,
    primary25: selectColors.backgroundSecondary,
    neutral0: selectColors.backgroundSurface,
    neutral10: selectColors.backgroundPrimary,
    neutral20: selectColors.borderStrong,
    neutral30: selectColors.accentBlack,
    neutral40: selectColors.typographyMuted,
    neutral50: selectColors.typographyMuted,
    neutral80: selectColors.typographyPrimary,
  },
});
