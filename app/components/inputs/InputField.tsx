export const InputField = ({ label, value, onChange, ...props }: any) => {
  return (
    <div className="space-y-2">
      <label className="block ml-[2px] text-sm font-bold font-fontMain text-secondary">{label}</label>
      <input {...props} value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 form-input"/>
    </div>
  );
};