import Select from 'react-select';
import type { SingleValue } from 'react-select';

import type { SelectFilterOption } from './multi-select-filter';

type SelectFilterProps<Option extends SelectFilterOption> = {
  id: string;
  label: string;
  options: readonly Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
};

export const SelectFilter = <Option extends SelectFilterOption>({
  id,
  label,
  options,
  value,
  onChange,
}: SelectFilterProps<Option>) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <Select
        inputId={id}
        options={options}
        value={value}
        onChange={(newValue: SingleValue<Option>) => onChange(newValue)}
      />
    </div>
  );
};
