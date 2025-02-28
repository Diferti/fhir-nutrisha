"use client";

import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import * as r4 from "fhir/r4";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import getPatientInfo from "./getPatient"
import { Navbar } from "@/app/components/Navbar";
import { PageHolder } from "@/app/components/PageHolder";
import { HomePage, GenerateDietPage, AnalyzeFoodPage} from "@/app/components/pages/index";

export interface IPageProps { }
export default function Page(props: IPageProps) {
    const appContext = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [patient, setPatient] = useState<r4.Patient | undefined>(undefined);
    
    const [patientInfo, setPatientInfo] = useState(null);
    const [selectedPage, setSelectedPage] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);
    

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


    const renderPage = () => {
        switch(selectedPage) {
            case 0: return <HomePage patientInfo={patientInfo} isDarkMode={isDarkMode}/>;
            case 1: return <GenerateDietPage patientInfo={patientInfo}/>;
            case 2: return <AnalyzeFoodPage patientInfo={patientInfo}/>;
            default: return <HomePage patientInfo={patientInfo} isDarkMode={isDarkMode}/>;
        }
    };

    return (
        <div>
            <Navbar selectedPage={selectedPage} onSelect={setSelectedPage} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
            <PageHolder>
                {renderPage()}
            </PageHolder>
            
            <Head><title>Patient Details</title></Head>
            {isLoading && <div>Loading...</div>}

            <pre>
                {JSON.stringify(patientInfo, null, 2)}
            </pre>
        </div>
    );
}