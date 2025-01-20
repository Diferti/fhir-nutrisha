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

    useEffect(() => {
        const load = async() => {
            if (!appContext.accessToken) { return; }
            if (!appContext.fhirClient) { return; }

            setIsLoading(true);

            // Get the patient...
            const patientId = appContext.patientFhirId;
            const patients = await appContext.fhirClient.request(`Patient?_id=${patientId}`, { flat: true });
            const patient = patients[0] ?? null;
            setPatient(patient);

            // TODO: This is a bad way of doing it. Better to do it in the AppProvider, but this is ok for now...
            if (patient !== null && appContext.patient === null) {
                appContext.setPatient(patient);
            }

            setIsLoading(false);
        }

        load();

    }, [setIsLoading, setPatient, appContext]);

    return (
        <div className="p-8">
            <Head><title>Patient Details</title></Head>
            {isLoading && <div>Loading...</div>}

            <pre>
                {JSON.stringify(patient, null, 2)}
            </pre>
        </div>
    );
}