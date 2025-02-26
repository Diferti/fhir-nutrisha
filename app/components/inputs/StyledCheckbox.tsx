export const StyledCheckbox = ({ label, emoji, checked, onChange, className }: any) => {
    return (
        <label className={`relative cursor-pointer group ${className}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden"/>
        <div className={`p-[10px] rounded-xl border-[1px] transition-all duration-200 font-fontMain
          ${checked 
            ? 'border-primary bg-primary/20 shadow-md border-[2px]' 
            : 'border-primary/50 hover:border-primary hover:bg-primary/50 bg-pageColor'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg transition-colors ${checked ? 'text-primary' : 'text-secondary'}`}>
              {emoji}
            </span>
            <span className={`font-bold text-sm md:text-base ${checked ? 'text-primary font-extrabold' : 'text-secondary'}`}>
              {label}
            </span>
          </div>
          {checked && (
            <div className="absolute top-0 right-0 -mt-2 -mr-2">
              <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                ✓
              </div>
            </div>
          )}
        </div>
      </label>
    );
  };