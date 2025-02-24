import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeFoodPrompt } from '@/app/patient-sphere/patient/patient-details/prompts/analyzeFoodPrompt';

export const AnalyzeFoodPage = ({ patientInfo, isDarkMode }: { patientInfo: any, isDarkMode: boolean}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [diabetesType, setDiabetesType] = useState('1');
  const [currentGlucose, setCurrentGlucose] = useState('');
  const [targetGlucose, setTargetGlucose] = useState('5.5');
  const [insulinSensitivity, setInsulinSensitivity] = useState('');
  const [insulinRatio, setInsulinRatio] = useState('');
  const [insulinType, setInsulinType] = useState('ultrashort');
  const [fastingBloodSugar, setFastingBloodSugar] = useState('');
  const [hemoglobinA1c, setHemoglobinA1c] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    }
  });

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const imageSender = async () => {
    if (!uploadedFile) {
      setImageError('Please upload an image first');
      return;
    }

    setIsLoadingImage(true);
    setImageError(null);
    
    try {
      const analyzePrompt = analyzeFoodPrompt({diabetesType, currentGlucose, targetGlucose, insulinSensitivity, insulinRatio, 
            insulinType, fastingBloodSugar, hemoglobinA1c}, patientInfo);
      
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('systemPrompt', JSON.stringify(analyzePrompt));

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Image analysis failed');
      }

      const data = await response.json();
      setImageAnalysis(data);

    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsLoadingImage(false);
    }
  };

  const StatCard = ({ label, value, unit }) => (
    <div className="bg-primary/50 p-4 rounded-lg">
      <div className="text-sm text-secondary font-bold font-fontMain">{label}</div>
      <div className="text-2xl text-secondary font-extrabold font-fontMain">
        {value} <span className="text-sm text-thirdary font-bold font-fontMain">{unit}</span>
      </div>
    </div>
  );
  
  const CircularProgress = ({ value, label }) => (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
        <circle 
          className="text-blue-500" 
          strokeWidth="8" 
          strokeDasharray={`${value * 2.83} 283`}
          strokeLinecap="round"
          stroke="currentColor" 
          fill="transparent" 
          r="45" 
          cx="50" 
          cy="50" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{value}%</span>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
    </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-secondary font-fontHeader tracking-tight sm:text-5xl md:text-6xl mb-4">
          Nutrisha Food Analysis
        </h1>
        <p className="text-xl text-primary/50 font-fontMain sm:text-2xl md:text-3xl mt-[10px] max-w-2xl mx-auto">
          Upload food images for instant nutritional analysis
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-stretch">
        <section className="flex-1">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
                shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/25' : 'border-gray-300 hover:border-primary'}
                  w-full aspect-square max-w-auto h-full relative overflow-hidden`}
            >
              <input {...getInputProps()} />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-[3px]">
                {!uploadedImage ? (
                  <>
                    <svg 
                      className="w-1/4 h-auto text-thirdary mb-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="text-secondary text-center font-fontMain font-bold text-sm md:text-base">
                      {isDragActive ? 'Drop the image here' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-xs md:text-sm text-thirdary font-fontMain mt-2">JPG, JPEG, PNG (max 5MB)</p>
                  </>
                ) : (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded food" 
                    className="object-cover w-full h-full rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-96 flex flex-col">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
            <h3 className="text-xl font-fontHeader font-bold text-primary">Diabetes Parameters</h3>
            
            <div className="space-y-4 font-medium text-secondary font-fontMain">
              <div>
                <label className="block text-sm mb-1">Diabetes Type</label>
                <select value={diabetesType} onChange={(e) => setDiabetesType(e.target.value)}
                  className="w-full p-2 border rounded-md">
                  <option value="1">Type 1</option>
                  <option value="2">Type 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Blood sugar after fasting (mmol/L)</label>
                <input type="number" value={fastingBloodSugar} onChange={(e) => setFastingBloodSugar(e.target.value)}
                  className="w-full p-2 border rounded-md" step="0.1"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Hemoglobin A1c (%)</label>
                <input type="number" value={hemoglobinA1c} onChange={(e) => setHemoglobinA1c(e.target.value)}
                  className="w-full p-2 border rounded-md" step="0.1"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Current Glucose Level (mmol/L)
                </label>
                <input type="number" value={currentGlucose} onChange={(e) => setCurrentGlucose(e.target.value)}
                  className="w-full p-2 border rounded-md" step="0.1"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Target Glucose Level (mmol/L)</label>
                <input type="number" value={targetGlucose} onChange={(e) => setTargetGlucose(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  min="4" max="7" step="0.1"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Insulin Sensitivity (mmol/L per 1 unit)</label>
                <input type="number" value={insulinSensitivity} onChange={(e) => setInsulinSensitivity(e.target.value)}
                  className="w-full p-2 border rounded-md"step="0.1"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Insulin Ratio (units/10-12g carbs)</label>
                <input type="number" value={insulinRatio} onChange={(e) => setInsulinRatio(e.target.value)}
                  className="w-full p-2 border rounded-md" step="0.1"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Insulin Type</label>
                <select value={insulinType} onChange={(e) => setInsulinType(e.target.value)} 
                    className="w-full p-2 border rounded-md">
                  <option value="short">Short-acting</option>
                  <option value="ultrashort">Rapid-acting</option>
                  <option value="basal">Long-acting</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="flex justify-center">
          <button onClick={imageSender}
            className="w-full max-w-[400px] bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Analyze
          </button>
        </div>

      {imageAnalysis && (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
            <h2 className="text-3xl font-extrabold mb-4 text-primary font-fontHeader">Nutritional Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Calories" value={imageAnalysis.nutritionalBreakdown.calories || "N/A"} unit="kcal" />
              <StatCard label="Carbs" value={imageAnalysis.nutritionalBreakdown.macronutrients.carbs || "N/A"} unit="g" />
              <StatCard label="Proteins" value={imageAnalysis.nutritionalBreakdown.macronutrients.proteins || "N/A"} unit="g" />
              <StatCard label="Fats" value={imageAnalysis.nutritionalBreakdown.macronutrients.fats || "N/A"} unit="g" />
              <StatCard label="Fiber" value={imageAnalysis.nutritionalBreakdown.macronutrients.fiber || "N/A"} unit="g" />
            <div className="col-span-full">
              <h3 className="text-sm text-secondary font-extrabold font-fontMain mb-2">Micronutrients:</h3>
              <div className="flex flex-wrap gap-2 font-bold font-fontMain">
                {imageAnalysis.nutritionalBreakdown.micronutrients.map((nutrient, index) => (
                  <span key={index} className="px-3 py-1 bg-primary text-white rounded-xl text-sm">
                    {nutrient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      
        <div className="bg-primary/50 p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
          <h2 className="text-3xl font-extrabold mb-4 text-secondary font-fontHeader">Identified Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xl border-b border-primary text-secondary font-extrabold font-fontMain">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Weight</th>
                  <th className="pb-2">Confidence</th>
                  <th className="pb-2">Allergens</th>
                </tr>
              </thead>
              <tbody>
                {imageAnalysis.identifiedItems.map((item, index) => (
                  <tr key={index} className="border-b border-primary text-secondary font-bold font-fontMain">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3">{item.weightG}g</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-20 h-[10px] bg-gray-200 border border-secondary rounded-full mr-2">
                          <div 
                            className="h-[8px] rounded-full bg-green-500" 
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span>{item.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {item.allergens.map((allergen, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-sm rounded-full mr-1">
                          {allergen && allergen != "None detected"?allergen:""}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
        {/* Recommendations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insulin Recommendation */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Insulin Guidance</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Required Parameters:</h3>
                <ul className="list-disc pl-5">
                  {imageAnalysis.insulinRecommendation.requiredParameters.map((param, index) => (
                    <li key={index} className="text-sm">{param}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900">
                <p className="font-medium">{imageAnalysis.insulinRecommendation.timingAdvice}</p>
              </div>
            </div>
          </div>
      
          {/* Meal Assessment */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Meal Assessment</h2>
            <div className="flex gap-4 mb-6">
              <CircularProgress value={imageAnalysis.mealAssessment.balanceScore} label="Balance" />
              <CircularProgress value={imageAnalysis.mealAssessment.healthyScore} label="Health" />
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Suggestions:</h3>
                <ul className="list-disc pl-5">
                  {imageAnalysis.mealAssessment.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Warnings:</h3>
                <ul className="list-disc pl-5">
                  {imageAnalysis.mealAssessment.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      
        {/* Footer Notes */}
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>* {imageAnalysis.confidenceNotes[0]}</p>
          <p>* {imageAnalysis.confidenceNotes[1]}</p>
          <div className="pt-4 border-t dark:border-gray-700">
            {imageAnalysis.disclaimers.map((disclaimer, index) => (
              <p key={index} className="italic">{disclaimer}</p>
            ))}
          </div>
        </div>
      </div>
     
      )}

        {imageError && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                Error: {imageError}
            </div>
        )}

        {imageAnalysis && (
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Image Analysis</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[1000px]">
                    {JSON.stringify(imageAnalysis, null, 2)}
                </pre>
            </div>
        )}
    </div>

    
  );
};