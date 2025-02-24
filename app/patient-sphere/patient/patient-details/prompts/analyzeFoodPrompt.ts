export const analyzeFoodPrompt = (
    diabetesParams: {
      diabetesType: string;
      currentGlucose: string;
      targetGlucose: string;
      insulinSensitivity: string;
      insulinRatio: string;
      insulinType: string;
      fastingBloodSugar: string;
      hemoglobinA1c: string;
    },
    patientInfo?: {
      allergyData?: string[];
    }
  ) => {
    const allergies = patientInfo?.allergyData?.filter(Boolean).join(', ');
    const allergyDisclaimer = allergies ? `- **Allergy Alert**: Patient has allergies to: ${allergies}\n  ` : '';
  
    return `Analyze the provided meal image and generate a detailed report with the following structure:
  
  ### Nutritional Breakdown
  - **Macronutrients**: 
    - Carbs (g) 
    - Proteins (g) 
    - Fats (g) 
    - Fiber (g)
  - **Calories**: Total (kcal) 
  - **Micronutrients**: Highlight key vitamins/minerals (e.g., iron, vitamin C) if detectable.
  
  ### Food Identification 
  - List all identifiable items (e.g., "grilled chicken", "basmati rice") 
  - **Portion estimates**: 
    - Weight (grams) per item 
    - Volume (ml) for liquids/sauces
  - **Confidence levels**: 0-100% for each identification
  
  ### Insulin Calculation
  - **Patient Parameters**:
    - Diabetes Type: ${diabetesParams.diabetesType}
    ${diabetesParams.fastingBloodSugar ? `- Fasting Blood Sugar: ${diabetesParams.fastingBloodSugar} mmol/L` : ''}
    ${diabetesParams.hemoglobinA1c ? `- Hemoglobin A1c: ${diabetesParams.hemoglobinA1c}%` : ''}
    ${diabetesParams.insulinSensitivity ? `- Insulin Sensitivity: ${diabetesParams.insulinSensitivity} mmol/L per 1 unit` : ''}
    ${diabetesParams.insulinRatio ? `- Insulin Ratio: ${diabetesParams.insulinRatio} units/10-12g carbs` : ''}
    ${diabetesParams.insulinType ? `- Insulin Type: ${diabetesParams.insulinType}` : ''}
    ${diabetesParams.currentGlucose ? `- Current Glucose: ${diabetesParams.currentGlucose} mmol/L` : ''}
    ${diabetesParams.targetGlucose ? `- Target Glucose: ${diabetesParams.targetGlucose} mmol/L` : ''}
    
  - **Recommendations**:
    - Suggested insulin dose (units)
    - Timing recommendations (pre-meal/post-meal)
  
  ### Meal Balance Assessment
    - **Healthy score**: 0-100 based
    - **Balance score**: 0-100 based on WHO/National Guidelines
  - **Suggestions**:
    ${allergyDisclaimer}
    - Missing food groups (e.g., "add leafy greens")
  
  ### Requirements:
  - Use metric units only (grams, milliliters, kcal)
  - Highlight potential allergy conflicts using: ${allergies || 'None detected'}
  - Include safety disclaimers:
  - For confidence <70%, add: "Low confidence: verify manually"
  - Flag ingredients with high glycemic index (>70)`;
  };