"use client";

import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import * as r4 from "fhir/r4";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import { ImageError } from "next/dist/server/image-optimizer";
import getPatientInfo from "./getPatient"
import { generateDietPrompt } from "./generateDietPrompt";
import { Navbar } from "@/app/components/Navbar";
import { PageHolder } from "@/app/components/PageHolder";
import { HomePage, GenerateDietPage, AnalyzeFoodPage} from "@/app/components/pages/index";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [patient, setPatient] = useState<r4.Patient | undefined>(undefined);
    
    const [patientInfo, setPatientInfo] = useState(null);

    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [goal, setGoal] = useState('');
    const [desiredWeight, setDesiredWeight] = useState('');
    const [duration, setDuration] = useState('');
    const [durationUnit, setDurationUnit] = useState('days');
    const [timePreparation, setTimePreparation] = useState(30);
    const [restrictions, setRestrictions] = useState<string[]>([]);
    const [activityLevel, setActivityLevel] = useState('');
    const [workoutType, setWorkoutType] = useState('');
    const [mealQuantity, setMealQuantity] = useState('3');
    const [loveProducts, setLoveProducts] = useState<string[]>([]);
    const [loveInput, setLoveInput] = useState('');
    const [unloveProducts, setUnloveProducts] = useState<string[]>([]);
    const [unloveInput, setUnloveInput] = useState('');
    const [budget, setBudget] = useState('');
    const [exoticAllowed, setExoticAllowed] = useState(false);
    const [dietPace, setDietPace] = useState('middle');
    const [calories, setCalories] = useState('');
    const [waist, setWaist] = useState('');
    const [neck, setNeck] = useState('');

    const [dietPlan, setDietPlan] = useState<any>(null);
    const [aiRequest, setAiRequest] = useState<any>(null);
    const [isLoadingDiet, setIsLoadingDiet] = useState(false);
    const [dietError, setDietError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [imageAnalysis, setImageAnalysis] = useState<any>(null);
    

    useEffect(() => {
        const load = async() => {
            if (!appContext.accessToken) { return; }
            if (!appContext.fhirClient) { return; }

            const patientId = appContext.patientFhirId;
            const data = await getPatientInfo(appContext,patientId);
            
            setPatientInfo(data);

            setIsLoading(false);
        }

        load();

    }, [setIsLoading, setPatient, appContext]);

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
          setWaist(patientInfo.measureData.waist || '');
          setNeck(patientInfo.measureData.neck || '');
        }
      }, [patientInfo]);

            const handleGenerateDiet = async () => {
                setIsLoadingDiet(true);
                setDietError(null);

                const dietDescription = generateDietPrompt({duration, durationUnit, dietPace, patientInfo, weight, height, bmi, activityLevel, workoutType,
                    goal, desiredWeight, mealQuantity, calories, exoticAllowed, budget, loveProducts, unloveProducts, restrictions, timePreparation,});
                    
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
                  
                    setAiRequest(formatedDietDescription);
                    const data = await response.json();
                    setDietPlan(data);
                } catch (err) {
                    console.error('Diet generation failed:', err);
                    setDietError(err instanceof Error ? err.message : 'Failed to generate diet plan');
                } finally {
                    setIsLoadingDiet(false);
                }
              };
              
              useEffect(() => {
                if (!selectedImage) return;
            
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    setImagePreview(fileReader.result);
                };
                fileReader.readAsDataURL(selectedImage);
            
                return () => {
                  fileReader.abort();
                  if (imagePreview) URL.revokeObjectURL(imagePreview);
                };
              }, [selectedImage]);
            
              const imageHandler = () => {
                fileInputRef.current.click();
              };
            
              const imageChangeHandler= (event) => {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    setSelectedImage(file);
                } else {
                    setSelectedImage(null);
                    setImagePreview(null);
                }
              };

              const imageSender = async () => {
                setIsLoadingImage(true);
                setImageError(null);
                const userData = {
                    currentBG: 162,
                    targetBG: 100,
                    carbRatio: 15,
                    sensitivity: 50
                }
     
                try {
                    const formData = new FormData();
                    formData.append('image', selectedImage);
                    formData.append('userData', JSON.stringify(userData));

                    const response = await fetch('/api/analyze-image', {
                        method: 'POST',
                        body: formData,
                    });
              
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                  
                    const data = await response.json();
                    setImageAnalysis(data);
                } catch (err) {
                    console.error('Diet generation failed:', err);
                    setImageError(err instanceof Error ? err.message : 'Failed to analyze image');
                } finally {
                    setIsLoadingImage(false);
                }
              };

    return (
        <div>

            <Navbar />
            <PageHolder />
            <Head><title>Patient Details</title></Head>
            {isLoading && <div>Loading...</div>}

            <pre>
                {JSON.stringify(patientInfo, null, 2)}
            </pre>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Height and Weight */}
                <div className="form-group">
                    <label>Height (cm)</label>
                    <input 
                        type="number" 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)}
                        className="form-input"/>
                </div>

                <div className="form-group">
                    <label>Weight (kg)</label>
                    <input 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        className="form-input"/>
                </div>

                {/* BMI Display */}
                <div className="form-group">
                    <label>BMI</label>
                    <input 
                        type="text" 
                        value={bmi} 
                        readOnly 
                        className="form-input bg-gray-100"/>
                </div>

                {/* Goal Selection */}
                <div className="form-group">
                    <label>Goal</label>
                    <select value={goal} onChange={(e) => setGoal(e.target.value)} className="form-select">
                        <option value="">Select Goal</option>
                        <option value="cut">Cut</option>
                        <option value="gain">Gain</option>
                        <option value="balance">Balance</option>
                        <option value="improve">Improve</option>
                    </select>
                </div>

                {/* Desired Weight (Conditional) */}
                {(goal === 'cut' || goal === 'gain') && (
                    <div className="form-group">
                        <label>Desired Weight (kg)</label>
                            <input
                                type="number"
                                value={desiredWeight}
                                onChange={(e) => setDesiredWeight(e.target.value)}
                                className="form-input"/>
                    </div>
                )}

                {/* Activity Level and Workout Type */}
                <div className="form-group">
                    <label>Activity Level</label>
                    <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="form-select">
                        <option value="">Select Activity Level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="lightly-active">Lightly Active</option>
                        <option value="moderately-active">Moderately Active</option>
                        <option value="very-active">Very Active</option>
                    </select>
                </div>

                {['moderately-active', 'very-active'].includes(activityLevel) && (
                    <div className="form-group">
                        <label>Workout Type</label>
                        <input
                            type="text"
                            value={workoutType}
                            onChange={(e) => setWorkoutType(e.target.value)}
                            className="form-input"
                            placeholder="E.g., Weightlifting, Cardio"/>
                    </div>
                )}

                {/* Body Measurements */}
                <div className="form-group">
                    <label>Waist Measurement (cm)</label>
                    <input
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        className="form-input"/>
                </div>

                <div className="form-group">
                    <label>Neck Measurement (cm)</label>
                    <input
                        type="number"
                        value={neck}
                        onChange={(e) => setNeck(e.target.value)}
                        className="form-input"/>
                </div>

                {/* Body Fat Display */}
                <div className="form-group">
                    <label>Body Fat Percentage</label>
                    <input
                        type="text"
                        value={bodyFat ? `${bodyFat}%` : ''}
                        readOnly
                        className="form-input"/>
                </div>

                {/* Duration */}
                <div className="form-group">
                    <label>Duration</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="form-input flex-1"
                            placeholder="Duration"/>

                        <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)}className="form-select w-24">
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                        </select>
                    </div>
                </div>

                {/* Restrictions */}
                <div className="form-group">
                    <label>Ethical/Religious Restrictions</label>
                    <div className="grid grid-cols-2 gap-2">
                        {['vegetarian', 'vegan', 'halal', 'kosher', 'pork-free', 'dairy-free'].map((restriction) => (
                            <label key={restriction} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={restrictions.includes(restriction)}
                                    onChange={(e) => {
                                        const newRestrictions = e.target.checked
                                            ? [...restrictions, restriction]
                                            : restrictions.filter(r => r !== restriction);
                                        setRestrictions(newRestrictions);
                                    }}
                                    className="form-checkbox"/>
                                <span className="capitalize">{restriction}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Meal Quantity */}
                <div className="form-group">
                    <label>Quantity of Meals per Day</label>
                    <select
                        value={mealQuantity}
                        onChange={(e) => setMealQuantity(e.target.value)}
                        className="form-select">
                        {[2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>{num} meals</option>
                        ))}
                    </select>
                </div>

                {/* Love/Unlove Products */}
                <div className="form-group">
                    <label>Favorite Products</label>
                    <input
                        type="text"
                        value={loveInput}
                        onChange={(e) => setLoveInput(e.target.value)}
                        onBlur={() => {
                            if (loveInput) {
                                setLoveProducts([...new Set([...loveProducts, ...loveInput.split(',')])]);
                                setLoveInput('');
                            }
                        }}
                        className="form-input"
                        placeholder="Add products (comma separated)"/>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {loveProducts.map((product, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {product.trim()}
                                <button
                                    type="button"
                                    onClick={() => setLoveProducts(loveProducts.filter((_, i) => i !== index))}
                                    className="ml-1 text-green-600 hover:text-green-800">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Disliked Products</label>
                    <input
                        type="text"
                        value={unloveInput}
                        onChange={(e) => setUnloveInput(e.target.value)}
                        onBlur={() => {
                            if (unloveInput) {
                                setUnloveProducts([...new Set([...unloveProducts, ...unloveInput.split(',')])]);
                                setUnloveInput('');
                            }
                        }}
                        className="form-input"
                        placeholder="Add products (comma separated)"/>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {unloveProducts.map((product, index) => (
                            <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded">
                                {product.trim()}
                                    <button
                                        type="button"
                                        onClick={() => setUnloveProducts(unloveProducts.filter((_, i) => i !== index))}
                                        className="ml-1 text-red-600 hover:text-red-800">
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Budget */}
                <div className="form-group">
                    <label>Weekly Budget</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="form-input pl-8"
                            min="0"
                            step="10"/>
                    </div>
                </div>

                {/* Exotic Products */}
                <div className="form-group">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={exoticAllowed}
                            onChange={(e) => setExoticAllowed(e.target.checked)}
                            className="form-checkbox"/>
                        <span>Allow Exotic Products</span>
                    </label>
                </div>

                {/* Diet Pace */}
                <div className="form-group">
                    <label>Diet Pace</label>
                    <div className="flex gap-4">
                        {['slow', 'middle', 'fast'].map((pace) => (
                            <label key={pace} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value={pace}
                                    checked={dietPace === pace}
                                    onChange={() => setDietPace(pace)}
                                    className="form-radio"/>
                                <span className="capitalize">{pace}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Calories */}
                 <div className="form-group">
                    <label>Daily Calories</label>
                    <input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="form-input"
                        step="50"
                        min="0"
                        placeholder="Enter target calories per day"/>
                </div>
            </div>

            <button 
                onClick={handleGenerateDiet}
                disabled={isLoadingDiet}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                {isLoadingDiet ? 'Generating...' : 'Generate Diet Plan'}
            </button>

            {aiRequest && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Diet Parameters</h2>
                    <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96 text-sm">
                        {aiRequest}
                    </pre>
                </div>
             )}

            {dietError && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    Error: {dietError}
                </div>
            )}

            {dietPlan && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Generated Diet Plan</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[1000px]">
                        {JSON.stringify(dietPlan, null, 2)}
                    </pre>
                </div>
            )}

            <div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={imageChangeHandler}
                    style={{ display: 'none' }}/>

                <button 
                    onClick={imageHandler}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mt-[50px]">
                        Upload Image
                </button>

                {imagePreview && (
                    <div>
                        <h4>Preview:</h4>
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', marginTop: '10px' }}/>
                            <button 
                                onClick={imageSender}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mt-[50px]">
                                Send Image
                            </button>
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
        </div>
    );
}