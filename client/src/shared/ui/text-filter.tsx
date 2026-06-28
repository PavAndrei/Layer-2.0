type TextFilterProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const TextFilter = ({
  id,
  label,
  value,
  placeholder,
  onChange,
}: TextFilterProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="block-medium" htmlFor={id}>
        {label}
      </label>
      <input
        className="w-full rounded border border-border-soft px-2 py-1"
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};
