import { useState } from 'react';

const MealIcon = ({ type }: any) => {
  const icons: { [key: string]: string } = {
    Breakfast: '🥞',
    Brunch: '🥐',
    Lunch: '🥗',
    Snack: '🍎',
    Dinner: '🍽️',
    Supper: '🍵'
  };
  return <span className="text-xl lg:text-2xl">{icons[type] || '🍴'}</span>;
};

const NutrientProgress = (props: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm items-center">
      <div className="flex items-center gap-1">
        <span className="text-lg">{props.icon}</span>
        <span className="text-secondary font-fontMain font-bold">{props.label}</span>
      </div>
      <span className="text-secondary font-fontMain font-bold">
        {Number.isInteger(props.value) ? props.value.toString() : props.value.toFixed(1) || 0}g
      </span>
    </div>
    <div className="h-2 bg-thirdary/25 rounded-full">
      <div 
        className={`h-2 rounded-full ${props.color}`} 
        style={{ width: `${Math.min(((props.value || 0) / (props.max || 100)) * 100, 100)}%` }}
      />
    </div>
  </div>
);

const calculateMealTotals = (meal: any) => {
  let totalCarbs = 0;
  let totalGL = 0;
  let weightedGI = 0;

  meal?.items?.forEach((item: any) => {
    const carbs = item?.nutrients?.carbs || 0;
    const gi = item?.nutrients?.glycemicIndex || 0;
    
    totalCarbs += carbs;
    totalGL += (gi * carbs) / 100;
    weightedGI += gi * carbs;
  });

  const averageGI = totalCarbs > 0 ? weightedGI / totalCarbs : 0;

  return {
    protein: meal?.items?.reduce((sum: number, item: any) => sum + (item?.nutrients?.protein || 0), 0) || 0,
    carbs: totalCarbs,
    fat: meal?.items?.reduce((sum: number, item: any) => sum + (item?.nutrients?.fat || 0), 0) || 0,
    fiber: meal?.items?.reduce((sum: number, item: any) => sum + (item?.nutrients?.fiber || 0), 0) || 0,
    averageGI: Math.round(averageGI),
    totalGL: Math.round(totalGL)
  };
};

