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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-secondary font-fontHeader tracking-tight sm:text-5xl md:text-6xl mb-4">
          AI-Powered Food Analysis
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
        <section className="max-w-6xl mx-auto px-4 pb-8 flex flex-col lg:flex-row gap-8">
          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] flex-1">
            <h3 className="text-xl font-semibold mb-4">Nutritional Values</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Calories</span>
                <span className="font-semibold">kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Protein</span>
                <span className="font-semibold">g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbohydrates</span>
                <span className="font-semibold">g</span>
              </div>
              <div className="flex justify-between">
                <span>Fats</span>
                <span className="font-semibold">g</span>
              </div>
            </div>
          </div>

          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] flex-1">
            <h3 className="text-xl font-semibold mb-4">Vitamins</h3>
            <div className="flex flex-wrap gap-2">
              {/* {imageAnalysis.vitamins.map((vitamin: string) => (
                <span 
                  key={vitamin}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  Vitamin {vitamin}
                </span>
              ))} */}
            </div>
          </div>

          <div className="bg-pageColor p-8 border border-primary rounded-[15px] 
              shadow-[10px_10px_30px_0px_rgb(var(--shadow)/0.25)] flex-1">
            <h3 className="text-xl font-semibold mb-4">FHIR Health Data</h3>
            <div className="space-y-2 text-gray-600">
              <p>Patient: John Doe</p>
              <p>Age: 35</p>
              <p>Conditions: Type 2 Diabetes</p>
            </div>
          </div>
        </section>
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