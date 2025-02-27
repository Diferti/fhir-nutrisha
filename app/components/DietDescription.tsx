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
  return <span className="text-2xl">{icons[type] || '🍴'}</span>;
};

const NutrientProgress = (props: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm items-center">
      <div className="flex items-center gap-2">
        <span className="text-lg">{props.icon}</span>
        <span>{props.label}</span>
      </div>
      <span className="font-medium">{props.value || 0}g</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full">
      <div 
        className={`h-2 rounded-full ${props.color}`} 
        style={{ width: `${Math.min(((props.value || 0) / (props.max || 100)) * 100, 100)}%` }}
      />
    </div>
  </div>
);

const calculateMealTotals = (meal: any) => {
  return {
    fiber: meal?.items?.reduce((sum: number, item: any) => sum + (item?.nutrients?.fiber || 0), 0) || 0,
    glycemicIndex: meal?.items?.reduce((sum: number, item: any) => sum + (item?.nutrients?.glycemicIndex || 0), 0) || 0,
    carbs: meal?.items?.reduce((sum: number, item: any) => sum + (item?.nutrients?.carbs || 0), 0) || 0
  };
};

const PreparationSection = ({ meal }: any) => {
  const { fiber, glycemicIndex, carbs } = calculateMealTotals(meal);

  return (
    <div className="mt-4 pt-4 border-t border-primary/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📝</span>
        <h4 className="font-bold text-lg">Preparation Steps</h4>
      </div>
      <p className="text-primary/80 leading-relaxed bg-primary/5 p-4 rounded-lg">
        {meal?.preparation || 'No preparation instructions available.'}
      </p>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <NutrientProgress 
            label="Carbohydrates" 
            value={carbs}
            max={60} 
            color="bg-yellow-300" 
            icon="🍞"
          />
          <NutrientProgress 
            label="Fiber" 
            value={fiber}
            max={25} 
            color="bg-green-300" 
            icon="🌾"
          />
        </div>
        
        <div className="bg-primary/5 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm text-primary/60">Glycemic Load</p>
              <p className="font-medium text-lg">{glycemicIndex}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">💊</span>
            <div>
              <p className="text-sm text-primary/60">Insulin Carbs</p>
              <p className="font-medium text-lg">{meal?.carbsForInsulin || 0}g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MealCard = ({ meal }: any) => {
  const [expanded, setExpanded] = useState(false);

  if (!meal) return null;

  return (
    <div className="bg-pageColor border border-primary/20 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <MealIcon type={meal?.mealType} />
          <h3 className="text-xl font-bold">{meal?.mealType || 'Meal'}</h3>
          <span className="text-primary/60">{meal?.time || 'No time'}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-primary/10 px-3 py-1 rounded-full text-sm">
            {meal?.totalCalories || '?'} kcal
          </span>
          <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-primary/10">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🍴</span>
                <h4 className="font-bold text-lg">Meal Composition</h4>
              </div>
              {(meal?.items || []).map((item: any) => (
                <div key={item?.food} className="py-2 border-b border-primary/5">
                  <div className="flex justify-between">
                    <span className="font-medium">{item?.food || 'Unknown food'}</span>
                    <span className="text-primary/60">{item?.quantity || '--'}</span>
                  </div>
                  <div className="flex gap-2 text-sm text-primary/60">
                    <span>P: {item?.nutrients?.protein || 0}g</span>
                    <span>C: {item?.nutrients?.carbs || 0}g</span>
                    <span>F: {item?.nutrients?.fat || 0}g</span>
                  </div>
                </div>
              ))}
            </div>
            <PreparationSection meal={meal} />
          </div>
        </div>
      )}
    </div>
  );
};

const DayNavigator = ({ current, total, onChange }: any) => (
  <div className="flex items-center justify-center gap-4 mb-8">
    <button 
      onClick={() => onChange(Math.max(0, current - 1))}
      disabled={current === 0}
      className="p-2 rounded-lg disabled:opacity-50 hover:bg-primary/10"
    >
      ◀️
    </button>
    <span className="font-bold text-lg">Day {current + 1}</span>
    <button 
      onClick={() => onChange(Math.min(total - 1, current + 1))}
      disabled={current === total - 1}
      className="p-2 rounded-lg disabled:opacity-50 hover:bg-primary/10"
    >
      ▶️
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
    <div className="bg-pageColor border border-primary/20 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold">Daily Nutrition</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-primary/5 p-3 rounded-lg text-center">
            <p className="text-sm text-primary/60">Total Meals</p>
            <p className="text-2xl font-bold flex items-center justify-center gap-2">
              <span className="text-xl">🍴</span>
              {day?.daySummary?.mealFrequency || 0}
            </p>
          </div>
          <div className="bg-primary/5 p-3 rounded-lg text-center">
            <p className="text-sm text-primary/60">Eating Window</p>
            <p className="text-2xl font-bold flex items-center justify-center gap-2">
              <span className="text-xl">⏳</span>
              {day?.daySummary?.eatingWindow || 'N/A'}
            </p>
          </div>
        </div>

        <NutrientProgress 
          label="Protein" 
          value={totals.protein}
          max={150} 
          color="bg-blue-300" 
          icon="🥩"
        />
        <NutrientProgress 
          label="Carbohydrates" 
          value={totals.carbs}
          max={300} 
          color="bg-yellow-300" 
          icon="🍚"
        />
        <NutrientProgress 
          label="Fat" 
          value={totals.fat}
          max={100} 
          color="bg-red-300" 
          icon="🥑"
        />
        <NutrientProgress 
          label="Fiber" 
          value={totals.fiber}
          max={50} 
          color="bg-green-300" 
          icon="🌿"
        />
      </div>
    </div>
  );
};

export const DietDescription = ({ dietPlan }: any) => {
  const [currentDay, setCurrentDay] = useState(0);
  
  if (!dietPlan?.days?.length) {
    return <div className="text-center p-8 text-primary/60">No diet plan available</div>;
  }

  const totalDays = dietPlan.days.length;
  const currentDayData = dietPlan.days[currentDay] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DayNavigator 
        current={currentDay} 
        total={totalDays} 
        onChange={setCurrentDay} 
      />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {(currentDayData?.meals || [])
            .sort((a: any, b: any) => (a?.time || '').localeCompare(b?.time || ''))
            .map((meal: any, index: number) => (
              <MealCard key={`${meal?.mealType}-${index}`} meal={meal} />
            ))}
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <DailySummary day={currentDayData} />
        </div>
      </div>
    </div>
  );
};