const PreparationSection = ({ meal, diabete }: any) => {
  const { protein, carbs, fat, fiber, averageGI, totalGL } = calculateMealTotals(meal);

  return (
    <div>
      <div className="flex items-center gap-[5px] mb-3 justify-center lg:justify-start">
        <span className="text-2xl">📝</span>
        <h4 className="text-xl font-extrabold font-fontHeader text-secondary">Preparation Steps</h4>
      </div>
      <p className="text-primary/80 leading-relaxed bg-primary/10 p-[12px] rounded-lg font-fontMain font-bold">
        {meal?.preparation || 'No preparation instructions.'}
      </p>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <NutrientProgress 
            label="Protein" 
            value={protein}
            max={40} 
            color="bg-red-400" 
            icon="🥩"/>
          <NutrientProgress 
            label="Carbs" 
            value={carbs}
            max={60} 
            color="bg-yellow-400" 
            icon="🍞"/>
        </div>
        <div className="space-y-4">
          <NutrientProgress 
            label="Fat" 
            value={fat}
            max={30} 
            color="bg-blue-400" 
            icon="🥑"/>
          <NutrientProgress 
            label="Fiber" 
            value={fiber}
            max={25} 
            color="bg-green-400" 
            icon="🌿"/>
        </div>
      </div>
      {diabete && (
        <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 flex items-center gap-2 lg:gap-3">
          <div>
            <span className="text-[30px] lg:text-[45px]">📈</span>
          </div>
          <div>
            <p className="text-[13px] lg:text-sm font-bold font-fontHeader uppercase tracking-wide text-primary/80 mb-1">
              Glycemic Index
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-secondary font-fontMain">{averageGI}</span>
              <span className="text-sm font-bold text-primary/80 font-fontMain">GI</span>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 flex items-center gap-2 lg:gap-3">
          <div>
            <span className="text-[30px] lg:text-[45px]">📉</span>
          </div>
          <div>
            <p className="text-[13px] lg:text-sm font-bold font-fontHeader uppercase tracking-wide text-primary/80 mb-1">
              Glycemic Load
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-secondary font-fontMain">{totalGL}</span>
              <span className="text-sm font-bold text-primary/80 font-fontMain">GL</span>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

const MealCard = ({ meal, diabete }: any) => {
  const [expanded, setExpanded] = useState(false);

  if (!meal) return null;

  return (
    <div className="bg-pageColor p-[10px] mb-6 md:p-6 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-[5px] lg:gap-3">
          <MealIcon type={meal?.mealType} />
          <h3 className="text-xl lg:text-2xl font-extrabold font-fontHeader text-secondary">{meal?.mealType || 'Meal'}</h3>
          <span className="pt-[1px] lg:pt-[3px] text-primary/70 font-fontMain font-bold text-sm lg:text-base">{meal?.time || 'No time'}</span>
        </div>
        <div className="flex items-center gap-[5px] lg:gap-4">
          <span className="bg-primary/10 px-3 py-1 rounded-lg text-[12px] lg:text-sm font-fontMain text-secondary font-bold">
            {meal?.totalCalories || 'N/A'} kcal
          </span>
          <span className={`text-primary transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-[5px] mb-3">
                <span className="text-2xl">🍴</span>
                <h4 className="text-xl font-extrabold font-fontHeader text-secondary">Meal Composition</h4>
              </div>
              {(meal?.items || []).map((item: any) => (
                <div key={item?.food} className="py-2 border-b border-primary/70">
                  <div className="flex justify-between">
                    <span className="text-base font-bold font-fontMain text-secondary">{item?.food || 'N/A'}</span>
                    <span className="text-base font-bold font-fontMain text-primary/70">{item?.quantity || '--'}</span>
                  </div>
                  <div className="flex gap-2 text-sm font-bold font-fontMain text-primary/70">
                    <span><span className="text-base">🥩</span> {item?.nutrients?.protein || 0}g</span>
                    <span><span className="text-base">🍞</span> {item?.nutrients?.carbs || 0}g</span>
                    <span><span className="text-base">🥑</span> {item?.nutrients?.fat || 0}g</span>
                    <span><span className="text-base">🌿</span> {item?.nutrients?.fiber || 0}g</span>
                  </div>
                </div>
              ))}
            </div>
            <PreparationSection meal={meal} diabete={diabete} />
          </div>
        </div>
      )}
    </div>
  );
};

const DayNavigator = ({ current, total, onChange }: any) => (
  <div className="flex items-center justify-center gap-4 mb-8 text-2xl">
    <button 
      onClick={() => onChange(Math.max(0, current - 1))}
      disabled={current === 0}
      className="px-3 text-secondary border-[1px] bg-primary/20 border-primary rounded-lg disabled:opacity-50 hover:bg-primary/50">
      🢠
    </button>
    <span className="font-extrabold text-4xl font-fontHeader text-secondary">Day {current + 1}</span>
    <button 
      onClick={() => onChange(Math.min(total - 1, current + 1))}
      disabled={current <= total - 1}
      className="px-3 text-secondary border-[1px] bg-primary/20 border-primary rounded-lg disabled:opacity-50 hover:bg-primary/50">
      🢡
    </button>
  </div>
);

const DailySummary = ({ day }: any) => {
  const totals = (day?.meals || []).reduce((acc: any, meal: any) => {
    (meal?.items || []).forEach((item: any) => {
      acc.protein += item?.nutrients?.protein || 0;
      acc.carbs += item?.nutrients?.carbs || 0;
      acc.fat += item?.nutrients?.fat || 0;
      acc.fiber += item?.nutrients?.fiber || 0;
    });
    return acc;
  }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });

  return (
    <div className="bg-pageColor p-[10px] mb-6 md:p-6 border border-primary rounded-[15px] shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)]">
      <div className="flex items-center gap-[5px] mb-4 justify-center lg:justify-start">
        <span className="text-2xl">📊</span>
        <h3 className="text-2xl font-extrabold font-fontHeader text-secondary">Daily Nutrition</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-primary/5 p-3 rounded-lg text-center">
            <div className="flex justify-center items-center">
              <span className="text-xl">🍴</span>
              <p className="text-sm font-bold font-fontHeader text-primary/80">Total Calories</p>
            </div>
            <p className="flex items-center justify-center gap-[5px] text-xl font-extrabold font-fontMain text-secondary ">
              {day?.daySummary?.totalCalories || 'N/A'} kcal
            </p>
          </div>
          <div className="bg-primary/5 p-3 rounded-lg text-center">
            <div className="flex justify-center items-center">
              <span className="text-xl">⏳</span>
              <p className="text-sm font-bold font-fontHeader text-primary/80">Eating Window</p>
            </div>
            <p className="text-xl font-extrabold font-fontMain text-secondary flex items-center justify-center gap-[5px]">
              {day?.daySummary?.eatingWindow || 'N/A'}
            </p>
          </div>
        </div>

        <NutrientProgress 
          label="Protein" 
          value={totals.protein}
          max={150} 
          color="bg-red-400" 
          icon="🥩"/>
        <NutrientProgress 
          label="Carbohydrates" 
          value={totals.carbs}
          max={300} 
          color="bg-yellow-400" 
          icon="🍞"/>
        <NutrientProgress 
          label="Fat" 
          value={totals.fat}
          max={100} 
          color="bg-blue-400" 
          icon="🥑"/>
        <NutrientProgress 
          label="Fiber" 
          value={totals.fiber}
          max={50} 
          color="bg-green-400" 
          icon="🌿"/>
      </div>
    </div>
  );
};

export const DietDescription = ({ dietPlan, diabete }: any) => {
  const [currentDay, setCurrentDay] = useState(0);
  
  if (!dietPlan?.days?.length) {
    return <div className="text-center p-8 text-primary/60">Something went wrong, try again!</div>;
  }

  const totalDays = dietPlan.days.length;
  const currentDayData = dietPlan.days[currentDay] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DayNavigator 
        current={currentDay} 
        total={totalDays} 
        onChange={setCurrentDay}/>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {(currentDayData?.meals || [])
            .sort((a: any, b: any) => (a?.time || '').localeCompare(b?.time || ''))
            .map((meal: any, index: number) => (
              <MealCard key={`${meal?.mealType}-${index}`} meal={meal} diabete={diabete} />
            ))}
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <DailySummary day={currentDayData} />
        </div>
      </div>
    </div>
  );
};