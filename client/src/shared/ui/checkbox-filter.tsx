type CheckboxFilterProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const CheckboxFilter = ({
  id,
  label,
  checked,
  onChange,
}: CheckboxFilterProps) => {
  return (
    <div className="flex items-center gap-1">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
