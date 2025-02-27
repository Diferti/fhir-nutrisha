export const TagInput = ({ label, values, setValues, colorClass, ...props }: any) => {
    return (
        <div className="space-y-2">
        <label className="block ml-[2px] text-sm font-bold font-fontMain text-secondary">{label}</label>
        <input className="w-full p-3 form-input"
          {...props}
          onBlur={(e) => {
            if (e.target.value) {
              setValues([...new Set([...values, ...e.target.value.split(',')])]);
              e.target.value = '';
            }}}/>
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((value: string, index: number) => (
            <span key={index} className={`${colorClass} px-2 py-1 rounded-lg text-sm font-bold font-fontMain text-gray-600`}>
              {value}
              <button type="button" onClick={() => setValues(values.filter((_: any, i: number) => i !== index))}
                className="ml-[3px] hover:text-red-500 text-base font-extrabold font-fontMain text-red-700">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };