"use client";

import React, { useState, useEffect, useContext } from "react";
import * as r4 from "fhir/r4";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [patient, setPatient] = useState<r4.Patient | undefined>(undefined);
    const [patientInfo, setPatientInfo] = useState(null);

    const getPatientInfo = async (patientId: string) => {
        try {
            const patient = await appContext.fhirClient.request(`Patient/${patientId}`, { flat: true });
            const observations = await appContext.fhirClient.request(`Observation?subject=Patient/${patientId}`, { flat: true });
            const allergies = await appContext.fhirClient.request(`AllergyIntolerance?patient=Patient/${patientId}`, { flat: true });
            const medications = await appContext.fhirClient.request(`MedicationRequest?subject=Patient/${patientId}`, { flat: true });
            const conditions = await appContext.fhirClient.request(`Condition?subject=Patient/${patientId}`, { flat: true });
            const diets = await appContext.fhirClient.request(`NutritionOrder?patient=Patient/${patientId}`, { flat: true });

            const patientData = getPatientData(patient);
            const measureData = getMeasureData(observations);
            const allergyData = getAllergyData(allergies);
            const medicationData = getMedicationData(medications);
            const conditionData = getConditionData(conditions);
            const dietData = getDietData(diets);

            return {patientData, measureData, allergyData, medicationData, conditionData, dietData};
        } catch (error) {
            console.error("Error getting patient data:", error);
            return null;
        }
    }

    function getPatientData(patient) {
        const firstName = patient?.name?.[0]?.given?.join(" ") ?? "Unknown";
        const lastName = patient?.name?.[0]?.family ?? "Unknown";
        const fullName = `${firstName} ${lastName}`;
        const birthDate = patient?.birthDate ?? "Unknown";
        const age = (birthDate !== "Unknown") 
            ? new Date().getFullYear() - new Date(birthDate).getFullYear() 
            : "Unknown";
        const gender = patient?.gender ?? "Unknown";
        return {firstName, lastName, fullName, birthDate, age, gender};
    }

    function getMeasureValue(obs) {
        if (obs.valueQuantity) {
          return `${obs.valueQuantity.value} ${obs.valueQuantity.unit}`;
        }
        if (obs.valueCodeableConcept) {
          return obs.valueCodeableConcept.text || 
                 obs.valueCodeableConcept.coding?.[0]?.display || 
                 'Unknown';
        }
        if (obs.valueString) return obs.valueString;
        if (obs.valueBoolean !== undefined) return obs.valueBoolean.toString();
        return 'Unknown';
      }
    
    function getMeasureData(observations) {
        if (!observations || observations.length === 0) return null;
      
        const codeMap = {
            // BODY MEASUREMENTS
            '29463-7': 'weight',            // Body weight - fundamental for calorie calculations
            '8302-2': 'height',             // Body height - used with weight to calculate BMI
            '39156-5': 'bmi',               // Body Mass Index - obesity/underweight assessment
            
            // VITAL SIGNS
            '8480-6': 'systolicBP',         // Top number in blood pressure - hypertension monitoring
            '8462-4': 'diastolicBP',        // Bottom number in blood pressure - cardiovascular health
        
            //_____LAB RESULTS_____
            // Diabetes Management
            '1558-6': 'fastingGlucose',     // Blood sugar after fasting - diabetes screening
            '4548-4': 'hbA1c',              // Hemoglobin A1c - 3-month average blood sugar (diabetes control)
            
            // Lipid Profile
            '18262-6': 'ldl',               // "Bad" cholesterol - artery clogging risk
            '2085-9': 'hdl',                // "Good" cholesterol - heart protection
            '2571-8': 'triglycerides',      // Blood fats - heart disease risk
            
            // Kidney Function
            '2160-0': 'creatinine',         // Waste product - kidney filtration ability
            '12966-8': 'bun',               // Blood Urea Nitrogen - kidney health indicator
            '33914-3': 'egfr',              // Estimated Glomerular Filtration Rate - kidney function
            
            // Electrolytes
            '2947-0': 'sodium',             // Blood salt levels - fluid balance/hypertension
            '6298-4': 'potassium',          // Essential mineral - muscle/nerve function
            
            // Liver Function
            '1742-6': 'alt',                // Liver enzyme - liver damage marker
            '14409-7': 'ast',               // Liver enzyme - liver/heart health
            
            // Nutritional Status
            '1751-7': 'albumin',            // Blood protein - overall nutrition status
            '1668-4': 'prealbumin',         // Short-term protein status - malnutrition detection
            '34714-6': 'inr',               // Blood clotting - important for patients on blood thinners
        
            // NUTRITIONAL MARKERS
            '62238-1': 'vitaminD',          // Bone health/immune function
            '2132-9': 'vitaminB12',         // Nerve function/red blood cell production
            '2498-4': 'ironStudies',        // Iron levels - anemia detection
        
            // SPECIAL CONSIDERATIONS
            '82810-3': 'pregnancyStatus',   // Critical for prenatal nutrition
            '24843006': 'swallowingStatus', // Dysphagia - affects food texture requirements
            '62715-8': 'fluidIntake',       // Total liquid consumption - hydration monitoring
            '8281-5': 'urineOutput',        // Fluid elimination - kidney/hydration status
            '80498-0': 'ree'                // Resting Energy Expenditure - baseline calorie needs
        };
      
        const latestObs = new Map();
      
        observations.forEach(obs => {
          const codings = obs.code?.coding || [];
          const obsDate = obs.effectiveDateTime || obs.issued;
      
          codings.forEach(coding => {
            const code = coding.code;
            if (codeMap[code]) {
              if (!latestObs.has(code) || obsDate > latestObs.get(code).date) {
                latestObs.set(code, {
                  value: getMeasureValue(obs),
                  date: obsDate
                });
              }
            }
          });
        });
      
        const result = {};
        Object.entries(codeMap).forEach(([code, key]) => {
          result[key] = latestObs.has(code) ? latestObs.get(code).value : 'Unknown';
        });
      
        return result;
      }

    function getAllergyData(allergies) {
        if (!allergies || allergies.length === 0) { return null;}

        const foodAllergies = [];
        allergies.forEach((allergy) => {
            const allergyCategory = allergy?.category;
        
            if (allergyCategory && allergyCategory.includes("food")) {
                const allergyName = allergy?.code?.text ?? "Unknown";
                foodAllergies.push(allergyName);
            }
        });
        return (foodAllergies.length > 0) ? foodAllergies : null;
    }

    function getMedicationData(medications) {
        if (!medications || medications.length === 0) { return null;}

        const medicationArray = [];
        medications.forEach((medication) => {
            if (medication.resource?.status === 'active') {
                const medicationInfo = {
                    id: medication.resource?.id ?? "Unknown",
                    code: medication.resource?.medicationCodeableConcept?.coding?.[0]?.code ?? "Unknown",
                    name: medication.resource?.medicationCodeableConcept?.coding?.[0]?.display ?? "Unknown",
                    dose: medication.resource?.dosage?.[0]?.doseQuantity?.value ?? "Unknown",
                    doseUnit: medication.resource?.dosage?.[0]?.doseQuantity?.unit ?? "Unknown"
                };
                medicationArray.push(medicationInfo);
            }
        });
        return medicationArray;
    }

    function getConditionData(conditions) {
        if (!conditions || conditions.length === 0) { return null;}

        const conditionArray = [];
        conditions.forEach((condition) => {
            const clinicalStatus = condition?.clinicalStatus?.coding?.[0]?.code ?? "Unknown";
            const conditionName = condition?.code?.text ?? "Unknown";

            conditionArray.push({
                name: conditionName,
                status: clinicalStatus
            });
        });
    
        return (conditionArray.length > 0) ? conditionArray : null;
    }

    function getDietData(diets) {
        if (!diets || diets.length === 0) { return null; }
    
        const dietDetails = [];
    
        diets.forEach((diet) => {
            if (diet?.status === "active") {
                const orderType = diet?.orderType?.text ?? "Unknown";
                const dietName = diet?.diet?.coding?.[0]?.display ?? "Unknown";
                const dietInstruction = diet?.instruction ?? "Unknown";
                const dateTime = diet?.dateTime ?? "Unknown";
                const oralDiet = diet?.oralDiet ?? "Unknown";
                const supplement = diet?.supplement ?? "Unknown";
                const enteralFormula = diet?.enteralFormula ?? "Unknown";
                const scheduledTime = diet?.scheduledTime ?? "Unknown";
                const intakeType = diet?.intakeType ?? "Unknown";
                const patientInstruction = diet?.patientInstruction ?? "Unknown";
        
                dietDetails.push({orderType, dietName, dietInstruction, dateTime, oralDiet,
                    supplement, enteralFormula, scheduledTime, intakeType, patientInstruction});
            }
        });
    
        return (dietDetails.length > 0) ? dietDetails : null;
    }

    useEffect(() => {
        const load = async() => {
            if (!appContext.accessToken) { return; }
            if (!appContext.fhirClient) { return; }

            const patientId = appContext.patientFhirId;
            const data = await getPatientInfo(patientId);
            
            setPatientInfo(data);

            setIsLoading(false);
        }

        load();

    }, [setIsLoading, setPatient, appContext]);

    return (
        <div className="p-8">
            <Head><title>Patient Details</title></Head>
            {isLoading && <div>Loading...</div>}

            <pre>
                {JSON.stringify(patientInfo, null, 2)}
            </pre>
        </div>
    );
}