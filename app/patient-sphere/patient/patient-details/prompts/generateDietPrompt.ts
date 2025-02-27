interface GenerateDietPromptParams {
    duration: string;
    dietPace: string;
    patientInfo: any;
    weight: string;
    height: string;
    bmi: string;
    waist: string;
    neck: string;
    bodyFat: string;
    activityLevel: string;
    workoutType: string;
    goal: string;
    desiredWeight: string;
    mealQuantity: string;
    selectedMeals: string[];
    exoticAllowed: boolean;
    budget: string;
    loveProducts: string[];
    unloveProducts: string[];
    restrictions: string[];
  }
  
  export const generateDietPrompt = ({duration, dietPace, patientInfo, weight, height, bmi, waist, neck, bodyFat, activityLevel, workoutType,
    goal, desiredWeight, mealQuantity, selectedMeals, exoticAllowed, budget, loveProducts, unloveProducts, restrictions
  }: GenerateDietPromptParams): string => {
    return `Generate a ${duration ? duration : "1"}-days ${dietPace}-paced diet plan for a ${patientInfo?.patientData?.age}-year-old ${patientInfo?.patientData?.gender} based on:
${patientInfo?.patientData?.gender === 'male' ? '♂ Male' : '♀ Female'} Profile:
- Current Weight: ${weight} kg
- Height: ${height} cm
- BMI: ${bmi}
${waist && neck ? `
- Waist: ${waist} (cm)
- Neck: ${neck} (cm)
- Body Fat: ${bodyFat}` : ''}
- Activity Level: ${activityLevel}${workoutType ? ` (${workoutType})` : ''}
- Goal: ${goal}${desiredWeight ? ` → Target: ${desiredWeight}kg` : ''}

Nutritional Requirements:
- Meals/Day: ${mealQuantity}${selectedMeals.length > 0 ? " (" + selectedMeals.join(', ') + ")" : ""}
- Calories/Day: auto-calculated
- ${exoticAllowed ? 'Includes' : 'Excludes'} exotic ingredients
${budget ? `- Budget: $${budget}/week` : ''}

Food Preferences:
Loved: ${loveProducts.length > 0 ? loveProducts.join(', ') + " (use them often, but not always)" : 'None'}
Avoid: ${[...unloveProducts, ...(patientInfo?.allergyData || [])].join(', ') || 'None'}

Health Considerations:
${patientInfo?.conditionData?.map((c: { name: any; status: any; }) => `- ${c.name} (${c.status})`).join('\n') || '- No significant medical conditions'}
${patientInfo?.medicationData?.length > 0 ? `Current Medications:\n${patientInfo.medicationData.map((m: { name: string; }) => m.name).join('\n')}` : ''}

${(patientInfo?.measureData?.systolicBP || patientInfo?.measureData?.diastolicBP) ? `
Vital Signs:
${patientInfo?.measureData?.systolicBP ? `- Systolic BP: ${patientInfo.measureData.systolicBP}` : ''}
${patientInfo?.measureData?.diastolicBP ? `- Diastolic BP: ${patientInfo.measureData.diastolicBP}` : ''}
` : ''}
    
${(patientInfo?.measureData?.fastingGlucose || patientInfo?.measureData?.hbA1c) ? `
Diabetes Management:
${patientInfo?.measureData?.fastingGlucose ? `- Fasting Glucose: ${patientInfo.measureData.fastingGlucose}` : ''}
${patientInfo?.measureData?.hbA1c ? `- HbA1c: ${patientInfo.measureData.hbA1c}` : ''}
` : ''}
    
${(patientInfo?.measureData?.ldl || patientInfo?.measureData?.hdl || patientInfo?.measureData?.triglycerides) ? `
Lipid Profile:
${patientInfo?.measureData?.ldl ? `- LDL Cholesterol: ${patientInfo.measureData.ldl}` : ''}
${patientInfo?.measureData?.hdl ? `- HDL Cholesterol: ${patientInfo.measureData.hdl}` : ''}
${patientInfo?.measureData?.triglycerides ? `- Triglycerides: ${patientInfo.measureData.triglycerides}` : ''}
` : ''}
    
${(patientInfo?.measureData?.creatinine || patientInfo?.measureData?.bun || patientInfo?.measureData?.egfr) ? `
Kidney Function:
${patientInfo?.measureData?.creatinine ? `- Creatinine: ${patientInfo.measureData.creatinine}` : ''}
${patientInfo?.measureData?.bun ? `- BUN: ${patientInfo.measureData.bun}` : ''}
${patientInfo?.measureData?.egfr ? `- eGFR: ${patientInfo.measureData.egfr}` : ''}
` : ''}
    
${(patientInfo?.measureData?.sodium || patientInfo?.measureData?.potassium) ? `
Electrolytes:
${patientInfo?.measureData?.sodium ? `- Sodium: ${patientInfo.measureData.sodium}` : ''}
${patientInfo?.measureData?.potassium ? `- Potassium: ${patientInfo.measureData.potassium}` : ''}
` : ''}
    
${(patientInfo?.measureData?.alt || patientInfo?.measureData?.ast) ? `
Liver Function:
${patientInfo?.measureData?.alt ? `- ALT: ${patientInfo.measureData.alt}` : ''}
${patientInfo?.measureData?.ast ? `- AST: ${patientInfo.measureData.ast}` : ''}
` : ''}
    
${(patientInfo?.measureData?.albumin || patientInfo?.measureData?.prealbumin || patientInfo?.measureData?.inr) ? `
Nutritional Status:
${patientInfo?.measureData?.albumin ? `- Albumin: ${patientInfo.measureData.albumin}` : ''}
${patientInfo?.measureData?.prealbumin ? `- Prealbumin: ${patientInfo.measureData.prealbumin}` : ''}
${patientInfo?.measureData?.inr ? `- INR: ${patientInfo.measureData.inr}` : ''}
` : ''}
    
${(patientInfo?.measureData?.vitaminD || patientInfo?.measureData?.vitaminB12 || patientInfo?.measureData?.ironStudies) ? `
Nutritional Markers:
${patientInfo?.measureData?.vitaminD ? `- Vitamin D: ${patientInfo.measureData.vitaminD}` : ''}
${patientInfo?.measureData?.vitaminB12 ? `- Vitamin B12: ${patientInfo.measureData.vitaminB12}` : ''}
${patientInfo?.measureData?.ironStudies ? `- Iron Studies: ${patientInfo.measureData.ironStudies}` : ''}
` : ''}
    
${(patientInfo?.measureData?.pregnancyStatus || patientInfo?.measureData?.swallowingStatus || patientInfo?.measureData?.fluidIntake || patientInfo?.measureData?.urineOutput || patientInfo?.measureData?.ree) ? `
Special Considerations:
${patientInfo?.measureData?.pregnancyStatus ? `- Pregnancy Status: ${patientInfo.measureData.pregnancyStatus}` : ''}
${patientInfo?.measureData?.swallowingStatus ? `- Swallowing Status: ${patientInfo.measureData.swallowingStatus}` : ''}
${patientInfo?.measureData?.fluidIntake ? `- Fluid Intake: ${patientInfo.measureData.fluidIntake}` : ''}
${patientInfo?.measureData?.urineOutput ? `- Urine Output: ${patientInfo.measureData.urineOutput}` : ''}
${patientInfo?.measureData?.ree ? `- Resting Energy Expenditure: ${patientInfo.measureData.ree}` : ''}
` : ''}

${patientInfo?.dietData?.length > 0 ? `
Current Diet Orders:
${patientInfo?.dietData?.map((diet: { orderType: any; dietName: any; instruction: any; dateTime: string | number | Date; oralDiet: any; supplement: any; enteralFormula: any; scheduledTime: any; intakeType: any; patientInstruction: any; }) => `
${(diet.orderType || diet.dietName || diet.instruction || diet.dateTime) ? `
Order Details:
${diet.orderType ? `- Type: ${diet.orderType}` : ''}
${diet.dietName ? `- Name: ${diet.dietName}` : ''}
${diet.instruction ? `- Instructions: ${diet.instruction}` : ''}
${diet.dateTime ? `- Date: ${new Date(diet.dateTime).toLocaleDateString()}` : ''}
` : ''}

${(diet.oralDiet || diet.supplement || diet.enteralFormula) ? `
Specifications:
${diet.oralDiet ? `- Oral Diet: ${JSON.stringify(diet.oralDiet)}` : ''}
${diet.supplement ? `- Supplements: ${JSON.stringify(diet.supplement)}` : ''}
${diet.enteralFormula ? `- Enteral Formula: ${JSON.stringify(diet.enteralFormula)}` : ''}
` : ''}

${(diet.scheduledTime || diet.intakeType) ? `
Administration:
${diet.scheduledTime ? `- Schedule: ${diet.scheduledTime}` : ''}
${diet.intakeType ? `- Type: ${diet.intakeType}` : ''}
` : ''}

${diet.patientInstruction ? `
Patient Instructions:
${diet.patientInstruction}
` : ''}
`).join('\n\n')}
` : ''}

Special Requirements:
${restrictions.length > 0 ? `- ${restrictions.join('\n- ')}` : '- None'}

Please provide:
1. Exact gram measurements for all portions
2. Calorie estimates per meal
3. Insulin dosing recommendations${patientInfo?.medicationData?.some((m: { name: string; }) => m.name.toLowerCase().includes('insulin')) ? ' (adjust for current insulin regimen)' : ''}
4. Meal prep instructions
`;
};