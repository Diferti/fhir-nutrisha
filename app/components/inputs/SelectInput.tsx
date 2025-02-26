export const SelectInput = ({ label, value, onChange, options }: any) => {
    return (
        <div className="space-y-2">
        <label className="block ml-[2px] text-sm font-bold font-fontMain text-secondary">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 form-select">
          {options.map((option: string) => (
            <option key={option} value={option.toLowerCase()}>{option}</option>
          ))}
        </select>
      </div>
    );
  };