import Select from 'react-select';
import type { MultiValue } from 'react-select';

export type SelectFilterOption<Value extends string = string> = {
  label: string;
  value: Value;
};

type MultiSelectFilterProps<Option extends SelectFilterOption> = {
  id: string;
  label: string;
  options: readonly Option[];
  value: readonly Option[];
  onChange: (value: Option[]) => void;
};

export const MultiSelectFilter = <Option extends SelectFilterOption>({
  id,
  label,
  options,
  value,
  onChange,
}: MultiSelectFilterProps<Option>) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <Select
        inputId={id}
        options={options}
        isMulti
        value={value}
        onChange={(newValue: MultiValue<Option>) => onChange([...newValue])}
      />
    </div>
  );
};
