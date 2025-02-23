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
    - Carbohydrates (g) 
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
    - Current Glucose: ${diabetesParams.currentGlucose} mmol/L
    - Target Glucose: ${diabetesParams.targetGlucose} mmol/L
    - Insulin Sensitivity: ${diabetesParams.insulinSensitivity} mmol/L per 1 unit
    - Insulin Ratio: ${diabetesParams.insulinRatio} units/10-12g carbs
    - Insulin Type: ${diabetesParams.insulinType}
    - Fasting Blood Sugar: ${diabetesParams.fastingBloodSugar} mmol/L
    - Hemoglobin A1c: ${diabetesParams.hemoglobinA1c}%
  - **Recommendations**:
    - Suggested insulin dose (units)
    - Timing recommendations (pre-meal/post-meal)
    - Glucose trend prediction based on meal composition
  
  ### Meal Balance Assessment
  - **Balance score**: 0-100 based on WHO/National Guidelines
  - **Suggestions**:
    ${allergyDisclaimer}- Missing food groups (e.g., "add leafy greens")
    - Excess components (e.g., "reduce saturated fats")
    - Alternative suggestions for diabetic-friendly substitutions
    - Glycemic index impact estimation
  
  ### Requirements:
  - Use metric units only (grams, milliliters, kcal)
  - Highlight potential allergy conflicts using: ${allergies || 'None detected'}
  - Include safety disclaimers:
    - "Consult a healthcare professional before making dietary changes"
    - "Estimates may vary by ±15% due to image quality"
    - "Not a substitute for medical advice"
    - "Consider insulin onset/duration for ${diabetesParams.insulinType} insulin"
  - For confidence <70%, add: "Low confidence: verify manually"
  - Flag ingredients with high glycemic index (>70)`;
  };