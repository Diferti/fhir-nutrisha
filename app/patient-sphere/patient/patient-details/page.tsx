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

    function getMeasureData(observations) {
        if (!observations || observations.length === 0) { return null; }
    
        const weight = observations.find((o) => o?.code?.coding?.some(c => c.code === '29463-7'));
        const height = observations.find((o) => o?.code?.coding?.some(c => c.code === '8302-2'));
    
        const weightValue = (weight?.valueQuantity?.value + " " + weight?.valueQuantity?.unit) ?? "Unknown";
        const heightValue = (height?.valueQuantity?.value + " " + height?.valueQuantity?.unit) ?? "Unknown";
        return {weightValue, heightValue};
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