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
    <div className="flex items-center gap-2 relative">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="cursor-pointer opacity-0"
      />
      <label className="block-medium cursor-pointer" htmlFor={id}>
        {label}
      </label>
      <span className="absolute left-0 top-1 h-3.5 w-3.5 border-border-active border bg-background-primary flex items-center justify-center pointer-events-none">
        <span
          className={`${checked ? 'block' : 'hidden'} h-2.5 w-2.5 bg-typography-primary`}
        />
      </span>
    </div>
  );
};
