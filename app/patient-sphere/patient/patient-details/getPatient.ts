    export default async function getPatientInfo(appContext: any, patientId: string) {
        try {
            const patient = await appContext.fhirClient.request(`Patient/${patientId}`, { flat: true });
            const observations = await appContext.fhirClient.request(`Observation?subject=Patient/${patientId}&_count=1000`, { flat: true });
            const allergies = await appContext.fhirClient.request(`AllergyIntolerance?patient=Patient/${patientId}&_count=1000`, { flat: true });
            const medications = await appContext.fhirClient.request(`MedicationRequest?subject=Patient/${patientId}&_count=1000`, { flat: true });
            const conditions = await appContext.fhirClient.request(`Condition?subject=Patient/${patientId}&_count=1000`, { flat: true });
            const diets = await appContext.fhirClient.request(`NutritionOrder?patient=Patient/${patientId}`, { flat: true });

            const patientData = getPatientData(patient);
            const measureData = getMeasureData(observations);
            const allergyData = getAllergyData(allergies);
            const medicationData = getMedicationData(medications);
            const conditionData = getConditionData(conditions);
            const dietData = getDietData(diets);

            return { patientData, measureData, allergyData, medicationData, conditionData, dietData };
        } catch (error) {
            console.error("Error getting patient data:", error);
            return null;
        }
    }

    function getPatientData(patient: { name: { family: null; given: any }[]; birthDate: null; gender: null; }) {
        const firstName = patient?.name?.[0]?.given?.join(" ") ?? null;
        const lastName = patient?.name?.[0]?.family ?? null;
        const fullName = `${firstName} ${lastName}`;
        const birthDate = patient?.birthDate ?? null;
        const age = birthDate !== null 
                ? (() => {
                    const today = new Date();
                    const birthDateObj = new Date(birthDate);
                    let age = today.getFullYear() - birthDateObj.getFullYear();
                    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
                        age--;
                    }
                    return age;
                })() 
                : null;;
        const gender = patient?.gender ?? null;
        return {firstName, lastName, fullName, birthDate, age, gender};
    }

    function getMeasureValue(obs) {
        if (obs.valueQuantity) {
          return `${obs.valueQuantity.value} ${obs.valueQuantity.unit}`;
        }
        if (obs.valueCodeableConcept) {
          return obs.valueCodeableConcept.text || 
                 obs.valueCodeableConcept.coding?.[0]?.display || 
                 null;
        }
        if (obs.valueString) return obs.valueString;
        if (obs.valueBoolean !== undefined) return obs.valueBoolean.toString();
        return null;
      }
    
    function getMeasureData(observations: any[]) {
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

            //_____________________
        
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
      
          codings.forEach((coding: { code: any; }) => {
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
          result[key] = latestObs.has(code) ? latestObs.get(code).value : null;
        });
      
        return result;
      }

    function getAllergyData(allergies: any[]) {
        if (!allergies || allergies.length === 0) { return null;}

        const foodAllergies: any[] = [];
        allergies.forEach((allergy) => {
            const allergyCategory = allergy?.category;
        
            if (allergyCategory && allergyCategory.includes("food")) {
                const allergyName = allergy?.code?.text ?? null;
                foodAllergies.push(allergyName);
            }
        });
        return (foodAllergies.length > 0) ? foodAllergies : null;
    }

    function getMedicationData(medications: any[]) {
        if (!medications || medications.length === 0) return null;
    
        const medicationArray: { code: string | null; name: string | null; }[] = [];
    
        medications.forEach((medication) => {
            const resource = medication?.resource || medication;
            if (resource?.status?.toLowerCase() !== 'active') return;
    
            const medConcept = resource.medicationCodeableConcept || {};
            const coding = medConcept.coding?.[0] || {};
    
            medicationArray.push({
                code: coding.code || null,
                name: coding.display || medConcept.text || null
            });
        });
    
        return medicationArray.length > 0 ? medicationArray : null;
    }

    function getConditionData(conditions: any[]) {
        if (!conditions || conditions.length === 0) return null;
    
        const icd10Prefixes = [
            // Metabolic/Endocrine
            'E10', 'E11', 'O24',   // Diabetes
            'E66',                 // Obesity
            'E03', 'E04',          // Thyroid
            'E70', 'E74',          // PKU, Galactosemia
            'M10',                 // Gout
            'M80', 'M81',          // Osteoporosis
            
            // Cardiovascular
            'I10', 'I11', 'I50',   // Hypertension, Heart failure
            'E78',                 // Hyperlipidemia
            
            // Renal
            'N18', 'N19',          // CKD/ESRD
            
            // Gastrointestinal
            'K90',                  // Celiac
            'K50', 'K51',           // Crohn's/UC
            'K58',                  // IBS
            'K21',                  // GERD
            'K74', 'K76',           // Cirrhosis/Fatty liver
            
            // Nutritional/Other
            'R13',                  // Dysphagia
            'R64',                  // Cachexia
            'B20',                  // HIV/AIDS
            'A05',                  // Foodborne illness
            'F50',                  // Eating disorders
            'E73'                   // Lactose intolerance
        ];
    
        const snomedCodes = [
            // Metabolic/Endocrine
            '46635009', '44054006', '237599001',    // Diabetes
            '238136002', '162864005',               // Obesity
            '40930008', '80394007',                 // Thyroid
            '190687004', '190745006',               // PKU, Galactosemia
            '90560007',                             // Gout
            '64859006',                             // Osteoporosis

            // Cardiovascular
            '38341003', '84114007',                 // Hypertension, Heart failure
            '55822004',                             // Hyperlipidemia

            // Renal
            '723190009', '46177005',                // CKD/ESRD

            // Gastrointestinal
            '396331005', '34000006', '64766004',    // Celiac, Crohn's, UC
            '52702003', '235595009',                // IBS, GERD
            '19943007', '50325005',                 // Cirrhosis, Fatty liver

            // Nutritional/Other
            '40739000', '240128005',                // Dysphagia, Cachexia
            '86406008', '87628006',                 // HIV, Foodborne illness
            '72366004', '25744000'                  // Eating disorders, Lactose intolerance
        ];
    
        const conditionArray: { code: any, name: any; status: any; }[] = [];
        
        conditions.forEach((condition) => {
            const clinicalStatus = condition?.clinicalStatus?.coding?.[0]?.code;
            if (!['active', 'recurrence'].includes(clinicalStatus)) return;
    
            const isRelevant = condition?.code?.coding?.some((coding: any) => {
                const system = coding.system;
                const code = coding.code;
                
                if (system?.startsWith('http://hl7.org/fhir/sid/icd-10')) {
                    return icd10Prefixes.includes(code?.split('.')[0]);
                }
                if (system === 'http://snomed.info/sct') {
                    return snomedCodes.includes(code);
                }
                return false;
            });
    
            if (isRelevant) {
                conditionArray.push({
                    code: condition.code?.coding?.[0]?.code,
                    name: condition.code?.text,
                    status: clinicalStatus
                });
            }
        });
    
        return conditionArray.length > 0 ? conditionArray : null;
    }

    function getDietData(diets: any[]) {
        if (!diets || diets.length === 0) { return null; }
    
        const dietDetails: { orderType: any; dietName: any; dietInstruction: any; dateTime: any; oralDiet: any; supplement: any; 
            enteralFormula: any; scheduledTime: any; intakeType: any; patientInstruction: any; }[] = [];
    
        diets.forEach((diet) => {
            if (diet?.status === "active") {
                const orderType = diet?.orderType?.text ?? null;
                const dietName = diet?.diet?.coding?.[0]?.display ?? null;
                const dietInstruction = diet?.instruction ?? null;
                const dateTime = diet?.dateTime ?? null;
                const oralDiet = diet?.oralDiet ?? null;
                const supplement = diet?.supplement ?? null;
                const enteralFormula = diet?.enteralFormula ?? null;
                const scheduledTime = diet?.scheduledTime ?? null;
                const intakeType = diet?.intakeType ?? null;
                const patientInstruction = diet?.patientInstruction ?? null;
        
                dietDetails.push({orderType, dietName, dietInstruction, dateTime, oralDiet,
                    supplement, enteralFormula, scheduledTime, intakeType, patientInstruction});
            }
        });
    
        return (dietDetails.length > 0) ? dietDetails : null;
    }