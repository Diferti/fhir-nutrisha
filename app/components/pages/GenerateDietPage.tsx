import { useState, useEffect, useMemo } from 'react';
import IconSVG from "@/app/components/IconSVG";
import { InputField, SelectInput, StyledCheckbox, TagInput } from '../inputs';
import { generateDietPrompt } from '@/app/patient-sphere/patient/patient-details/prompts/generateDietPrompt';
import { DietDescription } from '../DietDescription';

const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Brunch', 'Snack', 'Supper'];
const MEAL_ORDER = ['Breakfast', 'Brunch', 'Lunch', 'Snack', 'Dinner', 'Supper'];

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
            step="0.1"/>
          <InputField 
            label="Neck (cm)" 
            value={neck} 
            onChange={setNeck}
            type="number"
            step="0.1"/>
          <div className="md:col-span-2">
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-primary font-fontMain">Body Fat Percentage</h3>
                  <p className="text-sm text-secondary font-fontMain font-bold">Calculated from measurements</p>
                </div>
                <div className="text-[20px] md:text-[26px] font-extrabold text-primary font-fontMain">
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

export const GenerateDietPage = ({ patientInfo }: { patientInfo: any }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');

  const [activityLevel, setActivityLevel] = useState('sedentary (little or no exercise, desk job)');
  const [workoutType, setWorkoutType] = useState('');
  const [goal, setGoal] = useState('balance');
  const [desiredWeight, setDesiredWeight] = useState('');
  
  const [mealQuantity, setMealQuantity] = useState('3');
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['Breakfast', 'Lunch', 'Dinner']);

  const [duration, setDuration] = useState('');
  const [dietPace, setDietPace] = useState('moderate');
  const [budget, setBudget] = useState('');
  const [exoticAllowed, setExoticAllowed] = useState(false);

  const [restrictions, setRestrictions] = useState<string[]>([]);
  
  const [loveProducts, setLoveProducts] = useState<string[]>([]);
  const [unloveProducts, setUnloveProducts] = useState<string[]>([]);

  const [dietPlan, setDietPlan] = useState<any>(null);
  const [dietError, setDietError] = useState<string | null>(null);
  const [isLoadingDiet, setIsLoadingDiet] = useState(false);

  const bmi = useMemo(() => {
      if (height && weight) {
          const heightM = parseFloat(height) / 100;
          const weightKg = parseFloat(weight);
          if (!isNaN(heightM) && !isNaN(weightKg) && heightM > 0) {
              return (weightKg / (heightM * heightM)).toFixed(1);
          }
      }
      return patientInfo?.measureData?.bmi || '';
  }, [height, weight, patientInfo]);
      
  
  const bodyFat = useMemo(() => {
      if (!waist || !neck || !height || !patientInfo?.patientData?.gender) return '';

      const waistCm = parseFloat(waist);
      const neckCm = parseFloat(neck);
      const heightCm = parseFloat(height);
      const gender = patientInfo.patientData.gender;
      
      if (gender.toLowerCase() === 'male') {
          return (495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450).toFixed(1);
      } else {
          return (495 / (1.29579 - 0.35004 * Math.log10(waistCm + neckCm) + 0.22100 * Math.log10(heightCm)) - 450).toFixed(1);
      }
  }, [waist, neck, height, patientInfo]);
      
  useEffect(() => {
      if (patientInfo?.measureData) {
          setHeight(patientInfo.measureData.height?.split(' ')[0] || '');
          setWeight(patientInfo.measureData.weight?.split(' ')[0] || '');
      }
  }, [patientInfo]);

  const handleGenerateDiet = async () => {
      setIsLoadingDiet(true);
      setDietError(null);
      setDietPlan(null);
  
      const dietDescription = generateDietPrompt({duration, dietPace, patientInfo, weight, height, bmi, waist, neck, bodyFat, activityLevel, workoutType,
          goal, desiredWeight, mealQuantity, selectedMeals, exoticAllowed, budget, loveProducts, unloveProducts, restrictions});
                      
      const formatedDietDescription = dietDescription.split("\n").filter(line => line.trim()).join("\n");
  
      try {
          const response = await fetch('/api/generate-diet', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ dietDescription: formatedDietDescription }),
          });
                
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
                    
          const data = await response.json();
          setDietPlan(data);
      } catch (err) {
          console.error('Diet generation failed:', err);
          setDietError(err instanceof Error ? err.message : 'Failed to generate diet plan');
      } finally {
          setIsLoadingDiet(false);
      }
    };

    const handleMealSelect = (meal: string) => {
      setSelectedMeals(prev => {
        const updated = prev.includes(meal)
          ? prev.filter(m => m !== meal)
          : prev.length < parseInt(mealQuantity)
            ? [...prev, meal]
            : prev;
    
        return [...updated].sort(
          (a, b) => MEAL_ORDER.indexOf(a) - MEAL_ORDER.indexOf(b)
        );
      });
    };

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
      <div className="max-w-7xl mx-auto text-center">
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
                  step="0.1"/>
                <InputField 
                  label="Weight (kg)" 
                  value={weight} 
                  onChange={setWeight}
                  type="number"
                  step="0.1"/>
              </div>
              <div className="md:col-span-2">
                <div className="bg-primary/10 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-primary font-fontMain">Body Mass Index</h3>
                        <p className="text-sm text-secondary font-fontMain font-bold">Healthy range: 18.5 - 24.9</p>
                    </div>
                    <div className="text-[20px] md:text-[26px] font-extrabold text-primary font-fontMain">
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
                bodyFat={bodyFat}/>
            </div>
          </div>

          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <div className="space-y-6">
              <div>
                <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">
                  Activity <span className="font-fontMain">&</span> Goal</h2>
                <div className="space-y-4">
                  <SelectInput
                    label="Daily Activity"
                    value={activityLevel}
                    onChange={setActivityLevel}
                    options={['Sedentary (Little or no exercise, desk job)', 
                    'Lightly Active (Light activity 1-3 days/week)', 
                    'Moderately Active (Regular exercise 3-5 days/week)', 
                    'Very Active (Intense exercise 6-7 days/week)']}/>

                  {['moderate', 'active'].includes(activityLevel) && (
                    <InputField
                      label="Workout Type"
                      value={workoutType}
                      onChange={setWorkoutType}
                      placeholder="e.g., Weightlifting"/>
                  )}
                </div>
              </div>

              <div>
                <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <SelectInput
                    label="Primary Goal"
                    value={goal}
                    onChange={setGoal}
                    options={['Balance', 'Improve', 'Cut', 'Gain']}/>

                    {['cut', 'gain'].includes(goal) && (
                    <InputField
                        label="Target Weight"
                        value={desiredWeight}
                        onChange={setDesiredWeight}
                        type="number"
                        placeholder="kg"/>
                    )}
                </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <div className="space-y-6">
              <div>
                <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Meal Configuration</h2>
                <div className="space-y-4">
                    <SelectInput
                        label="Meals/Day"
                        value={mealQuantity}
                        onChange={(value: string) => {
                          setMealQuantity(value);
                          setSelectedMeals([]);
                        }}
                        options={['2', '3', '4', '5', '6']}/>

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
                                <label key={meal} className={`relative cursor-pointer group ${
                                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleMealSelect(meal)}
                                    disabled={isDisabled}
                                    className="hidden"/>

                                <div className={`p-[10px] rounded-xl border-[1px] transition-all duration-200 font-fontMain
                                    ${isSelected 
                                    ? 'border-primary bg-primary/20 shadow-md border-[2px]' 
                                    : 'border-primary/50 hover:border-primary hover:bg-primary/50 bg-pageColor'}
                                    ${isDisabled ? 'hover:border-primary/20' : ''}`}>

                                    <div className="flex items-center gap-2">
                                      <span className={`text-lg transition-colors ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                                        {getMealIcon(meal)}
                                      </span>
                                      <span className={`font-bold ${isSelected ? 'text-primary font-extrabold' : 'text-secondary'}`}>
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

        <div className="space-y-6">
          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Diet Preferences</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <InputField
                      label="Diet Duration"
                      value={duration}
                      onChange={setDuration}
                      type="number"
                      placeholder="Days"/>
                  <SelectInput
                      label="Diet Pace"
                      value={dietPace}
                      onChange={setDietPace}
                      options={['Moderate', 'Slow', 'Fast']}/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Weekly Budget"
                    value={budget}
                    onChange={setBudget}
                    type="number"
                    placeholder="$"/>

                <StyledCheckbox
                    label={<><span className="hidden lg:inline">Allow </span>Exotic Foods</>}
                    emoji="🌍"
                    checked={exoticAllowed}
                    onChange={(checked: boolean) => setExoticAllowed(checked)}
                    className="mt-[9px] lg:mt-[21px]"/>
              </div>
            </div>
          </div>

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
                    )}/>
                ))}
            </div>
          </div>

          <div className="bg-pageColor p-[10px] lg:p-8 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
            <h2 className="text-center lg:text-start text-2xl xl:text-3xl font-fontHeader font-bold text-primary mb-6">Food Preferences</h2>
            <div className="space-y-4">
              <TagInput
                label="Favorite Foods"
                values={loveProducts}
                setValues={setLoveProducts}
                placeholder="Enter foods (comma separated)"
                colorClass="bg-green-100 text-green-800"/>
              <TagInput
                label="Avoid Foods"
                values={unloveProducts}
                setValues={setUnloveProducts}
                placeholder="Enter foods (comma separated)"
                colorClass="bg-red-100 text-red-800"/>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center px-4">
          <button onClick={handleGenerateDiet} disabled={isLoadingDiet} className="flex items-center justify-left gap-2 w-full bg-primary/10
              border-[3px] border-primary text-secondary rounded-lg hover:bg-primary/50 transition-colors
              max-w-[400px] mx-auto p-[5px] pl-[0px] md:pl-[25px] disabled:cursor-not-allowed disabled:animate-pulse">
            <div className="flex-shrink-0">
                <IconSVG
                    type="logoGenerate"
                    color="rgb(var(--secondary))"
                    width="100"
                    height="100"/>
            </div>
            <span className="text-2xl md:text-3xl font-extrabold uppercase font-fontHeader">
            {isLoadingDiet ? (
              <span className="flex items-center gap-1">
                Generating
                <span className="relative before:content-['.'] before:animate-dots"></span>
              </span>
            ) : (
              "Generate"
            )}
            </span>
          </button>
      </div>

      {dietError && (
          <div className="max-w-6xl mx-auto px-4 mt-4 p-4 bg-red-100 text-red-700 rounded font-fontMain font-bold">
              Error: {dietError}
          </div>
      )}

      {dietPlan && <DietDescription dietPlan={dietPlan} diabete={patientInfo?.isDiabetes}/>}
    </div>
  );
};