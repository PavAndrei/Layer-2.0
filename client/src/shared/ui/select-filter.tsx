import Select from 'react-select';
import type { SingleValue } from 'react-select';

import type { SelectFilterOption } from './multi-select-filter';
import { getSelectStyles, getSelectTheme } from './select-filter-styles';

type SelectFilterProps<Option extends SelectFilterOption<string | number>> = {
  id: string;
  label: string;
  options: readonly Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  className?: string;
};

export const SelectFilter = <
  Option extends SelectFilterOption<string | number>,
>({
  id,
  label,
  options,
  value,
  onChange,
  className,
}: SelectFilterProps<Option>) => {
  return (
    <div className={`flex flex-col gap-1 ${className || ''}`}>
      <label className="block-medium" htmlFor={id}>
        {label}
      </label>
      <Select
        inputId={id}
        options={options}
        value={value}
        onChange={(newValue: SingleValue<Option>) => onChange(newValue)}
        styles={getSelectStyles<Option, false>()}
        theme={getSelectTheme}
      />
    </div>
  );
};
