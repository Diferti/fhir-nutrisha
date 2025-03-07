import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeFoodPrompt } from '@/app/patient-sphere/patient/patient-details/prompts/analyzeFoodPrompt';
import IconSVG from "@/app/components/IconSVG";

export const AnalyzeFoodPage = ({ patientInfo }: { patientInfo: any }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [diabetesType, setDiabetesType] = useState('');
  const [currentGlucose, setCurrentGlucose] = useState('');
  const [targetGlucose, setTargetGlucose] = useState('5.5');
  const [insulinSensitivity, setInsulinSensitivity] = useState('');
  const [insulinRatio, setInsulinRatio] = useState('');
  const [insulinType, setInsulinType] = useState('ultrashort');
  const [fastingBloodSugar, setFastingBloodSugar] = useState('');
  const [hemoglobinA1c, setHemoglobinA1c] = useState('');

  useEffect(() => {
    if (patientInfo?.isDiabetes) {
      setFastingBloodSugar(patientInfo.measureData?.fastingGlucose?.split(' ')[0] || '');
      setHemoglobinA1c(patientInfo.measureData?.hbA1c?.split(' ')[0] || '');
      setInsulinSensitivity(patientInfo.measureData?.insulinSensitivity?.split(' ')[0] || '');
      setInsulinRatio(patientInfo.measureData?.insulinRatio?.split(' ')[0] || '');

      const diabetesCode = patientInfo.isDiabetes;
      if (diabetesCode.startsWith('E10')) setDiabetesType('1');
      else if (diabetesCode.startsWith('E11')) setDiabetesType('2');
      else if (diabetesCode.startsWith('O24')) setDiabetesType('3');
      else if (['46635009'].includes(diabetesCode)) setDiabetesType('1');
      else if (['44054006'].includes(diabetesCode)) setDiabetesType('2');
      else if (['199223000'].includes(diabetesCode)) setDiabetesType('3');
    }
  }, [patientInfo?.isDiabetes]);

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
    setImageAnalysis(null);
    
    try {
      const analyzePrompt = analyzeFoodPrompt({diabetesType, currentGlucose, targetGlucose, insulinSensitivity, insulinRatio, 
            insulinType, fastingBloodSugar, hemoglobinA1c}, patientInfo);
      
      const formatedPrompt = analyzePrompt.split("\n").filter(line => line.trim()).join("\n");
      
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('systemPrompt', JSON.stringify(formatedPrompt));

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

  const StatCard = ({ label, value, unit } : { label: any, value: any, unit: any }) => (
    <div className="bg-primary/50 p-4 rounded-lg">
      <div className="text-sm text-secondary font-bold font-fontMain">{label}</div>
      <div className="text-2xl text-secondary font-extrabold font-fontMain">
        {value} <span className="text-sm text-thirdary font-bold font-fontMain">{unit}</span>
      </div>
    </div>
  );
  
  const CircularProgress = ({ value, label } : { value: any, label: any}) => (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-white/50" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
        <circle 
          className="text-primary" 
          strokeWidth="10" 
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
        <span className="text-lg text-secondary font-fontMain font-extrabold">{value}%</span>
        <span className="text-xs text-thirdary font-fontMain font-bold">{label}</span>
      </div>
    </div>
    );

  return (
    <div className="min-h-[calc(100vh-200px)] bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-secondary font-fontHeader tracking-tight sm:text-5xl md:text-6xl mb-4">
          Nutrisha Food Analysis
        </h1>
        <p className="text-xl text-primary/50 font-fontMain sm:text-2xl md:text-3xl mt-[10px] max-w-2xl mx-auto">
          Upload food images for instant nutritional analysis
        </p>
      </div>

      {imageError && (
            <div className="max-w-6xl mx-auto px-4 mt-4 p-4 bg-red-100 text-red-700 rounded font-fontMain font-bold">
                Error: {imageError}
            </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-stretch">
        <section className="flex-1">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
                shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full max-w-[700px] mx-auto">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/25' : 'border-gray-300 hover:border-primary'}
                  aspect-square max-w-auto relative overflow-hidden
                  ${patientInfo?.isDiabetes ? "h-full w-full" : "max-h-[700px] max-w-[700px] mx-auto"}`}>
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

        {patientInfo?.isDiabetes && (
          <section className="w-full lg:w-96 flex flex-col">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
            <h3 className="text-xl font-fontHeader font-bold text-primary">Diabetes Parameters</h3>
            
            <div className="space-y-4 font-medium text-secondary font-fontMain">
              <div>
                <label className="block text-sm mb-1">Diabetes Type</label>
                <select value={diabetesType} onChange={(e) => setDiabetesType(e.target.value)}
                  className="w-full p-2 border rounded-md form-select" disabled>
                  <option value="1">Type 1</option>
                  <option value="2">Type 2</option>
                  <option value="3">Gestational</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Blood sugar after fasting (mmol/L)</label>
                <input type="number" value={fastingBloodSugar} onChange={(e) => setFastingBloodSugar(e.target.value)}
                  className="w-full p-2 border rounded-md form-input" step="0.1" placeholder="Optional"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Hemoglobin A1c (%)</label>
                <input type="number" value={hemoglobinA1c} onChange={(e) => setHemoglobinA1c(e.target.value)}
                  className="w-full p-2 border rounded-md form-input" step="0.1" placeholder="Optional"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Insulin Sensitivity (mmol/L per 1 unit)</label>
                <input type="number" value={insulinSensitivity} onChange={(e) => setInsulinSensitivity(e.target.value)}
                  className="w-full p-2 border rounded-md form-input"step="0.1" placeholder="Optional"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Insulin Ratio (units/10-12g carbs)</label>
                <input type="number" value={insulinRatio} onChange={(e) => setInsulinRatio(e.target.value)}
                  className="w-full p-2 border rounded-md form-input" step="0.1" placeholder="Optional"/>
              </div>

              <div>
                <label className="block text-sm mb-1">Insulin Type</label>
                <select value={insulinType} onChange={(e) => setInsulinType(e.target.value)} 
                    className="w-full p-2 border rounded-md form-select">
                  <option value="short">Short-acting</option>
                  <option value="ultrashort">Rapid-acting</option>
                  <option value="basal">Long-acting</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Current Glucose Level (mmol/L)
                  <span className="text-primary text-base font-fontMain font-extrabold">*</span>
                </label>
                <input type="number" value={currentGlucose} onChange={(e) => setCurrentGlucose(e.target.value)}
                  className="w-full p-2 border rounded-md form-input" step="0.1" required/>
              </div>

              <div>
                <label className="block text-sm mb-1">Target Glucose Level (mmol/L)</label>
                <input type="number" value={targetGlucose} onChange={(e) => setTargetGlucose(e.target.value)}
                  className="w-full p-2 border rounded-md form-input"
                  min="4" max="7" step="0.1"/>
              </div> 
            </div>
          </div>
        </section>
        )} 
      </main>

      <div className="flex justify-center px-4">
        <button onClick={imageSender} disabled={isLoadingImage} className="flex items-center justify-left gap-2 w-full bg-primary/10
            border-[3px] border-primary text-secondary rounded-lg hover:bg-primary/50 transition-colors
            max-w-[400px] mx-auto p-[5px] pl-[5px] md:pl-[30px] disabled:cursor-not-allowed disabled:animate-pulse">
          <div className="flex-shrink-0">
            <IconSVG
                type="logoAnalyze"
                color="rgb(var(--secondary))"
                width="100"
                height="100"/>
          </div>
          <span className="text-2xl md:text-3xl font-extrabold uppercase font-fontHeader">
          {isLoadingImage ? (
              <span className="flex items-center gap-1">
                Analyzing
                <span className="relative before:content-['.'] before:animate-dots"></span>
              </span>
            ) : (
              "Analyze"
            )}
          </span>
        </button>
      </div>

      {imageAnalysis && (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
            <h2 className="text-2xl xl:text-3xl font-extrabold mb-4 text-primary font-fontHeader">Nutritional Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Calories" value={imageAnalysis?.nutritionalBreakdown?.calories || "N/A"} unit="kcal" />
              <StatCard label="Carbs" value={imageAnalysis?.nutritionalBreakdown?.macronutrients?.carbs || "N/A"} unit="g" />
              <StatCard label="Proteins" value={imageAnalysis?.nutritionalBreakdown?.macronutrients?.proteins || "N/A"} unit="g" />
              <StatCard label="Fats" value={imageAnalysis?.nutritionalBreakdown?.macronutrients?.fats || "N/A"} unit="g" />
              <StatCard label="Fiber" value={imageAnalysis?.nutritionalBreakdown?.macronutrients?.fiber || "N/A"} unit="g" />
            <div className="col-span-full">
              <h3 className="text-sm text-secondary font-extrabold font-fontMain mb-2">Micronutrients:</h3>
              <div className="flex flex-wrap gap-2 font-bold font-fontMain">
                {imageAnalysis?.nutritionalBreakdown?.micronutrients?.map((nutrient: any, index: any) => (
                  <span key={index} className="px-3 py-1 bg-primary text-white rounded-xl text-sm">
                    {nutrient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      
        <div className="bg-primary/50 p-[5px] md:p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
          <h2 className="text-2xl xl:text-3xl font-extrabold mb-4 text-secondary font-fontHeader">Identified Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm xl:text-xl border-y md:border-0 md:border-b w-auto text-center border-primary text-secondary font-extrabold font-fontMain">
                  <th className="pb-2 border-x border-primary md:border-0">Product</th>
                  <th className="pb-2 border-x border-primary md:border-0">Weight</th>
                  <th className="pb-2 border-x border-primary md:border-0">Confidence</th>
                  <th className="pb-2 border-x border-primary md:border-0">Allergens</th>
                </tr>
              </thead>
              <tbody>
                {imageAnalysis?.identifiedItems?.map((item: any, index: any) => (
                  <tr key={index} className="border-b border-primary text-center text-sm xl:text-base text-secondary font-bold font-fontMain">
                    <td className="py-3 text-left pl-[10px] border-x border-primary md:border-0">{item.name}</td>
                    <td className="py-3 border-x border-primary md:border-0">{item.weightG}g</td>
                    <td className="py-3 border-x border-primary md:border-0">
                      <div className="flex items-center justify-center">
                        <div className="w-10 xl:w-20 h-[10px] bg-gray-200 border border-secondary rounded-full mr-2">
                          <div 
                            className="h-[8px] rounded-full text-center bg-primary" 
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span>{item.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-center border-x border-primary md:border-0">
                      <div className="flex flex-col md:flex-row items-center justify-center gap-1">
                        {item.allergens.map((allergen: any, idx: any) => 
                          allergen && allergen !== "None detected" && allergen !== "none detected"
                            && allergen !== "none" && allergen !== "None"? (
                            <span key={idx} className="px-1 py-1 bg-red-800 text-white text-sm rounded-lg">
                              {allergen}
                            </span>
                          ) : null
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {patientInfo?.isDiabetes && (
        <div className="bg-pageColor p-[15px] md:p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary p-3 rounded-xl shadow-sm">
              <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24">
              <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>

              <div className="flex-1">
                <h3 className="text-lg xl:text-2xl font-extrabold font-fontHeader text-secondary uppercase tracking-wide mb-2">
                  Insulin Recommendation
                </h3>
        
                <div className="hidden md:flex items-baseline gap-4">
                  <div className="relative">
                    <span className="text-4xl font-extrabold text-primary font-fontMain">
                    {patientInfo?.isDiabetes
                        ? imageAnalysis?.insulinRecommendation?.calculatedDose ?? "N/A"
                        : imageAnalysis?.insulinRecommendation?.calculatedDose?.total ?? "N/A"}
                    </span>
                    <span className="ml-1 text-lg text-secondary font-fontMain font-bold">units</span>
            
                    <div className="absolute -top-2 -right-2">
                      <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-primary/90 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-pageColor px-3 py-1 rounded-full border border-thirdary">
                    <svg 
                        className="w-5 h-5 text-primary" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-sm font-bold font-fontMain text-secondary">
                      {imageAnalysis?.insulinRecommendation?.timingAdvice}
                    </span>
                  </div>
                </div>
                <div className="mt-4 hidden md:flex p-3 border-l-4 bg-primary/30 border-primary">
                  <p className="font-bold font-fontMain text-secondary">
                    <span className="text-lg font-extrabold text-primary font-fontHeader">Tip:</span>
                    {'  '}{imageAnalysis?.insulinRecommendation?.tip} 
                  </p>
                </div>
              </div> 
          </div>
          <div className="flex md:hidden items-baseline gap-4">
                <div className="relative">
                  <span className="text-4xl font-extrabold text-primary font-fontMain">
                    {imageAnalysis?.insulinRecommendation?.calculatedDose}
                  </span>
                  <span className="ml-1 text-lg text-secondary font-fontMain font-bold">units</span>
          
                  <div className="absolute -top-2 -right-2">
                    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-primary/90 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-pageColor px-3 py-1 rounded-full border border-thirdary">
                  <svg 
                      className="w-5 h-5 text-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24">
                  <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="text-sm font-bold font-fontMain text-secondary">
                    {imageAnalysis?.insulinRecommendation?.timingAdvice}
                  </span>
                </div>
              </div>
          <div className="mt-4 md:hidden flex p-3 border-l-4 bg-primary/30 border-primary">
                <p className="font-bold font-fontMain text-secondary">
                  <span className="text-lg font-extrabold text-primary font-fontHeader">Tip:</span>
                  {'  '}{imageAnalysis?.insulinRecommendation?.tip} 
                </p>
          </div>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 items-stretch">
            <div className="bg-pageColor p-[15px] md:p-8 md:pt-[16px] border border-primary rounded-[15px] 
                shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] h-full space-y-4">
              <h2 className="text-2xl xl:text-3xl text-center font-extrabold font-fontHeader mb-4 text-primary">
                  Meal Assessment
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col items-center justify-center bg-primary/50 p-[10px] rounded-lg">
                      <CircularProgress value={imageAnalysis?.mealAssessment?.balanceScore} label="Balance" />
                      <p className="mt-2 text-base font-fontHeader font-bold text-secondary">Food Group Balance</p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-primary/50 p-[10px] rounded-lg">
                      <CircularProgress value={imageAnalysis?.mealAssessment?.healthyScore} label="Health" />
                      <p className="mt-2 text-base font-fontHeader font-bold text-secondary">Nutrition Quality</p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-primary/50 p-[10px] rounded-lg">
                      <CircularProgress value={imageAnalysis?.mealAssessment?.varietyScore} label="Variety" />
                      <p className="mt-2 text-base font-fontHeader font-bold text-secondary">Ingredient Diversity</p>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-primary/50 p-[10px] rounded-lg">
                      <CircularProgress value={imageAnalysis?.mealAssessment?.portionScore} label="Portion" />
                      <p className="mt-2 text-base font-fontHeader font-bold text-secondary">Serving Size</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-6 h-full">
              <div className="bg-green-50 p-6 border-2 border-green-200 rounded-[15px] 
                  shadow-[5px_5px_15px_0px_rgb(var(--shadow)/0.15)] flex-1 relative
                  transform rotate-1 hover:rotate-0 transition-transform">
                <div className="absolute top-2 right-2 text-green-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl xl:text-2xl font-fontHeader font-extrabold text-green-800 mb-3">Suggestions</h3>
                <ul className="list-disc pl-5 space-y-2 font-fontMain">
                  {imageAnalysis?.mealAssessment?.suggestions?.map((suggestion: any, index: any) => (
                    <li key={index} className="text-base text-green-700 font-fontMain">{suggestion}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-6 border-2 border-red-200 rounded-[15px] 
                  shadow-[5px_5px_15px_0px_rgb(var(--shadow)/0.15)] flex-1 relative
                  transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="absolute top-2 right-2 text-red-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl xl:text-1xl font-fontHeader font-extrabold text-red-800 mb-3">Warnings</h3>
                <ul className="list-disc pl-5 space-y-2 font-fontMain">
                  {imageAnalysis?.mealAssessment?.warnings?.map((warning: any, index: any) => (
                    <li key={index} className="text-base text-red-700 font-fontMain">{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="text-sm text-secondary font-fontMain space-y-2">
            {imageAnalysis?.confidenceNotes?.map((note: any, index: any) => (
              note && note !== "" ? (<p key={index}>* {note}</p>) : null
            ))}
            <div className="pt-4 border-t border-thirdary">
                {imageAnalysis?.disclaimers?.map((disclaimer: any, index: any) => (
                    <p key={index} className="italic">{disclaimer}</p>
                ))}
            </div>
          </div>
        </div>   
        )}
  </div>
  );
};