import { useState, useCallback } from 'react';
import IconSVG from "@/app/components/IconSVG";

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Brunch', 'Snack', 'Supper'];

export const GenerateDietPage = ({ patientInfo, isDarkMode }: { patientInfo: any, isDarkMode: boolean}) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [goal, setGoal] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [duration, setDuration] = useState('');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [mealQuantity, setMealQuantity] = useState('3');
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [loveProducts, setLoveProducts] = useState<string[]>([]);
  const [unloveProducts, setUnloveProducts] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [exoticAllowed, setExoticAllowed] = useState(false);
  const [dietPace, setDietPace] = useState('middle');
  const [calories, setCalories] = useState('');
  const [isLoadingDiet, setIsLoadingDiet] = useState(false);

  const calculateBMI = useCallback(() => {
    if (height && weight) {
      const heightM = Number(height) / 100;
      const calculatedBMI = Number(weight) / (heightM * heightM);
      setBmi(calculatedBMI.toFixed(1));
    }
  }, [height, weight]);

  const handleGenerateDiet = async () => {
    setIsLoadingDiet(true);
    // Add your diet generation logic here
  };

  const handleMealSelect = (meal: string) => {
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter(m => m !== meal));
    } else {
      if (selectedMeals.length < parseInt(mealQuantity)) {
        setSelectedMeals([...selectedMeals, meal]);
      }
    }
  };

  const InputField = ({ label, value, onChange, ...props }: any) => (
    <div className="space-y-2">
      <label className="block ml-[2px] text-sm font-bold font-fontMain text-secondary">{label}</label>
      <input {...props} value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 form-input"/>
    </div>
  );

  const SelectInput = ({ label, value, onChange, options }: any) => (
    <div className="space-y-2">
      <label className="block ml-[2px] text-sm font-bold font-fontMain text-secondary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 form-select"
      >
        {options.map((option: string) => (
          <option key={option} value={option.toLowerCase()}>{option}</option>
        ))}
      </select>
    </div>
  );

  const StyledCheckbox = ({ label, emoji, checked, onChange, className }: any) => (
    <label className={`relative cursor-pointer group ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <div className={`p-[10px] rounded-xl border-[1px] transition-all duration-200 font-fontMain
        ${checked 
          ? 'border-primary bg-primary/20 shadow-md border-[2px]' 
          : 'border-primary/50 hover:border-primary hover:bg-primary/50 bg-pageColor'}`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-lg transition-colors ${checked ? 'text-primary' : 'text-secondary'}`}>
            {emoji}
          </span>
          <span className={`font-bold ${checked ? 'text-primary font-extrabold' : 'text-secondary'}`}>
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

  const TagInput = ({ label, values, setValues, colorClass, ...props }: any) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-secondary">{label}</label>
      <input
        {...props}
        onBlur={(e) => {
          if (e.target.value) {
            setValues([...new Set([...values, ...e.target.value.split(',')])]);
            e.target.value = '';
          }
        }}
        className="w-full p-3 border-2 border-primary/20 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {values.map((value: string, index: number) => (
          <span key={index} className={`${colorClass} px-2 py-1 rounded-full text-sm`}>
            {value}
            <button
              type="button"
              onClick={() => setValues(values.filter((_: any, i: number) => i !== index))}
              className="ml-2 hover:opacity-75"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );

  const AdvancedMeasurements = ({ showAdvanced, setShowAdvanced, waist, setWaist, neck, setNeck, bodyFat }: any) => (
    <div className="mt-6 border-t border-primary/20 pt-6">
      <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-center lg:justify-start gap-2 text-primary 
            hover:text-primary/80 transition-colors w-full">
        <span className="font-medium">Advanced Measurements</span>
        <svg className={`w-5 h-5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${showAdvanced ? 'max-h-96' : 'max-h-0'}`}>
        <div className="pt-6 space-y-4">
          <h3 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary">Detailed Measurements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
              label="Waist (cm)" 
              value={waist} 
              onChange={setWaist}
              type="number"
            />
            <InputField 
              label="Neck (cm)" 
              value={neck} 
              onChange={setNeck}
              type="number"
            />
            <div className="md:col-span-2">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-primary font-fontMain">Body Fat Percentage</h3>
                    <p className="text-sm text-secondary font-fontMain font-bold">Calculated from measurements</p>
                  </div>
                  <div className="text-4xl font-extrabold text-primary font-fontMain">
                    {bodyFat ? `${bodyFat}%` : '--'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'Breakfast': return '🥞';
      case 'Brunch': return '🥐';
      case 'Lunch': return '🥗';
      case 'Snack': return '🍎';
      case 'Dinner': return '🍽️';
      case 'Supper': return '🍵';
      default: return '🍴';
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-background">
      <div className="max-w-7xl mx-auto text-center pt-8">
        <h1 className="text-4xl font-bold text-secondary font-fontHeader tracking-tight sm:text-5xl md:text-6xl mb-4">
          Nutrisha Diet Generator
        </h1>
      </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-8">
        <div className="space-y-6">
          <div className="bg-pageColor p-[10px] md:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Body Metrics</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Height (cm)" 
                  value={height} 
                  onChange={setHeight}
                  type="number"
                />
                <InputField 
                  label="Weight (kg)" 
                  value={weight} 
                  onChange={setWeight}
                  type="number"
                />
              </div>
              <div className="md:col-span-2">
                <div className="bg-primary/10 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-primary font-fontMain">Body Mass Index</h3>
                        <p className="text-sm text-secondary font-fontMain font-bold">Healthy range: 18.5 - 24.9</p>
                    </div>
                    <div className="text-4xl font-extrabold text-primary font-fontMain">
                        {bmi || '--'}
                    </div>
                </div>
              </div>
              <AdvancedMeasurements 
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                waist={waist}
                setWaist={setWaist}
                neck={neck}
                setNeck={setNeck}
                bodyFat={bodyFat}
              />
            </div>
          </div>

          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <div className="space-y-6">
              <div>
                <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Activity Level</h2>
                <div className="space-y-4">
                  <SelectInput
                    label="Daily Activity"
                    value={activityLevel}
                    onChange={setActivityLevel}
                    options={['Sedentary', 'Light', 'Moderate', 'Active']}
                  />
                  {['moderate', 'active'].includes(activityLevel) && (
                    <InputField
                      label="Workout Type"
                      value={workoutType}
                      onChange={setWorkoutType}
                      placeholder="e.g., Weightlifting"
                    />
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Nutrition Goals</h2>
                <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput
                    label="Primary Goal"
                    value={goal}
                    onChange={setGoal}
                    options={['Cut', 'Gain', 'Maintain', 'Improve']}
                    />
                    {['cut', 'gain'].includes(goal) && (
                    <InputField
                        label="Target Weight (kg)"
                        value={desiredWeight}
                        onChange={setDesiredWeight}
                        type="number"
                    />
                    )}
                </div>
                <InputField
                    label="Daily Calories"
                    value={calories}
                    onChange={setCalories}
                    type="number"
                    step="50"
                />

                <div className="space-y-4">
                    <SelectInput
                        label="Meals/Day"
                        value={mealQuantity}
                        onChange={(value: string) => {
                        setMealQuantity(value);
                        setSelectedMeals([]);
                        }}
                        options={['2', '3', '4', '5', '6']}
                    />

                    {mealQuantity && (
                        <div className="space-y-2">
                        <label className="block text-sm ml-[2px] font-bold font-fontMain text-secondary">
                            Select {mealQuantity} {mealQuantity === '1' ? 'Meal' : 'Meals'}
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {MEAL_OPTIONS.map((meal) => {
                            const isSelected = selectedMeals.includes(meal);
                            const isDisabled = !isSelected && selectedMeals.length >= parseInt(mealQuantity);
                            
                            return (
                                <label 
                                key={meal}
                                className={`relative cursor-pointer group ${
                                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleMealSelect(meal)}
                                    disabled={isDisabled}
                                    className="hidden"
                                />
                                <div className={`p-[10px] rounded-xl border-[1px] transition-all duration-200 font-fontMain
                                    ${isSelected 
                                    ? 'border-primary bg-primary/20 shadow-md border-[2px]' 
                                    : 'border-primary/50 hover:border-primary hover:bg-primary/50 bg-pageColor'}
                                    ${isDisabled ? 'hover:border-primary/20' : ''}`}
                                >
                                    <div className="flex items-center gap-2">
                                    <span className={`text-lg transition-colors ${
                                        isSelected ? 'text-primary' : 'text-secondary'
                                    }`}>
                                        {getMealIcon(meal)}
                                    </span>
                                    <span className={`font-bold ${
                                        isSelected ? 'text-primary font-extrabold' : 'text-secondary'
                                    }`}>
                                        {meal}
                                    </span>
                                    </div>
                                    {isSelected && (
                                    <div className="absolute top-0 right-0 -mt-2 -mr-2">
                                        <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        ✓
                                        </div>
                                    </div>
                                    )}
                                </div>
                                </label>
                            );
                            })}
                        </div>
                        {selectedMeals.length > 0 && (
                            <div className="mt-2 ml-[2px] text-sm font-bold font-fontMain text-primary/80">
                            Selected meals:{" "}
                            <span className="font-medium">{selectedMeals.join(', ')}</span>
                            </div>
                        )}
                        </div>
                    )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Diet Preferences</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm ml-[2px] font-bold font-fontMain text-secondary mb-2">Diet Duration</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-3 form-input"
                      placeholder="Days"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm ml-[2px] font-bold font-fontMain text-secondary">Diet Pace</label>
                  <select
                    value={dietPace}
                    onChange={(e) => setDietPace(e.target.value)}
                    className="w-full p-3 form-select"
                  >
                    <option value="slow">Slow</option>
                    <option value="medium">Medium</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm ml-[2px] font-bold font-fontMain text-secondary">Weekly Budget ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-8 p-3 form-input"
                    />
                  </div>
                </div>
                <StyledCheckbox
                    label={<><span className="hidden lg:inline">Allow </span>Exotic Foods</>}
                    emoji="🌍"
                    checked={exoticAllowed}
                    onChange={(checked: boolean) => setExoticAllowed(checked)}
                    className="mt-[-4px] lg:mt-[20px]"
                    />
              </div>
            </div>
          </div>

          {/* Dietary Restrictions Card */}
          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Dietary Restrictions</h2>
            <div className="grid grid-cols-2 gap-4">
            {[
                { label: 'Vegetarian', emoji: '🌱' },
                { label: 'Vegan', emoji: '🥦' },
                { label: 'Halal', emoji: '☪️' },
                { label: 'Kosher', emoji: '✡️' },
                { label: 'Pork-free', emoji: '🐖🚫' },
                { label: 'Dairy-free', emoji: '🥛🚫' }
                ].map(({ label, emoji }) => (
                <StyledCheckbox
                    key={label}
                    label={label}
                    emoji={emoji}
                    checked={restrictions.includes(label.toLowerCase())}
                    onChange={(checked: boolean) => 
                    setRestrictions(checked ? 
                        [...restrictions, label.toLowerCase()] : 
                        restrictions.filter(r => r !== label.toLowerCase())
                    )
                    }
                />
                ))}
            </div>
          </div>

          {/* Food Preferences Card */}
          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Food Preferences</h2>
            <div className="space-y-4">
              <TagInput
                label="Favorite Foods"
                values={loveProducts}
                setValues={setLoveProducts}
                placeholder="Add favorite foods (comma separated)"
                colorClass="bg-green-100 text-green-800"
              />
              <TagInput
                label="Avoid Foods"
                values={unloveProducts}
                setValues={setUnloveProducts}
                placeholder="Add foods to avoid (comma separated)"
                colorClass="bg-red-100 text-red-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="max-w-7xl mx-auto mt-8 flex justify-center pb-8">
        <button 
          onClick={handleGenerateDiet}
          disabled={isLoadingDiet}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg 
                   shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          {isLoadingDiet ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Generating...
            </span>
          ) : 'Generate Diet Plan'}
        </button>
      </div>
    </div>
  );
};